"""Configuração do backend de mobilidade, lida de backend/.env.

Nenhum segredo tem valor padrão. Sem WEBOPER_DB_* ou GEOAPIFY_API_KEY a API
sobe mesmo assim e avisa o que falta.
"""

import os
from decimal import Decimal
from pathlib import Path

from dotenv import load_dotenv

PASTA_BACKEND = Path(__file__).resolve().parent.parent
# override=False: variáveis já definidas (testes, deploy) valem mais que o arquivo.
load_dotenv(PASTA_BACKEND / ".env", override=False)


def _texto(nome: str, padrao: str = "") -> str:
    return os.getenv(nome, padrao).strip()


# --- WebOper (somente leitura) -------------------------------------------
WEBOPER = {
    "host": _texto("WEBOPER_DB_HOST"),
    "port": int(_texto("WEBOPER_DB_PORT", "3306") or 3306),
    "user": _texto("WEBOPER_DB_USER"),
    "password": os.getenv("WEBOPER_DB_PASSWORD", ""),
    "database": _texto("WEBOPER_DB_NAME"),
    "charset": _texto("WEBOPER_DB_CHARSET", "latin1") or "latin1",
}
WEBOPER_CONFIGURADO = all(WEBOPER[chave] for chave in ("host", "user", "database"))
# Evita consultar o WebOper a cada clique: a lista de postos muda pouco.
WEBOPER_CACHE_SEGUNDOS = int(_texto("WEBOPER_CACHE_SEGUNDOS", "300"))
# Cliente ativo no cadastro precisa ter escala recente para entrar no laboratório.
WEBOPER_DIAS_OPERACAO = int(_texto("WEBOPER_DIAS_OPERACAO", "30"))
if not 1 <= WEBOPER_DIAS_OPERACAO <= 90:
    raise ValueError("WEBOPER_DIAS_OPERACAO deve estar entre 1 e 90.")

# --- Geoapify ------------------------------------------------------------
GEOAPIFY_API_KEY = _texto("GEOAPIFY_API_KEY")
# "transit" (horários reais) não roteia nada no Rio; testado em 16/09/2026.
GEOAPIFY_MODO_ROTA = _texto("GEOAPIFY_MODO_ROTA", "approximated_transit")
# Plano gratuito: até 5 requisições por segundo.
GEOAPIFY_INTERVALO_SEGUNDOS = float(_texto("GEOAPIFY_INTERVALO_SEGUNDOS", "0.25"))
GEOAPIFY_TIMEOUT_SEGUNDOS = float(_texto("GEOAPIFY_TIMEOUT_SEGUNDOS", "20"))

# --- Regra de vale-transporte --------------------------------------------
VT_TARIFA_SENTIDO = Decimal(_texto("VT_TARIFA_SENTIDO", "5.00"))
# Quantas conduções de ônibus/BRT/VLT o Jaé integra numa tarifa (2 ou 3, a confirmar).
VT_MAX_CONDUCOES_JAE = int(_texto("VT_MAX_CONDUCOES_JAE", "2"))
VT_RAIO_CAMINHAVEL_KM = float(_texto("VT_RAIO_CAMINHAVEL_KM", "2.0"))
ANALISE_TOP_POSTOS = int(_texto("ANALISE_TOP_POSTOS", "5"))
# Abaixo disso a coordenada do posto não é confiável (endereço bagunçado no WebOper).
CONFIANCA_MINIMA_POSTO = float(_texto("CONFIANCA_MINIMA_POSTO", "0.5"))

# --- Dados locais (cache de coordenadas e consumo) ------------------------
CAMINHO_CACHE = Path(_texto("MOBILIDADE_CACHE", str(PASTA_BACKEND / "var" / "mobilidade.sqlite3")))

CORS_ORIGENS = [
    origem.strip()
    for origem in _texto(
        "CORS_ORIGENS",
        "http://localhost:5185,http://127.0.0.1:5185,http://localhost:5173,http://127.0.0.1:5173",
    ).split(",")
    if origem.strip()
]
