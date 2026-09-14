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
       -> configured ContentSource
            -> Google Sheets API (read-only) or Strapi REST API
            -> published content snapshot
                 -> static HTML and JSON in apps/web/dist/client

Resident browser
  -> Cloudflare Pages static assets

Resident iOS app
  -> Cloudflare Worker GET /api/mobile-content
       -> Google Sheets API (read-only)
       -> validated public content snapshot
```

The deployed browser application reads pre-rendered HTML and immutable JSON assets. The iOS app is the sole runtime content consumer: it calls a narrow read-only Worker endpoint, which retrieves the Google Sheet with server-side credentials. No issue-report submission path exists.

## Content and failure behavior

- `CONTENT_SOURCE` explicitly selects `google-sheets` or `strapi`.
- Both adapters normalize their input into one domain-level content snapshot before routes or UI see it.
- Google Sheets reads the Updates, Events, Projects, Consultations, and Local_Info tabs in one authenticated, read-only batch request. Strapi reads the corresponding published API collections and site settings.
- The static build caches one validated snapshot. Dynamic development reloads the selected source so content changes do not require restarting the server.
- Google Sheets rows are public only when `publish` is `TRUE`; `admin_notes` is never mapped into either the static site or mobile response.
- Seed content contains current, source-linked Woodbrook and Shankill information researched in September 2026.
- Dynamic development and server builds show a clear service state if Strapi is unavailable.
- Static builds fail if selected-source content cannot be fetched, normalized, or validated, preserving the previous successful deployment instead of producing an empty site.
- Local SQLite data, uploads, build output, coverage, and secrets are excluded from Git.

## Deployment

The Cloudflare Worker deploys `apps/web/dist/client` as static assets and runs first only for `/api/*`. Configure the Google service-account values as Worker secrets for the web mobile-content endpoint. `VITE_PUBLIC_SITE_URL` supplies browser metadata. Both mobile renderers fetch the validated public snapshot from the Worker's `/api/mobile-content` endpoint at runtime, so Google credentials never enter a mobile bundle. See [Static Cloudflare Pages deployment](features/static-cloudflare-pages-site.md) and [iOS mobile navigation and live content](features/ios-mobile-navigation.md).
