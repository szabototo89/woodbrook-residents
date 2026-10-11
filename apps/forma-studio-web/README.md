# Forma Studio website

A responsive implementation of the supplied Locale design, rebranded as Forma Studio, including the home page and the requested blog subpage. The app directory and package name are `apps/forma-studio-web` and `forma-studio-web`.

## Development

Use Bun from the repository root:

```sh
bun install
bun run --cwd apps/forma-studio-web dev
bun run --cwd apps/forma-studio-web test:unit
bun run --cwd apps/forma-studio-web typecheck
bun run --cwd apps/forma-studio-web test:e2e
bun run --cwd apps/forma-studio-web build
bun run --cwd apps/forma-studio-web test:lighthouse --skip-build
```

Development uses port 3005; production preview uses 4178. Install Playwright Chromium and WebKit with `bun run --cwd apps/forma-studio-web playwright install chromium webkit` if needed. Lighthouse uses installed Chrome, or `CHROME_PATH`.

## Stack and hosting

Matches `apps/laura-faichney-web`: React 19, TanStack Start/Router, TypeScript, Vite, plain CSS, DM Sans, Lucide and Bun. Production builds prerender `/` and `/blog` to static HTML under `dist/client`. Publish **only `apps/forma-studio-web/dist/client`** to Cloudflare Pages using `wrangler.jsonc`; no runtime server or credentials are needed. `dist/server` is used during prerendering, not deployed. The home page and blog index are the only product routes.

Cloudflare build command from the monorepo root: `bun run --cwd apps/forma-studio-web build`. The site is deployed to the Cloudflare Pages project `forma-studio-web` at https://forma-studio-web-ddv.pages.dev.

## Content and future Sanity

`src/features/home/homeContent.ts` holds reference services, pricing, process and FAQ copy independently of presentation; `src/features/blog/blogContent.ts` holds the draft blog guides and their source URLs/access dates. A future Sanity integration can replace this with a validated build-time snapshot, following Laura's approach, without exposing tokens or introducing browser API requests. No Sanity project, schema, credentials, Studio, live data or webhook integration is configured in the current scope.

The currency and starting prices match the reference and remain draft commercial content. The final quote must confirm scope, hosting and ongoing costs. The cafe photograph is an illustrative mockup displaying Laura’s real homepage. The fictional sample testimonial has been removed. Customer enquiries use the user-approved `szabototo89@gmail.com` address with a prefilled, editable project brief. The address is also displayed for visitors who prefer to copy it. FAQ timelines are draft marketing copy, not a service commitment. A production origin was not supplied, so no canonical URL or sitemap with an invented origin is generated.

## Verification

Tests were written and observed failing before implementation. Behavioral component tests exercise copy, destinations, menu state, FAQ disclosure and keyboard interaction. Playwright checks the prerendered response, hydration without errors, real images, navigation, keyboard access and viewport overflow in desktop Chromium, mobile Chromium and mobile WebKit. The coverage gate requires at least 90% statements, branches, functions and lines for all homepage, blog and shared chrome code; routing boilerplate and build scripts are verified by type checks, production build and browser tests. Lighthouse gates the home page and blog in both mobile and desktop mode at 90 for performance, accessibility, best practices and SEO. Reports are written under `lighthouse-reports`; full raw audit files and screenshots are ignored, and the score summaries are retained.

## Image provenance

Images are generated with the built-in imagegen tool, then resized and encoded to WebP. The [exact Forma Studio logo prompt](docs/forma-logo-prompt.md) is retained with asset provenance. Prompts:

- Hero: retain the original silver laptop, oak cafe table, houseplants, coffee and daylight; replace only the screen with a perspective-fitted capture of Laura Faichney’s actual homepage, preserving its cream background, pink signature, “Bold Art Brighter Spaces” heading and multicolour painted face. Source: [Laura’s existing site](https://laura-faichney-all-things-art.pages.dev), captured from the local app on 2026-10-03. This is a website mockup, not a claim of a client outcome.
- Annotation: only forest-green felt-tip handwriting, the exact four-line text “Websites / that work / for real / businesses.” and one loose curved arrow pointing down-left, on a transparent background; no sticker, panel, typeface, texture, photo or watermark.
- Logo: exact “Forma Studio” horizontal wordmark, with Forma slightly heavier than Studio, a geometric F assembled from solid forest-green and sage forms, and modern rounded sans-serif typography on a genuinely transparent background; no leaf, panel, slogan, shadow or watermark.
- Portrait: a fictional smiling cafe owner, brown shoulder-length hair, cream shirt and taupe apron, warm cafe and green plants, soft daylight, editorial portrait; no text or watermark.

The generated logo and annotation preserve transparency. Final assets: `public/images/forma-studio-logo.webp` (720 × 113; approximately 20 KB), `public/images/handwritten-hero-note.webp`, `public/images/laura-website-640.webp`, `public/images/laura-website-1200.webp`, and `public/images/illustrative-owner.webp`.

The matching `public/favicon.png` is a 64 × 64 crop of the generated F mark. The previous Locale logo and favicon are superseded. Assets are local under `public/images` and require no remote image service.

## Customer journey review

The homepage now has expandable service details, a dedicated selected-work section, package discussion links, clearer project stages and keyboard menu dismissal. The portfolio image `public/images/laura-project.jpg` is a Playwright capture of the live Laura homepage hero (1440 × 540), accessed on 2026-10-11. It excludes the temporary announcement immediately above the hero. The café hero remains an illustrative mockup. See [the researched critique](../../docs/reviews/forma-studio-ux-review.md) and [acceptance criteria](../../docs/features/forma-studio-customer-journey.md).

## Mobile design verification

The home and journal are verified in mobile Chromium and WebKit, including 320, 360, 375, 390 and 430px phones and a 640 × 320 landscape menu. Mobile actions, card alignment, horizontal containment, disclosures, contact destinations and keyboard dismissal are covered by observable browser checks. Desktop-only runs intentionally skip the phone matrix. See [mobile design behavior and acceptance criteria](../../docs/features/forma-studio-mobile-design.md).
