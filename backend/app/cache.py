"""Cache local (SQLite) das coordenadas dos postos e do consumo da Geoapify.

Fica em backend/var/, que não é versionado. Não guarda endereço de candidato:
esse é consultado na hora e descartado.
"""

import sqlite3
from contextlib import closing
from datetime import date, datetime
from pathlib import Path

from app.modelos import Local


class Cache:
    def __init__(self, caminho: Path) -> None:
        self._caminho = caminho
        caminho.parent.mkdir(parents=True, exist_ok=True)
        with closing(self._conectar()) as conexao, conexao:
            conexao.executescript(
                """
                CREATE TABLE IF NOT EXISTS postos_geo (
                    chave INTEGER PRIMARY KEY,
                    endereco_busca TEXT NOT NULL,
                    latitude REAL, longitude REAL,
                    municipio TEXT, uf TEXT, endereco_formatado TEXT, confianca REAL,
                    erro TEXT,
                    atualizado_em TEXT NOT NULL
                );
                CREATE TABLE IF NOT EXISTS consumo (
                    dia TEXT NOT NULL, operacao TEXT NOT NULL,
                    requisicoes INTEGER NOT NULL DEFAULT 0, creditos INTEGER NOT NULL DEFAULT 0,
                    PRIMARY KEY (dia, operacao)
                );
                """
            )
            colunas = {linha[1] for linha in conexao.execute("PRAGMA table_info(postos_geo)")}
            if "precisao" not in colunas:
                conexao.execute("ALTER TABLE postos_geo ADD COLUMN precisao TEXT")

    def _conectar(self) -> sqlite3.Connection:
        return sqlite3.connect(self._caminho)

    def posto(self, chave: int, endereco_busca: str) -> tuple[Local | None, str | None] | None:
        """(local, erro) do posto; None se precisa geocodificar de novo.

        Precisa quando nunca foi geocodificado, quando o endereço mudou no WebOper ou quando a
        localização foi salva antes de existir a precisão (não dá para saber se é só o bairro).
        """
        with closing(self._conectar()) as conexao:
            linha = conexao.execute(
                "SELECT endereco_busca, latitude, longitude, municipio, uf, endereco_formatado, confianca, erro, precisao "
                "FROM postos_geo WHERE chave = ?",
                (chave,),
            ).fetchone()
        if not linha or linha[0] != endereco_busca:
            return None
        _, lat, lon, municipio, uf, formatado, confianca, erro, precisao = linha
        if lat is not None and not precisao:
            return None
        local = Local(lat, lon, formatado or "", municipio or "", uf or "", confianca or 0.0, precisao) if lat is not None else None
        return local, erro

    def salvar_posto(self, chave: int, endereco_busca: str, local: Local | None, erro: str | None) -> None:
        with closing(self._conectar()) as conexao, conexao:
            conexao.execute(
                "INSERT OR REPLACE INTO postos_geo (chave, endereco_busca, latitude, longitude, municipio, uf, "
                "endereco_formatado, confianca, erro, atualizado_em, precisao) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                (
                    chave, endereco_busca,
                    local.latitude if local else None, local.longitude if local else None,
                    local.municipio if local else None, local.uf if local else None,
                    local.endereco_formatado if local else None, local.confianca if local else None,
                    erro, datetime.now().isoformat(timespec="seconds"),
                    local.precisao if local else None,
                ),
            )

    def registrar_consumo(self, operacao: str, creditos: int) -> None:
        with closing(self._conectar()) as conexao, conexao:
            conexao.execute(
                "INSERT INTO consumo (dia, operacao, requisicoes, creditos) VALUES (?, ?, 1, ?) "
                "ON CONFLICT (dia, operacao) DO UPDATE SET requisicoes = requisicoes + 1, creditos = creditos + excluded.creditos",
                (date.today().isoformat(), operacao, creditos),
            )

    def consumo_do_dia(self) -> dict:
        with closing(self._conectar()) as conexao:
            linhas = conexao.execute(
                "SELECT operacao, requisicoes, creditos FROM consumo WHERE dia = ?", (date.today().isoformat(),)
            ).fetchall()
        return {
            "dia": date.today().isoformat(),
            "creditos_estimados": sum(l[2] for l in linhas),
            "por_operacao": {operacao: {"requisicoes": req, "creditos": cred} for operacao, req, cred in linhas},
            "limite_gratuito_dia": 3000,
        }
