# Woodbrook Community Hub

A resident information and action hub for Woodbrook, Shankill. The public site is built with TanStack Start and reads published content from Strapi.

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

The CMS creates researched starter content on its first run. Create the first Strapi administrator in the admin screen; public read permissions and private issue-submission permissions are configured automatically.

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
