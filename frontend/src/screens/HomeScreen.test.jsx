import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeScreen } from "./HomeScreen.jsx";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); };
});
afterEach(cleanup);

it("restores the personal greeting and browser-local date above the processes", () => {
  render(<HomeScreen onNavigate={vi.fn()} currentDate={new Date(2026, 8, 16)} />);
  expect(screen.getByRole("button", { name: "Agenda de hoje 3" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Hoje no RH" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Olá, Simão Pedro!" })).toBeInTheDocument();
  expect(screen.getByText("Quarta-feira, 16 de setembro de 2026")).toBeInTheDocument();
  expect(screen.getByText("Bom trabalho, Simão Pedro!")).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Próximo compromisso" })).not.toBeInTheDocument();
  const agendaButton = screen.getByRole("button", { name: "Agenda de hoje 3" });
  const greeting = screen.getByRole("heading", { name: "Olá, Simão Pedro!" });
  expect(agendaButton.compareDocumentPosition(greeting) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
});

it("opens the whole day and navigates to the complete agenda", () => {
  const navigate = vi.fn();
  render(<HomeScreen onNavigate={navigate} />);
  fireEvent.click(screen.getByRole("button", { name: "Agenda de hoje 3" }));
  const dialog = screen.getByRole("dialog", { name: "Agenda de hoje" });
  expect(within(dialog).getAllByRole("article")).toHaveLength(3);
  fireEvent.click(within(dialog).getByRole("button", { name: /Ver agenda completa/ }));
  expect(navigate).toHaveBeenCalledWith("/agenda");
});

it("handles an empty day inside the agenda dialog", () => {
  render(<HomeScreen onNavigate={vi.fn()} appointments={[]} />);
  fireEvent.click(screen.getByRole("button", { name: "Agenda de hoje 0" }));
  expect(within(screen.getByRole("dialog", { name: "Agenda de hoje" })).getByText("Nenhum compromisso agendado para hoje.")).toBeInTheDocument();
});
