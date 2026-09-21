# Juliet Rose → Wix custom widgets: research

Scope: analysis only. No code changed in `apps/juliet-rose-web`.
Agreed decisions (2026-09-21): drop TanStack, use a native date input,
use Wix Bookings for all booking behaviour.

## 1. Wix widget model (custom element site widgets via Wix CLI)

- Build with the Wix CLI: `wix generate --params` with
  `extensionType: CUSTOM_ELEMENT`. `folder` must be a valid custom-element
  tag name (lowercase, starts with a letter, contains at least one hyphen).
- Each widget scaffolds 4 files plus the `src/extensions.ts` registration:

| File                  | Purpose                                                                                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `<name>.tsx`          | Widget logic — class extending `HTMLElement`, default-exported. Wix calls `customElements.define()` for you; do NOT call it.                                             |
| `<name>.panel.tsx`    | Settings panel React component shown in the Editor sidebar.                                                                                                              |
| `<name>.module.css`   | CSS Modules stylesheet with `.root` class and design-token custom properties. Style here or inline; do not import other global CSS.                                      |
| `<name>.extension.ts` | Builder file: UUID `id`, `name` (max 30 chars), `tagName`, sizing defaults, `installation`, `presets[]` with `thumbnailUrl`. Edit only for sizing, auto-add, or presets. |

- Two widget implementation patterns exist: native class (CLI default,
  render via `this.innerHTML`, lifecycle `connectedCallback` /
  `disconnectedCallback` / `attributeChangedCallback` with static
  `observedAttributes`) and React function component via
  `react-to-webcomponent` (props in the `props` option, JSX render, hooks
  for effects). Prefer the **React pattern** for Juliet Rose — the source
  is already React 19, so components port with minimal rewrites.
- Props naming: **kebab-case** on both sides of the widget/panel boundary
  (`observedAttributes`, `getAttribute`, `widget.getProp`/`setProp`);
  local TS variables stay `camelCase`. (`react-to-webcomponent` maps
  kebab-case attributes to camelCase React props automatically.)
- Settings panel stack: `@wix/design-system` components inside
  `WixDesignSystemProvider > SidePanel > SidePanel.Content`; property sync
  via `widget` from `@wix/editor` (`getProp` on load, `setProp` in
  onChange handlers, updating local state AND the widget prop). Colour
  pickers use `inputs.selectColor()` + `FillPreview`; font pickers use
  `inputs.selectFont()` (values stored as JSON strings).
- Wix SDK in widgets: `createClient` from `@wix/sdk` with
  `site.host()` / `site.auth()` plus `auth.getAccessTokenInjector()`;
  business modules (`@wix/bookings`, `@wix/data`, `@wix/redirects`,
  `@wix/site-window`, `@wix/editor`).
- Do NOT use Blocks site widgets: deprecated path, no Wix Harmony support,
  requires visual rebuild + Velo rewrite.

## 2. Current app inventory (`apps/juliet-rose-web/src`)

