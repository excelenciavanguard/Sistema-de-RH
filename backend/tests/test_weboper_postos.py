"""Regras de operação com respostas controladas; não acessa o WebOper."""

import pytest

from app import config, weboper

CADASTRO = [
    (1, "Posto A", "Rua A 1", "Centro", "Rio de Janeiro", "RJ", "20000-000"),
    (2, "Posto sem escala", "Rua B 2", "Centro", "Rio de Janeiro", "RJ", "20000-000"),
    (3, "", "Rua C 3", "Tijuca", "Rio de Janeiro", "RJ", "20500-000"),
]


@pytest.fixture(autouse=True)
def limpar_cache(monkeypatch):
    monkeypatch.setattr(weboper, "_cache", None)
    monkeypatch.setattr(config, "WEBOPER_CACHE_SEGUNDOS", 300)


def fonte(monkeypatch, escala):
    consultas = []

    def executar(sql, parametros=None):
        consultas.append((sql, parametros))
        if sql == weboper.SQL_POSTOS_ATIVOS:
            return CADASTRO
        return escala

    monkeypatch.setattr(weboper, "executar_select", executar)
    return consultas


def test_so_entra_cliente_ativo_com_escala_recente(monkeypatch):
    consultas = fonte(monkeypatch, [(1,), (3,), (999,), (1,)])
    postos = weboper.listar_postos_ativos()
    assert [p.chave for p in postos] == [1, 3]
    assert postos[1].nome == "Cliente 3"
    assert len(consultas) == 2
    assert consultas[1][1] == {"dias": 30}


def test_sem_escala_nao_retorna_todo_cadastro(monkeypatch):
    fonte(monkeypatch, [])
    assert weboper.listar_postos_ativos() == []


def test_cache_reaproveita_intersecao_sem_reconsultar_banco(monkeypatch):
    consultas = fonte(monkeypatch, [(1,)])
    assert [p.chave for p in weboper.listar_postos_ativos()] == [1]
    assert [p.chave for p in weboper.listar_postos_ativos()] == [1]
    assert len(consultas) == 2


def test_falha_na_escala_nao_libera_todos_os_clientes(monkeypatch):
    def executar(sql, parametros=None):
        if sql == weboper.SQL_POSTOS_ATIVOS:
            return CADASTRO
        raise weboper.WebOperIndisponivel("Escala indisponível")

    monkeypatch.setattr(weboper, "executar_select", executar)
    with pytest.raises(weboper.WebOperIndisponivel):
        weboper.listar_postos_ativos()
    assert weboper._cache is None


def test_cache_expirado_remove_posto_sem_escala(monkeypatch):
    consultas = fonte(monkeypatch, [(1,)])
    monkeypatch.setattr(weboper.time, "monotonic", lambda: 1000)
    assert [p.chave for p in weboper.listar_postos_ativos()] == [1]
    consultas = fonte(monkeypatch, [])
    monkeypatch.setattr(weboper.time, "monotonic", lambda: 1301)
    assert weboper.listar_postos_ativos() == []
    assert len(consultas) == 2
