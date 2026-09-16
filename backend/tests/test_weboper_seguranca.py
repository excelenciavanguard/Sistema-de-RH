import pytest

from app.weboper import SQL_POSTOS_ATIVOS, SQL_CLIENTES_COM_ESCALA, WebOperIndisponivel, executar_select
from app.weboper_seguranca import garantir_sql_somente_leitura


@pytest.mark.parametrize("sql", [
    "INSERT INTO CAD_CLIENTE VALUES (1)",
    "UPDATE CAD_CLIENTE SET SITUACAO = 'Inativo'",
    "DELETE FROM CAD_CLIENTE",
    "DROP TABLE CAD_CLIENTE",
    "SELECT 1; DELETE FROM CAD_CLIENTE",
    "SELECT * FROM CAD_CLIENTE FOR UPDATE",
    "REPLACE INTO CAD_CLIENTE VALUES (1)",
    "SET SESSION TRANSACTION READ WRITE",
    "/* comentario */ UPDATE CAD_CLIENTE SET NOME = 'x'",
])
def test_escrita_e_bloqueada(sql):
    with pytest.raises(PermissionError):
        garantir_sql_somente_leitura(sql)


def test_consulta_de_postos_passa_na_barreira():
    garantir_sql_somente_leitura(SQL_POSTOS_ATIVOS)
    garantir_sql_somente_leitura(SQL_CLIENTES_COM_ESCALA)


def test_escrita_e_barrada_antes_de_tentar_conectar():
    # Sem WebOper configurado nos testes: a barreira tem de agir antes da conexão.
    with pytest.raises(PermissionError):
        executar_select("DELETE FROM CAD_CLIENTE")
    with pytest.raises(WebOperIndisponivel):
        executar_select("SELECT 1")
