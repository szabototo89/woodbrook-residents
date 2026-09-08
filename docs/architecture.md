# Architecture

## Reference analysis

The setup borrows the parts of `/Users/tszabo/Development/anki-app` that make change safe without copying its flashcard-specific design:

- TanStack Start with file-based routes and route modules kept thin.
- Product code grouped by feature, with shared chrome separated from domain UI.
- Strict TypeScript, ESLint, and Prettier as build gates.
- Fast unit tests for pure behavior, real-browser component tests for interactive UI, and Playwright end-to-end tests for critical journeys and responsive behavior.
- Tests use accessible roles, labels, visible outcomes, and URLs rather than CSS selectors or component internals.
- User-visible capabilities have living specifications under `docs/features/`.

## Runtime topology

```text
Cloudflare Pages build
  -> TanStack Start prerenderer
       -> Strapi REST API
            -> published content snapshot
                 -> static HTML and JSON in apps/web/dist/client

Resident browser
  -> Cloudflare Pages static assets
```

Strapi is contacted only during the static build. The deployed browser application reads pre-rendered HTML and immutable JSON assets and has no runtime application server, CMS request, API route, or issue-report submission path.

## Content and failure behavior

- Strapi is the source of truth for updates, projects, events, surveys, resources, and site settings.
- Seed content contains current, source-linked Woodbrook and Shankill information researched in September 2026.
- Dynamic development and server builds show a clear service state if Strapi is unavailable.
- Static builds fail if Strapi content cannot be fetched or validated, preserving the previous successful deployment instead of producing an empty site.
- Local SQLite data, uploads, build output, coverage, and secrets are excluded from Git.

## Deployment

Deploy only `apps/web/dist/client` to Cloudflare Pages. Strapi must be reachable from the build environment but is not a runtime dependency of the deployed website. `STRAPI_URL` is build-only; `VITE_PUBLIC_SITE_URL` is embedded in canonical and social metadata. See [Static Cloudflare Pages deployment](features/static-cloudflare-pages-site.md).
