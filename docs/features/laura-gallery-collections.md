# Laura named gallery collections

Status: Available

## Job to be done

When a visitor explores Laura's gallery, they can choose a named collection, read its shared description and browse its pictures together on one page.

## Visible behavior

- The gallery and home preview show named collection cards with a cover image and title.
- Each card opens `/gallery/{collection-slug}` with its own title, description and canonical metadata.
- Breadcrumbs show Home, Gallery and the current collection; Home and Gallery are clickable.
- The collection description appears once in the hero alongside the existing generated illustration.
- A large uncropped picture, selectable thumbnails and Previous picture / Next picture buttons let visitors browse within the collection without changing the URL. Navigation wraps at the ends.
- The selected thumbnail is visually outlined and marked as pressed for assistive technology. Controls work with the keyboard and touch.
- Back to gallery returns to the collection overview. The header's Gallery link remains active.
- Unknown collections and retired individual-picture URLs show Collection not found with a gallery return link.

## Acceptance criteria

- Collection cards on both entry points use collection URLs, with no individual-picture detail links.
- Each existing photo belongs to exactly one initial collection. The photo records contain no individual descriptions.
- The collection title and description render on direct loads and reloads; the description appears only once.
- Thumbnail selection and previous/next controls update the large image within the same URL and collection.
- Breadcrumbs, return links and image controls retain accessible names, visible focus and at least 44px-high tap areas.
- The gallery and collection pages fit 320px–1440px viewports without horizontal scrolling; selected pictures retain their original aspect ratio.
- Static export generates the collection detail URLs and includes them in the sitemap. Individual-picture detail URLs are removed from that output.
- Laura's unit tests, browser suite, typecheck, source lint, formatting and production/static builds pass.

## Scope

Only `apps/laura-faichney-web`, its local gallery content and feature documentation. Initial collections are Colour & nature (flowers and strawberries) and Everyday inspiration (coffee, book and creative desk), using the five existing photographs. Names and descriptions describe the visible themes and make no client or commission claims. The existing generated hero is reused. Collections are flat; there are no nested folders, individual picture pages, per-picture descriptions, uploads or collection editing interface.

This replaces the [individual picture detail capability](./laura-gallery-picture-detail.md).

## Verification

Verified on 2026-10-01: 15 Laura unit tests and 27 browser tests passed, together with typecheck, source lint, formatting, production build and static export. Static verification checked all seven HTML pages and internal links; both collection URLs have canonical metadata and sitemap entries, and all five retired picture URLs are absent from the output. Collection and overview screenshots were reviewed at desktop and phone widths.
