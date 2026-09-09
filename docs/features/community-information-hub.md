# Community information hub

Status: Available

## Job to be done

When I need to understand what is happening around Woodbrook, I want one trustworthy, organised place for updates, projects, events, consultations, and local services, so I can stay informed and take the right next step.

## User-visible behavior

- Residents can browse current updates, initiatives, events, surveys, and a searchable directory of local services.
- Published content is captured during deployment and remains available without a runtime CMS connection.
- Residents can open dedicated detail pages for local service providers while directory cards remain concise.
- Residents can open dedicated detail pages for updates, projects, events, and surveys from their listing cards.
- Detail pages use a consistent reading layout while surfacing the dates, status, location, next step, action, and source information relevant to each content type.
- Event detail pages let residents download an event to their calendar and open its location in Google Maps.
- The site consistently identifies itself as Woodbrook Residents, with Community hub · Shankill as supporting context.
- The home page states plainly that it provides local information and ways to take part.
- Navigation, page headings, and calls to action consistently use Updates, Events, Projects, Consultations, and Local information.
- The home page Have your say starting point links to Consultations rather than Projects.
- The home page presents its four resident starting points as one balanced row on wide screens and a compact single-column sequence on phones.
- The four resident starting points align their titles consistently on wide screens.
- Featured event and consultation cards share a horizontal starting line even when their headings wrap differently.
- The home page grounds the hub in a high-resolution, source-attributed photograph of Woodbrook's coastal setting.
- Dates and times use conventional, unslashed numerals throughout the resident-facing interface.
- The home page contribution panel pairs its label with a relevant, visually anchored icon.
- The contribution panel anchors its actions to the explanatory copy on wide screens and stacks them naturally on small screens.
- The Ways to help page distinguishes actions available now from submission channels that are not yet open, and uses a configured CMS contact email for corrections when one exists.
- Listing and detail routes provide specific page titles, descriptions, social metadata, and canonical URLs.
- Every factual seeded item links to its original public source.
- Local service cards show their source and checked date, support direct contact actions, and do not present listings as endorsements.
- Empty and unavailable states explain what happened without showing invented content.
- The experience works on mobile and desktop and supports keyboard navigation.
- On phones, the navigation menu closes when a resident taps outside it, presses Escape, follows a link, or activates the menu button again. Escape returns focus to the menu button, whose accessible expanded state stays in sync.

## Acceptance criteria

- Given Strapi contains published content when the site is built, when a resident opens the home page, then featured and recent content from that build is rendered.
- Given a resident opens the home page, when the hero loads, then a high-resolution Woodbrook photograph and its linked source credit are visible.
- Given a resident uses the site, when they read the header, footer, page metadata, or social preview, then Woodbrook Residents is the consistent primary identity.
- Given a resident chooses Have your say on the home page, when they follow the link, then they reach Consultations.
- Given the resident publishing contact is not configured, when a resident opens Ways to help, then the page says that corrections, event submissions, and issue reports are not accepted and still links to useful read-only actions.
- Given the resident publishing contact is configured, when a resident opens Ways to help, then they can email a correction through that published contact.
- Given a resident opens a listing or detail route, when the document head is rendered, then its title, description, social metadata, and canonical URL describe that route.
- Given a source-backed item, when a resident opens it, then its source and last reviewed date are visible.
- Given a published project, event, or survey, when a resident follows its card, then a dedicated detail page presents its available CMS information and a route back to the listing.
- Given a published event, when a resident uses its calendar or location action, then the event downloads as an `.ics` calendar file or opens as a Google Maps search respectively.
- Given an unknown, unpublished, or unavailable project, event, or survey slug, when a resident opens its detail URL, then a useful unavailable state links back to the relevant listing.
- Given the CMS cannot be reached during a static build, when the build attempts to prerender content routes, then the build fails instead of producing an empty deployment.
- Given a narrow mobile viewport, when a resident browses primary routes, then navigation and main content remain usable without horizontal overflow.
- Given the mobile navigation is open, when a resident taps outside it, presses Escape, follows a link, or activates the menu button again, then the menu closes; Escape returns focus to the menu button and its expanded state is announced accurately.
- Given a wide desktop viewport, when a resident reaches the homepage starting points, then all four paths have equal visual weight with no empty grid quadrant.
- Given a wide desktop viewport, when resident starting points, featured cards, and contribution actions are shown, then related elements align consistently without being displaced by differing copy lengths.
- Given resident-facing content contains a date or time, when it is rendered, then its numerals use conventional unslashed forms.

## Scope

### Included

- Updates, projects, events, surveys, local information, volunteering, and source attribution.
- Search-engine and social metadata.

### Not included

- Accounts, issue reporting, comments, forum posts, private messaging, marketplace listings, or a social feed.
