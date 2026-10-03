# Laura's editorial motion

Status: Available

## Job to be done

As a visitor exploring Laura's artwork and services, I want the paintings to hold my attention, a few motion details that feel handmade, and clear feedback when I choose a service, artwork or contact action.

## Visible behavior

The artwork, copy and controls are visible by default. Motion is a progressive enhancement under `prefers-reduced-motion: no-preference`.

| Motion                        | Desktop    | Phone (up to 640px)                                 |
| ----------------------------- | ---------- | --------------------------------------------------- |
| Press feedback                | 120ms      | 120ms                                               |
| Card, arrow and link feedback | 160ms      | Colour/press feedback; no persistent hover movement |
| Gallery image feedback        | 220ms      | No hover zoom                                       |
| Headline entrance             | 260ms, 8px | 220ms, 4px                                          |
| Composition entrance          | 360ms, 8px | 300ms, 4px                                          |
| Page / gallery transition     | 240ms      | 240ms                                               |
| Signature paint               | 620ms      | 500ms; mural uses a simple fade                     |
| Service stagger               | 60ms       | 35ms                                                |

Three shared easing curves cover entrances (`0.22, 1, 0.36, 1`), UI changes (`0.4, 0, 0.2, 1`) and exits (`0.4, 0, 1, 1`).

- The homepage heading settles once as a complete heading. Its existing gold paint stroke draws from left to right underneath it, starting after 90ms. The portrait settles once in 360ms, starting at 92% opacity so its first frame is already visible. Eyebrow, paragraphs, CTA and individual heading lines remain immediately available without their own entrances.
- Homepage scroll triggers fall from nine to three: the service group, mural artwork and About composition. The service heading stays static; its cards share one visibility trigger and short stagger. Keyboard focus exposes the whole pending group immediately.
- Desktop mural artwork uncovers once through an irregular SVG brush edge over 620ms. Its heading, copy and enquiry link stay visible throughout. After completion the mask is removed; scrolling away and returning does not replay the reveal. Unsupported masks and phones receive a simple fade.
- About's homepage preview enters as one composition. On subpages only the hero artwork settles from 92% opacity; headings, descriptive text and controls stay still. About's sketchbook, palette and brushes are one existing raster artwork, so they enter together. Values and story remain static.
- Service cards and service enquiry rows subtly change background/colour. On mouse hover or keyboard focus, their images move 2px and arrows move 4px in 160ms; the cards and text do not lift or scale. Services retain their complete enquiry links and service query parameters.
- Gallery collection covers zoom to 1.025 within their frames over 220ms, and caption arrows move 4px. Keyboard focus gets equivalent feedback. Picture thumbnails keep their restrained 1.02 zoom. Buttons darken and give 120ms press feedback; CTA arrows move without lifting the button.
- Desktop navigation uses a fine underline and colour feedback. Mobile navigation retains its static current-page indicator and closes when a page is selected.
- Ordinary internal page links progressively crossfade the main content over 240ms using the View Transition API. Header and footer remain stationary; destination main content receives focus without interrupting scroll restoration. Hash links, external links, downloads, modified clicks and unsupported/reduced-motion browsers retain native navigation.
- Existing collection links carry the cover image into the enlarged first picture on `/gallery/SLUG`; picture selection carries the selected thumbnail into the viewer. Supporting browsers use 240ms shared-image transitions. Picture Previous/Next controls crossfade in place, preserve the URL and retain control focus. Artwork selection preserves its existing selected-thumbnail indicator and destination focus.
- Gallery previews, testimonial, contact copy, decorative artwork and footer have no automatic scroll animation. There are no looping animations.
- Reduced motion removes all entrances, brush/mask reveals, translation, zoom and view transitions. Brief colour feedback remains. A live switch immediately exposes pending content and stops travel. Browsers without IntersectionObserver and JavaScript-free browsing retain readable content and ordinary links.

## Feedback review

The supplied review is a direction for the motion hierarchy, rather than a requirement to animate every row of its proposed section table.

