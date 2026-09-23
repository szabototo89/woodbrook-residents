# Wix settings panels UX

Status: Available

## Job to be done

When configuring a Juliet Rose widget in Wix Studio, change its content,
links, and imagery through a grouped Settings panel with clear labels and
inline help, instead of guessing at a flat list of bare text fields.

## Visible behavior

- Every widget Settings panel opens with a title naming the widget, e.g.
  “Hero settings”, and a one-line subtitle describing what it controls.
- Fields are grouped into sections — Content, Links, Contact, Brand, Hero
  content, Featured treatments, Scheduling, Media — separated by dividers.
- Every field has a plain-language label and inline help text, e.g. the
  booking link explains that buttons append `?service=<slug>`.
- Long copy (descriptions, addresses, policy summaries) edits in
  multi-line areas instead of single-line inputs.
- The header “Active page” offers a closed choice (Automatic, Home,
  Treatments) instead of a free-text path.
- Slug fields show the expected format with an example placeholder
  (`swedish-massage, microneedling`); phone/email links state the required
  `tel:`/`mailto:` prefix.
- While properties load, the panel shows “Loading settings…”. A load
  failure shows an error message instead of silently blank fields.
- Shared link, contact, image, and view-all definitions keep labels and
  help identical across all sixteen panels.

## Acceptance criteria

- All sixteen `*.panel.tsx` files render through one shared
  `SettingsPanel` kit (`panelFields`, `usePanelProps`, `PanelFieldInput`,
  `sharedFields`); the old `TextSettingsPanel` shim is removed.
- `panel-contracts.test.tsx` renders every panel and asserts its title,
  one editable control per declared key, and help text of at least ten
  characters per field.
- Editor-facing props are reduced: the test-only `today` override no
  longer appears in the booking-journey panel, and the raw
  `image-src-set` syntax no longer appears in the hero panel. Both
  element attributes keep working if already set.
- Kebab-case Studio properties still map to camel-case React props;
  every `data-hook` used by existing panel tests is unchanged.
- Panels and the shared kit are mirrored to `apps/juliet-rose-app`
  (`src/extensions/site/`), keeping the CLI-generated extension UUIDs.
- `bun run --cwd apps/juliet-rose-wix test:unit` (195 tests),
  `typecheck`, and the repository pre-commit lint pass.

## Scope

This capability covers Settings panel presentation and shared panel
definitions. Widget rendering, the custom-element prop surface itself,
Bookings wiring, and Wix Media uploads are unchanged. A future pass may
replace slug text fields with live pickers once Bookings-backed option
lists are available in panels.
