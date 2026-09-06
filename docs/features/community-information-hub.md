# Community information hub

Status: Available

## Job to be done

When I need to understand what is happening around Woodbrook, I want one trustworthy, organised place for updates, projects, events, consultations, and local services, so I can stay informed and take the right next step.

## User-visible behavior

- Residents can browse current updates, initiatives, events, surveys, and local resources.
- Residents can open dedicated detail pages for updates, projects, events, and surveys from their listing cards.
- Detail pages use a consistent reading layout while surfacing the dates, status, location, next step, action, and source information relevant to each content type.
- Event detail pages let residents download an event to their calendar and open its location in Google Maps.
- The home page presents those paths as one Woodbrook Community Hub, using direct resident-focused language rather than institutional categories or a themed naming system.
- Every factual seeded item links to its original public source.
- Empty and unavailable states explain what happened without showing invented content.
- The experience works on mobile and desktop and supports keyboard navigation.

## Acceptance criteria

- Given Strapi contains published content, when a resident opens the home page, then featured and recent content is rendered from the CMS.
- Given a source-backed item, when a resident opens it, then its source and last reviewed date are visible.
- Given a published project, event, or survey, when a resident follows its card, then a dedicated detail page presents its available CMS information and a route back to the listing.
- Given a published event, when a resident uses its calendar or location action, then the event downloads as an `.ics` calendar file or opens as a Google Maps search respectively.
- Given an unknown, unpublished, or unavailable project, event, or survey slug, when a resident opens its detail URL, then a useful unavailable state links back to the relevant listing.
- Given the CMS cannot be reached, when a resident opens a content route, then a clear unavailable state appears.
- Given a narrow mobile viewport, when a resident browses primary routes, then navigation and main content remain usable without horizontal overflow.

## Scope

### Included

- Updates, projects, events, surveys, local information, volunteering, and source attribution.
- Search-engine and social metadata.

### Not included

- Accounts, comments, forum posts, private messaging, marketplace listings, or a social feed.
