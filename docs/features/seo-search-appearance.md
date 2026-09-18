# Search appearance for Woodbrook residents

Status: Available

## Job to be done

When Woodbrook pages appear in Google, I want correct brand, clean snippet, and rich structure, so residents recognise and trust results.

## Visible behavior

- Homepage emits `WebSite` + `Organization` JSON-LD with name `Woodbrook Residents`, canonical URL, and logo (`/favicon-48.png`, `/apple-touch-icon.png`).
- Favicon served as SVG plus PNG 48px and Apple 180px; header links declare `sizes`.
- Detail pages (`updates`, `events`, `projects`, `surveys`, `local-info`) emit `BreadcrumbList` JSON-LD: Home › Section › Detail.
- Project pages emit `Article`-style structured data from title/summary/dates; survey pages emit structured data from title/summary/open/close; local-info pages emit `LocalBusiness`-style data with telephone/address from loaded resource only.
- Local-info meta description composes `description` + phone/address to 120-155 chars with sentence punctuation, preventing `5900Visit` concatenation.
- 404 page emits `noindex`; `/concepts/*` serves `noindex` (static HTML meta) and sitemap excludes them; `robots.txt` allows `/` but disallows `/concepts/`, templated from site URL.
- `public/robots.txt` is a template, final file generated with correct origin.

## Acceptance criteria

- Given homepage head, then JSON-LD graph contains `WebSite` name and `Organization` logo absolute URL.
- Given `/favicon-48.png`, then 200 PNG; given root head, then icon links include SVG + PNG 48 + Apple 180.
- Given detail slug resolves, then head JSON-LD includes `BreadcrumbList` with 3 items and correct absolute URLs.
- Given project/survey/resource resolves, then respective structured data present; given unavailable, then none.
- Given Garda resource (short description + phone + address), then composed description length 120-155, ends with period, contains phone with spaces.
- Given 404, then `robots=noindex`; given `/concepts/*`, then noindex present and robots disallows.
- Given invalid site URL, then canonical/sitemap/robots fall back to production origin.

## Scope

### Included

- `seoFiles.ts`, `seoStructuredData.ts`, `siteMetadata.ts`, `SiteStructuredData`, route heads, icons, robots/sitemap, 404/concepts noindex, tests, docs.

### Not included

- Custom-domain migration, Search Console submission, ranking guarantees, content edits in Sheets/Strapi.
