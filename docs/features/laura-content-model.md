# Laura content model

Status: In progress

## Job to be done

When Laura edits her own site content in Sanity Studio, I want every editable word and picture on the Home, About, Services, and Gallery pages to come from one plain-language Studio, so a non-technical editor can publish without touching code.

## Visible behavior

- Studio lives at `apps/laura-studio` bound to Sanity project `uag6kepo` ("Laura Faichney All Things Art"), dataset `production`, separate from the Woodbrook `ca34quae` project and `apps/sanity-studio`.
- Singletons with fixed document ids: `homePage`, `aboutPage`, `servicesPage`, `galleryPage`, `siteSettings`.
- Collections: `service` (title, stable slug, description, image + alt, order) and `galleryItem` (image, alt, optional caption, featured flag, order).
- Shared `pageHero` object (eyebrow, two-line title, description, image + alt, optional button text) and shared `seo` object (title, description) across all four page singletons.
- The Studio desk mirrors the website: Home, About, Services (Services page + All services), Gallery (Gallery page + All gallery items + Featured on the home page), Site settings.
- Every field carries a plain-language title and a one-line "where this shows" description; fieldsets group the Home page into Top banner, Page sections, and Client quote.
- Friendly validation: alt text required on every image, search description capped at 160 characters, service slug set-once guidance, About strengths fixed at four, home preview featured cap of six enforced across documents.
- Contact email, phone, mailto subject, and the shared Get-in-touch strip live once in `siteSettings` instead of being repeated per page.
- Initial values prefill the current live site copy so Laura edits rather than writes from blank.
- Website code wiring (route loaders reading this content) is explicitly out of scope; the site still reads baked-in `siteContent.ts` until that follow-up.

## Acceptance criteria

- Given the Studio schema changes, when `sanity schema validate` runs in `apps/laura-studio`, then it reports zero errors.
- Given a fresh checkout, when `bun run --cwd apps/laura-studio test:unit` runs, then all tests pass with the 90% per-file coverage gate green.
- Given the schema is deployed, when an editor opens the hosted Studio, then Home, About, Services page, Gallery page, and Site settings open directly with no document lists to navigate.
- Given an editor login, when they create and publish one service and one gallery item and edit the home hero copy, then the changes persist as published documents in `production`.
- Given `uag6kepo`, when the Laura scope is searched, then no `ca34quae` reference remains in `apps/laura-studio` or its wiring.

## Scope

### Included

- Standalone TypeScript Studio at `apps/laura-studio` (config, CLI config, desk structure, schema types, unit tests) plus root script wiring (`dev:laura-studio`, `build:laura-studio`, unit/typecheck/lint coverage).
- Schema deployment to `uag6kepo/production` and a hosted `*.sanity.studio` Studio.
- Seed content matching the current live copy so the Studio opens with real values.

### Not included

- Website code reading from Sanity (route loaders, `@sanity/client` in `laura-faichney-web`).
- Draft preview UI, visual editing overlays, webhook-triggered rebuilds, or contact-form writes.
- Changes to the Woodbrook `apps/sanity-studio` or project `ca34quae`.
