# iOS mobile home

Status: Available

## Job to be done

When I open Woodbrook Residents on an iPhone, I want the same clear starting point as the public website in a native mobile interface, so I can understand the hub and the ways it will help me stay informed, organise, and act.

## User-visible behavior

- The iOS-focused ReactLynx screen identifies itself as Woodbrook Residents with Community hub · Shankill as supporting context.
- The screen states that it provides local information and ways to take part.
- The current four homepage starting points appear in a single, touch-friendly mobile sequence and navigate to their mobile sections.
- The current Ways to help panel appears after the starting points.
- The existing Woodbrook coastal image is bundled with accessible descriptive text and its existing source attribution.
- Content is presented in a vertically scrollable layout sized for a phone.

## Acceptance criteria

- Given a resident opens the Lynx bundle on iOS, when the home screen renders, then the Woodbrook Residents identity, Shankill context, purpose statement, and four current starting points are visible.
- Given a resident uses assistive technology, when the coastal image and starting-point cards receive focus, then descriptive image text and button traits describe them.
- Given the mobile test suite runs, when coverage is calculated, then statements, branches, functions, and lines each meet or exceed 90%.
- Given the mobile app is built, when Rspeedy completes, then it emits an iOS-consumable `woodbrook.lynx.bundle`.

## Scope

### Included

- ReactLynx, React, and TypeScript project setup under `apps/mobile`.
- A native, vertically scrollable rendering of the current Woodbrook homepage hierarchy and visual language.
- The four existing homepage destinations as accessible navigation cards.
- iOS Simulator development through Lynx Explorer.
- Prettier, strict TypeScript, rendered component tests, and a 90% coverage gate.

### Not included

- Mobile-only features beyond the existing resident-facing web capabilities.
- Accounts, issue reporting, comments, forums, chat, private messaging, marketplace listings, or a social feed.
- Android packaging or a standalone production iOS host application.
