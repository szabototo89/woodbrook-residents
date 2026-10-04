# Forma Studio homepage

Status: Available

## Job to be done

As a small business owner, understand Forma Studio's digital services, compare starting packages, and find a clear way to begin a conversation.

## Visible behavior

- A responsive single homepage follows the supplied Locale design: navigation, laptop hero, five service cards, three packages, a three-step process, illustrative testimonial, three FAQs and a closing contact panel.
- Services, Work, About and Contact navigation points to homepage sections. Learn more points to packages. Get Started points to the contact panel; its email action opens the visitor's email client.
- Mobile navigation opens and closes, including after selecting a section. FAQ buttons expose one answer at a time and support keyboard interaction.
- A skip link, semantic landmarks, visible focus, descriptive image text and reduced-motion styling support accessible use.
- A generated transparent logo and handwritten annotation accompany a cafe mockup showing Laura Faichney’s actual homepage. The cafe imagery and testimonial are illustrative, and the contact address is visibly marked for replacement before launch.

- The header presents the generated Forma Studio logo with a matching favicon; page titles, journal, footer and illustrative copy use the same brand. The longer wordmark remains readable with usable navigation on narrow phones.

## Acceptance criteria

- All referenced sections appear at desktop and mobile sizes without horizontal overflow.
- No homepage link leads to an unimplemented page.
- FAQ and navigation behavior pass tests authored before implementation.
- New homepage UI meets a 90% minimum for statements, branches, functions and lines.
- Production HTML contains the homepage copy before JavaScript executes.
- Production build passes. Lighthouse mobile and desktop scores are at least 90 for performance, accessibility, best practices and SEO.
- The app uses Laura's React/TanStack Start/Vite/Bun stack and produces static Cloudflare Pages output.

## Explicit scope

`/` and the subsequently requested `/blog` are implemented. Other pages, actual customer claims, a working enquiry backend, and a Sanity project/Studio or integration are outside scope. Data is isolated for later build-time CMS integration. Replace the placeholder email and approve draft pricing, FAQ and testimonial content before a public launch. The production deployment is the Cloudflare Pages project `forma-studio-web` at https://forma-studio-web-ddv.pages.dev.

## Verification

Verified on 2026-10-03:

- 17 unit/configuration tests and 14 desktop/mobile Chromium browser tests pass across the home page and blog.
- Homepage feature and shared chrome coverage: 100% statements, branches, functions and lines, with a 90% gate.
- TypeScript, ESLint, production app build, and the repository-wide `bun run build` pass.
- Desktop Lighthouse: performance 100, accessibility 100, best practices 100, SEO 100.
- Mobile Lighthouse: performance 93, accessibility 100, best practices 100, SEO 100.
- Desktop and mobile screenshots were inspected; the supplied design's hierarchy and layout are preserved, with mobile content stacked for readable use.

Commands and coverage boundaries are documented in `apps/forma-studio-web/README.md`. Score summaries are retained in `apps/forma-studio-web/lighthouse-reports/`. Lighthouse measurements describe local production previews.
