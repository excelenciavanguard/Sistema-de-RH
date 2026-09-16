import sqlite3

from app.cache import Cache
from app.modelos import Local


def test_banco_antigo_ganha_precisao_e_posto_sem_ela_volta_a_ser_pendente(tmp_path):
    caminho = tmp_path / "antigo.sqlite3"
    with sqlite3.connect(caminho) as conexao:
        conexao.execute(
            "CREATE TABLE postos_geo (chave INTEGER PRIMARY KEY, endereco_busca TEXT NOT NULL, latitude REAL, longitude REAL, "
            "municipio TEXT, uf TEXT, endereco_formatado TEXT, confianca REAL, erro TEXT, atualizado_em TEXT NOT NULL)"
        )
        conexao.execute("INSERT INTO postos_geo VALUES (1, 'Rua A, 1', -22.9, -43.2, 'Rio de Janeiro', 'RJ', 'Botafogo', 1.0, NULL, 'x')")
        conexao.execute("INSERT INTO postos_geo VALUES (2, 'Rua B, 2', NULL, NULL, NULL, NULL, NULL, NULL, 'não localizado', 'x')")

    cache = Cache(caminho)

    assert cache.posto(1, "Rua A, 1") is None                 # localização antiga, sem precisão: localizar de novo
    assert cache.posto(2, "Rua B, 2") == (None, "não localizado")


def test_precisao_e_gravada_e_lida(tmp_path):
    cache = Cache(tmp_path / "novo.sqlite3")
    cache.salvar_posto(7, "Rua C, 3", Local(-22.9, -43.2, "Botafogo", "Rio de Janeiro", "RJ", 0.6, "bairro"), None)
    local, erro = cache.posto(7, "Rua C, 3")
    assert local.precisao == "bairro" and erro is None
