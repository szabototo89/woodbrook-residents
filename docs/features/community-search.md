# Community search

Status: Available

## Job to be done

When I need information about a local topic, I want to search the community hub in one place so I can find the relevant update, project, event or service and open its details.

## Visible behavior

- `/search` is available from the shared desktop header and mobile navigation.
- A Back link returns home. The page displays a search field, query-aware result count, clear control and filters with counts in this order: All, Services, Updates, Projects, Events. Services are immediately beside All.
- Search submits with Enter or the search icon. The query and selected category are recorded in the URL, restored on reload, and follow browser back/forward navigation.
- Results match every search word, without case sensitivity, across titles, summaries, full editorial text, relevant categories, provider names and service details. Filter counts refer to the complete matching set; the heading counts the displayed results.
- Updates include published consultations. Consultation badges reflect the published stage. Project badges reflect the published stage, and event badges distinguish upcoming and past events.
- Cards show existing photographs when available, otherwise a category icon. They include the title, summary, content type, source/date or event date/time/location, and link to the existing detail page.
- Blank searches invite a query; unmatched queries and empty categories offer specific guidance. Content outages show an availability notice and a retry link. Route loading has an accessible status.
- Phone layouts have horizontally scrollable category filters. The page uses the root layout’s existing header, mobile menu, footer and cookie controls with their shared appearance. There is no separate bottom navigation.
- Headings and result titles inherit the site’s Newsreader font and heading weight; body copy and controls inherit Inter. Search uses the shared text and brand color tokens, with sizes adapted to the compact results layout.

## Acceptance criteria

- Query submission, clearing, category counts, URL persistence, history navigation, canonical result links and empty states are verified with behavior tests.
- Controls have accessible names, selected filters expose their state, results have linked headings, status changes are announced and focus remains usable after clearing.
- Cards and controls remain usable at desktop and phone sizes without page overflow. Playwright verifies interactions, confirms shared header/footer consistency, and captures high-resolution desktop and mobile screenshots including the shared chrome.
- Search uses the same published content snapshot as the rest of the hub, without collection-list truncation or invented factual content.
- Focused tests, repository checks and `bun run build` pass before this capability is marked Available.
- Saved query/filter URLs hydrate the static build without browser errors. A static-mode hydration regression runs as part of the web unit-test command.

## Scope

Search includes published updates, consultations, projects, events and local services from the configured Strapi, Google Sheets or Sanity source. It does not search private submissions. Search is a local text match over public content; it does not provide typo correction, semantic ranking, external web search or a new CMS content model. Queries are limited to 120 characters. The supplied UI reference guides layout and styling; its historical example facts are not seeded.
