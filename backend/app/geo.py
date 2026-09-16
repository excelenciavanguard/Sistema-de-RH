"""Distância em linha reta e comparação de município. Sem dependência externa."""

import unicodedata
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
