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
- On phones, compact hero illustrations and headings bring the collection covers and selected picture into the first screen. The home preview and gallery keep two collection columns on phones and tablets.
- Gallery images use responsive image sources, using local WebPs and Sanity CDN variants for their displayed sizes and device pixel densities. Below-the-fold home covers and thumbnails load lazily; overview covers and the selected picture load eagerly. Portrait and landscape pictures fit uncropped in a stable 4:3 viewer frame. Previous/Next keeps focus on its control; selecting a thumbnail brings the enlarged picture into view and focuses it.

## Acceptance criteria

- Collection cards on both entry points use collection URLs, with no individual-picture detail links.
- Each existing photo belongs to exactly one initial collection. The photo records contain no individual descriptions.
- The collection title and description render on direct loads and reloads; the description appears only once.
- Thumbnail selection and previous/next controls update the large image within the same URL and collection.
- Breadcrumbs, header/footer links, return links and image controls retain accessible names, visible focus and at least 44×44px tap areas.
- The gallery and collection pages fit 320px–1440px viewports without horizontal scrolling; selected pictures retain their original aspect ratio.
- At 320, 360, 390, 430 and 640px, the first gallery picture begins within the top 650px. Collection covers fill two-column rows at tablet widths too.
- At 390px and both 1× and 2× pixel densities, hero sources are at most 640px wide with transparent corners, and three-picture collection thumbnails use sources no larger than 320px.
- Static export generates the collection detail URLs and includes them in the sitemap. Individual-picture detail URLs are removed from that output.
- Laura's unit tests, browser suite, typecheck, source lint, formatting and production/static builds pass.

## Scope

Only `apps/laura-faichney-web`, its Sanity-driven gallery content and feature documentation. Collections (`galleryCollection` documents with title, slug, description and photo references) and their pictures (`galleryItem` documents) are edited in the Studio; the gallery page, home preview, collection pages, sitemap and static verification all read collection slugs and photo references from Sanity at build time. Initial collections are Colour & nature (flowers and strawberries) and Everyday inspiration (coffee, book and creative desk), using the five existing photographs. Names and descriptions describe the visible themes and make no client or commission claims. The existing generated hero is reused. Collections are flat; there are no nested folders, individual picture pages, image zoom or lightbox.

This replaces the [individual picture detail capability](./laura-gallery-picture-detail.md).

## Verification

Verified on 2026-10-01: 34 Laura unit tests and 45 browser tests passed after integration with the committed CMS content and gallery motion changes, together with typecheck, source lint, formatting, production build and static export. Static verification checked all seven HTML pages and internal links; both collection URLs have canonical metadata and sitemap entries, and all five retired picture URLs are absent from the output. Home preview, gallery and both collection layouts were audited and visually reviewed at 320, 360, 390, 430, 640, 768, 900 and 1440px, plus landscape at 844×390px. No horizontal overflow or undersized visible links/buttons was found. Mobile menu navigation, breadcrumb returns, keyboard browsing and stable picture dimensions passed. At 390px, Everyday inspiration's selected picture starts around 536px from the top (previously 876px), and its 1× hero file is about 94% smaller.
