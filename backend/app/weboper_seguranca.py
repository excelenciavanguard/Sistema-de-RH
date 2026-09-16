"""Barreira que impede comando de escrita contra o WebOper.

O WebOper é o banco de produção da operação. Este backend só lê: nenhum
INSERT, UPDATE, DELETE, DDL, rota de escrita ou migration, nunca. A conta
usada tem permissão de escrita, então a garantia é do código:

1. toda consulta passa por `garantir_sql_somente_leitura`;
2. a sessão MySQL abre com SET SESSION TRANSACTION READ ONLY (app/weboper.py);
3. não existe endpoint de SQL livre.

Mesma regra do SistemaLancamentoExtras (seguranca_weboper.py).
"""

import re

MENSAGEM_SQL_BLOQUEADO = "Operação bloqueada: o WebOper aceita somente leitura."

_SQL_PROIBIDO = re.compile(
    r"\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|REPLACE|GRANT|"
    r"REVOKE|CALL|EXEC|EXECUTE|LOCK|UNLOCK|MERGE|UPSERT)\b|"
    r"\bSET\s+(GLOBAL|SESSION)\b|"
    r"\bINTO\s+(OUTFILE|DUMPFILE)\b|"
    r"\bFOR\s+UPDATE\b|"
    r"\bLOCK\s+IN\s+SHARE\s+MODE\b|"
    r"\b(GET_LOCK|RELEASE_LOCK|LOAD_FILE)\s*\(",
    re.IGNORECASE,
)
_PRIMEIRO_TOKEN = re.compile(r"([A-Z_][A-Z0-9_]*)", re.IGNORECASE)


def garantir_sql_somente_leitura(comando: str) -> None:
    """Aceita apenas SELECT, SHOW, DESCRIBE e DESC, um comando por vez."""
    sql = comando or ""
    sem_ponto_final = sql.strip().removesuffix(";").strip()
    if _SQL_PROIBIDO.search(sql) or ";" in sem_ponto_final:
        raise PermissionError(MENSAGEM_SQL_BLOQUEADO)

    primeiro = _PRIMEIRO_TOKEN.match(_sem_comentarios_iniciais(sql).lstrip())
    if not primeiro or primeiro.group(1).upper() not in {"SELECT", "SHOW", "DESCRIBE", "DESC"}:
        raise PermissionError(MENSAGEM_SQL_BLOQUEADO)


def _sem_comentarios_iniciais(sql: str) -> str:
    restante = sql
    while True:
        trecho = restante.lstrip()
        if trecho.startswith("--") or trecho.startswith("#"):
            quebra = trecho.find("\n")
            restante = "" if quebra == -1 else trecho[quebra + 1:]
            continue
        if trecho.startswith("/*"):
            fim = trecho.find("*/", 2)
            if fim == -1:
                return ""
            restante = trecho[fim + 2:]
            continue
        return trecho
