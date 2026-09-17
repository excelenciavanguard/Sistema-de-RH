import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { CandidateModal } from "./CandidateModal.jsx";

vi.mock("./MobilityWorkspace.jsx", () => ({ MobilityWorkspace: () => <div>Área de mobilidade</div> }));
afterEach(cleanup);
const candidate = { id: 7, name: "Beatriz Nunes", initials: "BN", stage: "contact", role: "Recepcionista", isDemo: true, experience: "2 anos em recepção", education: "Ensino médio completo", availability: "Disponível agora" };

it("restores the split professional summary with the selected candidate's data", () => {
  render(<CandidateModal candidate={candidate} onClose={vi.fn()} />);
  expect(screen.getByText("Resumo profissional")).toBeInTheDocument();
  expect(screen.getByText("Currículo do candidato")).toBeInTheDocument();
  expect(screen.getByText("Resumo profissional").closest(".candidate-profile-split")).toBeInTheDocument();
  expect(screen.getAllByText(candidate.experience)).toHaveLength(3);
  expect(screen.queryByText("4 anos identificados")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Abrir currículo" }));
  expect(screen.getByText("Resumo profissional")).toBeInTheDocument();
});

it("restores the evidence tab while keeping mobility separate", () => {
  render(<CandidateModal candidate={candidate} onClose={vi.fn()} />);
  fireEvent.click(screen.getByRole("button", { name: "Evidências", exact: true }));
  expect(screen.getByText("Confira a origem das informações antes de avançar")).toBeInTheDocument();
  expect(screen.queryByText("Resumo profissional")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Mobilidade", exact: true }));
  expect(screen.getByText("Área de mobilidade")).toBeInTheDocument();
  expect(screen.queryByText("Currículo do candidato")).not.toBeInTheDocument();
});

it("preserves recorded history and does not infer previous movements", () => {
  render(<CandidateModal candidate={candidate} initialTab="Histórico" onClose={vi.fn()} />);
  expect(screen.getByText("Nenhuma movimentação registrada nesta visita.")).toBeInTheDocument();
  expect(screen.queryByText("Currículo do candidato")).not.toBeInTheDocument();
});

it("does not fabricate evidence for non-demo candidates and preserves closing", () => {
  const onClose = vi.fn();
  render(<CandidateModal candidate={{ ...candidate, isDemo: false }} initialTab="Evidências" onClose={onClose} />);
  expect(screen.getByText("Nenhuma evidência estruturada")).toBeInTheDocument();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(onClose).toHaveBeenCalledTimes(1);
});
