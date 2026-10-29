# Woodbrook Residents

A resident information and action hub for Woodbrook, Shankill. The public site is built with TanStack Start and can capture published Sanity content as a fully static Cloudflare deployment.

## Prerequisites

- Bun 1.4+

## Start locally

```bash
cp .env.example .env
bun install
bun run test:install-browser
bun run dev
```

- Website: `http://localhost:3000` (Sanity content source by default)
- Sanity Studio: `bun run dev:sanity-studio` (`http://localhost:3333`)

To review the separate static website concepts gallery, run:

```bash
bun run dev:design-proposals
```

The proposal server is independent of the Woodbrook website and content sources.

`bun install` also configures the repository's pre-commit hook. Every commit runs
formatting and ESLint checks, TypeScript checks for both apps, and the unit,
browser, and end-to-end test suites. Run the same quality gate manually with
`bun run precommit`.

## Build the static site

Sanity is the default when `CONTENT_SOURCE` is missing or blank. To build explicitly with Sanity, run:

```bash
CONTENT_SOURCE=sanity \
VITE_PUBLIC_SITE_URL=https://www.example.com \
bun run build:static
```

The command fetches and validates published content, prerenders every reachable route, verifies the generated links and static data, and writes the deployable site to `apps/web/dist/client`. A content request or validation failure stops the build so it cannot replace a working deployment with empty content.

Configure Cloudflare Pages from the repository root with:

- Build command: `bun run build:static`
- Build output directory: `apps/web/dist/client`
- Build environment variables: `CONTENT_SOURCE`, `VITE_PUBLIC_SITE_URL`, and `BUN_VERSION=1.4.0`

Set `SANITY_PROJECT_ID` (defaults to `ca34quae`), `SANITY_DATASET` (defaults to `production`), `SANITY_API_VERSION` (defaults to `2025-09-01`), and optionally the server-only `SANITY_API_TOKEN`. Sanity is the single content source; `google-sheets` is no longer supported.

The public website remains fully static and never contacts a content API at runtime. The Wrangler deployment also attaches a read-only Worker endpoint used only by the mobile app; it does not change browser page delivery. See Cloudflare's [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) documentation for where to enter these values.

To publish Sanity changes automatically, create a [Cloudflare Pages deploy hook](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) and add its URL as a Sanity webhook for published creates, updates, and deletes. Treat the deploy-hook URL as a secret.

### Deploy with Wrangler

The production Worker is configured in `wrangler.jsonc` as `woodbrook`. On a
Cloudflare account whose `workers.dev` subdomain is `shankill`, it is published
at `https://woodbrook.shankill.workers.dev/`.

Authenticate Wrangler and deploy from the repository root:

```bash
bunx wrangler login
bun run deploy
```

`bun run deploy` first builds and verifies the static site with its production
public URL, then Wrangler uploads `apps/web/dist/client` with the mobile content Worker. It uses Sanity exclusively. Missing or blank `CONTENT_SOURCE` defaults to `sanity`; other source values fail before building.

For CI, provide `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` instead of using interactive login. Configure Sanity runtime variables and, for private datasets, the `SANITY_API_TOKEN` Worker secret for mobile reads. See [backend setup](apps/web/README.md). The
Cloudflare account must already use `shankill` as its `workers.dev` subdomain
for the configured Worker name to resolve to the expected URL.

### Daily Sanity rebuild

The `daily-cloudflare-rebuild.yml` GitHub workflow triggers a Cloudflare Workers
Build from `main` every day at 03:15 UTC. It can also be started manually from
GitHub Actions. Configure the production Workers Build with:

- Build command: `bun run build:static`
- Deploy command: `bunx wrangler deploy`
- Build variables: `CONTENT_SOURCE=sanity`,
  `VITE_PUBLIC_SITE_URL=https://woodbrook.shankill.workers.dev`, and
  `BUN_VERSION=1.4.0`
- Optional Sanity overrides: `SANITY_PROJECT_ID`, `SANITY_DATASET`, and
  `SANITY_API_VERSION`; use a secret `SANITY_API_TOKEN` only for private datasets

The workflow only invokes the hook; its environment is not forwarded to Cloudflare.
Set `CONTENT_SOURCE=sanity` in Cloudflare Workers Build settings for production
and any preview configuration. Wrangler runtime `vars` do not configure build variables.

Create a production deploy hook for the `main` branch and save its complete URL
as the `CLOUDFLARE_DEPLOY_HOOK_URL` GitHub Actions secret. The URL authorizes
builds and must not be committed. Each scheduled invocation rebuilds the latest
`main` commit and fetches a fresh, validated Sanity snapshot before
publishing the static assets.

## Verification

```bash
bun run test:unit
bun run test:browser
bun run test:e2e
bun run lint
bun run build
```

`test:install-browser` installs Chromium for Vitest Browser Mode and Playwright,
plus WebKit for Laura’s mobile Safari carousel checks. Rerun it when the pinned
Playwright version changes or when setting up these mobile checks for the first time.

See [Architecture](docs/architecture.md), [CMS model](docs/cms-model.md), and the [feature index](docs/features/README.md).

## Resident accounts

The optional account pages use Firebase Authentication. See [Firebase setup and rollout](docs/features/firebase-authentication.md) for configuring the existing `workers.dev` website, email/password, Google/Facebook providers, and feature flags.