| File                                                           | Export                                                                                                                                                                         | Props / state                                                                                                                              | Deps, data, links                                                                                                                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `components/SiteHeader.tsx`                                    | `SiteHeader`, `toActiveNavigationItem(pathname)`                                                                                                                               | `activeNavigationItem?: '/' \| '/treatments'`; `isMenuOpen` + `body.menu-open` toggle, Escape closes                                       | Plain `<a href>`; `BOOKING_URL`; links `/`, `/treatments`, `/#gift-cards`, `/#contact`, `/book`                                                                                    |
| `components/SiteFooter.tsx`                                    | `SiteFooter`                                                                                                                                                                   | None (static)                                                                                                                              | Plain anchors + `instagram.com/juliet_rose_beauty_`                                                                                                                                |
| `components/EditorialPageHero.tsx`                             | `EditorialPageHero`, `EditorialPageHeroHighlight{title,description,Icon}`                                                                                                      | `eyebrow`, `title: ReactNode`, `description`, `scriptLines:[string,...]`, `highlights:[x3]`; no state                                      | `lucide-react:LucideIcon`; presentational only                                                                                                                                     |
| `features/home/HeroSection.tsx`                                | `HeroSection`                                                                                                                                                                  | None (static)                                                                                                                              | `BOOKING_URL`; links `/book`, `/treatments`, `#booking-policy`; `/images/facial-hero*.jpg` with `srcSet/sizes`, `fetchPriority=high`                                               |
| `features/home/StudioSections.tsx`                             | `StudioSections`                                                                                                                                                               | None (static)                                                                                                                              | `GIFT_CARD_URL` (external); `tel:+353852867059`, `mailto:denizzza1@gmail.com`, `#booking-policy`; `/images/studio-interior.jpg`                                                    |
| `features/home/TreatmentSectionLink.tsx`                       | `TreatmentSectionLink`                                                                                                                                                         | None (static)                                                                                                                              | Link `/treatments`                                                                                                                                                                 |
| `features/home/TreatmentSections.tsx`                          | `TreatmentSections`                                                                                                                                                            | Static, maps over content                                                                                                                  | Category anchors `/treatments#facials-and-skin\|#massage\|#beauty-essentials\|#packages`; `/book?service={slug}`; per-category images                                              |
| `features/home/JulietRoseHomePage.tsx`                         | `JulietRoseHomePage`                                                                                                                                                           | Composes Hero + Treatments + Studio + sticky mobile booking link                                                                           | Link `BOOKING_URL (/book)`                                                                                                                                                         |
| `features/home/content.ts`                                     | `BOOKING_URL='/book'`, `GIFT_CARD_URL`, `treatmentCategories[4]`, `featuredTreatments[4]`                                                                                      | Derives name/duration/price via `requireTreatmentBySlug`                                                                                   | Featured slugs: `juliet-rose-signature-facial`, `microneedling`, `deep-hydration-6-step-facial`, `swedish-massage`                                                                 |
| `features/treatments/TreatmentHero.tsx`                        | `TreatmentHero`                                                                                                                                                                | Static (`treatmentHighlights[3]`)                                                                                                          | `lucide: Flower2,Heart,Leaf` + `EditorialPageHero`; script `Relax/and/Rejuvenate`                                                                                                  |
| `features/treatments/TreatmentListPage.tsx`                    | `TreatmentListPage`                                                                                                                                                            | Static list                                                                                                                                | `listTreatments()`; categories Massage, Facials & skin, Beauty essentials, Packages                                                                                                |
| `features/treatments/TreatmentCategoryCard.tsx`                | `TreatmentCategoryCard`                                                                                                                                                        | `{category, treatments}`; derives `id, description, Icon` from `treatmentCategoryPresentation`                                             | Renders `<ul><TreatmentRow/></ul>` + count label                                                                                                                                   |
| `features/treatments/TreatmentRow.tsx`                         | `TreatmentRow`                                                                                                                                                                 | `{treatment}`                                                                                                                              | `formatTreatmentDuration`; link `/book?service={slug}` (`aria-label=Book {name}`); price `€{priceCents/100}`                                                                       |
| `features/treatments/TreatmentGuidance.tsx`                    | `TreatmentGuidance`                                                                                                                                                            | Static                                                                                                                                     | `lucide: ArrowRight,Sprout`; link `/#contact`                                                                                                                                      |
| `features/treatments/treatmentCatalog.ts`                      | `listTreatments, getTreatmentBySlug, requireTreatmentBySlug, formatTreatmentDuration, toTreatment/Category`; `TREATMENT_SOURCE_URL`, `TREATMENT_SOURCE_ACCESSED_AT=2026-09-19` | In-memory from `treatments.json`                                                                                                           | `zod` validation; source `julietrosebeauty.com/book-online`                                                                                                                        |
| `features/treatments/treatmentData.ts`                         | Same API as `treatmentCatalog.ts` (duplicate)                                                                                                                                  | Same                                                                                                                                       | Hand-rolled guards, no `zod`; used by `home/content.ts` — deduplicate on port                                                                                                      |
| `features/booking/BookingPage.tsx`                             | `BookingPage`                                                                                                                                                                  | `{initialTreatmentSlug?, today?}`; creates `createLocalBookingProvider()` singleton                                                        | Wraps `BookingJourney`                                                                                                                                                             |
| `features/booking/BookingJourney.tsx`                          | `BookingJourney`                                                                                                                                                               | `{initialTreatmentSlug?, provider, today?}`; state `treatmentSlug, date\|undef, time, times[], confirmation?`; resets downstream on change | `date-fns:format`; `provider.listAvailableTimes/createBooking`; confirmation `role=status` with reference; editorial images `/images/gift-card.jpg`, `/images/studio-interior.jpg` |
| `features/booking/TreatmentPicker.tsx`                         | `TreatmentPicker`                                                                                                                                                              | `{treatments, value, onChange}` controlled `<select>`                                                                                      | Option label `{name} — €{price/100}`; empty "Choose a treatment"                                                                                                                   |
| `features/booking/AppointmentDatePicker.tsx`                   | `AppointmentDatePicker`                                                                                                                                                        | `{selected\|undef, onSelect, today?}`                                                                                                      | `date-fns:addMonths`, `enIE` locale, `react-day-picker` DayPicker; 6-month window; `isBookableDate`                                                                                |
| `features/booking/TimeSlotPicker.tsx`                          | `TimeSlotPicker`                                                                                                                                                               | `{times[], value, onChange}` radio-group; empty state "Choose a date…"                                                                     | No deps; keep `radiogroup` semantics                                                                                                                                               |
| `features/booking/CustomerDetailsForm.tsx`                     | `CustomerDetailsForm`, `CustomerDetails{name,email,phone,notes}`                                                                                                               | `{disabled?, onSubmit}`; TanStack Form `isSubmitting`, per-field errors                                                                    | Rules: name non-empty, `/^\S+@\S+\.\S+$/`, phone len≥7; consent checkbox unenforced; submit "Request appointment"                                                                  |
| `features/booking/BookingSidebar.tsx`                          | `BookingSidebar`                                                                                                                                                               | `{treatment\|undef, date\|undef, time}` read-only                                                                                          | `lucide` icons; fallbacks "Choose…/Not selected"; "request, not confirmed" note                                                                                                    |
| `features/booking/BookingHero.tsx`                             | `BookingHero`                                                                                                                                                                  | Static highlights (Sparkles/CalendarDays/CircleCheck)                                                                                      | Title "Request an appointment"; script `Relax/Restore/Rejuvenate`                                                                                                                  |
| `features/booking/BookingReassurance.tsx`                      | `BookingReassurance`                                                                                                                                                           | Static list of 3                                                                                                                           | `lucide: Flower2,Heart,Leaf` trust strip                                                                                                                                           |
| `features/booking/bookingProvider.ts`                          | `BookingProvider{listAvailableTimes, createBooking}` interface; `BookingConfirmation{reference,status:'requested'}`                                                            | Contract only                                                                                                                              | Keep `requested`-not-confirmed semantics in replacement backend                                                                                                                    |
| `features/booking/localBookingProvider.ts`                     | `createLocalBookingProvider()`                                                                                                                                                 | Stateless stub                                                                                                                             | Ref format `JR-{YYYYMMDD}-{HHMM}` — demo only, must NOT port as-is                                                                                                                 |
| `features/booking/availability.ts`                             | `isBookableDate`, `createDailySlots`, `formatBookingDate`                                                                                                                      | Pure                                                                                                                                       | `date-fns`; Mon–Fri 10:00–20:00; naive slot packing (ignores real conflicts); display `EEEE, d MMMM yyyy`                                                                          |
| `app/RootDocument.tsx`                                         | `RootDocument{children}`                                                                                                                                                       | Router-derived `pathname` for header state                                                                                                 | `useRouterState,HeadContent,Scripts`; skip-link `#main-content`; `lang=en-IE`                                                                                                      |
| `app/siteMetadata.ts`                                          | `resolveSiteUrl`, `createPageHead`; `PRODUCTION_SITE_URL`, `SITE_NAME`                                                                                                         | Pure; reads `VITE_PUBLIC_SITE_URL`                                                                                                         | Builds title/desc/canonical/OG/Twitter (`en_IE`) → Wix SEO panel per page                                                                                                          |
| `routes/__root.tsx`                                            | `createRootRoute` shell                                                                                                                                                        | `charset/viewport/theme-color #fbf8f4`, `/favicon.svg`, `NotFoundPage`                                                                     | → Wix theme styles + favicon + 404 page                                                                                                                                            |
| `routes/index.tsx`, `routes/treatments.tsx`, `routes/book.tsx` | File routes → page components                                                                                                                                                  | `book.tsx`: `validateSearch{service?}`, `loader{today}` for SSR parity                                                                     | → Wix pages `/`, `/treatments`, `/book`; keep `?service=` preselect                                                                                                                |

