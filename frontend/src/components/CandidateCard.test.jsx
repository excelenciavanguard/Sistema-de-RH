import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CandidateCard } from "./CandidateCard.jsx";

afterEach(cleanup);

it("removes the CV shortcut but keeps candidate details accessible", () => {
  const candidate = { id: 1, name: "Candidato exemplo", initials: "CE", requirements: "3/3 comprovados", route: "Mobilidade pendente", evidence: "Declarado" };
  const onOpen = vi.fn();
  render(<CandidateCard candidate={candidate} color="#235347" onOpen={onOpen} onDragStart={vi.fn()} />);
  expect(screen.queryByRole("button", { name: "Abrir currículo" })).not.toBeInTheDocument();
  expect(screen.queryByText("CV")).not.toBeInTheDocument();
  expect(screen.getByText("3/3 comprovados")).toBeInTheDocument();
  fireEvent.click(screen.getByLabelText("Abrir candidato Candidato exemplo"));
  expect(onOpen).toHaveBeenCalledWith(candidate);
  fireEvent.keyDown(screen.getByLabelText("Abrir candidato Candidato exemplo"), { key: "Enter" });
  expect(onOpen).toHaveBeenCalledTimes(2);
});
