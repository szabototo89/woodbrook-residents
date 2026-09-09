# Woodbrook Residents

A resident information and action hub for Woodbrook, Shankill. The public site is built with TanStack Start and can capture published Strapi content as a fully static Cloudflare deployment.

## Prerequisites

- Bun 1.4+
- Node.js 24 LTS for Strapi

## Start locally

```bash
cp .env.example apps/web/.env
bun install
bun run test:install-browser
bun run dev
```

- Website: `http://localhost:3000`
- Strapi admin: `http://localhost:1337/admin`

The CMS creates researched starter content on its first run. Create the first Strapi administrator in the admin screen; public content read permissions are configured automatically.

`bun install` also configures the repository's pre-commit hook. Every commit runs
formatting and ESLint checks, TypeScript checks for both apps, and the unit,
browser, and end-to-end test suites. Run the same quality gate manually with
`bun run precommit`.

## Build the static site

With Strapi running and reachable at `STRAPI_URL`, run:

```bash
STRAPI_URL=https://cms.example.com \
VITE_PUBLIC_SITE_URL=https://www.example.com \
bun run build:static
```

The command fetches and validates published CMS content, prerenders every reachable route, verifies the generated links and static data, and writes the deployable site to `apps/web/dist/client`. A CMS request or validation failure stops the build so it cannot replace a working deployment with empty content.

Configure Cloudflare Pages from the repository root with:

- Build command: `bun run build:static`
- Build output directory: `apps/web/dist/client`
- Build environment variables: `STRAPI_URL`, `VITE_PUBLIC_SITE_URL`, and `BUN_VERSION=1.4.0`

Only the output directory is deployed. It contains no server process or Pages Function, and the public site never contacts Strapi at runtime. See Cloudflare's [build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/) documentation for where to enter these values.

To publish CMS changes automatically, create a [Cloudflare Pages deploy hook](https://developers.cloudflare.com/pages/configuration/deploy-hooks/) and add its URL as a Strapi webhook for entry and media publish, update, unpublish, and delete events. Treat the deploy-hook URL as a secret.

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
public URL, then Wrangler uploads only `apps/web/dist/client`. When `STRAPI_URL`
is not set, the command starts a temporary local Strapi instance at
`http://127.0.0.1:1337`, waits for it to be ready, and stops it after the deploy.
If Strapi is already running there, the command reuses it and leaves it running.
Set `STRAPI_URL=https://cms.example.com` to build from another CMS instead.
Set `WOODBROOK_LOCAL_STRAPI_PORT` if the temporary local instance should use a
port other than `1337`.

For CI, provide `STRAPI_URL`, `CLOUDFLARE_API_TOKEN`, and
`CLOUDFLARE_ACCOUNT_ID` instead of using the local CMS or interactive login. The
Cloudflare account must already use `shankill` as its `workers.dev` subdomain
for the configured Worker name to resolve to the expected URL.

## Verification

```bash
bun run test:unit
bun run test:browser
bun run test:e2e
bun run lint
bun run build
```

`test:install-browser` installs the Chromium build used by Vitest Browser Mode
and Playwright. It only needs to be rerun when the pinned Playwright version
changes.

See [Architecture](docs/architecture.md), [CMS model](docs/cms-model.md), and the [feature index](docs/features/README.md).
