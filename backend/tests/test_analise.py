"""Análise ponta a ponta com provedor falso, postos em memória e cache temporário."""

from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app import analise, main
from app.cache import Cache
from app.modelos import EnderecoNaoLocalizado, Local, Rota, Trecho
from app.regra_vt import CONFERIR, DENTRO, FORA
from app.weboper import PostoWebOper

POSTOS = [
    PostoWebOper(1, "Posto Botafogo", "Rua Voluntários da Pátria 100", "Botafogo", "Rio de Janeiro", "RJ", ""),
    PostoWebOper(2, "Posto Tijuca", "Rua Conde de Bonfim 500", "Tijuca", "Rio de Janeiro", "RJ", ""),
    PostoWebOper(3, "Posto Niterói", "Rua da Conceição 10", "Centro", "Niterói", "RJ", ""),
    PostoWebOper(4, "Posto Barra", "Avenida das Américas 500", "Barra da Tijuca", "Rio de Janeiro", "RJ", ""),
    PostoWebOper(5, "Posto São Paulo", "Avenida Paulista 1000", "Bela Vista", "São Paulo", "SP", ""),
]
COORDENADAS = {  # ordem importa: "Barra da Tijuca" antes de "Tijuca"
    "Copacabana": Local(-22.9711, -43.1822, "Copacabana", "Rio de Janeiro", "RJ", 1.0),
    "Botafogo": Local(-22.9519, -43.1808, "Botafogo", "Rio de Janeiro", "RJ", 1.0),
    "Barra da Tijuca": Local(-23.0045, -43.3220, "Barra", "Rio de Janeiro", "RJ", 1.0),
    "Tijuca": Local(-22.9249, -43.2277, "Tijuca", "Rio de Janeiro", "RJ", 1.0),
    "Centro, Niterói": Local(-22.8832, -43.1034, "Niterói", "Niterói", "RJ", 1.0),
    "Bela Vista": Local(-23.5613, -46.6565, "São Paulo", "São Paulo", "SP", 1.0),
}
VEICULOS_POR_DESTINO = {"Tijuca": ["metro"], "Barra": ["onibus", "brt", "onibus"]}


class ProvedorFalso:
    def __init__(self):
        self.rotas = 0

    def geocodificar(self, endereco):
        for trecho, local in COORDENADAS.items():
            if trecho in endereco:
                return local
        raise EnderecoNaoLocalizado(endereco)

    def geocodificar_perto(self, endereco, perto, raio_m):
        raise EnderecoNaoLocalizado(endereco)

    def rota(self, origem, destino):
        self.rotas += 1
        veiculos = VEICULOS_POR_DESTINO.get(destino.endereco_formatado, ["onibus"])
        return Rota(True, 1800, 5000, [Trecho("transit", "x", linha=v, veiculo=v) for v in veiculos])


@pytest.fixture
def cache(tmp_path: Path):
    return Cache(tmp_path / "cache.sqlite3")


def test_geocodifica_postos_e_marca_fora_do_rj(cache):
    resumo = analise.geocodificar_pendentes(POSTOS, cache, ProvedorFalso(), limite=50)
    assert resumo["localizados"] == 5 and resumo["pendentes_restantes"] == 0
    situacoes = {p.posto.chave: p.situacao for p in analise.situacao_dos_postos(POSTOS, cache)}
    assert situacoes[5] == "fora_do_rj"
    assert cache.consumo_do_dia()["creditos_estimados"] == 5


def test_endereco_alterado_no_weboper_volta_a_ser_pendente(cache):
    analise.geocodificar_pendentes(POSTOS, cache, ProvedorFalso(), limite=50)
    alterado = [PostoWebOper(1, "Posto Botafogo", "Rua Nova 1", "Botafogo", "Rio de Janeiro", "RJ", "")]
    assert analise.situacao_dos_postos(alterado, cache)[0].situacao == "pendente"


def test_analise_classifica_e_ordena(cache):
    provedor = ProvedorFalso()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    resultado = analise.analisar("Rua Barata Ribeiro 500, Copacabana", POSTOS, cache, provedor, top=5)

    por_posto = {r["posto"]: r for r in resultado["resultados"]}
    assert por_posto["Posto Botafogo"]["classificacao"] == DENTRO            # ônibus
    assert por_posto["Posto Tijuca"]["classificacao"] == DENTRO              # 1 metrô
    assert por_posto["Posto Tijuca"]["pagamento"] == "Riocard (bilhete único)"
    assert por_posto["Posto Barra"]["classificacao"] == FORA                 # inclui BRT
    assert por_posto["Posto Niterói"]["classificacao"] == FORA               # intermunicipal
    assert por_posto["Posto Niterói"]["rota_consultada"] is False            # decidido sem crédito
    assert "Posto São Paulo" not in por_posto                                # fora do RJ não entra
    assert [r["classificacao"] for r in resultado["resultados"]][:2] == [DENTRO, DENTRO]
    assert resultado["resumo"]["rotas_consultadas"] == provedor.rotas == 3


