# iOS mobile home

Status: Available

## Job to be done

When I open Woodbrook Residents on an iPhone, I want the same clear starting point as the public website in a native mobile interface, so I can understand the hub and the ways it will help me stay informed, organise, and act.

## User-visible behavior

- The iOS-focused ReactLynx screen identifies itself as Woodbrook Residents with Community hub · Shankill as supporting context.
- A compact hero states that it provides local information and ways to take part, with a single supporting sentence.
- The screen surfaces live content first: the latest update, the next event, nearby essentials, and the current open consultation, each opening its detail view. Empty sections stay hidden.
- A browse list links to all five sections — Updates, Projects, Events, Consultations, and Local information — followed by the Ways to help panel.
- The existing Woodbrook coastal image is bundled with accessible descriptive text and its existing source attribution.
- Content is presented in a vertically scrollable layout sized for a phone.

## Acceptance criteria

- Given a resident opens the Lynx bundle on iOS, when the home screen renders, then the Woodbrook Residents identity, Shankill context, purpose statement, live content sections, and browse list are visible.
- Given a resident uses assistive technology, when the coastal image and starting-point cards receive focus, then descriptive image text and button traits describe them.
- Given the mobile test suite runs, when coverage is calculated, then statements, branches, functions, and lines each meet or exceed 90%.
- Given the mobile app is built, when Rspeedy completes, then it emits an iOS-consumable `woodbrook.lynx.bundle`.

## Scope

### Included

- ReactLynx, React, and TypeScript project setup under `apps/mobile`.
- A native, vertically scrollable rendering of the current Woodbrook homepage hierarchy and visual language.
- Content-first home sections (latest, upcoming, nearby, have-your-say) plus a browse list covering all five sections.
- iOS Simulator development through Lynx Explorer.
- Prettier, strict TypeScript, rendered component tests, and a 90% coverage gate.

### Not included

- Mobile-only features beyond the existing resident-facing web capabilities.
- Accounts, issue reporting, comments, forums, chat, private messaging, marketplace listings, or a social feed.
- Android packaging or a standalone production iOS host application.
