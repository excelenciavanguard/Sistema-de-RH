import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { LabHeader } from "./LabHeader.jsx";

afterEach(() => { cleanup(); vi.unstubAllEnvs(); });

it("abre o cadastro do candidato e mantém o retorno ao sistema", () => {
  render(<LabHeader />);
  const candidato = screen.getByRole("link", { name: "Abrir tela do candidato" });
  const destino = new URL(candidato.href);
  expect(destino.hostname).toBe(window.location.hostname);
  expect(destino.port).toBe("5190");
  expect(destino.pathname).toBe("/enviar-curriculo");
  expect(screen.getByRole("link", { name: "Abrir o sistema" })).toHaveAttribute("href", "/");
});

it("aceita a URL configurada para o portal sem fixar localhost no ambiente futuro", () => {
  vi.stubEnv("VITE_CANDIDATO_URL", "https://candidatos.example.com/enviar-curriculo");
  render(<LabHeader />);
  expect(screen.getByRole("link", { name: "Abrir tela do candidato" })).toHaveAttribute("href", "https://candidatos.example.com/enviar-curriculo");
});
