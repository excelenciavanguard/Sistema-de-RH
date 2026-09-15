# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Current frontend phase

- Implement only frontend screens and navigation in this phase. Do not add login or change backend, database, Weboper, e-mail, WhatsApp, Maps, or AI integrations.
- New flows use clearly illustrative data until the backend contracts are designed and approved.
- Preserve the approved top navigation, white work surfaces, solid blue actions, subtle offset shadows, and the existing Kanban/candidate modal behavior.
- The approved header follows the executive white direction selected from option 1: white application bar, Alpha RH wordmark, active “Hoje no RH” tab with a blue underline, restrained blue accents, search, notifications and profile. Preserve the grouped dropdown menus for Recrutamento, Talentos e Pessoas, Jornada, and Gestão. Do not add a second module bar or a global “Nova requisição” call to action.
- The approved “Hoje no RH” composition follows the selected reference closely: slim blue greeting banner, five priority rows, timeline agenda, four process indicators and compact recent activity. Treat that image as the source of truth for hierarchy and proportions.
- SLA indicators use low-saturation backgrounds and restrained text colors; reserve strong colors for actions and true critical alerts.
- The connected sequence is: Operações creates a requisition, Diretoria approves it, RH creates the vacancy, and the vacancy opens its candidate Kanban.
- The frontend now supports an incremental shadcn/Tailwind/TypeScript layer under `src/components/ui` while the existing JavaScript and CSS screens remain valid during migration.
- The `header-3` navigation replaces the previous top bar, but it must use Alpha RH modules and Portuguese copy; marketing labels and login calls to action do not belong in the internal product.
