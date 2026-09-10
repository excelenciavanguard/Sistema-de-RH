from fastapi import APIRouter

from .routes import candidates, extractions, system


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(system.router)
api_router.include_router(extractions.router)
api_router.include_router(candidates.router)
