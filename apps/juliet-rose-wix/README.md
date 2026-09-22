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
(`Hero`, `GiftCard`, `VisitUs`, `BookingPolicy`, `CategoryGrid`,
`FeaturedGrid`, `TreatmentCatalog`, `TreatmentGuidance`, `BookingJourney`
default and preselected). Imagery resolves
from `../juliet-rose-web/public` for local review only; Wix Media URLs
replace those paths at install time.

## CSS parity

`bun run --cwd apps/juliet-rose-wix css:parity` compares computed styles of
the original site against widget fixtures at identical CSS widths (needs
the original dev server on `:3003` plus Cosmos on `:5005`/`:5054`).
Text widths allow 8px for font shaping across DOM contexts; image widths
allow 20px for the Cosmos renderer body margin. Anything else fails.

## Deploy to Wix (reusable app)

The deployable app lives at `apps/juliet-rose-app` in this monorepo
(scaffolded 2026-09-22, appId `db3d875b-8e5c-40d3-b509-622ab612ec51`,
namespace `@szabototo89/juliet-rose-app`). It is a Wix CLI app whose nine
`CUSTOM_ELEMENT` site widget extensions are wired from
`apps/juliet-rose-wix` sources. Direction is one-way: the scaffold keeps its
own `wix.config.json`, dashboard-registered extension UUIDs, and
`package-lock.json`; nothing account-specific flows back into
`apps/juliet-rose-wix`.

```bash
# 1. Authenticate (token lands in ~/.wix, shared across runners)
npx -y @wix/cli@1.1.247 login
npx -y @wix/cli@1.1.247 whoami  # szabototo89@gmail.com

# 2. Scaffold (interactive; basic app; namespace must not contain "wix")
cd ~/Development && npm create @wix/new@latest app
# app: Juliet Rose Widgets, folder: juliet-rose-app,
# namespace: juliet-rose-app (accepted as @szabototo89/juliet-rose-app)

# 3. Register one extension per widget (non-interactive)
npm run generate -- --params '{"extensionType":"CUSTOM_ELEMENT","name":"<tag>"}'

# 4. Wire implementations: copy components, panels, styles, and shared
#    data modules over the generated templates, keeping the CLI-generated
#    extension/preset UUIDs and rewriting manifest paths to
#    ./extensions/site/widgets/<tag>/. Extension manifests must stay in the
#    scaffold's `export default extensions.customElement({...})` shape —
#    plain objects crash `wix build` in isBaseExtension.

# 5. Build, then cut a preview version
npm install
npm run build    # wix build
npm run preview  # prints Editor + Dashboard installer links
```

Test-site checklist (Bookings app installed, one `APPOINTMENT` service per
treatment with the researched slug as its custom slug):

- Editor shows mock preview content for all 9 widgets, no SDK errors.
- Preview/published: TreatmentCatalog lists live services; BookingJourney
  loads real slots, creates a booking, and redirects paid bookings to Wix
  checkout.
- Panel edits (view-all links, slugs, contact details, featured slugs)
  apply live in Preview.
- `#booking-policy` anchor reveals the policy widget; `?service=` slugs
  preselect the journey.
