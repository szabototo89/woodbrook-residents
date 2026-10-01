# Laura named gallery collections

Status: Available

## Job to be done

When a visitor explores Laura's gallery, they can choose a named collection, read its shared description and browse its pictures together on one page.

## Visible behavior

- The gallery and home preview show named collection cards with a cover image and title.
- Each card opens `/gallery/{collection-slug}` with its own title, description and canonical metadata.
- Breadcrumbs show Home, Gallery and the current collection; Home and Gallery are clickable.
- At 1024px and wider, the collection title, description and return link occupy the left third beside the picture viewer in the right two-thirds, with a 48px gap. Breadcrumbs sit above both columns. Below 1024px, the introduction stacks above the viewer.
- The collection description appears once. Collection details show the collection's own pictures without a decorative easel illustration.
- A large uncropped picture, selectable thumbnails and Previous picture / Next picture buttons let visitors browse within the collection without changing the URL. Navigation wraps at the ends.
- On touch screens, swiping left across the large picture shows the next picture; swiping right shows the previous picture. From the last picture, a left swipe opens the next collection at its first picture. From the first picture, a right swipe opens the previous collection at its last picture. Collections follow gallery order and wrap at the ends of the gallery, including single-picture collections. The URL, title, description and breadcrumbs update with the collection.
- Collection switches crossfade the page content and transition the artwork while the header and footer stay stationary. Picture changes within a collection retain the existing image transition. Reduced motion and browsers without View Transition support switch immediately.
- Vertical scrolling and pinch zoom remain available. Taps, short drags, mostly vertical gestures and multi-touch gestures do not change the selection.
- The selected thumbnail is visually outlined and marked as pressed for assistive technology. Controls work with the keyboard and touch.
- Collections with only one picture omit the picture controls and duplicate thumbnail chooser.
- Back to gallery returns to the collection overview. The header's Gallery link remains active.
- Unknown collections and retired individual-picture URLs show Collection not found with a gallery return link.
- On phones, compact introductions bring collection pictures close to the top of the page. The home preview and gallery keep two collection columns on phones and tablets.
- Gallery images use responsive image sources, using local WebPs and Sanity CDN variants for their displayed sizes and device pixel densities. Below-the-fold home covers and thumbnails load lazily; overview covers and the selected picture load eagerly. Portrait and landscape pictures fit uncropped in a stable 4:3 viewer frame. Previous/Next keeps focus on its control; selecting a thumbnail brings the enlarged picture into view and focuses it.

## Acceptance criteria

- Collection cards on both entry points use collection URLs, with no individual-picture detail links.
- Each existing photo belongs to exactly one initial collection. The photo records contain no individual descriptions.
- The collection title and description render on direct loads and reloads; the description appears only once.
- At 1024, 1280 and 1440px, the title, description and return link sit to the left of the selected picture; the viewer is approximately twice the introduction's width. At 320–1023px and in narrow landscape view, the introduction precedes the full-width viewer. Picture controls and thumbnails stay beneath the viewer in its column.
- Single-picture collections show one selected picture without a redundant chooser; collections with multiple pictures remain browsable.
- Thumbnail selection and previous/next controls update the large image within the same URL and collection.
- Left/right touch swipes update the large image and selected thumbnail within a collection. At picture boundaries, they navigate to the adjacent collection's first/last picture, with a corresponding URL, title and breadcrumb. The gallery wraps from its last collection to its first and vice versa; single-picture collections also support both directions.
- Collection changes animate page content and artwork; picture changes animate only the artwork. Both kinds of navigation work with reduced motion and without View Transition support. Gestures must travel at least 50px and be predominantly horizontal. Vertical scrolling, cancelled gestures and two-finger gestures preserve the selected picture; the next valid swipe still works.
- Breadcrumbs, header/footer links, return links and image controls retain accessible names, visible focus and at least 44×44px tap areas.
- The gallery and collection pages fit 320px–1440px viewports without horizontal scrolling; selected pictures retain their original aspect ratio.
- At 320, 360, 390, 430 and 640px, the first gallery picture begins within the top 650px. Collection covers fill two-column rows at tablet widths too.
- At 390px and both 1× and 2× pixel densities, gallery overview hero sources are at most 640px wide with transparent corners, and three-picture collection thumbnails use sources no larger than 320px. Collection details contain no decorative hero image or preload for it.
- Static export generates the collection detail URLs and includes them in the sitemap. Individual-picture detail URLs are removed from that output.
- Laura's unit tests, browser suite, typecheck, source lint, formatting and production/static builds pass.

