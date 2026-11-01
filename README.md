# Woodbrook Residents

A resident information and action hub for Woodbrook, Shankill. The public site is built with TanStack Start and can capture published Sanity or Google Sheets content as a fully static Cloudflare deployment.

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

### Start every browser project

```bash
bun run dev:all
```

`dev:all` starts all browser-based projects at the same time and keeps them under
one process manager. It does not replace `dev` or the individual
`dev:<project>` commands.

The interactive project list opens when stdout is a terminal. Otherwise, or
with `--no-interactive`, the command streams prefixed lifecycle and log lines
until Ctrl+C.

| Option             | Behavior                                                   |
| ------------------ | ---------------------------------------------------------- |
| _(none)_           | Open the interactive list on a TTY; stream logs otherwise. |
| `--interactive`    | Force the interactive list.                                |
| `--no-interactive` | Stream prefixed output; no terminal UI.                    |
| `-h`, `--help`     | Print the options and the project/port inventory.          |

`bun run dev:all:no-interactive` is the same as `bun run dev:all --no-interactive`.

In the interactive list, use Up/Down or `j`/`k` to select a project, `s` or
Enter to start it, `x` to stop it, `r` to restart it, and `q` or Ctrl+C to quit.
Starting an already running project does nothing. A failed project stays in the
list with its error, and you can restart it after fixing the cause.

The launcher marks a project ready only after its HTTP or TCP readiness check
passes. It shows the announced URL, including a URL announced by the child
process. It checks owned ports before starting and marks a project failed if a
port is already occupied; it never stops the process that owns the port.

Logs are kept in memory, bounded to the last 300 lines per project, and shown
for the selected project. They are not written to disk.

On quit, Ctrl+C, SIGTERM, or an error, the launcher stops every process group it
created. It sends SIGTERM, waits up to five seconds, then sends SIGKILL. It never
signals a process it did not start. In noninteractive mode, Ctrl+C exits 0; the
command exits 1 when every project fails.

| Project                 | URL                     | Readiness            |
| ----------------------- | ----------------------- | -------------------- |
| Woodbrook web           | `http://localhost:3000` | HTTP 3000            |
| Resident dashboard      | `http://localhost:3001` | HTTP 3001            |
| Handoffs                | `http://localhost:3002` | HTTP 3002            |
| Laura Faichney web      | `http://localhost:3003` | HTTP 3003            |
| Design proposal         | `http://localhost:3004` | HTTP 3004            |
| Forma Studio web        | `http://localhost:3005` | HTTP 3005            |
| Design proposals        | `http://localhost:3006` | HTTP 3006            |
| Mobile web              | `http://localhost:3203` | TCP 3202 + HTTP 3203 |
| Woodbrook Sanity Studio | `http://localhost:3333` | HTTP 3333            |
| Laura Faichney Studio   | `http://localhost:3334` | HTTP 3334            |
| Forma Studio            | `http://localhost:3335` | HTTP 3335            |

The web and mobile projects read the repository `.env` when it exists. Copy
`.env.example` to `.env` first. `bun install` installs the `serve` binary used by
the two static design sites.

To add a project, append one entry to `DEV_PROJECTS` in
`scripts/dev/projects.ts` with a unique port, its own working directory, command,
URL and readiness check. The launcher derives the list, port checks, readiness
and logs from that entry.

To use Google Sheets locally with service-account credentials, run:

```bash
bun run dev:web:sheets
```

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

For Google Sheets builds, share the private workbook with a Google service account as a viewer, then set `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. For Sanity builds, set `SANITY_PROJECT_ID` (defaults to `ca34quae`), `SANITY_DATASET` (defaults to `production`), `SANITY_API_VERSION` (defaults to `2025-09-01`), and optionally `SANITY_API_TOKEN`.

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
public URL, then Wrangler uploads `apps/web/dist/client` with the mobile content Worker. It defaults to `CONTENT_SOURCE=sanity`; set `CONTENT_SOURCE=google-sheets` to opt into the spreadsheet instead. An explicit source selection in an existing `.env` or build environment overrides the fallback.

For CI, provide `CLOUDFLARE_API_TOKEN` and
`CLOUDFLARE_ACCOUNT_ID` instead of using interactive login. Configure `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` as Worker secrets for mobile runtime reads. The
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
