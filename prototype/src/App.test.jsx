import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.jsx";

function jsonResponse(payload, ok = true) {
  return { ok, json: async () => payload };
}

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => jsonResponse([])));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("Alpha RH Kanban", () => {
  it("renders the nine approved recruitment stages", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: /Auxiliar de Serviços Gerais/i })).toBeInTheDocument();
    for (const label of ["Candidatura", "Triagem", "Contato", "Entrevista RH", "Entrevista Gestor", "Pesquisa", "Entrega de documentos", "Treinamento", "Contratação"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText("Novos")).not.toBeInTheDocument();
    expect(screen.queryByText("Proposta")).not.toBeInTheDocument();
  });

  it("filters candidates by search", () => {
    render(<App />);
    fireEvent.change(screen.getByPlaceholderText("Buscar candidatos"), { target: { value: "Beatriz" } });
    expect(screen.getByText("Beatriz Nunes")).toBeInTheDocument();
    expect(screen.queryByText("Juliana Alves")).not.toBeInTheDocument();
  });

  it("opens the extraction laboratory", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Testar extração/i }));
    expect(screen.getByRole("dialog", { name: /Laboratório de extração/i })).toBeInTheDocument();
    expect(screen.getByText(/Extração segura ativa/i)).toBeInTheDocument();
  });

  it("shows the approved mobility workspace inside the candidate modal", () => {
    render(<App />);
    fireEvent.click(screen.getAllByLabelText("Abrir candidato Rafael Santos")[0]);
    const candidateDialog = screen.getByRole("dialog", { name: "Rafael Santos" });
    fireEvent.click(within(candidateDialog).getByRole("button", { name: "Mobilidade" }));

    expect(screen.getByRole("heading", { name: "Detalhes da mobilidade" })).toBeInTheDocument();
    expect(screen.getByText("Percurso de ida até o posto")).toBeInTheDocument();
    expect(screen.getByText("Pontos para confirmar")).toBeInTheDocument();
    expect(screen.getByText(/A mobilidade apoia a análise/i)).toBeInTheDocument();
  });

  it("adds the chosen completed extraction to the Candidatura column", async () => {
    const imported = {
      id: "application-1",
      name: "Rafael de Teste",
      initials: "RT",
      source: "Extração Gemini",
      stage: "application",
      evidence: "Revisão pendente",
      evidenceTone: "warning",
      requirements: "Dados extraídos · revisar",
      route: "Mobilidade pendente",
      fare: "A calcular",
      stageTime: "Agora",
      owner: "Equipe RH",
      messages: 0,
      role: "Auxiliar de Serviços Gerais",
      location: "Rio de Janeiro, RJ",
      availability: "Não informado",
      education: "Ensino médio completo",
      experience: "Dois anos em serviços gerais",
      reviewStatus: "pending",
    };
    fetch.mockImplementation(async (url, options = {}) => {
      if (String(url).includes("/extractions") && options.method === "POST" && options.body instanceof FormData) {
        return jsonResponse({
          id: "job-1",
          status: "completed",
          file: { original_name: "curriculo.txt", size_bytes: 30, extension: "txt", duplicate: false, text_preview: "Rafael de Teste" },
          results: [{ provider: "gemini", status: "completed", structured_data: { nome: "Rafael de Teste", localidade: "Rio de Janeiro, RJ", experiencia: "Dois anos", escolaridade: "Ensino médio completo", disponibilidade: null } }],
        });
      }
      if (String(url).includes("add-to-kanban")) return jsonResponse({ candidate: imported, duplicate: false });
      return jsonResponse([]);
    });

    const { container } = render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Testar extração/i }));
    fireEvent.change(container.querySelector('input[type="file"]'), {
      target: { files: [new File(["Rafael de Teste"], "curriculo.txt", { type: "text/plain" })] },
    });
    fireEvent.click(screen.getByRole("button", { name: "Gemini" }));
    fireEvent.click(screen.getByRole("button", { name: /Executar teste/i }));

    fireEvent.click(await screen.findByRole("button", { name: /Adicionar resultado do Gemini ao Kanban/i }));

    expect(await screen.findByText("Candidato adicionado em Candidatura")).toBeInTheDocument();
    expect(screen.getByLabelText("Abrir candidato Rafael de Teste")).toBeInTheDocument();
  });

  it("persists a real candidate movement between approved stages", async () => {
    const imported = {
      id: "application-move-1",
      name: "Candidato em teste",
      initials: "CT",
      source: "Extração Gemini",
      stage: "application",
      evidence: "Revisão pendente",
      evidenceTone: "warning",
      requirements: "1 evidência extraída",
      route: "Mobilidade pendente",
      fare: "Custo pendente",
      stageTime: "Agora",
      owner: "Equipe RH",
      messages: 0,
      role: "Auxiliar de Serviços Gerais",
      postName: "Leblon Power",
      location: "Rio de Janeiro - RJ",
      availability: "Não informado",
      education: "Não informado",
      experience: "Não informado",
      reviewStatus: "pending",
      resumeFile: "curriculo.txt",
      isDemo: false,
      mobilityStatus: "pending",
    };
    fetch.mockImplementation(async (url, options = {}) => {
      if (options.method === "PATCH") return jsonResponse({ ...imported, stage: "screening" });
      return jsonResponse([imported]);
    });

    render(<App />);
    const card = await screen.findByLabelText("Abrir candidato Candidato em teste");
    const transfer = {
      value: "",
      effectAllowed: "none",
      setData(_type, value) { this.value = value; },
      getData() { return this.value; },
    };
    fireEvent.dragStart(card, { dataTransfer: transfer });
    fireEvent.drop(screen.getByText("Triagem").closest(".kanban-column"), { dataTransfer: transfer });

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      "http://127.0.0.1:8000/api/v1/applications/application-move-1/stage",
      expect.objectContaining({ method: "PATCH", body: JSON.stringify({ stage: "screening" }) }),
    ));
  });

  it("shows only real extracted evidence and pending mobility for an imported candidate", async () => {
    const candidateExample = {
      id: "candidate-example-application",
      name: "CANDIDATO EXEMPLO",
      initials: "CE",
      source: "Extração Gemini",
      stage: "application",
      evidence: "Revisão pendente",
      evidenceTone: "warning",
      requirements: "2 evidências extraídas",
      route: "Mobilidade pendente",
      fare: "Custo pendente",
      stageTime: "Agora",
      owner: "Equipe RH",
      messages: 0,
      role: "Auxiliar de Serviços Gerais",
      postName: "Leblon Power",
      location: "Rio de Janeiro - RJ",
      availability: "Não informado",
      education: "Ensino médio completo",
      experience: "Auxiliar de estoque em Empresa Exemplo",
      reviewStatus: "pending",
      resumeFileName: "curriculo_exemplo.pdf",
      isDemo: false,
      mobilityStatus: "pending",
      evidences: [{ campo: "experiencia", valor: "Auxiliar de estoque", trecho: "Auxiliar de estoque - Empresa Exemplo", pagina: 1, confianca: "alta" }],
      missingInfo: ["Disponibilidade"],
      questions: ["Qual é sua disponibilidade?"],
    };
    fetch.mockResolvedValue(jsonResponse([candidateExample]));

    render(<App />);
    fireEvent.click(await screen.findByLabelText("Abrir candidato CANDIDATO EXEMPLO"));

    expect(screen.getByText("curriculo_exemplo.pdf")).toBeInTheDocument();
    expect(screen.getAllByText("Revisão pendente")).toHaveLength(2);
    expect(screen.getByText("Auxiliar de estoque")).toBeInTheDocument();
    expect(screen.queryByText(/4 anos identificados/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/conservação de ambientes/i)).not.toBeInTheDocument();

    fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Mobilidade" }));
    expect(screen.getByRole("heading", { name: "Mobilidade pendente" })).toBeInTheDocument();
    expect(screen.queryByText("38 min")).not.toBeInTheDocument();
    expect(screen.queryByText("R$ 556,40")).not.toBeInTheDocument();
  });
});