def test_top_limita_rotas_consultadas(cache):
    provedor = ProvedorFalso()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    provedor.rotas = 0
    resultado = analise.analisar("Rua Barata Ribeiro 500, Copacabana", POSTOS, cache, provedor, top=1)
    assert provedor.rotas == 1
    assert any(r["classificacao"] is None and not r["rota_consultada"] for r in resultado["resultados"])


def test_analise_aceita_tres_onibus_no_jae(cache, monkeypatch):
    monkeypatch.setitem(VEICULOS_POR_DESTINO, "Barra", ["onibus", "onibus", "onibus"])
    provedor = ProvedorFalso()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    resultado = analise.analisar("Rua Barata Ribeiro 500, Copacabana", POSTOS, cache, provedor, top=5)
    barra = next(r for r in resultado["resultados"] if r["posto"] == "Posto Barra")
    assert barra["classificacao"] == DENTRO
    assert barra["pagamento"] == "Jaé"
    assert barra["custo_sentido"] == 5.0 and barra["custo_dia"] == 10.0
    assert resultado["regra"]["max_conducoes_jae"] == 3


def test_candidato_fora_do_rj_e_recusado(cache):
    with pytest.raises(analise.EnderecoInvalido):
        analise.analisar("Avenida Paulista 1000, Bela Vista", POSTOS, cache, ProvedorFalso())


def test_api_ponta_a_ponta(cache):
    provedor = ProvedorFalso()
    main.app.dependency_overrides[main.obter_postos] = lambda: POSTOS
    main.app.dependency_overrides[main.obter_cache] = lambda: cache
    main.app.dependency_overrides[main.obter_provedor] = lambda: provedor
    try:
        cliente = TestClient(main.app)
        assert cliente.post("/api/v1/mobilidade/postos/geocodificar?limite=10").json()["localizados"] == 5
        assert cliente.get("/api/v1/mobilidade/postos").json()["por_situacao"]["localizado"] == 4
        resposta = cliente.post("/api/v1/mobilidade/analisar", json={"endereco": "Rua Barata Ribeiro 500, Copacabana"})
        assert resposta.status_code == 200
        assert resposta.json()["resumo"]["dentro_da_meta"] == 2
        assert cliente.post("/api/v1/mobilidade/analisar", json={"endereco": "Endereço que não existe"}).status_code == 422
        assert cliente.get("/api/v1/mobilidade/consumo").json()["creditos_estimados"] > 0
    finally:
        main.app.dependency_overrides.clear()


def test_posto_com_localizacao_incerta_vai_para_conferir_sem_rota(cache):
    provedor = ProvedorFalso()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    incerto = COORDENADAS["Botafogo"]
    cache.salvar_posto(1, POSTOS[0].endereco_busca, Local(incerto.latitude, incerto.longitude, "Botafogo", "Rio de Janeiro", "RJ", 0.25), None)
    provedor.rotas = 0
    resultado = analise.analisar("Rua Barata Ribeiro 500, Copacabana", POSTOS, cache, provedor, top=5)
    botafogo = next(r for r in resultado["resultados"] if r["posto"] == "Posto Botafogo")
    assert botafogo["classificacao"] == CONFERIR
    assert botafogo["rota_consultada"] is False
    assert "confiança" in botafogo["motivo"]


def test_candidato_localizado_so_pelo_bairro_e_recusado(cache):
    provedor = ProvedorFalso()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    centro_do_bairro = Local(-22.9519, -43.1808, "Botafogo, Rio de Janeiro", "Rio de Janeiro", "RJ", 0.25, "bairro")
    provedor.geocodificar = lambda endereco: centro_do_bairro
    with pytest.raises(analise.EnderecoInvalido, match="só o bairro"):
        analise.analisar("Rua Com Grafia Diferente 88, Botafogo", POSTOS, cache, provedor)
    assert provedor.rotas == 0


