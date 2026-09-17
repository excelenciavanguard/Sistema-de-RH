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
  expect(screen.getByText("Informado")).toBeInTheDocument();
  expect(screen.queryByText("Declarado")).not.toBeInTheDocument();
  expect(screen.getByText("3/3 comprovados")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Abrir candidato Candidato exemplo"));
  expect(onOpen).toHaveBeenCalledWith(candidate);
  fireEvent.keyDown(screen.getByLabelText("Abrir candidato Candidato exemplo"), { key: "Enter" });
  expect(onOpen).toHaveBeenCalledTimes(2);
});

it.each([
  ["Comprovado", "No currículo"],
  ["Declarado", "Informado"],
  ["Informação ausente", "Pendente"],
])("renames evidence %s to %s", (evidence, label) => {
  render(<CandidateCard candidate={{ id: 2, name: "Teste", initials: "TT", evidence, stageTime: "1h", owner: "RH", messages: 0 }} color="#235347" onOpen={vi.fn()} onDragStart={vi.fn()} />);
  expect(screen.getByText(label)).toBeInTheDocument();
  expect(screen.queryByText(evidence)).not.toBeInTheDocument();
});
