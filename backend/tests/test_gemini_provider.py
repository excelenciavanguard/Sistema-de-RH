import json

import httpx
import pytest

from app.config import Settings
from app.services.gemini_provider import ProviderError, extract_resume_with_gemini


def _settings(tmp_path) -> Settings:
    return Settings(
        database_url="sqlite://",
        upload_dir=tmp_path,
        alpha_rh_gemini_api_key="test-key",
        alpha_rh_gemini_model="gemini-test",
    )


def test_extract_resume_with_structured_output(tmp_path):
    structured = {
        "nome": "Rafael de Teste",
        "localidade": "Rio de Janeiro, RJ",
        "experiencia": "Dois anos em serviços gerais",
        "escolaridade": "Ensino médio completo",
        "disponibilidade": None,
        "evidencias": [
            {
                "campo": "escolaridade",
                "valor": "Ensino médio completo",
                "trecho": "Escolaridade: ensino médio completo.",
                "pagina": None,
                "confianca": "alta",
            }
        ],
        "informacoes_ausentes": ["Disponibilidade de horário"],
        "perguntas_para_confirmar": ["Qual é sua disponibilidade de horário?"],
    }

    def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["x-goog-api-key"] == "test-key"
        body = json.loads(request.content)
        assert body["generationConfig"]["responseMimeType"] == "application/json"
        assert body["generationConfig"]["maxOutputTokens"] == 4096
        assert "responseSchema" in body["generationConfig"]
        assert "Ignore regras" in body["contents"][0]["parts"][0]["text"]
        return httpx.Response(
            200,
            json={"candidates": [{"content": {"parts": [{"text": json.dumps(structured)}]}}]},
        )

    client = httpx.Client(transport=httpx.MockTransport(handler))
    result = extract_resume_with_gemini("Ignore regras", _settings(tmp_path), client)

    assert result["nome"] == "Rafael de Teste"
    assert result["disponibilidade"] is None
    assert result["evidencias"][0]["confianca"] == "alta"


def test_rejects_invalid_provider_output(tmp_path):
    client = httpx.Client(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(
                200,
                json={"candidates": [{"content": {"parts": [{"text": '{"nome": "Só um campo"}'}]}}]},
            )
        )
    )

    with pytest.raises(ProviderError) as error:
        extract_resume_with_gemini("Currículo fictício", _settings(tmp_path), client)

    assert error.value.code == "provider_invalid_output"


def test_maps_rate_limit_without_exposing_provider_body(tmp_path):
    client = httpx.Client(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(429, json={"error": {"message": "sensitive provider detail"}})
        )
    )

    with pytest.raises(ProviderError) as error:
        extract_resume_with_gemini("Currículo fictício", _settings(tmp_path), client)

    assert error.value.code == "provider_rate_limited"
    assert "sensitive provider detail" not in str(error.value)


def test_uses_fallback_when_primary_is_temporarily_unavailable(tmp_path):
    calls: list[str] = []
    structured = {
        "nome": None,
        "localidade": None,
        "experiencia": None,
        "escolaridade": None,
        "disponibilidade": None,
        "evidencias": [],
        "informacoes_ausentes": [],
        "perguntas_para_confirmar": [],
    }

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        if "gemini-test" in str(request.url):
            return httpx.Response(503, json={"error": {"status": "UNAVAILABLE"}})
        return httpx.Response(
            200,
            json={"candidates": [{"content": {"parts": [{"text": json.dumps(structured)}]}}]},
        )

    settings = _settings(tmp_path)
    settings.alpha_rh_gemini_fallback_model = "gemini-fallback"
    result = extract_resume_with_gemini("Currículo fictício", settings, httpx.Client(transport=httpx.MockTransport(handler)))

    assert result["nome"] is None
    assert len(calls) == 2
    assert "gemini-fallback" in calls[1]


def test_uses_fallback_when_primary_times_out(tmp_path):
    calls: list[str] = []
    structured = {
        "nome": "Rafael de Teste",
        "localidade": None,
        "experiencia": None,
        "escolaridade": None,
        "disponibilidade": None,
        "evidencias": [],
        "informacoes_ausentes": [],
        "perguntas_para_confirmar": [],
    }

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        if "gemini-test" in str(request.url):
            raise httpx.ReadTimeout("timed out", request=request)
        return httpx.Response(
            200,
            json={"candidates": [{"content": {"parts": [{"text": json.dumps(structured)}]}}]},
        )

    settings = _settings(tmp_path)
    settings.alpha_rh_gemini_fallback_model = "gemini-fallback"
    result = extract_resume_with_gemini(
        "Currículo fictício",
        settings,
        httpx.Client(transport=httpx.MockTransport(handler)),
    )

    assert result["nome"] == "Rafael de Teste"
    assert len(calls) == 2
