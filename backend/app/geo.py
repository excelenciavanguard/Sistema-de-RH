"""Distância em linha reta e comparação de município. Sem dependência externa."""

import re
import unicodedata
from difflib import SequenceMatcher
from math import asin, cos, radians, sin, sqrt

RAIO_TERRA_KM = 6371.0088


def normalizar(texto: str | None) -> str:
    """Minúsculas, sem acento e sem espaço sobrando ("NITERÓI " -> "niteroi")."""
    if not texto:
        return ""
    sem_acento = unicodedata.normalize("NFKD", texto)
    sem_acento = "".join(c for c in sem_acento if not unicodedata.combining(c))
    return " ".join(sem_acento.lower().split())


def distancia_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Haversine: distância em linha reta entre dois pontos."""
    lat1_r, lon1_r, lat2_r, lon2_r = map(radians, (lat1, lon1, lat2, lon2))
    a = sin((lat2_r - lat1_r) / 2) ** 2 + cos(lat1_r) * cos(lat2_r) * sin((lon2_r - lon1_r) / 2) ** 2
    return 2 * RAIO_TERRA_KM * asin(sqrt(a))


def mesmo_municipio(a: str | None, b: str | None) -> bool:
    return bool(a) and bool(b) and normalizar(a) == normalizar(b)


# Tipo de via no começo do nome. "rua" sem limite de palavra pega o "RUAASSUNCAO" do WebOper.
_TIPO_DE_VIA = re.compile(r"^(avenida|av\b\.?|rua|r\b\.?|estrada|estr\b\.?|travessa|tv\b\.?|praca|largo|alameda|rodovia|ladeira)\s*")

# Grafia antiga, comum no cadastro dos Correios, para a grafia atual usada no mapa ("Goes" -> "Gois").
_GRAFIA_ATUAL = [
    (re.compile(r"ph"), "f"),
    (re.compile(r"th"), "t"),
    (re.compile(r"y"), "i"),
    (re.compile(r"oes\b"), "ois"),
    (re.compile(r"([lmnt])\1"), r"\1"),
    (re.compile(r"\bluiz\b"), "luis"),
    (re.compile(r"\bsouza\b"), "sousa"),
]


def nome_da_rua(texto: str | None) -> str:
    """Nome normalizado, sem o tipo de via: "R. Coronel Góis Pereira" -> "coronel gois pereira"."""
    return _TIPO_DE_VIA.sub("", normalizar(texto)).strip()


def semelhanca_de_rua(a: str | None, b: str | None) -> float:
    """0 a 1. "Coronel Goes Pereira" x "Rua Coronel Góis Pereira" dá perto de 0,95."""
    x, y = nome_da_rua(a), nome_da_rua(b)
    return SequenceMatcher(None, x, y).ratio() if x and y else 0.0


def grafia_atual(texto: str | None) -> str:
    resultado = normalizar(texto)
    for padrao, troca in _GRAFIA_ATUAL:
        resultado = padrao.sub(troca, resultado)
    return resultado
