# Alpha RH — Fidelidade das telas do Miro Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir Banco de talentos, Agenda, Admissão, Relatórios, Integrações e Administração para corresponder às referências aprovadas no Miro.

**Architecture:** Manter o `AppShell` e o cabeçalho atual, criando primitivas operacionais reutilizáveis para abas, filtros, tabelas e painéis mestre-detalhe. Cada rota continuará isolada em seu próprio componente e consumirá dados demonstrativos tipados por estrutura, com interações locais de React.

**Tech Stack:** React 19, Vite 6, JavaScript/TSX compatível com TypeScript, Tailwind CSS 4, CSS existente, Lucide React, Vitest e Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-14-fidelidade-telas-miro-design.md`

## Global Constraints

- Preservar o cabeçalho global atual e seus menus suspensos.
- Usar `docs/visuals/system-screen-pack` como fonte visual obrigatória.
- Manter dados demonstrativos identificados como tal.
- Não adicionar login, backend, persistência ou integrações reais.
- Não exibir nem persistir credenciais no frontend.
- Não recriar telas de LGPD, templates, compliance ou campos personalizados removidas anteriormente.
- O alvo principal é desktop amplo; telas menores devem manter acesso por quebra de linha, empilhamento e rolagem horizontal.

---

### Task 1: Primitivas operacionais compartilhadas

**Files:**
- Create: `prototype/src/components/WorkspaceTabs.jsx`
- Create: `prototype/src/components/OperationalFilters.jsx`
- Create: `prototype/src/components/StatusPill.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Produces: `WorkspaceTabs({ items, active, onChange, ariaLabel })`, `OperationalFilters({ children, activeFilters, onClear })` e `StatusPill({ tone, children })`.
- Consumes: callbacks locais das telas; não depende de API.

- [ ] **Step 1: Write the failing component tests**

```jsx
it("alternates an operational workspace tab", async () => {
  window.history.replaceState(null, "", "#/administracao");
  render(<App />);
  fireEvent.click(screen.getByRole("tab", { name: "Estrutura" }));
  expect(screen.getByRole("heading", { name: "Postos, departamentos e responsáveis" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the targeted test and verify failure**

Run: `npm test -- --run -t "alternates an operational workspace tab"`

Expected: FAIL because the tab and structure view do not exist.

- [ ] **Step 3: Implement the shared components**

```jsx
export function WorkspaceTabs({ items, active, onChange, ariaLabel }) {
  return <div className="workspace-tabs" role="tablist" aria-label={ariaLabel}>
    {items.map((item) => <button key={item.id} role="tab" aria-selected={active === item.id} onClick={() => onChange(item.id)}>{item.label}</button>)}
  </div>;
}
```

`OperationalFilters` must render the supplied fields, active-filter chips, a clear action, and a responsive wrapping container. `StatusPill` must map `success`, `warning`, `danger`, `info` and `neutral` to semantic classes.

- [ ] **Step 4: Add shared visual rules**

Create CSS for `.workspace-tabs`, `.operational-filters`, `.active-filter-row`, `.status-pill`, `.master-detail-layout`, `.operational-table`, `.side-detail-panel` and responsive behavior at 1100px and 760px.

- [ ] **Step 5: Run typecheck and targeted test**

Run: `npm run typecheck; npm test -- --run -t "alternates an operational workspace tab"`

Expected: PASS.

### Task 2: Banco de talentos fiel à referência 09

**Files:**
- Modify: `prototype/src/screens/TalentsScreen.jsx`
- Modify: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `WorkspaceTabs`, `OperationalFilters`, `StatusPill`.
- Produces: rota `#/talentos` com seleção em lote, filtros e alternância lista/cards.

- [ ] **Step 1: Write failing behavior tests**

