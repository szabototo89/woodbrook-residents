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
