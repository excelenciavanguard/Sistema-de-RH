"""Adaptador contra respostas reais da Geoapify gravadas no Rio (16/09/2026). Sem rede."""

import json
from pathlib import Path

import httpx
import pytest

from app.geoapify import ProvedorGeoapify, nome_da_linha, uf_do_resultado, veiculo_da_linha
from app.modelos import ErroProvedor, Local
from app.regra_vt import DENTRO, estimar

FIXTURES = Path(__file__).parent / "fixtures" / "geoapify"
A = Local(-22.97, -43.18, "origem", "Rio de Janeiro", "RJ")
B = Local(-22.90, -43.17, "destino", "Rio de Janeiro", "RJ")


def _responder(monkeypatch, status, fixture):
    corpo = json.loads((FIXTURES / fixture).read_text(encoding="utf-8"))
    monkeypatch.setattr(httpx.Client, "get", lambda self, *a, **k: httpx.Response(status, json=corpo))


def test_rota_real_de_metro_copacabana_centro_fica_dentro(monkeypatch):
    _responder(monkeypatch, 200, "rota_metro_copacabana_centro.json")
    rota = ProvedorGeoapify("x").rota(A, B)
    assert [t.veiculo for t in rota.conducoes] == ["metro"]
    estimativa = estimar(rota)
    assert estimativa.classificacao == DENTRO
    assert estimativa.pagamento == "Riocard (bilhete único)"


def test_rota_real_de_onibus(monkeypatch):
    _responder(monkeypatch, 200, "rota_onibus_alcantara_niteroi.json")
    rota = ProvedorGeoapify("x").rota(A, B)
    assert [t.veiculo for t in rota.conducoes] == ["onibus"]
    assert "41JB" in rota.conducoes[0].linha


@pytest.mark.parametrize("fixture", ["erro_longe_de_parada.json", "erro_sem_caminho.json"])
def test_400_sem_rota_nao_e_falha(monkeypatch, fixture):
    _responder(monkeypatch, 400, fixture)
    rota = ProvedorGeoapify("x").rota(A, B)
    assert rota.encontrada is False and rota.observacao


def test_chave_recusada_e_falha_sem_vazar_chave(monkeypatch):
    monkeypatch.setattr(httpx.Client, "get", lambda self, *a, **k: httpx.Response(401, json={"message": "Invalid apiKey"}))
    with pytest.raises(ErroProvedor) as erro:
        ProvedorGeoapify("segredo-123").rota(A, B)
    assert "segredo-123" not in str(erro.value)


def test_geocodificacao_real_de_sao_goncalo(monkeypatch):
    _responder(monkeypatch, 200, "geocode_sao_goncalo.json")
    local = ProvedorGeoapify("x").geocodificar("Rua Doutor Porciúncula, São Gonçalo")
    assert (local.uf, local.municipio) == ("RJ", "São Gonçalo")


@pytest.mark.parametrize("linha, veiculo", [
    ("Metrô Rio Linha 1 (General Osório --> Uruguai)", "metro"),
    ("Ônibus 41JB: Venda da Cruz → Centro", "onibus"),
    ("BRT TransOeste: Santa Cruz → Alvorada", "brt"),
    ("VLT Carioca Linha 1", "vlt"),
    ("SuperVia Ramal Santa Cruz", "trem"),
    ("Linha Deodoro: Central do Brasil → Deodoro", "trem"),
    ("Barcas Rio – Niterói", "barca"),
    ("Ônibus 474: Jacaré → Metrô Uruguaiana", "onibus"),
    ("Linha 2", None),
    (None, None),
])
def test_veiculo_pelo_nome_da_linha(linha, veiculo):
    assert veiculo_da_linha(linha) == veiculo


def test_nome_da_linha():
    assert nome_da_linha("Apanhe 41JB em direção a Ônibus 41JB: Venda da Cruz → Centro.") == "Ônibus 41JB: Venda da Cruz → Centro"
    assert nome_da_linha("Caminhe para oeste.") is None


def test_uf_pelo_cep_quando_a_geoapify_devolve_regiao():
    # Resposta real de 16/09/2026: state "Sudeste", sem state_code.
    assert uf_do_resultado({"state": "Sudeste", "state_code": None, "postcode": "20921-392"}) == "RJ"
    assert uf_do_resultado({"state": "Sudeste", "postcode": None}, "Rua X, Centro, 28010-000") == "RJ"
    assert uf_do_resultado({"state": "Sudeste", "postcode": "01310-100"}) == ""
    assert uf_do_resultado({"state_code": "rj"}) == "RJ"
    assert uf_do_resultado({"state": "Rio de Janeiro"}) == "RJ"
    assert uf_do_resultado({}) == ""