```jsx
it("supports talent selection and view switching", () => {
  window.history.replaceState(null, "", "#/talentos");
  render(<App />);
  fireEvent.click(screen.getByRole("checkbox", { name: "Selecionar Rafael Santos" }));
  expect(screen.getByText("1 selecionado")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Associar à vaga" })).toBeEnabled();
  fireEvent.click(screen.getByRole("tab", { name: "Cards" }));
  expect(screen.getByTestId("talent-card-grid")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test and verify failure**

Run: `npm test -- --run -t "supports talent selection"`

Expected: FAIL because selection and card view are absent.

- [ ] **Step 3: Expand illustrative talent data**

Store `id`, `name`, `role`, `experience`, `education`, `tags`, `location`, `availability`, `lastContact`, `opportunities`, `mobilityStatus`, `source` and `avatar` for six people matching the reference composition.

- [ ] **Step 4: Rebuild the screen**

Implement the title actions, informational notice, complete filter row, active chips, list/cards tabs, bulk action bar, seven-column table, selection checkboxes and pagination shown in `09-banco-de-talentos.png`. Search filters the visible rows; selecting a row updates the bulk counter; list/cards changes the body view.

- [ ] **Step 5: Match spacing and density**

At 1600px, keep the table and controls visible in the first viewport, use 44–52px rows, preserve clear column boundaries and align action controls with the reference.

- [ ] **Step 6: Run targeted tests**

Run: `npm test -- --run -t "talent"`

Expected: PASS.

### Task 3: Agenda semanal fiel à referência 12

**Files:**
- Modify: `prototype/src/screens/AgendaScreen.jsx`
- Modify: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `StatusPill`.
- Produces: calendário semanal com filtros laterais e próximos compromissos.

- [ ] **Step 1: Write the failing agenda test**

```jsx
it("changes the agenda display and calendar filters", () => {
  window.history.replaceState(null, "", "#/agenda");
  render(<App />);
  expect(screen.getByText("Calendários")).toBeInTheDocument();
  expect(screen.getByText("Próximos compromissos")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Dia" }));
  expect(screen.getByTestId("agenda-day-view")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- --run -t "changes the agenda display"`

Expected: FAIL because the three-column calendar is absent.

- [ ] **Step 3: Define weekly event data**

Create event objects with `id`, `date`, `start`, `end`, `type`, `title`, `person`, `location`, `owner` and `status`. Use interview, task and training categories.

- [ ] **Step 4: Build the calendar composition**

Implement left filters, center toolbar, seven day columns, hourly rows from 08:00 to 18:00, positioned event cards and the right “Próximos compromissos” panel. Month/week/day buttons must update the selected visual state; Day renders a single-column state.

- [ ] **Step 5: Run targeted tests**

Run: `npm test -- --run -t "agenda"`

Expected: PASS.

### Task 4: Admissão com documentos, treinamentos e contratação

**Files:**
- Modify: `prototype/src/screens/AdmissionScreen.jsx`
- Modify: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `WorkspaceTabs`, `OperationalFilters`, `StatusPill`.
- Produces: três visões internas `documents`, `training` e `hiring`, com seleção mestre-detalhe.

- [ ] **Step 1: Write failing admission tests**

```jsx
it("shows the selected admission checklist and switches admission tabs", () => {
  window.history.replaceState(null, "", "#/admissao");
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Mariana Lima/ }));
  expect(screen.getByRole("heading", { name: "Checklist de documentos" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Treinamentos" }));
  expect(screen.getByRole("heading", { name: "Treinamentos de admissão" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Contratação" }));
  expect(screen.getByRole("heading", { name: "Contratações e encerramentos" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- --run -t "selected admission checklist"`

Expected: FAIL because the detail panel and tabs are absent.

- [ ] **Step 3: Add admission datasets**

Define candidates with `documents`, `training`, `hiring`, `progress`, `deadline`, `owner` and `status`. Each document includes `name`, `status`, `date` and `action`.

- [ ] **Step 4: Rebuild the documents view**

Match `16-documentos-admissao.png`: header notice, status tabs, filters, candidate table, pagination and selected detail panel. Clicking a row changes the detail panel.

- [ ] **Step 5: Build training and hiring views**

Match the composition from `16a-treinamentos.png` and `16b-contratacoes-encerramentos.png`, reusing the master-detail layout and keeping actions local/demonstrative.

- [ ] **Step 6: Run targeted tests**

Run: `npm test -- --run -t "admission|Admissão|Treinamentos|Contratações"`

Expected: PASS.

### Task 5: Relatórios fiel à referência 18

**Files:**
- Modify: `prototype/src/screens/ReportsScreen.jsx`
- Modify: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `OperationalFilters`, `StatusPill`.
- Produces: indicadores, dois gráficos cartesianos, uma única pizza e tabela de atenção.

- [ ] **Step 1: Write the failing report test**

```jsx
it("renders the complete recruitment report", () => {
  window.history.replaceState(null, "", "#/relatorios");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Vagas com atenção" })).toBeInTheDocument();
  expect(screen.getByLabelText("Conversão por etapa")).toBeInTheDocument();
  expect(screen.getAllByLabelText(/Origem dos candidatos/)).toHaveLength(1);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- --run -t "complete recruitment report"`

Expected: FAIL because the attention table is absent.

- [ ] **Step 3: Implement the complete report**

Add the five filters, save/export actions, four metrics with period deltas, conversion bars, time-by-stage line/bar composition, the single origin donut and the “Vagas com atenção” table. Add accessible labels and visible numeric values to every chart.

- [ ] **Step 4: Match the grid**

Use a four-column metric row, a 5/5/4 chart grid and a full-width attention table. At narrower widths stack charts without truncating labels.

- [ ] **Step 5: Run targeted tests**

Run: `npm test -- --run -t "report|Relatórios"`

Expected: PASS.

### Task 6: Integrações com grade e painel lateral

**Files:**
- Modify: `prototype/src/screens/IntegrationsScreen.jsx`
- Modify: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `WorkspaceTabs`, `StatusPill`.
- Produces: seleção de integração e painel de configuração demonstrativo.

- [ ] **Step 1: Write the failing interaction test**

```jsx
it("opens the selected integration detail", () => {
  window.history.replaceState(null, "", "#/integracoes");
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Google Maps Platform/ }));
  expect(screen.getByRole("heading", { name: "Detalhe da integração" })).toBeInTheDocument();
  expect(screen.getByText("Conta e chave pendentes")).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- --run -t "selected integration detail"`

Expected: FAIL because cards do not control the detail panel.

- [ ] **Step 3: Expand integration data**

Store `id`, `name`, `category`, `description`, `status`, `tone`, `lastSync`, `requirements`, `events` and `costNote` for Weboper, Quickin, Gmail RioVagas, KingHost IMAP, OpenAI, Gemini, Google Maps, WhatsApp and Indeed.

- [ ] **Step 4: Rebuild the screen**

Match `19-integracoes.png`: counters, category tabs, search, 3x3 card grid and detail panel. Card selection updates description, requirements, events, security notice and available actions. All statuses must remain pending/test/demonstrative unless the repository contains verified evidence.

- [ ] **Step 5: Run targeted tests**

Run: `npm test -- --run -t "integration|Integrações"`

Expected: PASS.

### Task 7: Administração com três áreas fiéis às referências

**Files:**
- Modify: `prototype/src/screens/AdministrationScreen.jsx`
- Modify: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `WorkspaceTabs`, `OperationalFilters`, `StatusPill`.
- Produces: áreas `users`, `structure` e `recruitment-settings` dentro da rota `#/administracao`.

- [ ] **Step 1: Write failing administration tests**

```jsx
it("switches administration areas and preserves read-only Weboper copy", () => {
  window.history.replaceState(null, "", "#/administracao");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Usuários e permissões" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Estrutura" }));
  expect(screen.getByText(/CAD_CLIENTE/)).toBeInTheDocument();
  expect(screen.getByText(/somente leitura/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("tab", { name: "Configurações" }));
  expect(screen.getByRole("heading", { name: "Configurações do recrutamento" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm test -- --run -t "switches administration areas"`

Expected: FAIL because internal areas do not exist.

- [ ] **Step 3: Build users and permissions**

Match `20-usuarios-permissoes.png`: metrics, filters, users table, selected-user panel, profile selector, area permission toggles and security/session block. Directorate displays `Acesso integral`.

- [ ] **Step 4: Build structure and active posts**

Match `21-postos-estrutura.png`: only active posts, filters, table and detail panel. Use `CAD_CLIENTE` as the demonstrative source and explicitly state read-only access. Do not include connection parameters or credentials.

- [ ] **Step 5: Build recruitment settings**

Match `22-etapas-fontes-tags-motivos.png`: tabs, ordered stages, colors, SLAs, active state, linked automation description and selected-stage editor. Include professional disqualification reasons only.

- [ ] **Step 6: Run targeted tests**

Run: `npm test -- --run -t "administration|Administração|Estrutura|Configurações"`

Expected: PASS.

### Task 8: Visual fidelity, responsive QA and production verification

**Files:**
- Modify: `prototype/src/styles.css`
- Modify: `prototype/src/App.test.jsx`
- Create: `prototype/design-qa.md`

**Interfaces:**
- Consumes: all six rebuilt screens and reference PNGs.
- Produces: verified frontend build and visual QA report with `final result: passed`.

- [ ] **Step 1: Run the complete automated suite**

Run: `npm run typecheck; npm test -- --run; npm run build; npm run test:sites`

Expected: typecheck and build exit 0; all Vitest and Node tests pass.

- [ ] **Step 2: Capture all six routes at the reference viewport**

Open each route at approximately 1920x1080 and capture the same state represented by its reference. For Admission and Administration, capture every internal tab that has a separate reference.

- [ ] **Step 3: Write the visual comparison report**

In `prototype/design-qa.md`, record for each reference: viewport, matching structure, remaining discrepancy and severity. Mark any missing panel, filter group, table, chart or interaction as P1 or P2.

- [ ] **Step 4: Fix all P0/P1/P2 findings in one batch**

Correct structure, layout, clipping, density, alignment, contrast, accessible naming and responsive overflow found in Step 3.

- [ ] **Step 5: Perform one confirmation pass**

Recapture desktop and a narrow viewport, rerun the complete automated suite, and set `final result: passed` only when no P0/P1/P2 issue remains.

- [ ] **Step 6: Keep the local preview open**

Leave the verified application available at its local preview URL for user review.
