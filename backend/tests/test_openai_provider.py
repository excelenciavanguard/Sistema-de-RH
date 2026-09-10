import json

import httpx
import pytest

from app.config import Settings
from app.services.openai_provider import ProviderError, extract_resume_with_openai


def _settings(tmp_path) -> Settings:
    return Settings(
        database_url="sqlite://",
        upload_dir=tmp_path,
        alpha_rh_openai_api_key="test-key",
        alpha_rh_openai_model="gpt-test",
    )


def _structured() -> dict:
    return {
        "nome": "Rafael de Teste",
        "localidade": "Rio de Janeiro, RJ",
        "experiencia": "Dois anos em serviços gerais",
        "escolaridade": "Ensino médio completo",
        "disponibilidade": None,
        "evidencias": [],
        "informacoes_ausentes": ["Disponibilidade"],
        "perguntas_para_confirmar": ["Qual é sua disponibilidade?"],
    }


def test_extract_resume_with_responses_structured_output(tmp_path):
    def handler(request: httpx.Request) -> httpx.Response:
        assert request.headers["authorization"] == "Bearer test-key"
        body = json.loads(request.content)
        assert body["model"] == "gpt-test"
        assert body["store"] is False
        assert body["text"]["format"]["strict"] is True
        assert body["text"]["format"]["type"] == "json_schema"
        return httpx.Response(
            200,
            json={"output": [{"type": "message", "content": [{"type": "output_text", "text": json.dumps(_structured())}]}]},
        )

    result = extract_resume_with_openai(
        "Currículo fictício",
        _settings(tmp_path),
        httpx.Client(transport=httpx.MockTransport(handler)),
    )

    assert result["nome"] == "Rafael de Teste"
    assert result["disponibilidade"] is None


def test_rejects_invalid_openai_output(tmp_path):
    client = httpx.Client(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(
                200,
                json={"output": [{"content": [{"type": "output_text", "text": '{"nome":"Incompleto"}'}]}]},
            )
        )
    )

    with pytest.raises(ProviderError) as error:
        extract_resume_with_openai("Currículo", _settings(tmp_path), client)

    assert error.value.code == "provider_invalid_output"


@pytest.mark.parametrize(
    ("status", "code"),
    [(401, "provider_authentication_failed"), (429, "provider_rate_limited"), (500, "provider_unavailable")],
)
def test_maps_provider_errors_without_response_body(tmp_path, status, code):
    client = httpx.Client(
        transport=httpx.MockTransport(
            lambda request: httpx.Response(status, json={"error": {"message": "sensitive provider detail"}})
        )
    )

    with pytest.raises(ProviderError) as error:
        extract_resume_with_openai("Currículo", _settings(tmp_path), client)

    assert error.value.code == code
    assert "sensitive provider detail" not in str(error.value)
