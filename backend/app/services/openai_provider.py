import json

import httpx
from pydantic import ValidationError

from ..config import Settings
from .gemini_provider import GEMINI_RESPONSE_SCHEMA, ProviderError, ResumeExtraction, SYSTEM_INSTRUCTION, _prompt


def _strict_openai_schema(value):
    if isinstance(value, list):
        return [_strict_openai_schema(item) for item in value]
    if not isinstance(value, dict):
        return value

    converted = {
        key: _strict_openai_schema(item)
        for key, item in value.items()
        if key != "nullable"
    }
    if value.get("nullable") is True and isinstance(converted.get("type"), str):
        converted["type"] = [converted["type"], "null"]
    if converted.get("type") == "object":
        properties = converted.get("properties", {})
        converted["required"] = list(properties.keys())
        converted["additionalProperties"] = False
    return converted


def _response_text(payload: dict) -> str:
    text_parts: list[str] = []
    for output in payload.get("output") or []:
        for content in output.get("content") or []:
            if content.get("type") == "refusal":
                raise ProviderError("provider_refusal", "A OpenAI não processou este conteúdo; encaminhe para revisão.")
            if content.get("type") == "output_text" and isinstance(content.get("text"), str):
                text_parts.append(content["text"])
    text = "".join(text_parts)
    if not text.strip():
        raise ProviderError("provider_no_output", "A OpenAI não retornou conteúdo para análise.")
    return text


def extract_resume_with_openai(
    resume_text: str,
    settings: Settings,
    client: httpx.Client | None = None,
) -> dict:
    if not settings.alpha_rh_openai_api_key:
        raise ProviderError("provider_not_configured", "OpenAI ainda não possui chave configurada.")

    request_body = {
        "model": settings.alpha_rh_openai_model,
        "store": False,
        "instructions": SYSTEM_INSTRUCTION,
        "input": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "input_text",
                        "text": _prompt(resume_text[: settings.provider_max_text_chars]),
                    }
                ],
            }
        ],
        "text": {
            "format": {
                "type": "json_schema",
                "name": "resume_extraction",
                "strict": True,
                "schema": _strict_openai_schema(GEMINI_RESPONSE_SCHEMA),
            }
        },
    }

    owns_client = client is None
    http_client = client or httpx.Client(timeout=httpx.Timeout(45.0, connect=10.0))
    try:
        response = http_client.post(
            "https://api.openai.com/v1/responses",
            headers={"Authorization": f"Bearer {settings.alpha_rh_openai_api_key}"},
            json=request_body,
        )
    except httpx.TimeoutException as exc:
        raise ProviderError("provider_timeout", "A OpenAI excedeu o tempo limite. Tente novamente.") from exc
    except httpx.HTTPError as exc:
        raise ProviderError("provider_unavailable", "Não foi possível conectar à OpenAI.") from exc
    finally:
        if owns_client:
            http_client.close()

    if response.status_code in {401, 403}:
        raise ProviderError("provider_authentication_failed", "A chave da OpenAI não foi aceita.")
    if response.status_code == 429:
        raise ProviderError("provider_rate_limited", "O limite de uso da OpenAI foi atingido. Tente mais tarde.")
    if response.status_code >= 500:
        raise ProviderError("provider_unavailable", "A OpenAI está temporariamente indisponível.")
    if not response.is_success:
        raise ProviderError("provider_request_failed", "A OpenAI recusou a solicitação de análise.")

    try:
        parsed = ResumeExtraction.model_validate(json.loads(_response_text(response.json())))
    except (ValueError, TypeError, ValidationError) as exc:
        raise ProviderError(
            "provider_invalid_output",
            "A OpenAI retornou dados fora do formato esperado; encaminhe para revisão.",
        ) from exc
    return parsed.model_dump(mode="json")


__all__ = ["ProviderError", "extract_resume_with_openai"]
