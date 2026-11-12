# Flexible published content

Status: Available

## Job to be done

When publishing community content, I want incomplete dates and new categories to
keep the website build working and keep every published record accessible.

## Visible behavior

- Known categories accept surrounding whitespace and different letter case.
- Unknown update, project and resource categories and provider types show as Other.
- Missing or unparseable dates show Date unavailable. No factual date is invented.
- Undated news follows dated news in both sort directions.
- Undated events appear under Dates to be confirmed and keep their detail pages.
- Calendar actions and files require an event start date; the event itself remains visible.
- Missing source review dates are stated explicitly. News without a source URL has no source link.
- Build warnings name the document and fields that use fallback values.
- The mobile reader uses Date unavailable for empty dates from the shared endpoint.

## Acceptance criteria

- The complete five-collection Sanity snapshot retains incomplete records.
- Empty, null, missing, wrongly typed and unparseable dates normalize consistently.
- Available dates keep Dublin display formatting and chronological sorting.
- Page rendering, static prerendering, calendar generation and SEO tolerate unavailable dates.
- Invalid stages, waste streams, duplicate identities and broken project relations still fail validation.
- API, authentication, JSON and envelope errors still fail instead of returning replacement content.

## Scope

Included: normalization and date consumers in apps/web, its shared read-only mobile
endpoint, and mobile date-format compatibility. Excluded: CMS mutations, date
inference, stage or waste stream guessing, schema migration and mobile redesign.
