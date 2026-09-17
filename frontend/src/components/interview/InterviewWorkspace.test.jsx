import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";
import { InterviewMode, InterviewCompletion } from "./InterviewWorkspace.jsx";

afterEach(cleanup);
const interview = { name: "Rafael Santos", stage: "Entrevista RH", owner: "Letícia Silva", time: "Hoje, 14:00" };

describe("interview workbench", () => {
  it("records reviewed steps, ratings and considerations in the completed snapshot", () => {
    const onFinish = vi.fn();
    render(<InterviewMode interview={interview} onFinish={onFinish} onExit={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Marcar currículo como revisado" }));
    fireEvent.click(screen.getByRole("button", { name: "Avaliar Comunicação com 4 estrelas" }));
    expect(screen.getByLabelText("Média da avaliação")).toHaveTextContent("4,0");
    fireEvent.click(screen.getByRole("tab", { name: "Considerações" }));
    expect(screen.getByText("Etapa decisiva da entrevista")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Anotações da entrevista"), { target: { value: "Relatou exemplos de trabalho em equipe." } });
    fireEvent.change(screen.getByLabelText("Parecer do entrevistador"), { target: { value: "Avançar para a próxima etapa" } });
    fireEvent.click(screen.getByRole("button", { name: "Concluir entrevista" }));
    fireEvent.click(screen.getByRole("button", { name: "Concluir com pendências" }));
    expect(onFinish).toHaveBeenCalledWith(expect.objectContaining({
      notes: "Relatou exemplos de trabalho em equipe.", recommendation: "Avançar para a próxima etapa",
      reviewed: expect.objectContaining({ resume: true }), ratings: expect.objectContaining({ Comunicação: 4 }),
    }));
  });

  it("switches route direction and recalculates illustrative monthly costs", () => {
    render(<InterviewMode interview={interview} onFinish={vi.fn()} onExit={vi.fn()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Mobilidade" }));
    expect(screen.getByText(/Pavuna, Rio de Janeiro/)).toBeInTheDocument();
    expect(screen.getByLabelText("Custo mensal estimado")).toHaveTextContent("322,40");
    fireEvent.change(screen.getByLabelText("Dias presenciais no mês"), { target: { value: "22" } });
    expect(screen.getByLabelText("Custo mensal estimado")).toHaveTextContent("272,80");
    fireEvent.click(screen.getByRole("button", { name: "Volta" }));
    expect(screen.getByRole("heading", { name: "Percurso de volta" })).toBeInTheDocument();
    expect(screen.getByLabelText("Duração do percurso")).toHaveTextContent("46 min");
    expect(screen.getByText(/Sem consulta a trânsito/)).toBeInTheDocument();
  });

  it("keeps the progress rail visual and marks completed steps", () => {
    render(<InterviewMode interview={interview} onFinish={vi.fn()} onExit={vi.fn()} />);
    expect(screen.queryByLabelText("Anotações da entrevista")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ir para/ })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Marcar currículo como revisado" }));
    expect(screen.getByLabelText("Etapas da entrevista")).toHaveTextContent("Currículo");
  });

  it("never invents a calculation for a candidate with a pending route", () => {
    render(<InterviewMode interview={{ ...interview, name: "André Cardoso" }} onFinish={vi.fn()} onExit={vi.fn()} />);
    fireEvent.click(screen.getByRole("tab", { name: "Mobilidade" }));
    expect(screen.getByRole("heading", { name: "Rota pendente de validação" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Custo mensal estimado")).not.toBeInTheDocument();
  });

  it("shows a fullscreen completion with the complete saved assessment and no invented score", () => {
    render(<InterviewCompletion result={{ ...interview, ratings: {}, notes: "Retomar contato.", reviewed: {}, completedAt: "17/09/2026, 10:00" }} onBack={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Entrevista concluída" })).toBeInTheDocument();
    expect(screen.getAllByRole("main")).toHaveLength(1);
    expect(screen.getByLabelText("Nota final")).toHaveTextContent("Sem nota");
    expect(screen.getByText("Retomar contato.")).toBeInTheDocument();
    expect(screen.getByText("0 de 4 etapas preenchidas")).toBeInTheDocument();
  });
});
