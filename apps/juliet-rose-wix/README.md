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

Prerequisites: a Wix account plus either an interactive browser login or a
Wix API key (Dev Center → API keys). This repo has no Wix credentials; every
command below that touches Wix Cloud fails without them.

```bash
# 1. Authenticate (interactive browser flow, or headless with a key)
npx -y @wix/cli@1.1.247 login
# headless alternative — never commit the key:
wix login --api-key "$WIX_API_KEY"
wix whoami  # expect your Wix account email

# 2. Scaffold the deployable app shell (requires login; creates the
#    dashboard-linked app that hosts the widget extensions)
npm create @wix/app@0.0.252 -- --app-name juliet-rose-deploy
# app names: 1–30 chars, must not contain "wix"

# 3. Copy src/site/widgets/*, src/site/treatments/*, and
#    src/site/extensions.ts into the scaffolded app's src/, keeping the
#    per-widget folder layout (<tag>/<tag>.tsx, .panel.tsx, .module.css,
#    .extension.ts), then install and build from the scaffold:
npm install
wix app build

# 4. Install the preview version on a Wix test site from the site
#    Dashboard → Apps → Custom apps, then verify each widget.
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
