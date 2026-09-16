import "@testing-library/jest-dom/vitest";
import { act, cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";
import { HomeScreen, findNextAppointment } from "./HomeScreen.jsx";

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
  HTMLDialogElement.prototype.close = function () { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); };
});
afterEach(() => { cleanup(); vi.useRealTimers(); });

it("restores the greeting and displays the provided local calendar date", () => {
  render(<HomeScreen onNavigate={vi.fn()} currentDate={new Date(2026, 8, 16, 12)} />);
  expect(screen.getByRole("heading", { name: "Hoje no RH", level: 1 })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Olá, Simão Pedro!" })).toBeInTheDocument();
  expect(screen.getByText("Quarta-feira, 16 de setembro de 2026")).toHaveAttribute("datetime", "2026-09-16");
  expect(screen.queryByRole("button", { name: /Ver todas as ações/ })).not.toBeInTheDocument();
});

it("updates the local date after midnight while keeping the screen open", () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date(2026, 8, 16, 23, 59, 30));
  render(<HomeScreen onNavigate={vi.fn()} />);
  expect(screen.getByText("Quarta-feira, 16 de setembro de 2026")).toBeInTheDocument();
  act(() => { vi.advanceTimersByTime(60000); });
  expect(screen.getByText("Quinta-feira, 17 de setembro de 2026")).toHaveAttribute("datetime", "2026-09-17");
});

it("shows the next appointment before processes and opens only its details", () => {
  render(<HomeScreen onNavigate={vi.fn()} />);
  expect(screen.getByRole("heading", { name: "Próximo compromisso" })).toBeInTheDocument();
  expect(screen.getByText("10:30", { selector: ".next-appointment-time time" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Ver detalhes/ }));
  const dialog = screen.getByRole("dialog", { name: "Detalhes do compromisso" });
  expect(within(dialog).getByText("Entrevista RH · Mariana Lima")).toBeInTheDocument();
  expect(within(dialog).queryByText(/André Cardoso/)).not.toBeInTheDocument();
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

it("handles an empty day without showing a details action", () => {
  render(<HomeScreen onNavigate={vi.fn()} appointments={[]} />);
  expect(screen.getByRole("heading", { name: "Nenhum compromisso agendado para hoje" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Ver detalhes/ })).not.toBeInTheDocument();
});

it("sorts appointments and does not show an elapsed appointment as next", () => {
  expect(findNextAppointment([{ time: "14:00" }, { time: "09:00" }, { time: "10:30" }], "10:00").time).toBe("10:30");
  expect(findNextAppointment([{ time: "09:00" }], "10:00")).toBeNull();
});

it("distinguishes a completed day from an empty day", () => {
  render(<HomeScreen onNavigate={vi.fn()} currentTime="18:00" />);
  expect(screen.getByRole("heading", { name: "Todos os compromissos de hoje já passaram" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /Ver detalhes/ })).not.toBeInTheDocument();
});
