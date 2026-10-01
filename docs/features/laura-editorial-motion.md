# Laura's editorial motion

Status: In progress

## Job to be done

As a visitor exploring Laura's artwork and services, I want clear, responsive interaction feedback and a sense of continuity when selecting an image, while the artwork remains the focus.

## Visible behavior

- One CSS vocabulary uses 100ms press feedback, 180ms microinteractions, 280ms UI transitions, 420ms headline entrances and a 520ms artwork introduction, with shared UI/reveal easing and 4px, 8px and 12px distances.
- The hero introduces its eyebrow, headline lines, explanation, action and artwork at short intervals. The portrait settles from a 1.015 scale and stays still. Subpage heroes use the same vocabulary.
- Pink buttons darken on hover/focus, lift 1px on mouse hover and press to 0.98 scale. Directional arrows move 4px. Service images zoom to 1.025 and gallery previews to 1.02 within their image frames. Keyboard focus provides the same clear feedback; touch has no persistent hover movement.
- Desktop navigation draws a fine pink underline from the left on hover/focus and retains the current page indicator. Mobile navigation retains its existing static indicator and accessible menu.
- Service cards reveal once with an 8px rise, 380ms duration and 45ms stagger. Exactly two small pink brush lines draw once: Creative services and the mural feature. Other decoration stays still.
- At 22% visibility, the mural artwork uncovers left to right in 450ms. Copy follows 80ms later with a 10px rise and the action fades. About copy and its studio image have quiet one-time entrances; the handwritten raster artwork stays still.
- Selecting a homepage or gallery thumbnail opens its existing detail page at `/gallery/ID`. Previous/next picture thumbnails use the same interaction. Supporting browsers carry only the selected image across the transition in 280ms; the page itself does not fade. The selected artwork is brought into view before the transition and receives keyboard focus. Direct page loads retain the editorial hero at the top.
- Reduced motion removes translation, zoom, entrance/mask/brush animations and shared-image travel. Brief colour feedback remains. A live switch to reduced motion immediately exposes pending content. Keyboard focus exposes a pending action immediately.
- Browsers without IntersectionObserver leave content visible. Unsupported View Transitions, modified clicks and JavaScript-free browsing retain ordinary links to the existing detail pages.

## Acceptance criteria

- The hero becomes still after its introduction, and revealed sections do not replay on scrolling away and back.
- Hover/focus responds without shifting service text, moving navigation labels or changing layout dimensions.
- Gallery selection preserves the selected image, URL, destination focus and a working fallback; only one source and one destination image share the transition name.
- All five pages retain their responsive layouts without horizontal scrolling at 320, 390, 640, 700, 900 and 1440px.
- Reduced motion works both on initial load and when changed during browsing, without hiding artwork or controls.
- Keyboard and touch navigation work, and JavaScript-free content remains readable.
- Focused browser tests, unit tests, static prerender verification and `bun run build` pass.

## Scope

CSS handles feedback and animation; a small IntersectionObserver hook handles one-time homepage entrances, and TanStack Router's progressive View Transition support handles existing gallery navigation. No animation dependency, parallax, scroll-jacking, continuous motion, autoplay carousel, invented vector signature, or contact form is added. Existing gallery detail pages and their content/navigation are preserved. The single testimonial and existing email/phone contact flow stay still.

## Verification

`apps/laura-faichney-web/tests/e2e/motion.spec.ts` and `gallery-motion.spec.ts` cover interaction feedback, hero settling, one-time reveals, selected-image transition snapshots, reduced motion including live changes, browser API fallbacks, keyboard, touch and JavaScript-free browsing. Existing responsive tests continue to cover all five routes. Set `LAURA_PLAYWRIGHT_PORT` to a free port when another worktree is running browser tests; set `CI=1` to require a fresh preview server.

Implementation references: [MDN: startViewTransition](https://developer.mozilla.org/en-US/docs/Web/API/Document/startViewTransition) and [MDN: Intersection Observer](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) (accessed 2026-10-01).
