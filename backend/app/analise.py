"""Cruza o endereço de um candidato com os postos do WebOper.

1. Distância em linha reta contra todos os postos localizados: grátis.
2. Perto demais (a pé) ou em outro município: decide sem gastar crédito.
3. Só os `top` postos mais próximos que ainda precisam de rota consultam a Geoapify.
"""

import re
from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict, dataclass

from app import config
from app.cache import Cache
from app.geo import distancia_km, grafia_atual, normalizar, semelhanca_de_rua
from app.geoapify import CREDITOS_GEOCODE, CREDITOS_ROTA
from app.modelos import EnderecoNaoLocalizado, ErroProvedor, Local
from app.regra_vt import CONFERIR, DENTRO, FORA, Estimativa, decidir_sem_rota, estimar
from app.weboper import PostoWebOper

ORDEM = {DENTRO: 0, CONFERIR: 1, FORA: 2, None: 3}

# A correção automática da rua só vale com nome quase igual e perto do bairro encontrado.
SEMELHANCA_MINIMA_RUA = 0.85
RAIO_CORRECAO_KM = 5.0


class EnderecoInvalido(ValueError):
    pass


@dataclass
class PostoLocalizado:
    posto: PostoWebOper
    local: Local | None
    situacao: str  # localizado | impreciso | pendente | nao_localizado | fora_do_rj
    erro: str | None = None


@dataclass(frozen=True)
class Localizacao:
    local: Local
    correcao: str | None  # nome da rua como está no mapa, quando precisou corrigir
    creditos: int


def rua_e_numero(endereco: str) -> tuple[str, str]:
    """Primeiras partes do endereço: "RUAASSUNCAO,260,BOTAFOGO" -> ("RUAASSUNCAO", "260")."""
    partes = [parte.strip() for parte in (endereco or "").split(",") if parte.strip()]
    if not partes:
        return "", ""
    numero = partes[1] if len(partes) > 1 and re.fullmatch(r"\d+[a-zA-Z]?|s/?n[º°o]?", partes[1], re.IGNORECASE) else ""
    return partes[0], numero


def localizar(provedor, texto: str, rua: str, numero: str = "") -> Localizacao:
    """Geocodifica e, se o mapa só achar o bairro, tenta corrigir a rua sozinho.

    Caso real (16/09/2026): o CEP escreve "Goes" e o mapa "Góis", e a busca caiu no centro do
    bairro. Tentativas, nesta ordem:
    1. o mesmo endereço com a grafia atual do nome da rua ("goes" -> "gois");
    2. só rua e número, num raio em volta do bairro ("RUAASSUNCAO" -> "Rua Assunção").
    Um achado só vale se for endereço ou rua, com nome quase igual e perto do bairro:
    sem isso a busca aceitaria outra rua parecida (na prática, apareceu "General Polidoro").
    """
    local = provedor.geocodificar(texto)
    creditos = CREDITOS_GEOCODE
    rua = (rua or "").strip()
    if local.precisao != "bairro" or not rua:
        return Localizacao(local, None, creditos)

    atual = grafia_atual(rua)
    tentativas = []
    if atual != normalizar(rua):
        tentativas.append(lambda: provedor.geocodificar(_com_rua(texto, rua, atual)))
    rua_numero = f"{rua} {numero}".strip()
    tentativas.append(lambda: provedor.geocodificar_perto(rua_numero, local, int(RAIO_CORRECAO_KM * 1000)))

    for tentar in tentativas:
        creditos += CREDITOS_GEOCODE
        try:
            achado = tentar()
        except EnderecoNaoLocalizado:
            continue
        semelhanca = max(semelhanca_de_rua(rua, achado.rua), semelhanca_de_rua(atual, achado.rua))
        perto = distancia_km(local.latitude, local.longitude, achado.latitude, achado.longitude) <= RAIO_CORRECAO_KM
        if achado.precisao != "bairro" and achado.uf == local.uf and semelhanca >= SEMELHANCA_MINIMA_RUA and perto:
            return Localizacao(achado, achado.rua or None, creditos)
    return Localizacao(local, None, creditos)


