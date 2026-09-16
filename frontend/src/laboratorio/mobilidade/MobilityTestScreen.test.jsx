import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { MobilityTestScreen } from "./MobilityTestScreen.jsx";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("explica o critério de operação recebido da API, sem confundir com todos os ativos cadastrais", async () => {
  vi.stubGlobal("fetch", vi.fn(async (url) => ({
    ok: true,
    json: async () => url.endsWith("/postos")
      ? { total: 2, dias_operacao: 30, por_situacao: { localizado: 2 }, postos: [] }
      : { creditos_estimados: 0, limite_gratuito_dia: 3000 },
  })));
  render(<MobilityTestScreen />);
  expect(await screen.findByText("2 de 2 localizados")).toBeInTheDocument();
  expect(screen.getByText(/clientes ativos com escala nos últimos 30 dias/i)).toBeInTheDocument();
});