## 3. Proposed widget map (grouped, not 1:1 files)

| #   | Widget (tag)         | Source components                                                                                                                                            | Panel props (kebab-case)                                                                                                                                                                                                           |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | `jr-hero`            | `EditorialPageHero`, `HeroSection`, `TreatmentHero`, `BookingHero`                                                                                           | `eyebrow, title, description, script-lines (JSON), highlights (JSON)`, icon choice. Replace Lucide with inline SVG. Re-upload hero images to Wix Media.                                                                            |
| 2   | `jr-treatment-cards` | `TreatmentSections`, `TreatmentSectionLink`, `TreatmentListPage`, `TreatmentCategoryCard`, `TreatmentRow`, `TreatmentGuidance`                               | `category-filter, show-prices, show-book-buttons`. Preserve category anchors and `/book?service={slug}` links.                                                                                                                     |
| 3   | `jr-studio-sections` | `StudioSections`                                                                                                                                             | `gift-card-url, phone, email`. External gift URL, `tel:`/`mailto:`, `#booking-policy` stay plain links.                                                                                                                            |
| 4   | `jr-booking-journey` | `BookingJourney`, `BookingPage`, `TreatmentPicker`, `AppointmentDatePicker`, `TimeSlotPicker`, `CustomerDetailsForm`, `BookingSidebar`, `BookingReassurance` | `initial-service, today-override`. 4-step state (treatment→date→time→details + `status` confirmation). See §5.                                                                                                                     |
| —   | Not widgets          | `SiteHeader`, `SiteFooter`, `RootDocument`, `routes/__root`                                                                                                  | Map to Wix theme header/footer, global styles, favicon, 404 page. CLI `installation.staticContainer` only supports `HOMEPAGE`; header/footer widgets cannot auto-install there. Sticky mobile Book CTA = native Wix pinned button. |

