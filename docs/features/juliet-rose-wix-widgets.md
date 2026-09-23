# Juliet Rose Wix widget library

Status: In progress

## Job to be done

When assembling the Juliet Rose site in Wix Studio, add either a focused,
editable section or a complete page-sized building block without rebuilding
the approved design one element at a time.

## Visible behavior

- Wix Studio exposes sixteen Juliet Rose custom widgets.
- Every widget card in the Studio selector shows a full-width preview of the
  real Juliet Rose component instead of the generated placeholder icon.
- Default treatment photos and decorative images load inside Wix Studio widgets
  without requiring matching files on the Wix site's `/images` route.
- Focused widgets cover the homepage hero, category grid, featured treatments,
  treatment catalog, treatment guidance, gift-card callout, visit details,
  booking policy, booking journey, treatments hero, and full gift-card page.
- `JR Studio Sections` combines the gift-card callout, visit details, and
  booking policy into one configurable block.
- `JR Complete Home Page` combines the hero, category grid, featured
  treatments, and studio sections into one configurable block.
- `JR Complete Treatments` combines the treatments hero, live catalog, and
  treatment guidance into one configurable block.
- Shared route, contact, image, and service settings flow from each aggregate
  widget to its child sections.
- Treatment widgets show safe sample content in the Editor and load treatment
  names, categories, prices, durations, and featured status from the Wix CMS
  Treatments collection in Preview and Site modes. Booking availability still
  comes from Wix Bookings.
- `JR Site Header` supplies the Juliet Rose top-bar menu (brand, Main
  navigation, booking action, and mobile navigation) as an opt-in page
  widget, and `JR Site Footer` supplies the matching footer chrome the
  same way.

## Composition model

| Building block         | Reused focused components                                                                       |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| JR Studio Sections     | Gift Card, Visit Us, Booking Policy                                                             |
| JR Complete Home Page  | Hero, Category Grid, Featured Grid, Studio Sections                                             |
| JR Complete Treatments | Treatment Hero, Treatment Catalog, Treatment Guidance                                           |
| JR Booking Journey     | Booking hero, treatment picker, date and time selection, customer details, summary, reassurance |

## Acceptance criteria

- Every widget has a unique CLI-generated extension ID, an Editor settings
  panel, a stretchable preset, and opt-in installation.
- Every preset thumbnail is a distinct, non-blank 1000 by 400 PNG captured
  from its corresponding component fixture.
- The treatments hero and full gift-card page preserve the visible content and
  accessible heading/link structure of the standalone Juliet Rose web app.
- Focused widgets remain independently installable after aggregate widgets are
  added.
- Aggregate widgets render the same focused React components rather than copied
  markup.
- Kebab-case Studio properties map to camel-case React props at each custom
  element boundary.
- Editor mode never calls the live treatment catalog; Preview and Site modes
  load treatments from the Wix CMS with the site's injected access token.
- Default widget images render in the Editor and are embedded in the Wix widget
  bundle; configured image URLs may still override the defaults. Blank image
  settings fall back to the embedded photo.
- Unit tests, strict TypeScript checks, the Wix build, and the repository build
  pass before this capability is marked `Available`.

## Scope

This capability supplies page content widgets and settings panels, including
opt-in `JR Site Header` and `JR Site Footer` page widgets that expose the
Juliet Rose top-bar menu and footer chrome through the Studio Add panel.
Custom-element extensions install onto pages rather than into Wix's global
theme chrome, so the site-wide theme header/footer, SEO settings, page
creation, Bookings service configuration, schedules, staff, payment setup,
and custom media uploads remain Wix Studio or Wix Dashboard
responsibilities.
