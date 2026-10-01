# Laura's editorial motion

Status: Available

## Job to be done

As a visitor exploring Laura's artwork and services, I want clear, responsive interaction feedback and a sense of continuity when selecting an image, while the artwork remains the focus.

## Visible behavior

- One CSS vocabulary uses 100ms press feedback, 180ms microinteractions, 280ms UI transitions, 420ms headline entrances and a 900ms artwork introduction, with shared UI/reveal easing and 4px, 8px and 12px distances.
- The hero introduces its eyebrow, headline lines, explanation, action and artwork at short intervals. The portrait settles from a 1.015 scale over 900ms, beginning 275ms after the copy starts, then stays still. Subpage heroes use the same vocabulary. The longer artwork reveal leaves the copy, controls and section timings unchanged.
- Pink buttons darken on hover/focus, lift 1px on mouse hover and press to 0.98 scale. Directional arrows move 4px. Service images zoom to 1.025 and gallery previews to 1.02 within their image frames. Keyboard focus provides the same clear feedback; touch has no persistent hover movement.
- Desktop navigation draws a fine pink underline from the left on hover/focus and retains the current page indicator. Mobile navigation retains its existing static indicator and accessible menu.
- Service cards reveal once with an 8px rise, 380ms duration and 45ms stagger. Exactly two small pink brush lines draw once: Creative services and the mural feature. Other decoration stays still.
- At 22% visibility, the mural artwork uncovers left to right in 450ms. Copy follows 80ms later with a 10px rise and the action fades. About copy and its studio image have quiet one-time entrances; the handwritten raster artwork stays still.
- Selecting a homepage or gallery collection card opens its existing collection page at `/gallery/SLUG`, carrying the cover thumbnail into the enlarged first picture. Within a collection, selecting a picture thumbnail carries that image into the viewer. Supporting browsers use a 280ms shared-image transition; the page itself does not fade. The enlarged artwork is brought into view and receives focus. Previous/Next crossfades between pictures in place and keeps focus on its control. The collection URL, content and selected-thumbnail indicator stay unchanged. Direct page loads retain the editorial hero at the top.
- Reduced motion removes translation, zoom, entrance/mask/brush animations and shared-image travel. Brief colour feedback remains. A live switch to reduced motion immediately exposes pending content. Keyboard focus exposes a pending action immediately.
- Browsers without IntersectionObserver leave content visible. Unsupported View Transitions, modified clicks and JavaScript-free browsing retain ordinary collection links. Without View Transitions, picture controls update immediately; without JavaScript, each collection retains its first picture and description.

## Acceptance criteria

- The hero becomes still after its introduction, and revealed sections do not replay on scrolling away and back.
- Hover/focus responds without shifting service text, moving navigation labels or changing layout dimensions.
- Gallery selection preserves the selected image, URL, destination focus and a working fallback; only one source and one destination image share the transition name.
- All five pages retain their responsive layouts without horizontal scrolling at 320, 390, 640, 700, 900 and 1440px.
- Reduced motion works both on initial load and when changed during browsing, without hiding artwork or controls.
- Keyboard and touch navigation work, and JavaScript-free content remains readable.
- Focused browser tests, unit tests, static prerender verification and `bun run build` pass.

## Scope

CSS handles feedback and animation; a small IntersectionObserver hook handles one-time homepage entrances, and TanStack Router's progressive View Transition support handles existing gallery navigation. No animation dependency, parallax, scroll-jacking, continuous motion, autoplay carousel, invented vector signature, or contact form is added. Existing gallery collections, descriptions, controls and URLs are preserved. The single testimonial and existing email/phone contact flow stay still.

## Verification

Verified 2026-10-01: 41 Laura browser tests and 15 unit tests pass; the full repository build passes; static prerender verification checks all seven public HTML pages and every generated internal link. Desktop and phone screenshots confirm the artwork, collection controls and responsive layout remain intact.

`apps/laura-faichney-web/tests/e2e/motion.spec.ts` and `gallery-motion.spec.ts` cover interaction feedback, hero settling, one-time reveals, selected-image transition snapshots, reduced motion including live changes, browser API fallbacks, keyboard, touch and JavaScript-free browsing. Existing responsive tests continue to cover all five routes. Set `LAURA_PLAYWRIGHT_PORT` to a free port when another worktree is running browser tests; set `CI=1` to require a fresh preview server.

Implementation references: [MDN: startViewTransition](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) and [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) (accessed 2026-10-01).
