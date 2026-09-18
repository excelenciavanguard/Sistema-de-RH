import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { AgendaScreen } from "./AgendaScreen.jsx";

afterEach(cleanup);

it("keeps month as default and preserves the weekly view and day drawer", () => {
  render(<AgendaScreen />);
  expect(screen.getByTestId("agenda-month-view")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Semana", exact: true }));
  expect(screen.getByTestId("agenda-week-view")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Abrir quinta-feira, 24 de abril" }));
  const drawer = screen.getByRole("dialog", { name: "Quinta-feira, 24 de abril" });
  expect(within(drawer).getAllByRole("article")).toHaveLength(3);
  expect(within(drawer).getAllByRole("button", { name: "Editar" })).toHaveLength(3);
  fireEvent.click(within(drawer).getByRole("button", { name: "Fechar detalhes do dia" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});

it("shows a chronological day timeline with prominent participants and a single creation action", () => {
  render(<AgendaScreen />);
  fireEvent.click(screen.getByRole("button", { name: "Dia", exact: true }));
  const day = screen.getByTestId("agenda-day-view");
  const timeline = within(day).getByRole("list", { name: "Compromissos do dia em ordem de horário" });
  expect(within(timeline).getAllByRole("listitem")).toHaveLength(3);
  expect(within(timeline).getAllByRole("heading", { level: 3 }).map((element) => element.textContent))
    .toEqual(["Rafael Santos", "Mariana Lima", "Equipe de novos colaboradores"]);
  expect(within(timeline).getByText("09:00")).toBeInTheDocument();
  expect(within(timeline).getByText("16:00")).toBeInTheDocument();
  expect(screen.getAllByRole("button", { name: "Novo compromisso", exact: true })).toHaveLength(1);
  expect(screen.getByText("22 de abril de 2025")).toBeInTheDocument();
  expect(within(day).getByText("Conflito ilustrativo — verificar antes de agendar.")).toBeInTheDocument();
});

it("updates the day timeline and gives an explicit empty state when filters remove appointments", () => {
  render(<AgendaScreen />);
  fireEvent.click(screen.getByRole("button", { name: "Dia", exact: true }));
  fireEvent.click(screen.getByRole("button", { name: "Tipos", exact: true }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Entrevistas" }));
  const day = screen.getByTestId("agenda-day-view");
  expect(within(day).getAllByRole("article")).toHaveLength(1);
  expect(within(day).getByText("1 compromisso programado")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("checkbox", { name: "Treinamentos" }));
  expect(within(day).queryByRole("list")).not.toBeInTheDocument();
  expect(within(day).getByText("Nenhum compromisso com os filtros atuais")).toBeInTheDocument();
  expect(within(day).getByText("0 compromissos programados")).toBeInTheDocument();
});
