# Alpha RH Frontend Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the approved Alpha RH prototypes into a connected frontend flow for Início, Requisições, Aprovações, Vagas, and the existing Kanban, without adding authentication or backend integrations.

**Architecture:** Keep the existing React/Vite prototype and introduce lightweight hash navigation so every implemented screen has a stable URL without adding a routing dependency. New screens consume local illustrative data, while the existing Kanban and extraction laboratory remain intact.

**Tech Stack:** React 19, Vite 6, CSS, Phosphor Icons, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-08-alpha-rh-master-spec.md`

## Global Constraints

- This phase changes frontend screens only.
- Do not add login, authentication, database, Weboper, e-mail, WhatsApp, Google Maps, or new AI integrations.
- Use Portuguese (Brazil), the approved blue-and-white visual system, solid colors, restrained shadows, and top navigation.
- Treat all new visible records and totals as illustrative data.
- Preserve the existing Kanban, extraction laboratory, and candidate modal behavior.

---

### Task 1: Connected application shell

**Files:**
- Modify: `prototype/src/components/AppShell.jsx`
- Create: `prototype/src/navigation.js`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Produces: `routeFromHash()`, `navigateTo(route)`, and shell navigation callbacks.

- [ ] Write a failing test for primary and recruitment navigation.
- [ ] Implement hash-based navigation and active states.
- [ ] Run the frontend tests.

### Task 2: Home operational screen

**Files:**
- Create: `prototype/src/screens/HomeScreen.jsx`
- Create: `prototype/src/mockWorkspaceData.js`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `onNavigate(route)`.
- Produces: an operational overview with upcoming actions, current processes, agenda, and recent activity.

- [ ] Write a failing rendering and navigation test.
- [ ] Implement the responsive screen with illustrative labels.
- [ ] Run the frontend tests.

### Task 3: Requisitions and director approval

**Files:**
- Create: `prototype/src/screens/RequisitionsScreen.jsx`
- Create: `prototype/src/screens/ApprovalsScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: shared illustrative requisitions.
- Produces: operational request list and director decision workspace.

- [ ] Write failing tests for both screens.
- [ ] Implement filterable lists and a decision detail panel.
- [ ] Run the frontend tests.

### Task 4: Vacancy list and Kanban entry

**Files:**
- Create: `prototype/src/screens/VacanciesScreen.jsx`
- Create: `prototype/src/screens/KanbanScreen.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Test: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `onOpenKanban(vacancyCode)` and the existing Kanban components.
- Produces: vacancy list with a working “Abrir Kanban” action.

- [ ] Write a failing end-to-end navigation test.
- [ ] Move the current Kanban composition into its own screen.
- [ ] Implement the vacancy list and working transition.
- [ ] Run the frontend tests.

### Task 5: Visual and packaging verification

**Files:**
- Modify: `prototype/AGENTS.md`
- Verify: `prototype/src/**/*`

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npm run test:sites`.
- [ ] Open the local preview and inspect desktop and mobile layouts.
- [ ] Run the Impeccable detector once on changed frontend targets.