## 4. Dropped / replaced dependencies

| Current                                                                 | Replacement                                                                                                                                                               |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@tanstack/react-router` (routes, `?service=` loader, `today` snapshot) | Wix pages `/`, `/treatments`, `/book`; widget reads query string for `initial-service`; client date replaces `today` snapshot                                             |
| `@tanstack/react-form` (`CustomerDetailsForm`)                          | Wix Forms inputs + Velo validation (same 3 rules: name non-empty, email regex, phone ≥7)                                                                                  |
| `react-day-picker` (`AppointmentDatePicker`, 6-month window)            | Native `<input type="date">` inside the custom element (`min=today`, `max=+6mo`, `en-IE`); Mon–Fri disable stays as a hint — Bookings availability is the source of truth |
| `date-fns`                                                              | Velo date helpers + `Intl` formatting                                                                                                                                     |
| `lucide-react`                                                          | Inline SVG / Wix icons                                                                                                                                                    |
| `zod` (`treatmentCatalog.ts`)                                           | Not needed — Wix collection schema enforces shape; deduplicate `treatmentCatalog.ts` vs `treatmentData.ts` into one source                                                |
| Per-file `.css`                                                         | Per-widget `.module.css` (no global CSS imports in custom elements)                                                                                                       |
| `localBookingProvider` (`JR-{date}-{time}` stub)                        | Deleted — replaced by Wix Bookings backend (see §5)                                                                                                                       |

## 5. Booking via Wix Bookings (agreed)

Prerequisites: Bookings app installed; one Bookings service (type
`APPOINTMENT`) per treatment slug, each with schedule, staff/resources,
booking policy; payment provider connected if paid.

Standard single-service flow, mapped to current components:

1. **Service list** (`TreatmentPicker`): `services.queryServices()` from
   `@wix/bookings`; render name/price; keep empty "Choose a treatment"
   option and `?service=` preselect.
2. **Availability** (`AppointmentDatePicker` + `TimeSlotPicker`):
   `availabilityTimeSlots.listAvailabilityTimeSlots({serviceId,
fromLocalDate, toLocalDate, bookable: true, timeZone})` (local datetime
   strings, not UTC). Display returned slots as radio pills; keep
   `radiogroup` semantics and "Choose a date…" empty state. Current
   `availability.ts` slot math (`floor(600/duration)` from 10:00) is
   deleted — it ignores real conflicts.
3. **Details** (`CustomerDetailsForm`): collect name/email/phone/notes
   (same validation), then `bookings.createBooking()` with the selected
   `serviceId`, `scheduleId`, `localStartDate`/`localEndDate`, resource
   id, and location.
4. **Checkout/confirm** (`BookingSidebar` + confirmation view): for paid
   services create an eCom cart/checkout and redirect via
   `redirects.createRedirectSession({bookingsCheckout})`; keep the
   `role=status` confirmation pattern and the "request, not confirmed"
   note until payment/confirmation completes.
5. Business rules carried over: weekday-only, today-inclusive,
   10:00–20:00 Mon–Fri becomes Bookings schedule/policy config;
   `EEEE, d MMMM yyyy` display via `Intl` (`en-IE`).

Custom-element auth: `createClient({host: site.host(),
auth: site.auth(), modules: {services, availabilityTimeSlots, bookings,
redirects}})` + `auth.getAccessTokenInjector()` in the constructor.

## 6. Editor vs live (agreed: branch, not same mode)

`viewMode()` from `@wix/site-window` returns `Editor` (sandboxed: Wix API
calls blocked, no `localStorage`/cookies/same-origin access),
`Preview` (unsandboxed, real APIs), or `Site` (live, real APIs).

- Running the same fetch path everywhere fails in `Editor`: empty
  results + noisy errors, widget looks broken to the site owner.
- Required pattern, even for MVP: `if viewMode === 'Editor'` render a
  static/mock preview (sample treatment + sample slots, disabled Book
  button) with zero SDK/storage calls; else run the real SDK path.
  `Preview` already exercises the real path without publishing, so
  nothing is lost by branching.
- "Same mode" is acceptable only for static widgets (`jr-hero`,
  `jr-studio-sections`). `jr-treatment-cards` and `jr-booking-journey`
  must branch (Data API in `Editor` must render a placeholder instead of
  fetching).

## 7. Content / URL / SEO contracts to preserve

- Pages/routes: `/`, `/treatments`, `/book?service={slug}`;
  anchors `#gift-cards`, `#contact`, `#booking-policy`; category hashes
  (`#facials-and-skin`, `#massage`, `#beauty-essentials`, `#packages`).
