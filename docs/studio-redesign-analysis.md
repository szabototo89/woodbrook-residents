# Studio redesign analysis: web style, data usage, editor footguns

Date: 2026-09-28. Source of truth: `apps/web` on `main` (+ subagent inventories verified against the files below). Sanity project `ca34quae`, dataset `production`.

## 1. Visual language of apps/web (what the Studio should echo)

Active styles live in `apps/web/src/styles.css` (three stacked `:root` blocks; the last block at lines 2351+ wins). `docs/design-system.md` describes an older intent (Atlantic `#145E63`, Atkinson font) that the code no longer uses — do not copy the doc, copy the code.

- **Fonts** (`styles.css:1-2`, `2394-2415`): headings `Newsreader Variable` serif, weight 480, tight letter-spacing (`h1` up to `clamp(3.7rem,7vw,6.8rem)`); body/UI/nav/buttons in `Inter Variable`. Article long-form body is Newsreader (`2967-2969`); everything else (summaries, meta, buttons, captions, source notes) is Inter.
- **Palette** (`styles.css:2353-2382`): paper background `#f8f5ed`, ink text `#274038`, forest primary `#416b58`, sun accent `#f2db88`, sage `#cdddc9` (pills/tags), sea-glass `#e4efed` (source notes), white cards `#fffdf8` on subtle green-tinted shadows. Status pills: open/active = sage, closed/completed = granite `#d8dcd5`, upcoming/consultation = gorse-soft `#f8edc6`.
- **Shape**: 28px card radius, pill buttons/tags (`999px`), 22px card grids, 78px header with `W` brand mark + "Woodbrook Residents / Community hub · Shankill" wordmark (`AppHeader.tsx`), ink footer with sun-yellow headings (`AppFooter.tsx`).
- **Card anatomy** (all in `apps/web/src/components/` + `features/resources/`): image (optional, updates/projects only) → meta row (tag pill + date) → title link → summary → one action link. Detail pages share one shell: meta → `h1` → summary deck → body → `aside.source-note` ("Source and freshness" + checked date + outbound source link). Every public fact ends at a source note — provenance is part of the visual language.
- **Site IA** (header nav, `AppHeader.tsx`): Updates, Events, Projects, Consultations, Local information, Get involved. The Studio desk should mirror exactly these six.

## 2. Route → field map (condensed)

Full inventory: homepage slices first 3 updates/projects (ignores `featured`), upcoming events sorted `startsAt` ASC (featured-first only for the hero pick), 1 survey; list pages render card fields; detail pages render everything plus source note; `/local-info` filters featured-only highlights + searchable directory; `/get-involved` uses only `siteSetting.contactEmail`; `/api/mobile-content` serves the whole snapshot. Sitemap lastmod uses `publishedOn` / `updatedOn` / `startsAt` / `closesOn ?? opensOn` / `sourceReviewedOn`; JSON-LD per detail route (Article, Event, GovernmentOffice).

## 3. Field criticality table

"Load-bearing" = empty/malformed value breaks a page (verified 2026-09-28: `sourceReviewedOn: ""` on projects crashed the homepage with `Invalid time value`).

