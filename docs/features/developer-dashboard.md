# Developer dashboard

Status: Available

## Job to be done

As a Woodbrook software engineer, I can open one local dashboard to see every workspace application, reach infrastructure consoles, and run standard build actions.

## Visible behavior

- `/` shows `Workspace status and actions` with Applications, Infrastructure, and Build actions sections.
- Applications lists `web`, `cms`, and `dashboard` as Astryx cards with descriptions, stacks, localhost URLs, and copyable per-app script blocks.
- Infrastructure links render as Astryx list rows grouped by source, hosting, cms, and analytics.
- Build actions show runnable `bun run` commands for install, lint, builds, and tests.
- New apps, links, and actions are added as data in `src/features/dashboard/registry.ts` and validated by `registrySchema.ts`; no layout change is needed.

## Acceptance criteria

- Unit tests validate registry completeness and extendability.
- Browser test renders app headings and infrastructure links.
- E2E test loads `/` and verifies section headings plus the GitHub repository URL.
- Mobile E2E test verifies no horizontal overflow on a phone viewport.
- UI is built on Astryx (@astryxdesign/core 0.6.0, neutral theme) and verified with Playwright desktop and mobile screenshots plus keyboard skip-link focus.
- `bun run build:dashboard`, typecheck, lint, and dashboard unit/browser/e2e suites pass.

## Scope

- Local engineering tool only; not linked from the public resident site.
- No production secrets, no remote command execution; actions are documented commands plus console deep-links.
- Infrastructure URLs are discovered from repository config and docs; none are invented.
