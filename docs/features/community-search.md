# Community search

Status: Available

## Job to be done

When I need information about a local topic, I want to search the community hub in one place so I can find the relevant update, project, event or service and open its details.

## Visible behavior

- `/search` is available from the shared desktop header and mobile navigation.
- The page displays a search field, query-aware result count, clear control and filters with counts in this order: All, Services, Updates, Projects, Events. Services are immediately beside All. Navigation uses the shared header; the search page has no Back control.
- Search submits with Enter or the search icon. The query and selected category are recorded in the URL, restored on reload, and follow browser back/forward navigation.
- Results match every search word, without case sensitivity, across titles, summaries, full editorial text, relevant categories, provider names and service details. Filter counts refer to the complete matching set; the heading counts the displayed results.
- Updates include published consultations. Results reuse the existing update, consultation, project, event and local-service cards, with their normal photographs, stages, dates, summaries, details links and service contact actions.
- Blank searches invite a query; unmatched queries and empty categories offer specific guidance. Content outages show an availability notice and a retry link. Route loading has an accessible status.
- Phone layouts have horizontally scrollable category filters. The page uses the root layout’s existing header, mobile menu, footer and cookie controls with their shared appearance. There is no separate bottom navigation.
- The page uses the shared PageIntro, section/shell layout, card grid and EmptyState components. Its SearchField is shared with the local-services directory, and filters reuse the directory controls. There is no search-specific stylesheet or separate typography scale.

## Acceptance criteria

- Query submission, clearing, category counts, URL persistence, history navigation, canonical result links and empty states are verified with behavior tests.
- Controls have accessible names, selected filters expose their state, results have linked headings, status changes are announced and focus remains usable after clearing.
- Cards and controls remain usable at desktop and phone sizes without page overflow. Playwright verifies interactions, compares heading and card font sizes, colors, weights and line heights with the updates page, and captures high-resolution desktop and mobile screenshots including shared chrome.
- Search uses the same published content snapshot as the rest of the hub, without collection-list truncation or invented factual content.
- Focused tests, repository checks and `bun run build` pass before this capability is marked Available.
- Saved query/filter URLs hydrate the static build without browser errors. A static-mode hydration regression runs as part of the web unit-test command.

## Scope

Search includes published updates, consultations, projects, events and local services from the configured Google Sheets or Sanity source. It does not search private submissions. Search is a local text match over public content; it does not provide typo correction, semantic ranking, external web search or a new CMS content model. Queries are limited to 120 characters. The supplied UI reference guides layout and styling; its historical example facts are not seeded.
