# iOS mobile navigation and live content

Status: Available

## Job to be done

When I use Woodbrook Residents on an iPhone, I want to browse the same current resident information as the website, so I can stay informed, follow local change, organise around confirmed dates, and act through official channels.

## User-visible behavior

- A compact brand header identifies Woodbrook Residents; tapping it returns home. Home and collections show the full brand with subtitle, while detail screens use a 20–30% smaller header without the subtitle.
- A persistent bottom tab bar switches the top-level sections Home, Updates, Events, Local, and More with simple line icons plus labels, and always marks the selected tab with a pale-green pill behind the icon .
- The More screen uses compact navigation rows with chevrons for Projects, Consultations, and Ways to help; open consultations are also surfaced from Home and Updates.
- Each collection shows the same purpose, public records, summaries, and source-backed content semantics as the corresponding website section, with 20–30% tighter back-link, eyebrow, and page-intro spacing.
- Collection pages match the reference alignment: Updates shows filter chips and uniform thumbnail rows with chevron circles; Events shows an Upcoming/Past segmented control and image cards with date badges; Local information shows a rounded search field, filter chips and icon rows with chevron circles.
- Tapping a record opens its detail view with a back link, status pill, fact rows with icons, primary official-site action and source note, plus the applicable dates, location, stage, next step, contact details, collection schedule, official source, and source review date.
- Back controls return through visited screens instead of jumping to a fixed parent.
- Home shows a real image caption (“Woodbrook and the Shankill coastline”), tap chevrons on cards, and explicit “View all updates/events/consultations →” section links.
- Local information supports text search, horizontally scrollable category chips, and an out-of-hours-only filter, keeps those filters when returning from a contact, retains the website's directory disclaimer, and guarantees 100px bottom scroll padding above the tab bar.
- Contact details are explicit mobile actions: Call phone, Email address, Get directions (Maps), and Visit website with an external-link indicator; source and action rows show a short host name instead of a full URL.
- The official source row shows an external-link indicator and uses Checked (not Verified) with the review date.
- The app fetches a validated public content snapshot from `/api/mobile-content` at runtime. Loading shows skeleton placeholders, and offline, empty, no-match, and missing-detail states are explicit.
- If loading takes longer than 12 seconds, the app offers the same offline notice and retry instead of hanging on a spinner.
- When the content API cannot be reached, the app stays usable: navigation and empty sections remain available with an offline notice and a "Try again" control that requests a new snapshot.
- Ways to help explains “Community contributions are coming soon. For now, this is a read-only public resource.”, offers a tappable community contact, and navigates to live events, projects, and consultations sections. Public submissions are not introduced.
- Type scale follows page title 32–36, card title 25–28, intro 18–20, body 16–18, and metadata 13–14 while keeping the cream, dark-green, and pale-sage identity.

## Acceptance criteria

- Given the mobile app launches with network access, when its first screen loads, then it requests the configured Woodbrook origin's `GET /api/mobile-content` endpoint instead of using a bundled content snapshot.
- Given the endpoint receives a GET request, when Google Sheets is available, then it reads and validates the current published snapshot server-side without exposing service-account credentials.
- Given a resident selects any current collection and then a record, when navigation completes, then the matching list and detail content are visible with its official source and review date.
- Given a resident opens a record and then goes back, when the previous screen renders, then the resident returns to the visited list with its state preserved.
- Given local information is loaded, when search, category, or out-of-hours filters are applied and a contact is opened and then closed, then the visible contacts and count still match the applied filters.
- Given the bottom tab bar is visible, when the resident switches sections, then the selected tab shows its line icon, label, and compact indicator and any drill-in history resets to the section root.
- Given a resident opens a detail screen, when the header renders, then it uses the compact brand without the subtitle.
- Given a resident opens a local contact, when contact actions render, then Call, Email, Get directions (where an address or event location exists), and Visit website actions are tappable and the source shows Checked with an external-link indicator.
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