## Scope

Only `apps/laura-faichney-web`, its Sanity-driven gallery content and feature documentation. Collections (`galleryCollection` documents with title, slug, description and photo references) and their pictures (`galleryItem` documents) are edited in the Studio; the gallery page, home preview, collection pages, sitemap and static verification all read collection slugs and photo references from Sanity at build time. Titles, descriptions, membership and picture counts come from published CMS content. Collections are flat; there are no nested folders, individual picture pages, image zoom or lightbox. This layout change does not edit CMS content or the Studio.

This replaces the [individual picture detail capability](./laura-gallery-picture-detail.md).

Swipe navigation applies to the selected collection picture on touch devices and follows the existing picture and collection order. Previous/Next buttons continue to wrap within the current collection. CMS content is unchanged.

## Verification

Mobile swipe navigation verified on 2026-10-01: all 55 Laura browser tests (including five swipe tests) and 48 unit tests passed on the integrated gallery. Native Chromium touch input at 390×844px verifies both directions, adjacent collection entry at the correct first/last picture, wrapping across the gallery, selected-thumbnail state, collection URLs and headings, separate page/image transitions, normal/reduced motion, unsupported-transition fallback, short drags, diagonal and vertical scrolling, multi-touch cancellation and recovery, and single-picture collections. Behavior tests failed before implementation and passed afterward. The repository `bun run build` (including formatting, lint and typechecks) and Laura's static export passed; static verification checked nine HTML pages and every generated internal link.

Decorative detail illustration removal verified on 2026-10-01: 34 unit tests and six focused layout/mobile browser tests passed, together with typecheck, source lint, production build and static export. The detail markup includes neither the illustration nor its image preload. Desktop and phone screenshots were reviewed; the collection introduction, return link and responsive picture viewer remain in place.

Desktop layout update verified on 2026-10-01: 34 unit tests and 47 browser tests passed on the final integrated state, including all four currently published collections, single-picture and three-picture collections, nine layout widths from 320 to 1440px (including 1023/1024px), and 844×390px landscape. Screenshots were visually reviewed at 390, 1024 and 1440px and in landscape. The tests assert the title, description and return link beside the viewer on desktop, stacked above it on smaller screens, with controls aligned beneath the viewer. Existing tests verify 44×44px targets, uncropped stable frames, keyboard/touch navigation, shared-image transitions and reduced-motion/unsupported-transition fallbacks. The production build and static export passed; static verification checked nine HTML pages and every internal link. Gallery browser tests now query current CMS collections and choose collections with multiple pictures for browsing checks rather than assuming sample slugs or two pictures.

Verified on 2026-10-01: 34 Laura unit tests and 45 browser tests passed after integration with the committed CMS content and gallery motion changes, together with typecheck, source lint, formatting, production build and static export. Static verification checked all seven HTML pages and internal links; both collection URLs have canonical metadata and sitemap entries, and all five retired picture URLs are absent from the output. Home preview, gallery and both collection layouts were audited and visually reviewed at 320, 360, 390, 430, 640, 768, 900 and 1440px, plus landscape at 844×390px. No horizontal overflow or undersized visible links/buttons was found. Mobile menu navigation, breadcrumb returns, keyboard browsing and stable picture dimensions passed. At 390px, Everyday inspiration's selected picture starts around 536px from the top (previously 876px), and its 1× hero file is about 94% smaller.
