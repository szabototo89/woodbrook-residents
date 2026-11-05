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
       -> Sanity ContentSource
            -> Sanity GROQ API (published-only)
            -> published content snapshot
                 -> static HTML and JSON in apps/web/dist/client

Resident browser
  -> Cloudflare Pages static assets

Resident iOS or mobile web app
  -> Cloudflare Worker GET /api/mobile-content
       -> Sanity GROQ API (published-only)
       -> validated public content snapshot

Editor
  -> Sanity Studio in apps/sanity-studio (project ca34quae, dataset production)
       -> Sanity Content Lake (Draft & Publish)
```

The deployed browser application reads pre-rendered HTML and immutable JSON assets. Both mobile renderers call a narrow read-only Worker endpoint, which retrieves published Sanity content with an optional server-side read token. No issue-report submission path exists.

## Content and failure behavior

- `CONTENT_SOURCE` accepts only `sanity` (also the default when missing or blank).
- The Sanity adapter normalizes input into one domain-level content snapshot before routes or UI see it.
- Sanity queries siteSetting, update, project, event, survey, and resource documents; slugs, images, and project references become canonical public fields.
- The static build caches one validated snapshot. Dynamic development reloads the selected source so content changes do not require restarting the server.
- Every query uses the published perspective and excludes draft and release-version paths, including token-authenticated reads.
- Seed content contains current, source-linked Woodbrook and Shankill information researched in September 2026.
- Dynamic development and server builds show a clear service state if the selected source is unavailable.
- Static builds fail if selected-source content cannot be fetched, normalized, or validated, preserving the previous successful deployment instead of producing an empty site.
- Local SQLite data, uploads, build output, coverage, and secrets are excluded from Git.

## Deployment

The Cloudflare Worker deploys `apps/web/dist/client` as static assets and runs first only for `/api/*`. Configure Sanity runtime variables and optional `SANITY_API_TOKEN` as a Worker secret for the mobile-content endpoint. `VITE_PUBLIC_SITE_URL` supplies browser metadata. Both mobile renderers fetch the validated public snapshot from the Worker's `/api/mobile-content` endpoint at runtime, so Sanity credentials never enter a mobile bundle. See [Static Cloudflare Pages deployment](features/static-cloudflare-pages-site.md) and [iOS mobile navigation and live content](features/ios-mobile-navigation.md).
