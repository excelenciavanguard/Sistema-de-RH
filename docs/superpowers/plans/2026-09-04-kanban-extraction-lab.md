# Kanban and Extraction Lab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a runnable React prototype of the approved recruitment Kanban with an interactive mock extraction comparison lab.

**Architecture:** A Vite React TypeScript frontend keeps domain types, sample data and UI components separated. State is local and deterministic; the extraction service exposes the future backend contract while returning explicitly labeled demo results.

**Tech Stack:** React, TypeScript, Vite, CSS, Phosphor Icons, Vitest, Testing Library.

**Spec:** `docs/superpowers/specs/2026-09-04-kanban-extraction-lab-design.md`

## Global Constraints

- Match `.impeccable/mocks/approved/kanban-filtros-aprovado.png`.
- No gradients, secrets, real API calls or invented production claims.
- Portuguese-Brazil UI and keyboard-visible focus states.
- Keep OpenAI and Gemini behind one typed extraction interface.

---

### Task 1: Prototype foundation and domain model

**Files:**
- Create: `prototype/src/types.ts`
- Create: `prototype/src/data/candidates.ts`
- Modify: Product Design starter files only where permitted.

**Interfaces:**
- Produces: `Candidate`, `Stage`, `ExtractionComparison`, `initialCandidates`.

- [ ] Bootstrap the Product Design web prototype.
- [ ] Add domain types and illustrative data.
- [ ] Add a smoke test for the initial vacancy and stages.
- [ ] Run the test and build.

### Task 2: Approved Kanban visual implementation

**Files:**
- Create: `prototype/src/components/AppShell.tsx`
- Create: `prototype/src/components/SmartFilters.tsx`
- Create: `prototype/src/components/KanbanBoard.tsx`
- Create: `prototype/src/components/CandidateCard.tsx`
- Modify: `prototype/src/Prototype.tsx`
- Modify: `prototype/src/prototype.css`

**Interfaces:**
- Consumes: `Candidate`, `Stage`, `initialCandidates`.
- Produces: searchable and draggable Kanban UI.

- [ ] Write interaction tests for search, filters and candidate movement.
- [ ] Build the app shell and vacancy header.
- [ ] Build smart filters and the six-column board.
- [ ] Implement drag-and-drop and responsive horizontal scrolling.
- [ ] Run tests and build.

### Task 3: Candidate 360 modal

**Files:**
- Create: `prototype/src/components/CandidateModal.tsx`
- Test: `prototype/src/components/CandidateModal.test.tsx`

**Interfaces:**
- Consumes: selected `Candidate`.
- Produces: accessible dialog with curriculum, evidence, mobility and history tabs.

- [ ] Write the modal accessibility and tab test.
- [ ] Implement modal, document preview and version notice.
- [ ] Verify escape, close button and focus behavior.

### Task 4: Extraction comparison laboratory

**Files:**
- Create: `prototype/src/services/extraction.ts`
- Create: `prototype/src/components/ExtractionLab.tsx`
- Test: `prototype/src/components/ExtractionLab.test.tsx`

**Interfaces:**
- Produces: `compareExtraction(file, providers): Promise<ExtractionComparison>`.

- [ ] Write tests for supported files, loading and labeled demo results.
- [ ] Implement upload and provider selection.
- [ ] Implement deterministic OpenAI/Gemini comparison results in demo mode.
- [ ] Display errors without claiming an API call occurred.

### Task 5: Verification and handoff

**Files:**
- Create: `design-qa.md`
- Create: `.impeccable/review/kanban-desktop.png`
- Create: `.impeccable/review/kanban-mobile.png`

- [ ] Run unit tests, type check and production build.
- [ ] Start the local preview and inspect primary interactions.
- [ ] Capture desktop and mobile evidence.
- [ ] Compare the desktop capture with the approved mock, fix P0–P2 issues and record QA.
- [ ] Leave the local preview running for review.
