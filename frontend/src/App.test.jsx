import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { App } from "./App.jsx";

function jsonResponse(payload, ok = true) {
  return { ok, json: async () => payload };
}

beforeEach(() => {
  window.history.replaceState(null, "", "#/inicio");
  vi.stubGlobal("ResizeObserver", class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  });
  vi.stubGlobal("fetch", vi.fn(async () => jsonResponse([])));
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function renderKanban() {
  window.history.replaceState(null, "", "#/recrutamento/vagas/2026-0157/kanban");
  return render(<App />);
}

describe("Alpha RH connected screens", () => {
  it("opens on the operational home and navigates through the recruitment flow", async () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Hoje no RH" })).toBeInTheDocument();
    expect(screen.queryByText("Saúde das entradas")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Recrutamento" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Requisições.*Operações/i }));
    expect(await screen.findByRole("heading", { name: "Requisições de vaga" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Recrutamento" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Aprovações.*Diretoria/i }));
    expect(await screen.findByRole("heading", { name: "Aprovações da diretoria" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Recrutamento" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Vagas.*Kanban/i }));
    expect(await screen.findByRole("heading", { name: "Vagas" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Abrir Kanban" })[0]);
    expect(await screen.findByRole("heading", { name: /Auxiliar de Serviços Gerais/i })).toBeInTheDocument();
  });

  it("keeps the confirmed responsibility sequence visible", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Recrutamento" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Requisições.*Operações/i }));
    expect(await screen.findByText("Operações cria")).toBeInTheDocument();
    expect(screen.getByText("Diretoria aprova")).toBeInTheDocument();
    expect(screen.getByText("RH publica a vaga")).toBeInTheDocument();
  });

  it("shows illustrative labels on frontend-only data", () => {
    render(<App />);
    expect(screen.getAllByText("Dados demonstrativos").length).toBeGreaterThan(0);
  });

  it("shows a compact operational welcome banner on the home screen", () => {
    render(<App />);
    expect(screen.getByRole("heading", { name: "Olá, Simão Pedro!" })).toBeInTheDocument();
    expect(screen.getByText(/27 currículos para revisar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ver todas as ações" })).toBeInTheDocument();
  });

  it("lets Operations prepare and submit a new requisition", async () => {
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Recrutamento" }));
    fireEvent.click(screen.getByRole("menuitem", { name: /Requisições.*Operações/i }));
    fireEvent.click(await screen.findByRole("button", { name: "Nova requisição" }));

    expect(await screen.findByRole("heading", { name: "Nova requisição" })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Função solicitada"), { target: { value: "Auxiliar de Serviços Gerais" } });
    fireEvent.change(screen.getByLabelText("Justificativa da requisição"), { target: { value: "Reposição de profissional para cobertura da escala do posto." } });
    fireEvent.click(screen.getByRole("button", { name: "Enviar para a Diretoria" }));

    expect(await screen.findByText("Requisição enviada para aprovação")).toBeInTheDocument();
  });

  it("uses grouped dropdown menus without a duplicated secondary bar", () => {
    render(<App />);
    expect(screen.getByRole("searchbox", { name: "Buscar no Alpha RH" })).toBeInTheDocument();
    for (const group of ["Recrutamento", "Talentos e Pessoas", "Jornada", "Gestão"]) {
      expect(screen.getByRole("button", { name: group })).toBeInTheDocument();
    }
    expect(screen.queryByRole("navigation", { name: "Módulos do sistema" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Nova requisição" })).not.toBeInTheDocument();
  });

  it("connects the Directorate decision to the RH vacancy builder", async () => {
    window.history.replaceState(null, "", "#/recrutamento/aprovacoes");
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: /Analisar REQ-2026-041/i }));
    const decision = screen.getByRole("dialog", { name: /Analisar requisição REQ-2026-041/i });
    fireEvent.click(within(decision).getByRole("button", { name: "Aprovar requisição" }));
    expect(within(decision).getByText("Requisição aprovada")).toBeInTheDocument();

    fireEvent.click(within(decision).getByRole("button", { name: "Criar vaga no RH" }));
    expect(await screen.findByRole("heading", { name: "Criar vaga" })).toBeInTheDocument();
    expect(screen.getByText("REQ-2026-041 aprovada pela Diretoria")).toBeInTheDocument();
  });

  it.each([
    ["#/talentos", "Banco de talentos", "Encontre pessoas ou descubra talentos para uma vaga"],
    ["#/agenda", "Agenda", "Lista de compromissos"],
    ["#/admissao", "Documentos de admissão", "Selecione um candidato para conferir"],
    ["#/relatorios", "Relatórios de recrutamento", "Origem dos candidatos"],
    ["#/integracoes", "Integrações", "Configure fontes de dados"],
    ["#/administracao", "Usuários e permissões", "Controle quem pode acessar"],
  ])("renders the connected module %s", async (hash, heading, content) => {
    window.history.replaceState(null, "", hash);
    render(<App />);
    expect(await screen.findByRole("heading", { name: heading })).toBeInTheDocument();
    expect(screen.getByText(content, { exact: false })).toBeInTheDocument();
    expect(screen.queryByText("Estrutura visual em preparação")).not.toBeInTheDocument();
  });

  it("supports talent selection and view switching", () => {
    window.history.replaceState(null, "", "#/talentos");
    render(<App />);
    expect(screen.queryByText("1 selecionado")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Mariana Lima" }));
    expect(screen.getByText("1 selecionado")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Associar à vaga" })).toBeEnabled();
    fireEvent.click(screen.getByRole("tab", { name: "Encontrar para uma vaga" }));
    expect(screen.getByText("Vaga selecionada")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Cards" }));
    expect(screen.getByTestId("talent-card-grid")).toBeInTheDocument();
  });

  it("opens the agenda in month view and lets the user inspect a day", () => {
    window.history.replaceState(null, "", "#/agenda");
    render(<App />);
    expect(screen.getByTestId("agenda-month-view")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Calendários" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tipos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Lista de compromissos" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Abrir terça-feira, 22 de abril/i }));
    const drawer = screen.getByRole("dialog", { name: "Terça-feira, 22 de abril" });
    expect(within(drawer).getByText("3 compromissos neste dia")).toBeInTheDocument();
    expect(within(drawer).getByRole("button", { name: "Novo compromisso" })).toBeInTheDocument();
    fireEvent.click(within(drawer).getByRole("button", { name: "Fechar detalhes do dia" }));
    expect(screen.queryByRole("dialog", { name: "Terça-feira, 22 de abril" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Semana" }));
    expect(screen.getByTestId("agenda-week-view")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Entrevista RH, Paulo Henrique, 10:00" }));
    const thursday = screen.getByRole("dialog", { name: "Quinta-feira, 24 de abril" });
    expect(within(thursday).getAllByRole("button", { name: "Editar" })).toHaveLength(3);
    expect(within(thursday).getAllByRole("button", { name: "Abrir candidato" })).toHaveLength(2);
    fireEvent.click(within(thursday).getByRole("button", { name: "Fechar detalhes do dia" }));

    fireEvent.click(screen.getByRole("button", { name: "Dia" }));
    expect(screen.getByTestId("agenda-day-view")).toBeInTheDocument();
  });

  it("shows admission details and switches admission workspaces", () => {
    window.history.replaceState(null, "", "#/admissao");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: "Abrir documentos de Mariana Lima" }));
    expect(screen.getByRole("heading", { name: "Checklist de documentos" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Fechar modal de documentos" }));
    fireEvent.click(screen.getByRole("tab", { name: "Treinamentos" }));
    expect(screen.getByRole("heading", { name: "Treinamentos de admissão" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("tab", { name: "Contratação" }));
    expect(screen.getByRole("heading", { name: "Contratações e encerramentos" })).toBeInTheDocument();
  });

  it("renders the complete recruitment report", () => {
    window.history.replaceState(null, "", "#/relatorios");
    render(<App />);
    expect(screen.getByRole("heading", { name: "Vagas com atenção" })).toBeInTheDocument();
    expect(screen.getByLabelText("Conversão por etapa")).toBeInTheDocument();
    expect(screen.getAllByLabelText(/Origem dos candidatos/)).toHaveLength(1);
  });

  it("opens the selected integration detail", () => {
    window.history.replaceState(null, "", "#/integracoes");
    render(<App />);
    fireEvent.click(screen.getByRole("button", { name: /Google Maps Platform/ }));
    expect(screen.getByRole("heading", { name: "Detalhe da integração" })).toBeInTheDocument();
    expect(within(screen.getByLabelText("Painel de detalhe da integração")).getByText("Conta e chave pendentes")).toBeInTheDocument();
  });

  it("switches administration areas and preserves read-only Weboper copy", () => {
    window.history.replaceState(null, "", "#/administracao");
    render(<App />);
    fireEvent.click(screen.getByRole("tab", { name: "Estrutura" }));
    expect(screen.getByRole("heading", { name: "Postos, departamentos e responsáveis" })).toBeInTheDocument();
    expect(screen.getAllByText(/CAD_CLIENTE/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/somente leitura/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("tab", { name: "Configurações" }));
    expect(screen.getByRole("heading", { name: "Configurações do recrutamento" })).toBeInTheDocument();
  });

  it("moves through vacancy details, requirements, questions, stages and review", async () => {
    window.history.replaceState(null, "", "#/recrutamento/vagas/nova");
    render(<App />);

    expect(screen.getByRole("heading", { name: "Criar vaga" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continuar para requisitos" }));
    expect(screen.getByRole("heading", { name: "Requisitos da vaga" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continuar para perguntas" }));
    expect(screen.getByRole("heading", { name: "Perguntas da candidatura" })).toBeInTheDocument();
    expect(screen.getByDisplayValue("Possui disponibilidade para trabalhar à noite?")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Continuar para etapas" }));
    expect(screen.getByRole("heading", { name: "Etapas do processo" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Revisar vaga" }));
    expect(screen.getByRole("heading", { name: "Revisão e publicação" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Publicar vaga" }));
    expect(await screen.findByText("Vaga publicada no protótipo")).toBeInTheDocument();
  });
});

describe("Alpha RH Kanban", () => {
  it("renders the nine approved recruitment stages", () => {
    renderKanban();
    expect(screen.getByRole("heading", { name: /Auxiliar de Serviços Gerais/i })).toBeInTheDocument();
    for (const label of ["Candidatura", "Triagem", "Contato", "Entrevista RH", "Entrevista Gestor", "Pesquisa", "Entrega de documentos", "Treinamento", "Contratação"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
    expect(screen.queryByText("Novos")).not.toBeInTheDocument();
    expect(screen.queryByText("Proposta")).not.toBeInTheDocument();
  });

  it("filters candidates by search", () => {
    renderKanban();
    fireEvent.change(screen.getByPlaceholderText("Buscar candidatos"), { target: { value: "Beatriz" } });
    expect(screen.getByText("Beatriz Nunes")).toBeInTheDocument();
    expect(screen.queryByText("Juliana Alves")).not.toBeInTheDocument();
  });

  it("opens the extraction laboratory", () => {
    renderKanban();
    fireEvent.click(screen.getByRole("button", { name: /Testar extração/i }));
    expect(screen.getByRole("dialog", { name: /Laboratório de extração/i })).toBeInTheDocument();
    expect(screen.getByText(/Extração segura ativa/i)).toBeInTheDocument();
  });

  it("shows the approved mobility workspace inside the candidate modal", () => {
    renderKanban();
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

    const { container } = renderKanban();
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

    renderKanban();
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

    renderKanban();
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