| Feedback                          | Decision                                                                                                       |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 1. Stop default element entrances | Replace nine independent scroll targets with three compositions; remove staged hero copy.                      |
| 2. Identifiable artist signature  | Animate the existing gold hero stroke; share the left-to-right paint language with the mural.                  |
| 3. Strongest moment at the mural  | Replace the rectangular wipe with a one-shot irregular SVG brush mask. Keep the copy readable.                 |
| 4. Avoid scrollytelling           | Keep ordinary scrolling; no pinned, horizontal, scrubbed or parallax sections.                                 |
| 5. Prefer reactive motion         | Concentrate feedback on links, services, artwork and controls.                                                 |
| 6. Consistent service feedback    | Add arrows on enquiry rows, 2px image movement, 4px arrow movement and subtle background changes.              |
| 7. Gallery discovery              | Add caption arrows and 1.025 cover zoom inside the existing image frames.                                      |
| 8. Typography only once           | Introduce the homepage heading as one unit; no letter, line or navigation choreography.                        |
| 9. Calmer About page              | One artwork composition entrance; static copy, values and story. Preserve the existing combined illustration.  |
| 10. Remove loops                  | Audit found no existing loops; retain zero looping animations.                                                 |
| 11. Page continuity               | Add a progressive 240ms main-content crossfade; preserve existing gallery image continuity.                    |
| 12. Systematic tokens             | Use shared duration, distance, stagger and three easing tokens.                                                |
| 13. Less stagger                  | Only service cards stagger: 60ms desktop / 35ms phone.                                                         |
| 14. Small travel                  | 8px desktop / 4px phone entrances; 2px service images and 4px arrows.                                          |
| 15. Calmer mobile                 | Shorter durations/stagger/travel, simpler mural fade, hover restricted to fine pointers.                       |
| 16. Reduced motion                | Static default plus no-preference enhancements; initial and live preference changes covered.                   |
| 17. Performance                   | Routine motion uses opacity/transform. The rare mural effect animates an SVG mask; it never runs continuously. |

## Acceptance criteria

- The hero is still after its introduction, and revealed sections do not replay on scrolling away and back.
- Only three homepage compositions are observed; services reveal as a group with static headings.
- The mural's irregular paint reveal never delays reading or using its enquiry link and leaves no mask after completion.
- Hover/focus feedback preserves service text, navigation labels, card dimensions and responsive image frames.
- Gallery selection preserves selected images, URLs, destination focus and native fallbacks; one source and one destination image share the artwork transition name.
- Ordinary page navigation crossfades main content, preserves enquiry parameters, closes the phone menu and exposes the destination to keyboard users.
- All pages remain readable without horizontal overflow at existing tested viewport sizes from 320px to 1440px.
- Initial and live reduced-motion preferences reveal all artwork/controls without travel, zoom, brush animation or page transitions.
- Keyboard, touch, API fallback and JavaScript-free browsing retain usable content and links.
- Laura unit/browser tests, static prerender verification and the repository's `bun run build` pass.

## Scope

CSS handles feedback, composition entrances and the reusable local SVG brush mask. The existing IntersectionObserver hook handles one-shot homepage triggers. Small navigation hooks progressively enhance ordinary page links and existing gallery selections without adding an animation dependency. Existing copy, CMS content, artwork, enquiry destinations and collection routes are preserved.

No new artwork, individual-letter animation, scroll-jacking, parallax, pinned section, horizontal scrollytelling, autoplay or persistent decoration is introduced. A testimonial fade and per-object About choreography were deliberately left out to preserve the quieter hierarchy and the existing composite artwork.

## Verification

Verified 2026-10-03 with the current main changes: 101 Laura browser tests and 57 unit tests pass. Static prerender verification checks nine public HTML files and every generated internal link. The full repository `bun run build` passes. Desktop (1440px), phone (390px), service and mural screenshots were inspected. New motion expectations were first run against the previous implementation: nine browser assertions and the gallery-caption unit assertion failed before the corresponding changes; the page-navigation tests also exposed missing page snapshots and destination focus before implementation.

Regression coverage is in `apps/laura-faichney-web/tests/e2e/motion.spec.ts`, `gallery-motion.spec.ts` and `page-motion.spec.ts`, alongside existing layout, contact and gallery tests.

Implementation references (accessed 2026-10-02): [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API), [W3C: Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html), and [Webflow: 2026 design trends](https://webflow.com/blog/web-design-trends-2026). The review's central idea—brand-specific expressive moments with restrained routine motion—fits the existing artwork; trend claims are not a substitute for browser and accessibility checks.

The cancelled-scroll recovery check waits for native scrolling to settle before starting the next swipe, keeping its existing selection assertions.

Browser verification used an isolated preview on port 4196 because the default port 4176 was occupied. Published artwork interception retained working image access on that port.
