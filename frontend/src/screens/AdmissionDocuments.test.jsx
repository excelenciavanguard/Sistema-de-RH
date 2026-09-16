import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AdmissionDocuments } from "./AdmissionDocuments.jsx";
afterEach(cleanup);
const start = () => render(<AdmissionDocuments onSelect={vi.fn()} />);
describe("Documentos de admissão", () => {
  it("shows a full list and opens nine candidate-specific documents", () => {
    start(); expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Abrir documentos de Mariana Lima" }));
    expect(within(screen.getByRole("dialog")).getAllByRole("listitem")).toHaveLength(9);
    expect(screen.getByRole("button", { name: "Concluir conferência" })).toBeDisabled();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
  it("searches without accents and filters actual completed candidates", () => {
    start(); fireEvent.change(screen.getByRole("textbox", { name: "Buscar candidatos em admissão" }), { target: { value: "beatriz" } });
    expect(screen.getByRole("button", { name: "Abrir documentos de Beatriz Nunes" })).toBeInTheDocument();
    expect(screen.queryByText("Mariana Lima")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "" } });
    fireEvent.click(screen.getByRole("tab", { name: "Concluídos (2)" }));
    expect(screen.getByText("Bruno Martins")).toBeInTheDocument();
    expect(screen.queryByText("Mariana Lima")).not.toBeInTheDocument();
  });
  it("validates received documents and requires a correction reason", () => {
    start(); fireEvent.click(screen.getByRole("button", { name: "Abrir documentos de Mariana Lima" }));
    fireEvent.click(screen.getByRole("button", { name: "Conferir Carteira de trabalho" }));
    expect(screen.getByRole("button", { name: "Pedir correção" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Validar documento" }));
    expect(within(screen.getByRole("dialog")).getByText("5 de 9")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Conferir Foto para cadastro" }));
    fireEvent.change(screen.getByRole("textbox", { name: "Motivo da correção" }), { target: { value: "Foto ilegível" } });
    fireEvent.click(screen.getByRole("button", { name: "Pedir correção" }));
    expect(screen.getByText("Foto ilegível")).toBeInTheDocument();
  });
  it("requests only missing items, never claims a real message was sent", () => {
    start(); fireEvent.click(screen.getByRole("button", { name: "Abrir documentos de Mariana Lima" }));
    fireEvent.click(screen.getByRole("button", { name: "Solicitar pendências" }));
    expect(screen.getByRole("status")).toHaveTextContent("Comprovante de residência, Dados bancários");
    expect(screen.getByRole("status")).toHaveTextContent("Nada foi enviado");
    expect(screen.getByRole("status")).not.toHaveTextContent("CPF");
  });
});
