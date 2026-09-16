"""Testes sem rede e sem WebOper: nada aqui conecta em banco ou API externa."""

import os
import tempfile
from pathlib import Path

# Antes de importar app.config: load_dotenv não sobrescreve o que já existe.
os.environ["WEBOPER_DB_HOST"] = ""
os.environ["WEBOPER_DB_USER"] = ""
os.environ["WEBOPER_DB_NAME"] = ""
os.environ["GEOAPIFY_API_KEY"] = "chave-de-teste"
os.environ["GEOAPIFY_INTERVALO_SEGUNDOS"] = "0"
os.environ["MOBILIDADE_CACHE"] = str(Path(tempfile.mkdtemp()) / "teste.sqlite3")
