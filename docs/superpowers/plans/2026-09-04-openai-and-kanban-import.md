# OpenAI and Kanban Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrar a OpenAI ao laboratório e permitir que o RH adicione ao Kanban o resultado escolhido, com persistência no MySQL.

**Architecture:** A OpenAI usará a Responses API com JSON Schema estrito e `store: false`, mantendo o mesmo contrato validado do Gemini. Uma ação explícita e idempotente criará candidato e candidatura na vaga; o frontend buscará candidaturas persistidas e atualizará a coluna `new` após o clique.

**Tech Stack:** Python 3.12, FastAPI, SQLAlchemy 2, Alembic, MySQL 8.4, httpx, Pydantic 2, React 19, Vitest.

**Spec:** `docs/superpowers/specs/2026-09-04-extraction-to-kanban-design.md`

## Global Constraints

- O banco do Weboper permanece somente leitura e não participa desta migração.
- Currículos não entram automaticamente no Kanban; o RH escolhe um resultado concluído.
- O card inicial usa a etapa `new` e revisão `pending`.
- Nenhuma chave, conteúdo curricular ou caminho privado é registrado em logs.
- O mesmo arquivo na mesma vaga não cria candidatura duplicada.

---

### Task 1: Adaptador OpenAI estruturado

**Files:**
- Create: `backend/app/services/openai_provider.py`
- Modify: `backend/app/config.py`
- Modify: `backend/app/api/routes/extractions.py`
- Modify: `backend/.env.example`
- Test: `backend/tests/test_openai_provider.py`

**Interfaces:**
- Consumes: `ResumeExtraction`, instruções e prompt do contrato curricular.
- Produces: `extract_resume_with_openai(resume_text: str, settings: Settings, client: httpx.Client | None = None) -> dict`.

- [x] **Step 1: Write failing adapter tests** for successful strict JSON, invalid output, authentication, quota and timeout mappings.
- [x] **Step 2: Run** `backend/.venv/Scripts/python.exe -m pytest backend/tests/test_openai_provider.py -q` and confirm failure because the module does not exist.
- [x] **Step 3: Implement** a POST to `https://api.openai.com/v1/responses` with model `gpt-5.4-mini`, `store: false`, developer instructions, curriculum as user input, and `text.format={type: json_schema, name: resume_extraction, strict: true, schema: ...}`. Parse `output[*].content[*]` entries whose type is `output_text`, then validate with `ResumeExtraction.model_validate_json`.
- [x] **Step 4: Route extraction requests** for `openai` to the adapter and persist sanitized success or error in `extraction_results`.
- [x] **Step 5: Run** all backend tests and make them pass.

### Task 2: Candidate and application persistence

**Files:**
- Create: `backend/alembic/versions/0002_candidates_and_applications.py`
- Modify: `backend/app/models.py`
- Modify: `backend/app/schemas.py`
- Create: `backend/app/services/candidate_import.py`
- Create: `backend/app/api/routes/candidates.py`
- Modify: `backend/app/api/router.py`
- Test: `backend/tests/test_candidate_import.py`

**Interfaces:**
- Consumes: extraction job id, provider name and vacancy code.
- Produces: `POST /api/v1/extractions/{job_id}/add-to-kanban` and `GET /api/v1/vacancies/{vacancy_code}/candidates`.

- [x] **Step 1: Write failing service tests** proving first creation and idempotent reuse.
- [x] **Step 2: Add models and migration** for `vacancies`, `candidates`, `applications`, plus nullable `application_id` on `extraction_jobs`.
- [x] **Step 3: Implement `add_extraction_to_kanban`** validating that the selected provider completed, the vacancy is active, and the transaction creates or reuses records.
- [x] **Step 4: Add response schemas and routes** returning only card-safe fields and never `storage_path`.
- [x] **Step 5: Run migration** with `alembic upgrade head`, then run backend tests.

### Task 3: Explicit Kanban action in React

**Files:**
- Modify: `prototype/src/services/extraction.js`
- Create: `prototype/src/services/candidates.js`
- Modify: `prototype/src/components/ExtractionLab.jsx`
- Modify: `prototype/src/App.jsx`
- Modify: `prototype/src/styles.css`
- Modify: `prototype/src/App.test.jsx`

**Interfaces:**
- Consumes: `addToKanban(jobId, provider, vacancyCode)` and `listCandidates(vacancyCode)`.
- Produces: `ExtractionLab({ open, onClose, vacancyCode, onCandidateAdded })`.

- [x] **Step 1: Write failing UI tests** for a button on each completed result and callback delivery after a successful click.
- [x] **Step 2: Implement API clients** for listing persisted candidates and adding the chosen provider result.
- [x] **Step 3: Add the button and states** `adding`, `added`, duplicate message and accessible error feedback within the selected provider card.
- [x] **Step 4: Load and merge persisted candidates** by string id in `App`, and update immediately through `onCandidateAdded` without duplicate cards.
- [x] **Step 5: Run** `npm test -- --run` and `npm run build`.

### Task 4: End-to-end verification

**Files:**
- Modify: `backend/README.md`

**Interfaces:**
- Consumes: running FastAPI, MySQL and Vite services.
- Produces: verified OpenAI/Gemini comparison and persistent Kanban import.

- [x] **Step 1: Test OpenAI externally** using only `backend/tests/fixtures/curriculo_ficticio.txt`, printing no key or raw provider response. A API autenticou a chave e retornou `provider_rate_limited`; a conta precisa de cota para concluir.
- [ ] **Step 2: Test both providers** through `POST /api/v1/extractions` and verify both results are completed. Pendente de cota da OpenAI; o Gemini concluiu normalmente.
- [x] **Step 3: Add the completed Gemini result** through the Kanban endpoint twice and verify one application with `duplicate: true` on the second call.
- [x] **Step 4: Reload the candidate list** and verify the card remains in `new`.
- [x] **Step 5: Document** local start commands, supported formats and the explicit import behavior.
