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
    assert por_posto["Posto Barra"]["classificacao"] == FORA                 # 3 conduções
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
