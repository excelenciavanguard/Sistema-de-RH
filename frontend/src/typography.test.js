import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(resolve(process.cwd(), "src/styles.css"), "utf8");
const typography = readFileSync(resolve(process.cwd(), "src/typography.css"), "utf8");
const navigationFiles = ["header-3.tsx", "dropdown-navigation.tsx"].map((file) =>
  readFileSync(resolve(process.cwd(), `src/components/ui/${file}`), "utf8"),
);

describe("approved readable typography", () => {
  it("uses the approved self-hosted Inter family across the shared stylesheet", () => {
    expect(stylesheet).not.toMatch(/Manrope|fonts\.googleapis/);
    expect(readFileSync(resolve(process.cwd(), "src/main.jsx"), "utf8")).toContain('import "./typography.css"');
    expect(typography).toMatch(/font-family:\s*"Inter"/);
    expect(typography).toMatch(/font-weight:\s*100 900/);
    for (const asset of ["InterVariable.woff2", "InterVariable-Italic.woff2"]) {
      const bytes = readFileSync(resolve(process.cwd(), "public/fonts/inter", asset));
      expect(bytes.subarray(0, 4).toString()).toBe("wOF2");
    }
    expect(readFileSync(resolve(process.cwd(), "public/fonts/inter/LICENSE.txt"), "utf8")).toContain("SIL OPEN FONT LICENSE");
  });
  it("uses consistent normal, medium and semibold role weights", () => {
    expect(typography).toMatch(/--weight-text:\s*400/);
    expect(typography).toMatch(/--weight-ui:\s*500/);
    expect(typography).toMatch(/--weight-heading:\s*600/);
    expect(stylesheet).not.toMatch(/font-weight:\s*(650|700|750|800)\b/);
  });
  it("aligns digits with tabular lining numerals and keeps data weights restrained", () => {
    expect(typography).toMatch(/font-variant-numeric:\s*lining-nums tabular-nums/);
    expect(typography).toMatch(/--weight-data:\s*500/);
    expect(typography).toMatch(/\.vacancies-number, \.number-cell/);
  });
  it("does not reintroduce miniature CSS text", () => {
    const sizes = [...stylesheet.matchAll(/font(?:-size\s*:\s*|\s*:\s*(?:\d+\s+)?)(\d+(?:\.\d+)?)px/g)].map((match) => Number(match[1]));
    expect(sizes.filter((size) => size < 12)).toEqual([]);
  });

  it("keeps inline navigation text at least 12px", () => {
    const sizes = navigationFiles.flatMap((source) => [...source.matchAll(/text-\[(\d+(?:\.\d+)?)px\]/g)].map((match) => Number(match[1])));
    expect(sizes.filter((size) => size < 12)).toEqual([]);
  });

  it("defines zoomable shared typography roles", () => {
    for (const role of ["meta", "support", "ui", "body", "input", "section", "heading", "page"]) {
      expect(stylesheet).toMatch(new RegExp(`--font-${role}:\\s*[.\\d]+rem`));
    }
  });

  it("uses the approved balanced density", () => {
    expect(stylesheet).toMatch(/--font-ui:\s*\.8125rem/);
    expect(stylesheet).toMatch(/--font-body:\s*\.875rem/);
    expect(stylesheet).toMatch(/--font-input:\s*\.875rem/);
    expect(stylesheet).toMatch(/--font-page:\s*1\.75rem/);
    expect(stylesheet).toMatch(/\.candidate-card \{ padding: 11px 10px 10px 13px;/);
  });
});