- Treatments content model: `slug, name, category (enum x4),
durationMinutes, priceCents, sourceUrl`; helper
  `formatTreatmentDuration` (`<60 min` vs `X hr Y min`). Featured slugs
  (see `content.ts` inventory) must keep working as `?service=` values —
  map them to Bookings service IDs.
- `siteMetadata.ts` titles/descriptions/canonicals/OG (`en_IE`) → Wix SEO
  panel per page; preserve copy for parity.
- Images (`facial-hero*.jpg` with `srcSet`, `studio-interior.jpg`,
  `gift-card.jpg`) re-uploaded to Wix Media with responsive variants;
  keep `fetchPriority=high` equivalent on hero.
- Accessibility: `radiogroup` time slots, `role=status` confirmation,
  `aria-label=Book {name}`, skip-link `#main-content`, `lang=en-IE`.

## 8. Risks and open questions

1. Bookings service setup (schedules, staff, policies, payment) is the
   critical path — widget code cannot start meaningfully before service
   IDs exist.
2. Slug→service-ID mapping: needs a lookup (collection field or settings
   prop) so old `/book?service=` links keep working.
3. Editor mock data must be clearly fake to avoid confusion with real
   availability.
4. Iframe sandbox: single bundled JS, HTTPS only, no `localStorage`
   reliance in `Editor`.
5. Confirm free vs paid flow: "request, not confirmed" note vs immediate
   eCom checkout per service.

## 9. Suggested build order

1. `jr-hero` (static, proves CLI scaffold → panel → deploy loop).
2. `jr-treatment-cards` (Data/Bookings `queryServices` + Editor
   placeholder pattern).
3. `jr-studio-sections` (static).
4. `jr-booking-journey` (availability → booking → checkout).
5. Theme chrome (header/footer/SEO/404), URL-contract verification.

## Sources

- Wix docs: "About Site Widget Extensions", "Build a Site Widget in
  Blocks", "About Widget Code in Blocks", "About Custom Elements in
  Blocks", "Add a Blocks Site Widget Extension in the CLI", "Custom
  Element Extension Files and Code", "Add a Custom Element Extension with
  the Wix CLI", "Add Self-Managed Site Widget Extensions with Custom
  Elements", "Create a Settings Panel for a Site Widget or Plugin",
  "Authenticate Custom Elements Using the Wix Client", "Handle Sandboxing
  in the Editor", `siteWindow.viewMode()`.
- Wix skills repo: `skills/wix-app/references/CUSTOM_ELEMENT_WIDGET.md`.
- Wix API/SDK: Bookings end-to-end single-service flow
  (`services.queryServices`,
  `availabilityTimeSlots.listAvailabilityTimeSlots`,
  `bookings.createBooking`, `redirects.createRedirectSession`),
  Bookings quick-start tutorial, "Book a Hike" coding example.
