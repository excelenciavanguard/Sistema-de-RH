const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

function errorMessage(payload, fallback) {
  if (typeof payload?.detail === "string") return payload.detail;
  if (payload?.detail?.message) return payload.detail.message;
  return fallback;
}

export async function listCandidates(vacancyCode) {
  const response = await fetch(`${API_BASE_URL}/vacancies/${encodeURIComponent(vacancyCode)}/candidates`);
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorMessage(payload, "Não foi possível carregar os candidatos do Kanban."));
  return payload;
}

export async function addToKanban(jobId, provider, vacancyCode) {
  const response = await fetch(`${API_BASE_URL}/extractions/${encodeURIComponent(jobId)}/add-to-kanban`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ provider: provider.toLowerCase(), vacancy_code: vacancyCode }),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(errorMessage(payload, "Não foi possível adicionar o candidato ao Kanban."));
  return payload;
}

export async function moveCandidateStage(applicationId, stage) {
  const response = await fetch(`${API_BASE_URL}/applications/${applicationId}/stage`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(errorMessage(payload, "Não foi possível salvar a nova etapa do candidato."));
  return payload;
}
