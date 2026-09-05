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
Resident browser
  -> TanStack Start (SSR + client navigation, port 3000)
       -> server-only Strapi client
            -> Strapi REST API (port 1337)
                 -> SQLite locally / PostgreSQL in production
```

The browser never needs a privileged CMS token. Published public content is fetched on the TanStack server. Issue reports are validated by a TanStack server function and forwarded to Strapi's create-only public endpoint.

## Content and failure behavior

- Strapi is the source of truth for updates, projects, events, surveys, resources, and site settings.
- Seed content contains current, source-linked Woodbrook and Shankill information researched in September 2026.
- If Strapi is unavailable, the website shows a clear service state instead of substituting fake content.
- Local SQLite data, uploads, build output, coverage, and secrets are excluded from Git.

## Deployment note

The web and CMS are separate deployable services. Strapi should use managed PostgreSQL and persistent media storage in production. `STRAPI_URL` is server-only; `VITE_PUBLIC_SITE_URL` is used for canonical and social metadata.
