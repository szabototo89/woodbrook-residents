# Juliet Rose Wix widgets

Wix custom-element site widgets for Juliet Rose Beauty Studio, ported from
`apps/juliet-rose-web`. See `docs/juliet-rose-wix-widgets-research.md` for the
full migration analysis.

## Structure

`src/site/widgets/<tag>/` holds one widget per folder, following the Wix CLI
custom-element layout (`<name>.tsx`, `<name>.panel.tsx`, `<name>.module.css`,
`<name>.extension.ts`).

## Conventions

- React components use a single `props` parameter and one component per file.
- Widget/panel boundary props are kebab-case; local variables stay camelCase.
- Data-driven widgets render mock preview content when
  `viewMode() === 'Editor'` and call Wix SDKs only in Preview/Site.
- No TanStack, no `react-day-picker`, no `zod`. Booking state comes from
  Wix Bookings.

## Verification

```bash
bun run --cwd apps/juliet-rose-wix test:unit
bun run --cwd apps/juliet-rose-wix typecheck
```

## Visual review

React Cosmos fixtures live next to each widget (`*.fixture.tsx`) and run
with Editor preview data, so every widget renders without Wix credentials:

```bash
bun run dev:juliet-rose-wix
```

This opens the Cosmos playground with one fixture per widget
(`JrHero`, `JrStudioSections`, `JrTreatmentCards` in all/home/catalog
displays, `JrBookingJourney` default and preselected). Imagery resolves
from `../juliet-rose-web/public` for local review only; Wix Media URLs
replace those paths at install time.
