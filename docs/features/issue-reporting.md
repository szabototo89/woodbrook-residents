# Issue reporting

Status: In progress

## Job to be done

When I notice a local maintenance or safety problem, I want to submit a structured report, so the community team can understand, triage, and route it.

## User-visible behavior

- Residents choose a category and provide a location and useful detail.
- Name and email are optional; consent is required before submission.
- A successful submission shows a receipt message.
- Submitted reports are never publicly readable.

## Acceptance criteria

- Given valid required fields and consent, when a resident submits a report, then it is stored in Strapi and a success state is shown.
- Given missing or invalid required fields, when a resident submits, then accessible validation guidance is shown and nothing is sent.
- Given a public API caller, when they request issue reports, then no list or record can be read.

## Scope

### Included

- Lighting, litter, drainage, roads and paths, landscaping, traffic, and other issue categories.
- Optional contact details and a private triage state.

### Not included

- Emergency reporting, automatic council ticket creation, public issue maps, resident accounts, or status notifications.
