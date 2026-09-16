from decimal import Decimal

import pytest

from app.modelos import Rota, Trecho
from app.regra_vt import CONFERIR, DENTRO, FORA, decidir_sem_rota, estimar


def _rota(*veiculos):
    trechos = [Trecho("walk", "até o ponto")]
    trechos += [Trecho("transit", "condução", linha=f"Linha {i}", veiculo=v) for i, v in enumerate(veiculos)]
    return Rota(encontrada=True, duracao_segundos=1800, trechos=trechos)


@pytest.mark.parametrize("quantidade", [1, 2, 3])
def test_ate_tres_onibus_ficam_dentro_pagando_uma_tarifa_no_jae(quantidade):
    e = estimar(_rota(*(["onibus"] * quantidade)))
    assert e.classificacao == DENTRO
    assert e.custo_sentido == Decimal("5.00") and e.custo_dia == Decimal("10.00")
    assert e.pagamento == "Jaé"


def test_um_metro_sozinho_fica_dentro_pelo_riocard():
    e = estimar(_rota("metro"))
    assert e.classificacao == DENTRO
    assert e.custo_dia == Decimal("10.00")
    assert e.pagamento == "Riocard (bilhete único)"


def test_metro_com_onibus_fica_fora():
    assert estimar(_rota("onibus", "metro")).classificacao == FORA


def test_trem_fica_fora_mesmo_sozinho():
    assert estimar(_rota("trem")).classificacao == FORA


def test_barca_fica_fora():
    assert estimar(_rota("barca")).classificacao == FORA


def test_quatro_onibus_ficam_fora_do_limite_jae():
    e = estimar(_rota("onibus", "onibus", "onibus", "onibus"))
    assert e.classificacao == FORA
    assert e.pagamento is None and e.custo_sentido is None


@pytest.mark.parametrize("veiculos", [
    ("brt",), ("vlt",), ("onibus", "brt"), ("onibus", "vlt"),
    ("onibus", "brt", "onibus"), ("onibus", "vlt", "onibus"),
])
def test_jae_nao_aceita_brt_ou_vlt_mesmo_abaixo_do_limite(veiculos):
    e = estimar(_rota(*veiculos))
    assert e.classificacao == FORA
    assert e.pagamento is None and e.custo_sentido is None


def test_conducao_sem_tipo_vai_para_conferir():
    assert estimar(_rota("onibus", None)).classificacao == CONFERIR


def test_sem_rota_vai_para_conferir():
    assert estimar(Rota(encontrada=False, observacao="Nenhum caminho.")).classificacao == CONFERIR


def test_rota_so_a_pe_acima_do_limite_vai_para_conferir():
    assert estimar(Rota(encontrada=True, trechos=[Trecho("walk", "a pé")])).classificacao == CONFERIR


def test_perto_decide_a_pe_sem_gastar_rota():
    e = decidir_sem_rota(municipio_candidato="Niterói", municipio_posto="Niterói", distancia_reta_km=1.5)
    assert e.classificacao == DENTRO and e.custo_dia == Decimal("0.00")


def test_outro_municipio_decide_fora_sem_gastar_rota():
    e = decidir_sem_rota(municipio_candidato="São Gonçalo", municipio_posto="Niterói", distancia_reta_km=6.0)
    assert e.classificacao == FORA and e.intermunicipal is True


def test_mesmo_municipio_com_grafia_diferente_precisa_de_rota():
    assert decidir_sem_rota(municipio_candidato="NITERÓI", municipio_posto="Niteroi", distancia_reta_km=6.0) is None
