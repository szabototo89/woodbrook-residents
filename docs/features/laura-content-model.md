# Laura content model

Status: Available

## Job to be done

When Laura edits her own site content in Sanity Studio, I want every editable word and picture on the Home, About, Services, and Gallery pages to come from one plain-language Studio, so a non-technical editor can publish without touching code.

## Visible behavior

- Studio lives at `apps/laura-studio` bound to Sanity project `uag6kepo` ("Laura Faichney All Things Art"), dataset `production`, fully separate from the Woodbrook studio and project.
- Singletons with fixed document ids: `homePage`, `aboutPage`, `servicesPage`, `galleryPage`, `siteSettings`.
- Collections: `service` (title, stable slug, description, image + alt, order), `galleryCollection` (title, stable slug, description, order, photo references) and `galleryItem` (image + alt, optional sale availability, order).
- Gallery items have an optional **Sale availability** choice: **For sale** or **Not for sale**. Unset values show **Enquire for availability**; the website displays the [availability badge](./laura-artwork-availability.md) below each selected picture and on its thumbnail.
- Shared `pageHero` object (eyebrow, two-line title, description, image + alt, optional button text) and shared `seo` object (title, description) across all four page singletons.
- The Studio desk mirrors the website: Home, About, Services (Services page + All services), Gallery (Gallery page + All collections + All gallery items), Site settings.
- Every field carries a plain-language title and a one-line "where this shows" description; fieldsets group the Home page into Top banner, Page sections, and Client quote.
- Friendly validation: alt text required on every image, search description capped at 160 characters, service and collection slug set-once guidance, About strengths fixed at four, collections requiring at least one picture.
- Contact email, phone, mailto subject, and the shared Get-in-touch strip live once in `siteSettings` instead of being repeated per page.
- Initial values prefill the current live site copy so Laura edits rather than writes from blank.
- The website reads this content at build time: TanStack route loaders fetch the singletons, ordered services, and ordered collections (with photo references expanded) via GROQ during static prerender, and components render CMS copy, Sanity CDN artwork (hotspot-aware crops, required alt text), collection pages, and per-page SEO with code fallbacks. No `siteContent.ts` remains.
- Service cards link `/contact?service=<slug>`; the Contact page keeps its hardcoded hero and reads shared contact details from `siteSettings`.
- Browser-side route transitions re-read published content from the Sanity API, so the production Pages origin and local dev/e2e origins are registered as project CORS origins.

## Acceptance criteria

- Given the Studio schema changes, when `sanity schema validate` runs in `apps/laura-studio`, then it reports zero errors.
- Given a fresh checkout, when `bun run --cwd apps/laura-studio test:unit` runs, then all tests pass with the 90% per-file coverage gate green.
- Given the schema is deployed, when an editor opens the hosted Studio, then Home, About, Services page, Gallery page, and Site settings open directly with no document lists to navigate.
- Given an editor login, when they create and publish one service and one gallery item and edit the home hero copy, then the changes persist as published documents in `production`.
- Given `uag6kepo`, when the Laura scope is searched, then no Woodbrook project reference remains in `apps/laura-studio` or its wiring.
- Given the published seed content, when `bun run build:static` runs in `apps/laura-faichney-web`, then all five routes prerender from Sanity with identical copy, titles, and layout to the previous hardcoded site, and `verify-static-build` passes.

## Scope

### Included

- Standalone TypeScript Studio at `apps/laura-studio` (config, CLI config, desk structure, schema types, unit tests) plus root script wiring (`dev:laura-studio`, `build:laura-studio`, unit/typecheck/lint coverage).
- Schema deployment to `uag6kepo/production` and a hosted `*.sanity.studio` Studio.
- Seed content matching the current live copy so the Studio opens with real values.
- Website wiring in `apps/laura-faichney-web`: `lauraSanity.ts` data layer (`@sanity/client` for image URLs, plain-fetch GROQ, zod validation), route loaders, CMS-driven components and head metadata, and unit tests with mocked Sanity responses.

### Not included

- Draft preview UI, visual editing overlays, webhook-triggered rebuilds, or contact-form writes.
- Changes to the Woodbrook `apps/sanity-studio` or project `ca34quae`.
