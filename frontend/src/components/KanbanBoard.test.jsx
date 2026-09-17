import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { KanbanBoard } from "./KanbanBoard.jsx";

afterEach(cleanup);

it("shows only the stage name and candidate count in column headers", () => {
  render(<KanbanBoard
    stages={[{ id: "application", label: "Candidatura", sla: "2 dias úteis", color: "#235347" }]}
    candidates={[]}
    onMove={vi.fn()}
    onOpen={vi.fn()}
  />);

  expect(screen.getByText("Candidatura")).toBeInTheDocument();
  expect(screen.queryByText(/SLA:/i)).not.toBeInTheDocument();
  expect(screen.queryByText("2 dias úteis")).not.toBeInTheDocument();
});

it("keeps all candidates in a keyboard-accessible region separate from its fixed header", () => {
  const candidates = Array.from({ length: 40 }, (_, index) => ({ id: index + 1, name: `Pessoa ${index + 1}`, initials: "PE", stage: "application" }));
  render(<KanbanBoard stages={[{ id: "application", label: "Candidatura", color: "#235347" }]} candidates={candidates} onMove={vi.fn()} onOpen={vi.fn()} />);
  const region = screen.getByRole("region", { name: "Candidatos em Candidatura" });
  expect(region).toHaveAttribute("tabindex", "0");
  expect(within(region).getAllByLabelText(/Abrir candidato Pessoa/)).toHaveLength(40);
  expect(within(region).queryByText("Candidatura")).not.toBeInTheDocument();
  expect(screen.getByText("40")).toBeInTheDocument();
});

it("still moves a candidate when dropped into the scrolling region", () => {
  const onMove = vi.fn();
  render(<KanbanBoard stages={[{ id: "screening", label: "Triagem", color: "#235347" }]} candidates={[{ id: 1, name: "Pessoa", stage: "application" }]} onMove={onMove} onOpen={vi.fn()} />);
  fireEvent.drop(screen.getByRole("region", { name: "Candidatos em Triagem" }), { dataTransfer: { getData: () => "1" } });
  expect(onMove).toHaveBeenCalledWith(1, "screening");
});
