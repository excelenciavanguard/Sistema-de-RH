import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CandidateList, RejectedCandidates } from "./VacancyWorkspaceViews.jsx";

afterEach(cleanup);

const candidate = {
  id: 1,
  name: "Rafael Santos",
  initials: "RS",
  role: "Auxiliar de Serviços Gerais",
  source: "RioVagas Gmail",
  stage: "application",
  evidence: "Comprovado",
  evidenceTone: "success",
  route: "42 min · 1 condução",
  availability: "Disponível agora",
};

describe("visualizações de candidatos da vaga", () => {
  it("apresenta a etapa em português e abre o perfil na lista", () => {
    const onOpen = vi.fn();
    render(<CandidateList candidates={[candidate]} onOpen={onOpen} />);

    expect(screen.getByText("Candidatura")).toBeInTheDocument();
    expect(screen.getByText("No currículo")).toBeInTheDocument();
    expect(screen.queryByText("Comprovado")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Ver perfil de Rafael Santos/i }));
    expect(onOpen).toHaveBeenCalledWith(candidate);
  });

  it("traduz as etapas finais do funil sem expor códigos técnicos", () => {
    render(<CandidateList candidates={[
      { ...candidate, id: 2, stage: "interview_hr" },
      { ...candidate, id: 3, stage: "manager_interview" },
      { ...candidate, id: 4, stage: "hiring" },
    ]} onOpen={() => {}} />);

    expect(screen.getByText("Entrevista RH")).toBeInTheDocument();
    expect(screen.getByText("Entrevista Gestor")).toBeInTheDocument();
    expect(screen.getByText("Contratação")).toBeInTheDocument();
  });

  it("abre e fecha os detalhes de um registro desclassificado", () => {
    render(<RejectedCandidates />);

    fireEvent.click(screen.getByRole("button", { name: /Ver registro de Camila Souza/i }));
    const record = screen.getByRole("region", { name: /Registro de Camila Souza/i });
    expect(record).toBeInTheDocument();
    expect(within(record).getByText("Sem disponibilidade para escala 6×1")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Fechar registro/i }));
    expect(screen.queryByRole("region", { name: /Registro de Camila Souza/i })).not.toBeInTheDocument();
  });
});
