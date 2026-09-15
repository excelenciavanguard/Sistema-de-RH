# Alpha RH Remaining Frontend Modules Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the six empty module previews with connected, responsive frontend screens for Banco de Talentos, Agenda, Admissão, Relatórios, Integrações, and Administração.

**Architecture:** Preserve the React/Vite hash router and current Alpha RH application shell. Each module receives a focused screen component and uses shared illustrative workspace data; no screen calls or mutates an external service.

**Tech Stack:** React 19, TypeScript-compatible JSX, Tailwind CSS 4, existing CSS design system, Lucide/Phosphor icons, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-08-alpha-rh-master-spec.md`

## Global Constraints

- Frontend screens only; do not add login, backend, database, Weboper, e-mail, WhatsApp, Maps, or AI integration work.
- All visible records and counts are illustrative and explicitly inherit the existing “Dados demonstrativos” label.
- Preserve the approved single gradient header, grouped dropdown navigation, white work surfaces, Portuguese copy, and human decision-making.
- Do not expose privacy/LGPD administration as a standalone frontend module.

---

### Task 1: Shared module data and route tests

**Files:**
- Create: `prototype/src/moduleWorkspaceData.js`
- Modify: `prototype/src/App.test.jsx`

**Interfaces:**
- Produces: `talentCandidates`, `agendaEvents`, `admissionCases`, `integrationSources`, `adminUsers`, `adminPosts`.
- Consumes: existing hash routes from `prototype/src/navigation.js`.

- [ ] Add failing route tests asserting each module heading and its primary operational content.
- [ ] Add illustrative records with stable IDs and explicit status fields.
- [ ] Run `npm test -- --run` and confirm the new tests fail only because screens are missing.

### Task 2: Banco de Talentos and Agenda

**Files:**
- Create: `prototype/src/screens/TalentsScreen.jsx`
- Create: `prototype/src/screens/AgendaScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- `TalentsScreen({ onNavigate })` renders searchable retained candidates and candidate status.
- `AgendaScreen()` renders a weekly agenda with interview type, vacancy, owner, time, and confirmation state.

- [ ] Implement a filterable talent table with source, location, experience, last application, and “Criar candidatura” action.
- [ ] Implement the weekly agenda with a compact date rail and upcoming-event details.
- [ ] Connect both routes in `App.jsx` and run the tests.

### Task 3: Admissão

**Files:**
- Create: `prototype/src/screens/AdmissionScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- `AdmissionScreen()` renders candidates transitioning from document delivery through training to hiring.

- [ ] Implement overview counters and a checklist table with documents, training, deadline, responsible person, and progress.
- [ ] Add status filters and clearly separate pending, attention, and ready states.
- [ ] Connect the route and run the tests.

### Task 4: Relatórios

**Files:**
- Create: `prototype/src/screens/ReportsScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- `ReportsScreen()` renders recruitment KPIs and one candidate-source pie chart.

- [ ] Implement period/post/vacancy filters, KPI summaries, stage conversion, and time-by-stage.
- [ ] Keep only one pie/donut visualization, matching the previously approved reporting direction.
- [ ] Connect the route and run the tests.

### Task 5: Integrações

**Files:**
- Create: `prototype/src/screens/IntegrationsScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- `IntegrationsScreen()` renders connection status without claiming that any provider has been tested.

- [ ] Implement integration rows for Weboper, Quickin, Gmail, WhatsApp, OpenAI/Gemini, and Google Maps.
- [ ] Label every unverified connection as “Não configurada”, “Pendente” or “Somente proposta”; never “Conectada”.
- [ ] Add a processing-pendencies panel and run the tests.

### Task 6: Administração

**Files:**
- Create: `prototype/src/screens/AdministrationScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- `AdministrationScreen()` renders internal tabs for users/permissions and active Weboper posts.

- [ ] Implement role summaries for Diretoria, RH, and Operações with illustrative users.
- [ ] Implement a posts table that identifies `CAD_CLIENTE` as the proposed read-only source and never shows credentials.
- [ ] Keep operational pipeline settings summarized on the same screen instead of creating extra top-level screens.
- [ ] Connect the route and run the tests.

### Task 7: Full verification

**Files:**
- Verify: `prototype/src/**/*`

**Interfaces:**
- Produces: a connected six-module frontend release candidate.

- [ ] Run `npm run typecheck`.
- [ ] Run `npm test -- --run`.
- [ ] Run `npm run build` and `npm run test:sites`.
- [ ] Inspect the six routes at desktop width and one representative mobile route.
- [ ] Run the Impeccable detector once on all changed frontend targets.
