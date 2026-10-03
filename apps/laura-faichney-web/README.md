# Laura Faichney web application

Independent TanStack Start site for Laura Faichney All Things Art. Content comes
from the `uag6kepo` ("Laura Faichney All Things Art") Sanity project, dataset
`production`, captured once before each build and rendered
with bundled site artwork and Sanity-hosted gallery photos (see `docs/features/laura-content-model.md`).

Production: `https://laura-faichney-all-things-art.pages.dev`

## Sanity content

Published reads need no token. The project, dataset, and API version default to
the values above and can be overridden for previews or local experiments:

- `SANITY_PROJECT_ID` (or `VITE_SANITY_PROJECT_ID` at build time)
- `SANITY_DATASET` (or `VITE_SANITY_DATASET` at build time)
- `SANITY_API_VERSION` (or `VITE_SANITY_API_VERSION` at build time)

Each build makes four published-content queries (Home, About, Services, Gallery)
and writes a validated snapshot to the ignored `.cache/laura-content.json`.
Vite embeds that snapshot in the client and server bundles. Route loaders,
preloads, gallery swipes, sitemap generation and static verification reuse it;
visitors make zero Sanity content API requests. Browser CORS registration is
therefore unnecessary for content navigation.

A missing or invalid required field or a failed Sanity request fails the build;
there is no runtime refresh or fallback to an older snapshot. Published changes
appear after the next build and deployment. Builds also download responsive WebP
variants for site heroes, service illustrations, mural and biography images.
These are served from `/site-images/` on Cloudflare Pages. The persistent
`.cache/image-assets/` cache avoids redownloading unchanged source assets and
transformations; the GitHub deploy workflow restores it between runs. Gallery
collection photos and thumbnails still load from Sanity's image CDN. Failed
required image downloads stop the build.

## Development

From the repository root:

```bash
bun run dev:laura-faichney-web
```

The app captures content when the development server starts and runs on port 3003. Restart it to load newly published content. The production origin used for canonical metadata defaults to `https://laura-faichney-all-things-art.pages.dev` and can be overridden with `VITE_PUBLIC_SITE_URL`.

## Verification

Run checks from this directory:

```bash
bunx playwright install chromium webkit
bun run typecheck
bun run test:unit
bun run test:e2e
bun run build
bun run build:static
```

`test:e2e` checks all five routes at 320, 390, 640, 700, 900 and 1440 pixels, the mobile service and gallery layouts, logo loading, and keyboard menu dismissal.

Gallery swipe tests use native Chromium touch input in mobile mode at 320, 390 and 430px, plus WebKit with an iPhone viewport and synthetic touch events. They verify that the image follows the finger, pictures and adjacent collections remain browsable, and vertical scrolling and multi-touch gestures preserve selection. The WebKit checks require its Playwright browser binary; they do not replace physical-device testing.

It also checks restrained motion, keyboard/touch feedback, selected-image gallery transitions, reduced motion (including live changes), missing browser APIs, and JavaScript-free browsing. For concurrent worktrees, `LAURA_PLAYWRIGHT_PORT` can select a free preview port. Content navigation requires no Sanity CORS configuration.

`test:e2e` builds all content and artwork from local fixtures before Vite runs,
with no live Sanity requests or network fallback. Fixture image variants use
the separate `.cache/test-image-assets/` cache, so test artwork cannot populate
the production cache. It also blocks Sanity API endpoints while checking direct
visits and client navigation.

The static build is written to `dist/client` and verifies the five main pages plus each CMS gallery collection, internal links, crawler metadata, and the absence of Sanity API code or runtime-only output.

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

## Contact enquiries

The contact page posts directly from the browser to the matching Google Form.
The submission runs in the background, keeps the visitor on the contact page,
and displays an inline status. Network errors preserve the details and allow a
retry; the opaque response cannot confirm whether Google stored the entry. There is no enquiry API, Cloudflare
function or deployed Google credential. The submission URL and verified Google
question field IDs live in `src/features/site/googleFormSubmission.ts`.
See `docs/features/laura-google-form-enquiries.md` for verification and scope.

## Lighthouse

From the repository root, run `bun run test:lighthouse:laura`. It builds the
static site from local content and image fixtures, serves the prerendered files
with gzip on port 4176, and audits all main pages and fixture collections on mobile
and desktop. No live Sanity content or image requests are allowed.
`build:static:offline` creates this audit artifact. `--skip-build` requires that
offline artifact; `--base-url` must also serve images locally. Sanity URLs are
blocked, and attempted Sanity requests fail the audit. Keep the port free while the audit runs. `CHROME_PATH` can select Chrome.

Reports and summaries are written to `lighthouse-reports/`. Every route must
score at least 90 for performance and 100 for accessibility, best practices,
and SEO. For a focused run:

```bash
bun run test:lighthouse --route=/contact --form-factor=mobile --retries=0
```

Page styles are minified at build time and embedded in prerendered HTML to avoid a blocking stylesheet request. Cloudflare Pages applies `public/_headers`: hashed Vite assets cache for a year, while replaceable artwork, branding and decorations cache for one day. The Lighthouse preview reads those same rules. See [Cloudflare header configuration](https://developers.cloudflare.com/pages/configuration/headers/).

The current CMS hero assets have matching, optimized AVIF and WebP local derivatives. Their
SHA-1 asset identities select these copies, which builds also publish under content-hashed
`/site-images/` URLs. Replacing or cropping an image in Sanity uses the new
responsive cached WebP images automatically. Originals remain in
`public/` as references. See `docs/features/laura-lighthouse-testing.md` for
scope and verification results.
