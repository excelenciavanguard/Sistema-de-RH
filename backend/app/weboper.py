"""Leitura dos postos no WebOper. SOMENTE LEITURA.

Posto em operação = cliente ativo em CAD_CLIENTE com escala em FOLHA_ESCALA
nos últimos WEBOPER_DIAS_OPERACAO dias. É um critério operacional aproximado:
estar ativo no cadastro sozinho não confirma operação recente.
CAD_POSTO não serve de
fonte: há local em operação com cliente Ativo e posto homônimo Inativo
(ver SistemaLancamentoExtras/docs/INTEGRACOES_WEBOPER_OMIE.md).
"""

import time
from dataclasses import dataclass

import pymysql

from app import config
from app.weboper_seguranca import garantir_sql_somente_leitura


class WebOperIndisponivel(RuntimeError):
    """WebOper sem configuração ou sem conexão."""


@dataclass(frozen=True)
class PostoWebOper:
    chave: int
    nome: str
    endereco: str
    bairro: str
    municipio: str
    uf: str
    cep: str

    @property
    def endereco_busca(self) -> str:
        """Texto enviado ao geocodificador. O cadastro é irregular (município "RJ",
        bairro "Piraí - RJ"); juntar tudo dá ao geocodificador contexto suficiente."""
        partes = [self.endereco, self.bairro, self.municipio, self.uf, self.cep, "Brasil"]
        return ", ".join(parte for parte in partes if parte)


SQL_POSTOS_ATIVOS = """
    SELECT
        CHAVE,
        COALESCE(NULLIF(TRIM(NOME_FANTASIA), ''), TRIM(RAZAO_SOCIAL)) AS NOME,
        TRIM(COALESCE(ENDERECO, '')) AS ENDERECO,
        TRIM(COALESCE(BAIRRO, '')) AS BAIRRO,
        TRIM(COALESCE(MUNICIPIO, '')) AS MUNICIPIO,
        UPPER(TRIM(COALESCE(UF, ''))) AS UF,
        TRIM(COALESCE(CEP, '')) AS CEP
    FROM CAD_CLIENTE
    WHERE UPPER(TRIM(COALESCE(SITUACAO, ''))) = 'ATIVO'
      AND TRIM(COALESCE(ENDERECO, '')) <> ''
    ORDER BY NOME
"""


# Consulta única da escala; evita subconsulta correlacionada para cada cliente.
# Limite superior exclusivo inclui o dia atual inteiro, inclusive se DATA for DATETIME.
SQL_CLIENTES_COM_ESCALA = """
    SELECT DISTINCT CODIGO_CLIENTE
    FROM FOLHA_ESCALA
    WHERE DATA >= CURDATE() - INTERVAL %(dias)s DAY
      AND DATA < CURDATE() + INTERVAL 1 DAY
      AND CODIGO_CLIENTE IS NOT NULL
"""


def executar_select(sql: str, parametros: dict | None = None) -> list[tuple]:
    garantir_sql_somente_leitura(sql)
    if not config.WEBOPER_CONFIGURADO:
        raise WebOperIndisponivel("WebOper não configurado: preencha WEBOPER_DB_* em backend/.env.")
    try:
        conexao = pymysql.connect(
            **config.WEBOPER,
            # O próprio MySQL recusa escrita nesta sessão, mesmo com conta privilegiada.
            init_command="SET SESSION TRANSACTION READ ONLY",
            connect_timeout=15,
            read_timeout=60,
        )
    except pymysql.MySQLError as erro:
        raise WebOperIndisponivel(f"Não foi possível conectar ao WebOper ({type(erro).__name__}).") from erro
    try:
        with conexao.cursor() as cursor:
            cursor.execute(sql, parametros)
            return list(cursor.fetchall())
    except pymysql.MySQLError as erro:
        raise WebOperIndisponivel(f"Não foi possível consultar o WebOper ({type(erro).__name__}).") from erro
    finally:
        conexao.close()


_cache: tuple[float, list[PostoWebOper]] | None = None


def listar_postos_ativos() -> list[PostoWebOper]:
    """Interseção do cadastro ativo com a escala recente, cacheada por 5 minutos."""
    global _cache
    agora = time.monotonic()
    if _cache and agora - _cache[0] < config.WEBOPER_CACHE_SEGUNDOS:
        return _cache[1]
    postos = [
        PostoWebOper(int(chave), nome or f"Cliente {chave}", endereco, bairro, municipio, uf, cep)
        for chave, nome, endereco, bairro, municipio, uf, cep in executar_select(SQL_POSTOS_ATIVOS)
    ]
    com_escala = {
        int(linha[0])
        for linha in executar_select(SQL_CLIENTES_COM_ESCALA, {"dias": config.WEBOPER_DIAS_OPERACAO})
    }
    postos = [posto for posto in postos if posto.chave in com_escala]
    # Só atualiza o cache se ambas as leituras terminarem: falha não libera todo o cadastro.
    _cache = (agora, postos)
    return postos
