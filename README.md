# Woodbrook Community Hub

A resident information and action hub for Woodbrook, Shankill. The public site is built with TanStack Start and can capture published Strapi content as a fully static Cloudflare Pages deployment.

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
