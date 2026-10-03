# Locale homepage

A responsive implementation of the supplied Locale design, scoped to the home page.

## Development

Use Bun from the repository root:

```sh
bun install
bun run --cwd apps/locale-web dev
bun run --cwd apps/locale-web test:unit
bun run --cwd apps/locale-web typecheck
bun run --cwd apps/locale-web test:e2e
bun run --cwd apps/locale-web build
bun run --cwd apps/locale-web test:lighthouse --skip-build
```

Development uses port 3005; production preview uses 4178. Install Playwright Chromium with `bun run --cwd apps/locale-web playwright install chromium` if needed. Lighthouse uses installed Chrome, or `CHROME_PATH`.

## Stack and hosting

Matches `apps/laura-faichney-web`: React 19, TanStack Start/Router, TypeScript, Vite, plain CSS, DM Sans, Lucide and Bun. Production builds prerender `/` to `dist/client/index.html`. Publish **only `apps/locale-web/dist/client`** to Cloudflare Pages using `wrangler.jsonc`; no runtime server or credentials are needed. `dist/server` is used during prerendering, not deployed. No other product routes exist.

Cloudflare build command from the monorepo root: `bun run --cwd apps/locale-web build`. This implementation prepares hosting but does not create or deploy a Cloudflare project.

## Content and future Sanity

`src/features/home/homeContent.ts` holds reference services, pricing, process and FAQ copy independently of presentation. A future Sanity integration can replace this with a validated build-time snapshot, following Laura's approach, without exposing tokens or introducing browser API requests. No Sanity project, schema, credentials, Studio, live data or webhook integration is configured in this homepage-only scope.

The currency and prices match the reference. The example cafe and testimonial are explicitly labelled illustrative; the images depict fictional subjects. `hello@locale.example` is an intentional reserved-domain placeholder: replace it with an approved contact address before launch. FAQ timelines are draft marketing copy, not a service commitment. A production origin was not supplied, so no canonical URL or sitemap with an invented origin is generated.

## Verification

Tests were written and observed failing before implementation. Behavioral component tests exercise copy, destinations, menu state, FAQ disclosure and keyboard interaction. Playwright checks the prerendered response, hydration without errors, real images, navigation, keyboard access and viewport overflow in desktop and mobile Chromium. The coverage gate requires at least 90% statements, branches, functions and lines for all homepage feature and shared chrome code; routing boilerplate and build scripts are verified by type checks, production build and browser tests. Lighthouse gates the home page in both mobile and desktop mode at 90 for performance, accessibility, best practices and SEO. Reports are written under `lighthouse-reports`; full raw audit files and screenshots are ignored, and the score summaries are retained.

## Image provenance

Images are generated with the built-in imagegen tool, then resized and encoded to WebP. Prompts:

- Hero: a silver laptop on a warm oak cafe table, displaying a cream and forest-green restaurant website titled “The Gathered Table” with “Good food brings people together.”, softly blurred cafe, houseplants, coffee and daylight; premium natural editorial photography; no watermark, illustrative concept.
- Portrait: a fictional smiling cafe owner, brown shoulder-length hair, cream shirt and taupe apron, warm cafe and green plants, soft daylight, editorial portrait; no text or watermark.

Assets are local under `public/images` and require no remote image service.
