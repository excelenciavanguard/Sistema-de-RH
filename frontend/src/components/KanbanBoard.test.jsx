import React from "react";
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
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
