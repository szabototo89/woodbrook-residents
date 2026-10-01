# Laura gallery picture detail

Status: Available

## Job to be done

When a visitor finds a picture in Laura's gallery, they can open it at a shareable URL, view the complete picture, read a description when supplied, and browse other pictures without returning to the gallery first.

## Implementation goal

Implement this capability exclusively in `apps/laura-faichney-web`, using the existing five gallery photographs. Keep routing and loading in a dedicated route and presentation in the app's feature components. Generate a new transparent painterly hero asset for the detail page without replacing the gallery photography. Use failing behavior tests before implementation, verify Laura's unit and browser tests, typecheck, lint and build, and verify static export before marking the capability Available.

## Visible behavior

- Gallery cards and home gallery previews open `/gallery/{picture-slug}`, where the slug comes from the `galleryItem` document in Sanity.
- Picture titles and optional descriptions are edited in the Studio (`title`, `description` on `galleryItem`); the detail hero names the current picture and includes its own generated peony-and-paintbrush artwork.
- Breadcrumbs show Home, Gallery and the current picture. Home and Gallery link to their pages; the current picture is marked as the current page.
- The selected photograph is displayed at its full original aspect ratio, without cropping.
- The page shows the picture's position in the gallery.
- An About this picture section appears only when a non-empty description is supplied.
- Previous picture and Next picture links include adjacent picture titles and desktop thumbnails, following gallery order and wrapping at the ends.
- Back to gallery returns to the full gallery. The header's Gallery link stays active on detail pages.
- Unknown picture URLs show Picture not found and a return link.

## Acceptance criteria

- All five gallery pictures have distinct, directly loadable detail URLs and page titles/canonical metadata.
- Links from both the gallery and home preview select the corresponding picture.
- Breadcrumb links, previous/next links and the return link work with keyboard navigation and have at least 44px-high tap areas.
- First/last navigation wraps correctly; descriptions can be omitted without an empty heading or placeholder.
- The detail page has one primary heading and fits phone and desktop viewports from 320px to 1440px without horizontal scrolling.
- The local hero asset loads and retains transparent corners.
- Static export generates all five detail pages and includes them in the sitemap; the static verifier checks their output and internal links.
- Laura's unit tests, end-to-end tests, typecheck, source lint, formatting and production/static builds pass.

## Scope

Only the Laura web app's gallery experience, its Sanity-driven content, generated asset, static SEO output and feature documentation. Descriptions are optional Studio content edited per picture; this change does not introduce image zoom, a lightbox or changes to other applications. Descriptions describe visible image content without inventing clients, commissions or provenance. The detail hero is an illustrative generated asset.

## Verification

Verified on 2026-10-01 in the isolated Laura gallery session: 17 unit tests and 25 browser tests passed, together with Laura's typecheck, source lint, formatting, `bun run build` and `bun run build:static`. Static verification confirmed 10 HTML pages, including all five picture details, and every generated internal link. Desktop and phone screenshots were reviewed.