def _com_rua(texto: str, rua: str, nova: str) -> str:
    if rua.lower() in texto.lower():
        return re.sub(re.escape(rua), nova, texto, count=1, flags=re.IGNORECASE)
    return f"{nova}, {texto}"


def situacao_dos_postos(postos: list[PostoWebOper], cache: Cache) -> list[PostoLocalizado]:
    resultado = []
    for posto in postos:
        salvo = cache.posto(posto.chave, posto.endereco_busca)
        if salvo is None:
            resultado.append(PostoLocalizado(posto, None, "pendente"))
            continue
        local, erro = salvo
        if local is None:
            resultado.append(PostoLocalizado(posto, None, "nao_localizado", erro))
        elif local.uf != "RJ":
            resultado.append(PostoLocalizado(posto, local, "fora_do_rj", f"Geocodificado em {local.uf or 'UF desconhecida'}."))
        elif local.precisao == "bairro":
            resultado.append(PostoLocalizado(posto, local, "impreciso", f"Localizado só pelo bairro: {local.endereco_formatado}."))
        else:
            resultado.append(PostoLocalizado(posto, local, "localizado"))
    return resultado


def geocodificar_pendentes(postos: list[PostoWebOper], cache: Cache, provedor, limite: int) -> dict:
    pendentes = [p.posto for p in situacao_dos_postos(postos, cache) if p.situacao == "pendente"][:limite]

    def consultar(posto: PostoWebOper):
        rua, numero = rua_e_numero(posto.endereco)
        try:
            return posto, localizar(provedor, posto.endereco_busca, rua, numero)
        except EnderecoNaoLocalizado:
            return posto, None

    # 4 em paralelo: a Geoapify leva ~1,5 s por endereço; o provedor segura o ritmo em 5 req/s.
    localizados = falhas = corrigidos = 0
    with ThreadPoolExecutor(max_workers=4) as executor:
        for posto, achado in executor.map(consultar, pendentes):
            cache.registrar_consumo("geocodificar_posto", achado.creditos if achado else CREDITOS_GEOCODE)
            local = achado.local if achado else None
            cache.salvar_posto(posto.chave, posto.endereco_busca, local, None if local else "Endereço não localizado pela Geoapify.")
            if local:
                localizados += 1
                corrigidos += 1 if achado.correcao else 0
            else:
                falhas += 1
    restantes = sum(1 for p in situacao_dos_postos(postos, cache) if p.situacao == "pendente")
    return {
        "consultados": len(pendentes), "localizados": localizados, "rua_corrigida": corrigidos,
        "nao_localizados": falhas, "pendentes_restantes": restantes,
    }


