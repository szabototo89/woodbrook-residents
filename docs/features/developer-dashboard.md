# Developer dashboard

Status: In progress

## Job to be done

As a Woodbrook software engineer, I can open one local dashboard to see every workspace application, reach infrastructure consoles, and run standard build actions.

## Visible behavior

- `/` shows `Workspace status and actions` with Applications, Infrastructure, and Build actions sections.
- Applications lists `web`, `cms`, and `dashboard` with descriptions, stacks, localhost URLs, and key scripts.
- Infrastructure links to the GitHub repository and Actions, Cloudflare Pages/Workers and deploy-hook docs, Strapi admin docs, and Microsoft Clarity.
- Build actions show runnable `bun run` commands for install, lint, builds, and tests.
- New apps, links, and actions are added as data in `src/features/dashboard/registry.ts` and validated by `registrySchema.ts`; no layout change is needed.

## Acceptance criteria

- Unit tests validate registry completeness and extendability.
- Browser test renders app headings and infrastructure links.
- E2E test loads `/` and verifies section headings plus the GitHub repository URL.
- `bun run build:dashboard`, typecheck, lint, and dashboard unit/browser/e2e suites pass.

## Scope

- Local engineering tool only; not linked from the public resident site.
- No production secrets, no remote command execution; actions are documented commands plus console deep-links.
- Infrastructure URLs are discovered from repository config and docs; none are invented.
