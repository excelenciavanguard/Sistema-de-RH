from dataclasses import dataclass

from ..config import Settings


@dataclass(frozen=True)
class ProviderState:
    provider: str
    configured: bool


def provider_states(settings: Settings) -> list[ProviderState]:
    return [
        ProviderState("openai", bool(settings.alpha_rh_openai_api_key)),
        ProviderState("gemini", bool(settings.alpha_rh_gemini_api_key)),
    ]


def configured(settings: Settings, provider: str) -> bool:
    if provider == "openai":
        return bool(settings.alpha_rh_openai_api_key)
    if provider == "gemini":
        return bool(settings.alpha_rh_gemini_api_key)
    return False