def test_posto_localizado_so_pelo_bairro_vai_para_conferir_sem_rota(cache):
    provedor = ProvedorFalso()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    bairro = COORDENADAS["Botafogo"]
    cache.salvar_posto(1, POSTOS[0].endereco_busca, Local(bairro.latitude, bairro.longitude, "Botafogo, Rio de Janeiro", "Rio de Janeiro", "RJ", 1.0, "bairro"), None)
    assert {p.posto.chave: p.situacao for p in analise.situacao_dos_postos(POSTOS, cache)}[1] == "impreciso"
    provedor.rotas = 0
    resultado = analise.analisar("Rua Barata Ribeiro 500, Copacabana", POSTOS, cache, provedor, top=5)
    botafogo = next(r for r in resultado["resultados"] if r["posto"] == "Posto Botafogo")
    assert botafogo["classificacao"] == CONFERIR
    assert botafogo["rota_consultada"] is False
    assert "só pelo bairro" in botafogo["motivo"]
    assert resultado["resumo"]["postos_imprecisos"] == 1


CENTRO_DO_BAIRRO = Local(-22.9519, -43.1808, "Botafogo, Rio de Janeiro", "Rio de Janeiro", "RJ", 0.25, "bairro")


class ProvedorComGrafiaDoMapa(ProvedorFalso):
    """O mapa só conhece "Góis"; com a grafia do CEP ("Goes") a busca cai no centro do bairro."""

    def __init__(self, perto=None):
        super().__init__()
        self.buscas = []
        self.perto = perto

    def geocodificar(self, endereco):
        self.buscas.append(endereco)
        if "gois" in endereco.lower():
            return Local(-22.9550, -43.1850, "Rua Coronel Góis Pereira 10, Botafogo", "Rio de Janeiro", "RJ", 1.0, "endereco", rua="Rua Coronel Góis Pereira")
        if "goes" in endereco.lower():
            return CENTRO_DO_BAIRRO
        return super().geocodificar(endereco)

    def geocodificar_perto(self, endereco, perto, raio_m):
        self.buscas.append(f"perto:{endereco}")
        if self.perto is None:
            raise EnderecoNaoLocalizado(endereco)
        return self.perto


def test_candidato_com_grafia_do_cep_e_corrigido_sozinho(cache):
    provedor = ProvedorComGrafiaDoMapa()
    analise.geocodificar_pendentes(POSTOS, cache, provedor, limite=50)
    resultado = analise.analisar(
        "Rua Coronel Goes Pereira, 10, Botafogo, Rio de Janeiro, RJ", POSTOS, cache, provedor, rua="Rua Coronel Goes Pereira", numero="10"
    )
    assert resultado["candidato"]["precisao"] == "endereco"
    assert resultado["candidato"]["grafia_corrigida"] == "Rua Coronel Góis Pereira"
    assert resultado["resumo"]["creditos_estimados"] >= 2            # busca original + grafia atual


def test_correcao_nao_aceita_outra_rua_parecida(cache):
    outra_rua = Local(-22.9530, -43.1820, "Rua Coronel Polidoro 10", "Rio de Janeiro", "RJ", 1.0, "endereco", rua="Rua Coronel Polidoro")
    provedor = ProvedorComGrafiaDoMapa(perto=outra_rua)
    provedor.geocodificar = lambda endereco: CENTRO_DO_BAIRRO           # nem a grafia atual acha
    with pytest.raises(analise.EnderecoInvalido, match="só o bairro"):
        analise.analisar("Rua Coronel Goes Pereira, 10, Botafogo, Rio de Janeiro, RJ", POSTOS, cache, provedor)


def test_posto_com_rua_grudada_no_weboper_e_corrigido_pela_busca_perto(cache):
    posto = PostoWebOper(9, "Posto Grudado", "RUAASSUNCAO,260,BOTAFOGO", "BOTAFOGO", "RIO DE JANEIRO", "RJ", "22251-030")
    certo = Local(-22.9500, -43.1830, "Rua Assunção 260, Botafogo", "Rio de Janeiro", "RJ", 1.0, "endereco", rua="Rua Assunção")
    provedor = ProvedorComGrafiaDoMapa(perto=certo)
    provedor.geocodificar = lambda endereco: CENTRO_DO_BAIRRO
    resumo = analise.geocodificar_pendentes([posto], cache, provedor, limite=10)
    assert resumo["localizados"] == 1 and resumo["rua_corrigida"] == 1
    assert analise.situacao_dos_postos([posto], cache)[0].situacao == "localizado"
    assert "perto:RUAASSUNCAO 260" in provedor.buscas


def test_rua_e_numero_do_texto():
    assert analise.rua_e_numero("RUAASSUNCAO,260,BOTAFOGO") == ("RUAASSUNCAO", "260")
    assert analise.rua_e_numero("Rua A, S/N, Centro") == ("Rua A", "S/N")
    assert analise.rua_e_numero("R DO OUVIDOR, 91 - SUPLEMENTAR, CENTRO") == ("R DO OUVIDOR", "")
    assert analise.rua_e_numero("") == ("", "")
