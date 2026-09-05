# Community information hub

Status: Available

## Job to be done

When I need to understand what is happening around Woodbrook, I want one trustworthy, organised place for updates, projects, events, consultations, and local services, so I can stay informed and take the right next step.

## User-visible behavior

- Residents can browse current updates, initiatives, events, surveys, and local resources.
- Every factual seeded item links to its original public source.
- Empty and unavailable states explain what happened without showing invented content.
- The experience works on mobile and desktop and supports keyboard navigation.

## Acceptance criteria

- Given Strapi contains published content, when a resident opens the home page, then featured and recent content is rendered from the CMS.
- Given a source-backed item, when a resident opens it, then its source and last reviewed date are visible.
- Given the CMS cannot be reached, when a resident opens a content route, then a clear unavailable state appears.
- Given a narrow mobile viewport, when a resident browses primary routes, then navigation and main content remain usable without horizontal overflow.

## Scope

### Included

- Updates, projects, events, surveys, local information, volunteering, and source attribution.
- Search-engine and social metadata.

### Not included

- Accounts, comments, forum posts, private messaging, marketplace listings, or a social feed.
