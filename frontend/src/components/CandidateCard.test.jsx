import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CandidateCard } from "./CandidateCard.jsx";

afterEach(cleanup);

it("uses the simplified evidence label and keeps candidate details accessible", () => {
  const candidate = { id: 1, name: "Candidato exemplo", initials: "CE", requirements: "3/3 comprovados", route: "Mobilidade pendente", evidence: "Declarado" };
  const onOpen = vi.fn();
  render(<CandidateCard candidate={candidate} color="#235347" onOpen={onOpen} onDragStart={vi.fn()} />);
  expect(screen.queryByRole("button", { name: "Abrir currículo" })).not.toBeInTheDocument();
  expect(screen.queryByText("CV")).not.toBeInTheDocument();
  expect(screen.getByText("3/3 requisitos · informado")).toBeInTheDocument();
  expect(screen.queryByText("Declarado")).not.toBeInTheDocument();
  expect(screen.getByText("Mobilidade pendente")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Abrir candidato Candidato exemplo"));
  expect(onOpen).toHaveBeenCalledWith(candidate);
  fireEvent.keyDown(screen.getByLabelText("Abrir candidato Candidato exemplo"), { key: "Enter" });
  expect(onOpen).toHaveBeenCalledTimes(2);
  fireEvent.keyDown(screen.getByLabelText("Abrir candidato Candidato exemplo"), { key: " " });
  expect(onOpen).toHaveBeenCalledTimes(3);
});

it.each([
  ["Comprovado", "No currículo"],
  ["Declarado", "Informado"],
  ["Informação ausente", "Pendente"],
])("renames evidence %s to %s", (evidence, label) => {
  render(<CandidateCard candidate={{ id: 2, name: "Teste", initials: "TT", evidence, stageTime: "1h", owner: "RH", messages: 0 }} color="#235347" onOpen={vi.fn()} onDragStart={vi.fn()} />);
  expect(screen.getByText(`Requisitos · ${label.toLowerCase()}`)).toBeInTheDocument();
  expect(screen.queryByText(evidence)).not.toBeInTheDocument();
});

it("shows existing data without a next-step block", () => {
  render(<CandidateCard candidate={{ id: 3, name: "Rafael", initials: "RS", evidence: "Comprovado", requirements: "3/3 comprovados", availability: "Disponível agora", route: "42 min · 1 condução", stage: "application", stageTime: "1h30 na etapa" }} color="#235347" onOpen={vi.fn()} onDragStart={vi.fn()} />);
  expect(screen.queryByText("Disponível agora")).not.toBeInTheDocument();
  expect(screen.queryByText("Disponibilidade a confirmar")).not.toBeInTheDocument();
  expect(screen.getByText("42 min · 1 condução")).toBeInTheDocument();
  expect(screen.queryByText("Próximo passo sugerido")).not.toBeInTheDocument();
  expect(screen.queryByText("Entrar em contato")).not.toBeInTheDocument();
  expect(screen.getByText("1h30 na etapa")).toBeInTheDocument();
  expect(screen.queryByText(/amanhã|escala/i)).not.toBeInTheDocument();
});

it("prioritizes missing requirements without inventing which requirement is missing", () => {
  render(<CandidateCard candidate={{ id: 4, name: "Juliana", initials: "JA", evidence: "Declarado", requirements: "2/3 comprovados", stage: "screening" }} color="#235347" onOpen={vi.fn()} onDragStart={vi.fn()} />);
  expect(screen.getByText("2/3 requisitos · informado")).toBeInTheDocument();
  expect(screen.queryByText("Confirmar requisitos pendentes")).not.toBeInTheDocument();
  expect(screen.queryByText(/Confirmar experiência/)).not.toBeInTheDocument();
});

it("preserves drag and the duplicate alert without opening twice", () => {
  const candidate = { id: 5, name: "Teste", initials: "TT", duplicate: "Currículo reenviado · 3 envios", nextAction: "Entrevista em 25/04 às 10h" };
  const onOpen = vi.fn();
  const onDragStart = vi.fn();
  render(<CandidateCard candidate={candidate} onOpen={onOpen} onDragStart={onDragStart} />);
  fireEvent.dragStart(screen.getByLabelText("Abrir candidato Teste"));
  expect(onDragStart).toHaveBeenCalledWith(expect.anything(), 5);
  fireEvent.click(screen.getByRole("button", { name: /Ver alerta de Teste/ }));
  expect(onOpen).toHaveBeenCalledTimes(1);
  expect(screen.queryByText("Próxima ação")).not.toBeInTheDocument();
  expect(screen.queryByText(candidate.nextAction)).not.toBeInTheDocument();
});
