# Laura Faichney web application

Independent TanStack Start site for Laura Faichney All Things Art. Content comes
from the `uag6kepo` ("Laura Faichney All Things Art") Sanity project, dataset
`production`, fetched by the TanStack route loaders at build time and rendered
from Sanity CDN artwork (see `docs/features/laura-content-model.md`).

Production: `https://laura-faichney-all-things-art.pages.dev`

## Sanity content

Published reads need no token. The project, dataset, and API version default to
the values above and can be overridden for previews or local experiments:

- `VITE_SANITY_PROJECT_ID` (or `SANITY_PROJECT_ID` on the server)
- `VITE_SANITY_DATASET` (or `SANITY_DATASET` on the server)
- `VITE_SANITY_API_VERSION` (or `SANITY_API_VERSION` on the server)

A missing or invalid required field fails the static build with the Sanity
validation message. Browser-side route transitions re-read published content,
so the local dev (`http://localhost:3003`), e2e (`http://127.0.0.1:4176`), and
production origins are registered as project CORS origins.

## Development

From the repository root:

```bash
bun run dev:laura
```

The app runs on port 3003. The production origin used for canonical metadata defaults to `https://laura-faichney-all-things-art.pages.dev` and can be overridden with `VITE_PUBLIC_SITE_URL`.

## Verification

Run checks from this directory:

```bash
bun run typecheck
bun run test:unit
bun run test:e2e
bun run build
bun run build:static
```

`test:e2e` checks all five routes at 320, 390, 640, 700, 900 and 1440 pixels, the mobile service and gallery layouts, logo loading, and keyboard menu dismissal.

The static build is written to `dist/client` and verifies the five prerendered pages, internal links, crawler metadata, and the absence of runtime-only output.

## Cloudflare Pages deployment

Cloudflare Pages project: `laura-faichney-all-things-art` (production branch `main`).

Dashboard build settings (repository root):

- Build command: `bun run --cwd apps/laura-faichney-web build:static`
- Build output directory: `apps/laura-faichney-web/dist/client`
- Build environment variables: `VITE_PUBLIC_SITE_URL=https://laura-faichney-all-things-art.pages.dev`, `BUN_VERSION=1.4.0`

Easiest deploy from the repository root (builds then deploys):

```bash
bun run deploy:laura
```

The script always builds with the production site URL (the repo-root `.env`
points `VITE_PUBLIC_SITE_URL` at localhost for local dev, so it is ignored).
Preview deploys can opt in with `LAURA_SITE_URL=https://preview.example.com
bun run deploy:laura`.

Manual deploy after building (from the app directory so wrangler picks up
its Pages config instead of the repository-root Workers config):

```bash
bun run --cwd apps/laura-faichney-web build:static
cd apps/laura-faichney-web
bunx wrangler pages deploy dist/client --project-name=laura-faichney-all-things-art --branch=main --commit-hash=$(git rev-parse HEAD)
```

Pushes to `main` that touch `apps/laura-faichney-web/**` are also deployed by the `Deploy Laura Faichney` GitHub workflow.
