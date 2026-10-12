# Responsive coastal homepage

Status: Available

## Job to be done

When I visit the Woodbrook Residents site on a phone or computer, I want to
quickly find relevant local news, dates, projects and practical services, so I
can stay informed and decide where to go next.

## Visible behavior

- An ivory, forest-green and soft-yellow design uses the site's Newsreader and
  Inter fonts on one shared typography scale, with Lucide icons.
- The homepage starts with a sourced coastal photograph, a clear headline,
  working public-content search and primary section shortcuts, including a direct Trades & services link to
  the directory filtered to trades.
- Phones show a compact branded header with an accessible dismissible menu,
  two-column shortcuts, one latest update, a featured upcoming event and four
  everyday-service tiles. There is no fixed bottom navigation.
- Computers show horizontal navigation and search, a wide hero, three updates
  beside the featured event, six service shortcuts, and published project and
  consultation panels alongside contact guidance.
- A generated coastal annotation, header wordmark and standalone neighbourhood
  logo are image assets. Seasonal event artwork is illustrative. Documentary photography retains its source credit.
- Content comes from the existing Google Sheets workbook through the existing
  read-only adapter. Only rows marked for publication appear; unpublished notes
  and service-account credentials remain private.
- Search finds titles and summaries across published updates, projects, events,
  consultations and services, and links to their canonical detail pages.
- Empty collections and source outages have clear visible states. Past events
  do not appear as upcoming. Spreadsheet all-day dates do not display an
  invented midnight time. No fictitious councillors or reference events are
  seeded.

## Acceptance criteria

1. At 390px, the header, hero, search, shortcut grid, latest update, event and
   services appear in the reference order without horizontal overflow.
2. At 1440px, updates and event align in adjacent columns; all six services
   appear in one row. The lower panels use actual available content.
3. At 320, 390, 768, 1024 and 1440px, content remains within the viewport and
   the search action stays usable.
4. The mobile header menu opens and closes, dismisses outside and on Escape,
   restores focus after Escape, and closes when a destination is followed.
5. Search works with submit and Enter, preserves query text in the URL, handles
   no matches, and reaches public detail pages. It never indexes submissions.
6. Home and listing cards share heading font family, heading size and body size.
7. The generated assets load at desktop and mobile sizes; the brand's home link
   has the accessible name Woodbrook Residents.
8. A Google Sheets static build validates the published content and generated
   internal links; unit/browser/E2E checks and `bun run build` pass.
9. High-resolution Playwright screenshots of both viewports are reviewed and
   delivered using published spreadsheet content.

## Scope

Homepage composition, shared navigation and typography, generated branding
assets, public search, responsive checks and documentation. Existing routes,
content adapters and detail actions remain supported. No workbook edits,
councillor content model, issue-submission access, social features or deployment.
