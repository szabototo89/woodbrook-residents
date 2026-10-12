# Public content search

Status: Available

## Job to be done

When I know what I am looking for, I want to search all published Woodbrook
information from one field so that I can reach the relevant detail page quickly.

## Visible behavior

- Search accepts up to 120 characters and preserves the query in the URL.
- Results match all query words, ignoring case, across titles, summaries and
  collection labels for updates, projects, events, consultations and services.
- Each result links to its canonical public detail page.
- Blank queries, missing matches and source outages have clear messages.

## Acceptance criteria

- A search for Woodbrook finds updates, projects and consultations.
- A search for pharmacy finds a service and reaches its detail page.
- Submit buttons and Enter both work.
- Search indexes the complete published snapshot from the selected content
  adapter, including the existing Google Sheets workbook.
- Drafts, private notes, issue submissions and credentials are never indexed.
- Unit and Playwright checks pass; static search works with query parameters.

## Scope

Read-only public-content search and header/home search forms. No full-text body
search, fuzzy ranking, workbook edits, private-content access or external search.
