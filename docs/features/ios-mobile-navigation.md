# iOS mobile navigation and live content

Status: Available

## Job to be done

When I use Woodbrook Residents on an iPhone, I want to browse the same current resident information as the website, so I can stay informed, follow local change, organise around confirmed dates, and act through official channels.

## User-visible behavior

- A slim brand header identifies Woodbrook Residents; tapping it returns home.
- A persistent bottom tab bar switches the top-level sections Home, Updates, Events, Local, and More, and always marks the selected tab.
- The More screen opens Projects, Consultations, and Ways to help; open consultations are also surfaced from Home and Updates.
- Each collection shows the same purpose, public records, summaries, and source-backed content semantics as the corresponding website section.
- Collection pages lead with one featured record and list the rest as lightweight divider rows so more fits on a phone screen.
- Tapping a record opens its detail view with the applicable dates, location, stage, next step, contact details, collection schedule, official source, and source review date.
- Back controls return through visited screens instead of jumping to a fixed parent.
- Local information supports text search, category filtering, and an out-of-hours-only filter, keeps those filters when returning from a contact, and retains the website's directory disclaimer.
- Booking, response, source, phone, email, and website actions are tappable buttons that open the official destination; source and action rows show a short host name instead of a full URL.
- The app fetches a validated public content snapshot from `/api/mobile-content` at runtime. Loading shows skeleton placeholders, and offline, empty, no-match, and missing-detail states are explicit.
- If loading takes longer than 12 seconds, the app offers the same offline notice and retry instead of hanging on a spinner.
- When the content API cannot be reached, the app stays usable: navigation and empty sections remain available with an offline notice and a "Try again" control that requests a new snapshot.
- Ways to help explains that community contributions are coming soon, offers a tappable community contact, and navigates to live events, projects, and consultations sections. Public submissions are not introduced.

## Acceptance criteria

- Given the mobile app launches with network access, when its first screen loads, then it requests the configured Woodbrook origin's `GET /api/mobile-content` endpoint instead of using a bundled content snapshot.
- Given the endpoint receives a GET request, when Google Sheets is available, then it reads and validates the current published snapshot server-side without exposing service-account credentials.
- Given a resident selects any current collection and then a record, when navigation completes, then the matching list and detail content are visible with its official source and review date.
- Given a resident opens a record and then goes back, when the previous screen renders, then the resident returns to the visited list with its state preserved.
- Given local information is loaded, when search, category, or out-of-hours filters are applied and a contact is opened and then closed, then the visible contacts and count still match the applied filters.
- Given the bottom tab bar is visible, when the resident switches sections, then the selected tab is marked and any drill-in history resets to the section root.
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
