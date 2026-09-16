const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const providerValue = {
  OpenAI: "openai",
  Gemini: "gemini",
};

function errorMessage(payload, fallback) {
  if (typeof payload?.detail === "string") return payload.detail;
  if (payload?.detail?.message) return payload.detail.message;
  return fallback;
}

export async function compareExtraction(file, providers) {
  const form = new FormData();
  form.append("file", file);
  form.append("provider", providers.length > 1 ? "both" : providerValue[providers[0]]);

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/extractions`, { method: "POST", body: form });
  } catch {
    throw new Error("O backend local não está disponível. Verifique se a API FastAPI está iniciada.");
  }

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(errorMessage(payload, "Não foi possível processar o currículo."));
  }

  return {
    requestId: payload.id,
    status: payload.status,
    file: {
      name: payload.file.original_name,
      size: payload.file.size_bytes,
      extension: payload.file.extension,
      duplicate: payload.file.duplicate,
      textPreview: payload.file.text_preview,
      extractionNote: payload.file.extraction_note,
    },
    results: payload.results.map((item) => ({
      provider: item.provider === "openai" ? "OpenAI" : "Gemini",
      status: item.status,
      fields: item.structured_data,
      errorCode: item.error_code,
      errorMessage: item.error_message,
    })),
  };
}

