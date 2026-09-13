# Developer dashboard

Status: Available

## Job to be done

As a Woodbrook software engineer, I can select one workspace application and see everything about it in one focused place.

## Visible behavior

- A persistent application selector lists `web`, `cms`, and `dashboard`; the active app is marked and every view shows only that app's context.
- `/` redirects to the last-selected app, defaulting to `web`, so the dashboard always focuses one application.
- `/app/<name>` is deep-linkable per application and shows its description, stack, local URL, copyable script block, relevant infrastructure links, app actions, and workspace actions.
- New apps, links, and actions are added as data in `src/features/dashboard/registry.ts` and validated by `registrySchema.ts`; no layout change is needed.

## Acceptance criteria

- Unit tests validate registry completeness, extendability, and per-app link/action filtering.
- Browser tests render an app workspace and prove per-app context.
- E2E test redirects `/` to the focused app, switches apps through the selector, and verifies per-app content plus the GitHub repository URL.
- Mobile E2E test verifies no horizontal overflow on a phone viewport.
- UI is built on Astryx (@astryxdesign/core 0.6.0, neutral theme) and verified with Playwright desktop and mobile screenshots plus keyboard skip-link focus.
- `bun run build:dashboard`, typecheck, lint, and dashboard unit/browser/e2e suites pass.

## Scope

- Local engineering tool only; not linked from the public resident site.
- No production secrets, no remote command execution; actions are documented commands plus console deep-links.
- Infrastructure URLs are discovered from repository config and docs; none are invented.