| Field                                            | Surfaces where                                                                         | If empty/malformed                                                                        |
| ------------------------------------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `title`                                          | Every card, detail `h1`, SEO/JSON-LD                                                   | Blank headings everywhere; SEO degrades                                                   |
| `slug`                                           | All card links, detail routes, ICS filenames, sitemap                                  | Links 404; blank slugs dropped from sitemap/ICS                                           |
| `kind` / `category` / `stage` / `providerType`   | Tag pills, status colors, directory filters, search                                    | Unknown value fails snapshot validation → build stops                                     |
| `summary`                                        | Every card + detail deck + meta description                                            | Blank cards; SEO description degrades                                                     |
| `body` / `details`                               | Detail pages (split on `\n`)                                                           | Blank article body                                                                        |
| `publishedOn`, `updatedOn`, `startsAt`           | Cards, detail headers, ordering, sitemap, JSON-LD                                      | `formatDate` throws `Invalid time value` → error boundary ("Something went wrong!")       |
| `endsAt`, `opensOn`, `closesOn`                  | Detail facts, survey card ("Closes…"), calendar                                        | Same crash when rendered; safe only when absent (`undefined`), never `""`                 |
| `sourceName` / `sourceUrl` / `sourceReviewedOn`  | Every source note, `ProjectCard` "Reviewed …", ICS `DTSTAMP`/`URL`, event CTA fallback | Crash (`sourceReviewedOn`) or dead provenance links; `bookingUrl ?? sourceUrl` CTA breaks |
| `location` (event)                               | Event meta, Google Maps link, JSON-LD place, ICS `LOCATION`                            | Broken maps link, invalid event structured data                                           |
| `imagePath` / `imageAlt` / `imageCredit`(+`Url`) | Update/project cards + detail figures, Article JSON-LD image                           | Missing image is fine (optional); credit without URL renders nothing                      |
| `featured`                                       | Home hero-event pick, local highlights (`featured`-only)                               | Wrong/missing homepage highlights; silently ignored on updates/projects lists             |
| `relatedProjectId` (survey)                      | Fetched but never rendered (dead field)                                                | No breakage; do not surface prominently                                                   |
| `details[]` (`showOnCard`)                       | Directory cards (filtered), detail facts, SEO address                                  | `Address` label is magic: drives Maps links + GovernmentOffice JSON-LD                    |
| `collectionDates[]`                              | Waste highlight facts, collection schedule, `<time dateTime>`                          | Past-only dates drop the highlight silently                                               |
| `nextStep`                                       | Project detail "What happens next" callout                                             | Hidden when absent — safe                                                                 |
| `contactEmail` (siteSetting)                     | Get-involved correction mailto                                                         | Falls back to "corrections are not open yet"                                              |
| `displayOrder`                                   | Directory ordering                                                                     | Defaults to 100 in code; missing is safe                                                  |
| Issue-report fields                              | Never listed publicly (create-only)                                                    | Must stay unlisted in Studio queries and previews                                         |

Two schema quirks editors must know: `nextStep`, `opensOn`, `closesOn` are required by the Sheets importer but optional at render; `relatedProjectId` is render-dead. Studio help text must say so.

## 4. Top-5 editor footguns (each observed or one edit away from a real outage)

1. **Empty date string (`""`) in any date field.** zod `dateString` now rejects it at validation, but if it ever reaches render, `formatDate` throws and the whole page shows "Something went wrong!" (homepage outage 2026-09-28 via `ProjectCard` "Reviewed …"). Studio fix: required dates, no empty strings, validation message naming the crash.
2. **Clearing `sourceUrl` / `sourceReviewedOn`.** Every detail page ends in a source note; `ProjectCard` prints "Reviewed …"; events fall back to it for the CTA and ICS. Fix: required + help text ("Shown under 'Source and freshness' on the public page").
3. **Editing a `slug` after publishing.** All card links, sitemap, ICS filenames, and calendar UIDs derive from it; old URLs 404 with no redirect. Fix: help text warning ("Changing this breaks existing links").
4. **Unchecking `featured` on all events / misunderstanding it.** Homepage hero prefers a featured upcoming event; local highlights show _only_ featured resources. Updates/projects lists ignore it entirely (a common misconception). Fix: help text per type stating exactly what featuring does.
5. **Renaming the `Address` detail label.** SEO address, Maps links, and meta descriptions key off the literal label `Address`. Fix: help text on detail rows + a dedicated address affordance if added later.

## 5. Current Studio gaps (verified)

- Zero field-level `description`s in `apps/sanity-studio/schemaTypes/*.ts` (only type-level) → editors see bare labels with no subtitles. Every field needs a plain-language subtitle written for non-technical editors (what it is, where residents see it, what breaks without it).
- Desk is the default type list; does not mirror site IA, no editorial filtered lists (featured, missing source data, past events).
- Previews are default (title-only); editors cannot see the card residents will see.
- No fieldsets; fields in schema order, not render-priority order.
- Studio title is "Woodbrook Residents" (fine) but no logo/branding echoing the web identity (Newsreader/Inter, forest/ink/sun).
- Validation messages are generic (`required`); they must name the site breakage, consistent with `contentSchemas` strictness (`dateString` rejects `""` and unparseable input since `ce87c85`).
