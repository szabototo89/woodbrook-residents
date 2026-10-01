# Laura Faichney web application

Independent TanStack Start site for Laura Faichney All Things Art. No CMS integration; content is baked into the app with supplied artwork, generated transparent assets, and fixed Picsum photography until Laura provides originals (see `ASSETS.md`).

Production: `https://laura-faichney-all-things-art.pages.dev`

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

It also checks restrained motion, keyboard/touch feedback, selected-image gallery transitions, reduced motion (including live changes), missing browser APIs, and JavaScript-free browsing. For concurrent worktrees, use a free preview port, for example `LAURA_PLAYWRIGHT_PORT=4188 CI=1 bun run test:e2e`.

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
