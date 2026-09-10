from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    cors_origins: str = "http://localhost:4173"
    database_url: str
    upload_dir: Path
    max_upload_bytes: int = 12 * 1024 * 1024
    alpha_rh_openai_api_key: str | None = None
    alpha_rh_openai_model: str = "gpt-5.4-mini"
    alpha_rh_gemini_api_key: str | None = None
    alpha_rh_gemini_model: str = "gemini-3.1-flash-lite"
    alpha_rh_gemini_fallback_model: str = "gemini-3.6-flash"
    gemini_primary_timeout_seconds: int = 60
    gemini_fallback_timeout_seconds: int = 120
    gemini_max_output_tokens: int = 4096
    provider_max_text_chars: int = 50_000

    @field_validator("upload_dir", mode="after")
    @classmethod
    def resolve_upload_dir(cls, value: Path) -> Path:
        return value.expanduser().resolve()

    @property
    def cors_origin_list(self) -> list[str]:
        return [item.strip() for item in self.cors_origins.split(",") if item.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
