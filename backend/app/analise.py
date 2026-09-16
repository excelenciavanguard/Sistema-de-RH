"""Cruza o endereço de um candidato com os postos do WebOper.

1. Distância em linha reta contra todos os postos localizados: grátis.
2. Perto demais (a pé) ou em outro município: decide sem gastar crédito.
3. Só os `top` postos mais próximos que ainda precisam de rota consultam a Geoapify.
"""

from concurrent.futures import ThreadPoolExecutor
from dataclasses import asdict, dataclass

from app import config
from app.cache import Cache
from app.geo import distancia_km
from app.geoapify import CREDITOS_GEOCODE, CREDITOS_ROTA
from app.modelos import EnderecoNaoLocalizado, ErroProvedor, Local
from app.regra_vt import CONFERIR, DENTRO, FORA, Estimativa, decidir_sem_rota, estimar
from app.weboper import PostoWebOper

ORDEM = {DENTRO: 0, CONFERIR: 1, FORA: 2, None: 3}


class EnderecoInvalido(ValueError):
    pass


@dataclass
class PostoLocalizado:
    posto: PostoWebOper
    local: Local | None
    situacao: str  # localizado | impreciso | pendente | nao_localizado | fora_do_rj
    erro: str | None = None


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
        try:
            return posto, provedor.geocodificar(posto.endereco_busca)
        except EnderecoNaoLocalizado:
            return posto, None

    # 4 em paralelo: a Geoapify leva ~1,5 s por endereço; o provedor segura o ritmo em 5 req/s.
    localizados = falhas = 0
    with ThreadPoolExecutor(max_workers=4) as executor:
        for posto, local in executor.map(consultar, pendentes):
            cache.registrar_consumo("geocodificar_posto", CREDITOS_GEOCODE)
            cache.salvar_posto(posto.chave, posto.endereco_busca, local, None if local else "Endereço não localizado pela Geoapify.")
            if local:
                localizados += 1
            else:
                falhas += 1
    restantes = sum(1 for p in situacao_dos_postos(postos, cache) if p.situacao == "pendente")
    return {"consultados": len(pendentes), "localizados": localizados, "nao_localizados": falhas, "pendentes_restantes": restantes}


def analisar(endereco: str, postos: list[PostoWebOper], cache: Cache, provedor, top: int | None = None) -> dict:
    top = top or config.ANALISE_TOP_POSTOS
    endereco = (endereco or "").strip()
    if len(endereco) < 8:
        raise EnderecoInvalido("Informe o endereço completo: rua, número, bairro e cidade (ou o CEP).")

    try:
        candidato = provedor.geocodificar(endereco)
    except EnderecoNaoLocalizado as erro:
        raise EnderecoInvalido("Endereço não localizado. Confira rua, número e cidade.") from erro
    finally:
        cache.registrar_consumo("geocodificar_candidato", CREDITOS_GEOCODE)
    if candidato.uf != "RJ":
        raise EnderecoInvalido(f"O endereço foi localizado em {candidato.uf or 'outro estado'}; os postos são do RJ.")
    if candidato.precisao == "bairro":
        # Medir a partir do centro do bairro dá distâncias e rotas erradas: melhor parar e pedir correção.
        raise EnderecoInvalido(
            "O mapa não encontrou a rua, só o bairro, e as distâncias sairiam erradas. Confira o nome da rua e o "
            "número: o mapa às vezes escreve diferente do CEP (por exemplo, \"Góis\" em vez de \"Goes\")."
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
        "candidato": {"endereco": candidato.endereco_formatado, "municipio": candidato.municipio, "uf": candidato.uf, "confianca": candidato.confianca, "precisao": candidato.precisao},
        "resumo": {
            "postos_ativos": len(postos),
            "postos_localizados": len(localizados),
            "postos_imprecisos": len(imprecisos),
            "rotas_consultadas": rotas,
            "creditos_estimados": CREDITOS_GEOCODE + rotas * CREDITOS_ROTA,
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
        "distancia_km": round(km, 2),
        "rota_consultada": consultou_rota,
        "classificacao": dados.get("classificacao"),
        "motivo": dados.get("motivo") or "Fora dos postos mais próximos: rota não consultada.",
        "custo_sentido": float(dados["custo_sentido"]) if dados.get("custo_sentido") is not None else None,
        "custo_dia": float(dados["custo_dia"]) if dados.get("custo_dia") is not None else None,
        "pagamento": dados.get("pagamento"),
        "conducoes": dados.get("conducoes") or [],
        "intermunicipal": dados.get("intermunicipal", False),
    }
