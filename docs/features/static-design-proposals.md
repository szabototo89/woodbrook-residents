# Static design proposals

Status: Available

## Job to be done

When I want to pitch a website redesign or compare directions, I want a simple
gallery of high-fidelity static concepts, so I can share and review the idea
without creating a production application.

## User-visible behavior

- A standalone welcome screen lists every available website proposal.
- Each proposal opens as an independent static website concept.
- The first proposal presents a persuasive redesign direction for The Dog Salon
  in Bray, including services, proof, care positioning, FAQs, location, and an
  appointment-request experience.
- A second, visually independent proposal presents Spotless Dog Grooming as a
  precise, qualification-led Shankill business rather than repeating the warm,
  boutique Dog Salon direction.
- A review-led alternative presents Spotless as a warm neighbourhood groomer,
  reflecting recurring public feedback about Stephanie's friendliness,
  professionalism, attentive advice, trusted handling, and relaxed dogs.
- The Spotless proposal includes an in-app research document covering the source
  audit, current design signals, rationale, production checklist, dated sources,
  and explicit points requiring owner confirmation.
- A discreet proposal layer explains which production inputs still require the
  business owner's confirmation.
- The Dog Salon concept uses sourced business details and licensed concept
  photography instead of invented local facts or outcomes.
- The concepts adapt for desktop and mobile review.
- The appointment form demonstrates the intended interaction without sending or
  storing personal information.

## Acceptance criteria

- Given the proposal server is running, when a reviewer opens its root URL, then
  an independent welcome screen links to The Dog Salon concept.
- Given a reviewer opens The Dog Salon concept, when the first viewport appears,
  then the salon identity, one-to-one value proposition, phone number, primary
  navigation, appointment action, and professional grooming imagery are visible.
- Given a reviewer scans the concept, when they reach services, then inclusions,
  durations, published prices, and appointment actions are easy to compare.
- Given a reviewer uses a narrow screen, when they open navigation, then the main
  destinations remain usable and a persistent appointment action remains visible.
- Given a reviewer submits the concept form, when validation succeeds, then the
  page confirms the demonstration without transmitting or retaining the entered
  information.
- Given a reviewer opens proposal notes or sources, when they inspect caveats,
  then production dependencies and source URLs are explicit.
- Given a reviewer opens the Spotless concept, when they compare it with The Dog
  Salon, then the palette, typography, composition, positioning, and imagery are
  materially distinct.
- Given a reviewer follows the Spotless research link, when the document opens,
  then the existing-site findings, current design research, dated sources, and
  design decisions are readable inside the proposal app.
- Given a reviewer compares the two Spotless directions, when they read the
  review research, then the warm direction is clearly identified as the closer
  fit for the public customer sentiment.

## Scope

### Included

- Plain HTML, CSS, and browser JavaScript under `apps/design-proposals`.
- A proposal-gallery landing page, The Dog Salon concept, two distinct Spotless
  Dog Grooming directions, and a shared research document.
- Local review through `bun run dev:proposals`.

### Not included

- Production forms, data storage, analytics, CMS integration,
  verified client photography, or final legal copy.
- Hosting itself is specified separately in
  `docs/features/design-proposal-hosting.md`.
