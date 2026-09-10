from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from ...config import Settings, get_settings
from ...db import get_db
from ...schemas import HealthOut, ProviderAvailability
from ...services.providers import provider_states


router = APIRouter(tags=["system"])


@router.get("/health", response_model=HealthOut)
def health(db: Session = Depends(get_db), settings: Settings = Depends(get_settings)) -> HealthOut:
    db.execute(text("SELECT 1"))
    return HealthOut(status="ok", database="connected", environment=settings.app_env)


@router.get("/providers", response_model=list[ProviderAvailability])
def providers(settings: Settings = Depends(get_settings)) -> list[ProviderAvailability]:
    return [ProviderAvailability(provider=item.provider, configured=item.configured) for item in provider_states(settings)]