def analisar(
    endereco: str,
    postos: list[PostoWebOper],
    cache: Cache,
    provedor,
    top: int | None = None,
    *,
    rua: str | None = None,
    numero: str | None = None,
) -> dict:
    top = top or config.ANALISE_TOP_POSTOS
    endereco = (endereco or "").strip()
    if len(endereco) < 8:
        raise EnderecoInvalido("Informe o endereço completo: rua, número, bairro e cidade (ou o CEP).")

    rua_do_texto, numero_do_texto = rua_e_numero(endereco)
    try:
        achado = localizar(provedor, endereco, rua or rua_do_texto, numero or numero_do_texto)
    except EnderecoNaoLocalizado as erro:
        cache.registrar_consumo("geocodificar_candidato", CREDITOS_GEOCODE)
        raise EnderecoInvalido("Endereço não localizado. Confira rua, número e cidade.") from erro
    cache.registrar_consumo("geocodificar_candidato", achado.creditos)
    candidato = achado.local

    if candidato.uf != "RJ":
        raise EnderecoInvalido(f"O endereço foi localizado em {candidato.uf or 'outro estado'}; os postos são do RJ.")
    if candidato.precisao == "bairro":
        # Medir a partir do centro do bairro dá distâncias e rotas erradas: melhor parar e pedir correção.
        raise EnderecoInvalido(
            "O mapa não encontrou a rua, só o bairro, mesmo tentando grafias parecidas. As distâncias sairiam "
            "erradas: confira o nome da rua e o número."
        )

    situacoes = situacao_dos_postos(postos, cache)
    localizados = [p for p in situacoes if p.situacao == "localizado"]
    # Posto localizado só pelo bairro aparece para o RH, mas sem decisão pela distância.
    imprecisos = [p for p in situacoes if p.situacao == "impreciso"]
    por_distancia = sorted(
        ((p, distancia_km(candidato.latitude, candidato.longitude, p.local.latitude, p.local.longitude)) for p in localizados + imprecisos),
        key=lambda par: par[1],
    )

    resultados, rotas = [], 0
    for item, km in por_distancia:
        if item.situacao == "impreciso":
            estimativa = Estimativa(CONFERIR, "Posto localizado só pelo bairro: a distância é aproximada. Confira o endereço no WebOper.")
        elif item.local.confianca < config.CONFIANCA_MINIMA_POSTO:
            # Coordenada incerta: a distância pode estar errada, então nem "a pé" nem rota valem.
            estimativa = Estimativa(
                CONFERIR,
                f"Localização do posto incerta ({item.local.confianca:.0%} de confiança): confira o endereço no WebOper.",
            )
        else:
            estimativa = decidir_sem_rota(
                municipio_candidato=candidato.municipio, municipio_posto=item.local.municipio, distancia_reta_km=km
            )
        consultou_rota = False
        if estimativa is None and rotas < top:
            try:
                estimativa = estimar(provedor.rota(candidato, item.local))
            except ErroProvedor as erro:
                estimativa = Estimativa(CONFERIR, str(erro))
            finally:
                cache.registrar_consumo("rota", CREDITOS_ROTA)
            rotas += 1
            consultou_rota = True
        resultados.append(_linha(item, km, estimativa, consultou_rota))

    resultados.sort(key=lambda r: (ORDEM[r["classificacao"]], r["distancia_km"]))
    return {
        "candidato": {
            "endereco": candidato.endereco_formatado, "municipio": candidato.municipio, "uf": candidato.uf,
            "confianca": candidato.confianca, "precisao": candidato.precisao, "grafia_corrigida": achado.correcao,
        },
        "resumo": {
            "postos_ativos": len(postos),
            "postos_localizados": len(localizados),
            "postos_imprecisos": len(imprecisos),
            "rotas_consultadas": rotas,
            "creditos_estimados": achado.creditos + rotas * CREDITOS_ROTA,
            "dentro_da_meta": sum(1 for r in resultados if r["classificacao"] == DENTRO),
        },
        "regra": {
            "tarifa_sentido": float(config.VT_TARIFA_SENTIDO),
            "meta_dia": float(config.VT_TARIFA_SENTIDO * 2),
            "max_conducoes_jae": config.VT_MAX_CONDUCOES_JAE,
            "raio_caminhavel_km": config.VT_RAIO_CAMINHAVEL_KM,
            "top_rotas": top,
        },
        "resultados": resultados,
    }


def _linha(item: PostoLocalizado, km: float, estimativa: Estimativa | None, consultou_rota: bool) -> dict:
    dados = asdict(estimativa) if estimativa else {}
    return {
        "chave": item.posto.chave,
        "posto": item.posto.nome,
        "bairro": item.posto.bairro,
        "municipio": item.local.municipio,
        # Mesmo arredondamento do motivo ("Dá para ir a pé: 0,2 km"), para a coluna e o texto baterem.
        "distancia_km": round(km, 1),
        "rota_consultada": consultou_rota,
        "classificacao": dados.get("classificacao"),
        "motivo": dados.get("motivo") or "Fora dos postos mais próximos: rota não consultada.",
        "custo_sentido": float(dados["custo_sentido"]) if dados.get("custo_sentido") is not None else None,
        "custo_dia": float(dados["custo_dia"]) if dados.get("custo_dia") is not None else None,
        "pagamento": dados.get("pagamento"),
        "conducoes": dados.get("conducoes") or [],
        "intermunicipal": dados.get("intermunicipal", False),
    }
