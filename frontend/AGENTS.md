# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Current frontend phase

- Home detail placement: use the motivational phrase as the single supporting line directly beneath the personal greeting, with readable UI-size text, strong green contrast and a subtle green left accent. Place the Processes in progress title, active vacancy count and vacancies action below the click-a-vacancy hint, in the process card footer.

- Home greeting direction supersedes earlier banner layouts: integrate the personal greeting into the page header, with a small Hoje no RH label above it, short supporting text, and date/agenda on the right. Use the light application canvas and a subtle bottom divider; no separate welcome banner or duplicate greeting. Stack the header on mobile.

- Processes panel refinement (2026-09-16): preserve the single nine-stage pipeline with each stage name always visible above its bar and the candidate count shown below; do not use hover tooltips for these details. Keep rectangular bars using the approved vivid green palette (`#235347` for completed stages, `#0B2B26` for the current stage, and `#DFF3E4`/`#EDF6EF` for light states), aligned row spacing and responsive wrapping without horizontal scrolling; do not restore deadlines, overflow menus or a separate candidate-count column.

- Latest Home top-area direction (2026-09-16): show Hoje no RH with the browser-local current weekday/date, Bom trabalho, Simão Pedro! and the compact Agenda de hoje action grouped in the upper-right area, all above the compact green-gradient Olá, Simão Pedro! banner. Preserve the current processes and recent-activity layout without restoring the previous sidebar, KPI cards, next-appointment strip, stale priority counts or dead welcome actions. Update the displayed date while the page stays open and reflow the heading/actions/banner on mobile.

- Candidate cards must not display a CV shortcut/badge. Keep the résumé accessible inside the candidate modal; preserve card click, keyboard opening and drag behavior.

- Entry welcome direction (2026-09-16): retain a full-screen typed personalized greeting; use a professional, restrained presentation with the actual Alpha RH logo, light background, green accents and subtle transitions.

- Documents admission direction approved on 2026-09-16: use a full-width candidate list and a right modal drawer opened on candidate selection, not a permanent detail column. Distinguish received and validated documents, request only missing/correction items, require a correction reason, and block completion until all required documents are validated. Keep fixed drawer header/footer and a scrolling body. All actions remain illustrative in this frontend phase.

- Implement only frontend screens and navigation in this phase. Do not add login or change backend, database, Weboper, e-mail, WhatsApp, Maps, or AI integrations.
- New flows use clearly illustrative data until the backend contracts are designed and approved.
- Preserve the approved top navigation, white work surfaces, solid green actions, subtle offset shadows, and the existing Kanban/candidate modal behavior.
- The approved header follows the executive white direction selected from option 1: white application bar, Alpha RH wordmark, active navigation with a restrained green accent, search, notifications and profile. Preserve the grouped dropdown menus for Recrutamento, Talentos e Pessoas, Jornada, and Gestão. Do not add a second module bar or a global “Nova requisição” call to action.
- The approved “Hoje no RH” composition follows the selected reference closely: slim dark-green greeting banner, five priority rows, timeline agenda, four process indicators and compact recent activity. Treat that image as the source of truth for hierarchy and proportions.
- SLA indicators use low-saturation backgrounds and restrained text colors; reserve strong colors for actions and true critical alerts.
- The connected sequence is: Operações creates a requisition, Diretoria approves it, RH creates the vacancy, and the vacancy opens its candidate Kanban.
- The frontend now supports an incremental shadcn/Tailwind/TypeScript layer under `src/components/ui` while the existing JavaScript and CSS screens remain valid during migration.
- The `header-3` navigation replaces the previous top bar, but it must use Alpha RH modules and Portuguese copy; marketing labels and login calls to action do not belong in the internal product.
- Balanced density approved on 2026-09-16 replaces the oversized readability pass: body/form content 14px, menus/buttons/tables 13px, secondary information 12px, section headings 16–18px and page titles 24–28px. Use zoomable shared font roles and compact rows, fields and cards without truncating candidate names or reverting to 8–10px text. Preserve the approved green identity.
- Vacancies screen direction approved on 2026-09-16: prioritize finding a vacancy and opening its Kanban. Replace the four large KPI cards with compact Ativas/Rascunhos/Encerradas status counts; use prominent search by function, post or code, restrained post/owner/status filters, separate positions and candidates columns, owner initials and outlined green Open Kanban actions. Preserve the actual incumbent executive header rather than substituting the generated mock's logo/header. Missing candidate examples for other vacancies must never reuse Leblon Power's candidates.
- System-wide typography approved on 2026-09-16: use self-hosted Inter variable (regular and italic), preserve the balanced font sizes and green layout, and centralize weight roles in `src/typography.css`: body 400, controls/data 500, headings/emphasis 600. Use lining/tabular numerals for consistent codes, dates, counts and monetary values; do not introduce monospace styling or miniature text. Keep Inter's license with the font assets.
- Color direction approved on 2026-09-16: use `#051F20`, `#0B2B26`, `#163832`, `#235347`, `#DFF3E4`, and `#EDF6EF`. Keep the global header white and work surfaces white; use `#235347` for solid primary actions, `#DFF3E4` for selected states and filter chips, and `#EDF6EF` for the application canvas. Do not use gradients in the global header or buttons. Reserve `linear-gradient(110deg, #051F20 0%, #163832 55%, #235347 100%)` for greeting or other exceptional feature banners. Semantic warnings remain orange, destructive states red, and informational states may retain blue when the meaning requires it.
- Agenda direction approved on 2026-09-16: open in monthly view, allow switching between Mês/Semana/Dia, and place Calendários and Tipos in the top toolbar instead of a fixed filter rail. Do not keep a fixed upcoming-events column. Use the label “Lista de compromissos” for the chronological list, and open a detailed right-side modal when a calendar day is selected.
- Agenda corrective direction: weekly view uses seven readable day columns with chronological appointments, not the legacy hourly grid. Day headings and appointments open the same day drawer. Drawer cards must retain their complete natural height, with only the list scrolling and its header/footer fixed; never compress or clip appointment actions.
