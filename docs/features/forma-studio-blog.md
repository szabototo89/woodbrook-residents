# Forma Studio blog

Status: Available

## Job to be done

As a local business owner, read practical guidance about a website, local discovery and keeping business information useful, then find a clear route to ask for help.

## Visible behavior

- `/blog` presents a featured website-design guide and two further guides about local search and content care in the Forma Studio visual style.
- Each guide expands and collapses in place using its Read guide control. Native disclosure controls support keyboard use.
- Blog appears in desktop and mobile navigation with a current-page indication. Services, Work, About, Contact and Get Started return to the corresponding homepage section.
- Draft articles include source links and access dates; no invented authors, publication dates, readership figures or customer results are presented.
- A contact call to action returns to the homepage contact panel.

- The header presents the generated Forma Studio logo with a matching favicon; page titles, journal, footer and illustrative copy use the same brand. The longer wordmark remains readable with usable navigation on narrow phones.

## Acceptance criteria

- `/blog` is prerendered with its content and descriptive search metadata.
- Menu links work between the home and blog pages on desktop and mobile.
- Guides open and close with a mouse, touch or keyboard.
- Both pages fit small phone widths and visible text meets contrast requirements.
- Feature and shared chrome unit coverage meets the 90% gate for statements, branches, functions and lines.
- Lighthouse audits both routes on desktop and mobile at a minimum of 90 for performance, accessibility, best practices and SEO.

## Explicit scope

This extends the original homepage-only request with a single blog index containing expandable guides. Individual article routes, categories, search, pagination, author management, subscriptions and comments are not implemented. Content is now edited in the dedicated Forma Sanity project and validated during each build; see [Forma Studio content editing](forma-sanity-content.md).

## Verification

Verified on 2026-10-03:

- 17 unit/configuration tests and 14 browser tests pass across the site, including guide disclosure, active navigation, cross-page destinations, static HTML, asset layout, 320px navigation and text contrast.
- Homepage, blog and shared chrome coverage is 100% for statements, branches, functions and lines.
- Repository production build, TypeScript and ESLint pass.
- Blog Lighthouse desktop: performance 100, accessibility 100, best practices 100, SEO 100.
- Blog Lighthouse mobile: performance 98, accessibility 100, best practices 100, SEO 100.
- Desktop/mobile screenshots were visually reviewed. Report summaries are retained under `apps/forma-studio-web/lighthouse-reports/`.
