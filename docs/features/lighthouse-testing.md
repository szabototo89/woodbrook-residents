# Chrome Lighthouse testing

Status: In progress

## Job to be done

When the public site changes, I want automated Chrome Lighthouse checks for performance, accessibility, best practices, and SEO, so regressions are caught before residents feel them.

## User-visible behavior

- `bun run test:lighthouse` (from the repo root, or `bun run --cwd apps/web test:lighthouse`) builds the web app, serves the production preview locally, and runs Chrome Lighthouse against the key public routes (`/`, `/events`, `/local-info`, `/projects`, `/surveys`, `/updates`, `/get-involved`) in both mobile and desktop form factors.
- Every Lighthouse category (performance, accessibility, best practices, SEO) must score at least 90 on every checked route; the command exits non-zero and prints the failing categories otherwise.
- JSON and HTML reports land in `apps/web/lighthouse-reports/`, alongside `lighthouse-summary.json` and `lighthouse-summary.md`.
- Flags narrow a run while iterating: `bun scripts/lighthouse.ts --form-factor=mobile --route=/ --skip-build --port=4173 --base-url=http://127.0.0.1:4173`.
- The `Lighthouse` GitHub workflow runs the same checks on pull requests and pushes to `main`, and uploads the reports as an artifact.

## Acceptance criteria

- Given a clean checkout, when `bun run test:lighthouse` runs, then it builds, serves, checks all key routes in both form factors, and passes with every category at 90 or above.
- Given a page regresses below 90 in any category, when the checks run, then they fail with the route, form factor, and categories named.
- Given a pull request is opened, when the `Lighthouse` workflow runs, then it executes the same checks and publishes the reports.

## Scope

### Included

- Reproducible local Lighthouse runner (`apps/web/scripts/lighthouse.ts`) with route/threshold config (`lighthouse-config.ts`) and pure scoring helpers (`lighthouse-report.ts`) covered by `bun test`.
- `test:lighthouse` scripts in `apps/web` and at the repo root.
- `Lighthouse` CI workflow with report artifacts.
- Fixes for every issue the baseline run surfaces.

### Not included

- CMS or content-pipeline changes beyond what Lighthouse findings require.
- Third-party dashboard provisioning.
