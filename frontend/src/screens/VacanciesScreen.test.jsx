import "@testing-library/jest-dom/vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { VacanciesScreen } from "./VacanciesScreen.jsx";

afterEach(cleanup);

describe("Lista operacional de vagas", () => {
  it("starts with active vacancies and compact status counts", () => {
    render(<VacanciesScreen onNavigate={vi.fn()} />);
    expect(screen.getAllByRole("button", { name: "Abrir Kanban" })).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Ativas 3" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.queryByText("Vagas no painel")).not.toBeInTheDocument();
  });
  it("finds a vacancy by its code and changes situation", () => {
    render(<VacanciesScreen onNavigate={vi.fn()} />);
    fireEvent.change(screen.getByRole("searchbox", { name: /Buscar por função/ }), { target: { value: "0156" } });
    expect(screen.getByText("Porteiro")).toBeInTheDocument();
    expect(screen.queryByText("Encarregado Operacional")).not.toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: /Buscar por função/ }), { target: { value: "" } });
    fireEvent.click(screen.getByRole("button", { name: "Rascunhos 1" }));
    expect(screen.getByText("Jovem Aprendiz Administrativo")).toBeInTheDocument();
  });
  it("shows an honest empty state", () => {
    render(<VacanciesScreen onNavigate={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Encerradas 0" }));
    expect(screen.getByText("Nenhuma vaga encontrada")).toBeInTheDocument();
  });
  it("combines post and owner filters and ignores accents in search", () => {
    render(<VacanciesScreen onNavigate={vi.fn()} />);
    fireEvent.change(screen.getByRole("searchbox", { name: /Buscar por função/ }), { target: { value: "servicos" } });
    expect(screen.getByText("Auxiliar de Serviços Gerais")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Filtrar por responsável"), { target: { value: "Ana Marques" } });
    expect(screen.getByText("Nenhuma vaga encontrada")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("searchbox", { name: /Buscar por função/ }), { target: { value: "" } });
    expect(screen.getByText("Porteiro")).toBeInTheDocument();
  });
  it("opens the route of the selected vacancy", () => {
    const navigate = vi.fn();
    render(<VacanciesScreen onNavigate={navigate} />);
    fireEvent.click(screen.getByRole("button", { name: "Porteiro" }));
    expect(navigate).toHaveBeenCalledWith("/recrutamento/vagas/2026-0156/kanban");
  });
  it("clears search and filters without changing the selected situation", () => {
    render(<VacanciesScreen onNavigate={vi.fn()} />);
    fireEvent.change(screen.getByLabelText("Filtrar por posto"), { target: { value: "Comrio Ilha" } });
    expect(screen.getAllByRole("button", { name: "Abrir Kanban" })).toHaveLength(1);
    fireEvent.click(screen.getByRole("button", { name: "Limpar filtros" }));
    expect(screen.getAllByRole("button", { name: "Abrir Kanban" })).toHaveLength(3);
    expect(screen.getByRole("button", { name: "Ativas 3" })).toHaveAttribute("aria-pressed", "true");
  });
});
