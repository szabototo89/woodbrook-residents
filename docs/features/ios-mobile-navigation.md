# iOS mobile navigation and live content

Status: Available

## Job to be done

When I use Woodbrook Residents on an iPhone, I want to browse the same current resident information as the website, so I can stay informed, follow local change, organise around confirmed dates, and act through official channels.

## User-visible behavior

- A persistent, horizontally scrollable navigation bar opens Updates, Projects, Events, Consultations, Local information, and Ways to help; the Woodbrook identity returns home.
- Each collection shows the same purpose, public records, summaries, and source-backed content semantics as the corresponding website section.
- Tapping a record opens its detail view with the applicable dates, location, stage, next step, contact details, collection schedule, official source, and source review date.
- Local information supports text search, category filtering, and an out-of-hours-only filter, and retains the website's directory disclaimer.
- The app fetches a validated public content snapshot from `/api/mobile-content` at runtime. Loading, offline, empty, no-match, and missing-detail states are explicit.
- When the content API cannot be reached, the app stays usable: navigation and empty sections remain available with an offline notice and a "Try again" control that requests a new snapshot.
- Ways to help remains read-only and explains how to suggest a correction, check events, and follow projects. Public submissions are not introduced.

## Acceptance criteria

- Given the mobile app launches with network access, when its first screen loads, then it requests the configured Woodbrook origin's `GET /api/mobile-content` endpoint instead of using a bundled content snapshot.
- Given the endpoint receives a GET request, when Google Sheets is available, then it reads and validates the current published snapshot server-side without exposing service-account credentials.
- Given a resident selects any current collection and then a record, when navigation completes, then the matching list and detail content are visible with its official source and review date.
- Given local information is loaded, when search, category, or out-of-hours filters are applied, then the visible contacts and count update to match.
- Given runtime loading fails, when the offline notice appears, then the app keeps navigation and empty sections usable, and a retry makes a new request and recovers when content is available.
- Given quality checks run, when tests complete, then mobile statements, branches, functions, and lines each reach at least 90%, strict TypeScript passes, Prettier passes, and the web and mobile builds succeed.

## Scope

### Included

- Runtime Google Sheets-backed content through a public read-only web/Worker endpoint.
- Native in-app home, collection, detail, local directory, and ways-to-help screens.
- The existing Updates, Projects, Events, Consultations, and Local information records and fields.
- Loading, offline-notice with retry, empty, no-match, and missing-detail handling.

### Not included

- Accounts, issue reporting, comments, forums, chat, private messaging, marketplace listings, social feeds, or public content submission.
- Editing Google Sheets from the mobile app.
- Android packaging or a standalone production iOS host application.
