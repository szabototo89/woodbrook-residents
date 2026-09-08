# Community information hub

Status: Available

## Job to be done

When I need to understand what is happening around Woodbrook, I want one trustworthy, organised place for updates, projects, events, consultations, and local services, so I can stay informed and take the right next step.

## User-visible behavior

- Residents can browse current updates, initiatives, events, surveys, and a searchable directory of local services.
- Residents can open dedicated detail pages for local service providers while directory cards remain concise.
- Residents can open dedicated detail pages for updates, projects, events, and surveys from their listing cards.
- Detail pages use a consistent reading layout while surfacing the dates, status, location, next step, action, and source information relevant to each content type.
- Event detail pages let residents download an event to their calendar and open its location in Google Maps.
- The home page presents those paths as one Woodbrook Community Hub, using direct resident-focused language rather than institutional categories or a themed naming system.
- The home page presents its four resident starting points as one balanced row on wide screens and a compact single-column sequence on phones.
- The four resident starting points align their titles consistently on wide screens.
- Featured event and consultation cards share a horizontal starting line even when their headings wrap differently.
- The home page grounds the hub in a high-resolution, source-attributed photograph of Woodbrook's coastal setting.
- Dates and times use conventional, unslashed numerals throughout the resident-facing interface.
- The home page contribution panel pairs its label with a relevant, visually anchored icon.
- The contribution panel anchors its actions to the explanatory copy on wide screens and stacks them naturally on small screens.
- Every factual seeded item links to its original public source.
- Local service cards show their source and checked date, support direct contact actions, and do not present listings as endorsements.
- Empty and unavailable states explain what happened without showing invented content.
- The experience works on mobile and desktop and supports keyboard navigation.

## Acceptance criteria

- Given Strapi contains published content, when a resident opens the home page, then featured and recent content is rendered from the CMS.
- Given a resident opens the home page, when the hero loads, then a high-resolution Woodbrook photograph and its linked source credit are visible.
- Given a source-backed item, when a resident opens it, then its source and last reviewed date are visible.
- Given a published project, event, or survey, when a resident follows its card, then a dedicated detail page presents its available CMS information and a route back to the listing.
- Given a published event, when a resident uses its calendar or location action, then the event downloads as an `.ics` calendar file or opens as a Google Maps search respectively.
- Given an unknown, unpublished, or unavailable project, event, or survey slug, when a resident opens its detail URL, then a useful unavailable state links back to the relevant listing.
- Given the CMS cannot be reached, when a resident opens a content route, then a clear unavailable state appears.
- Given a narrow mobile viewport, when a resident browses primary routes, then navigation and main content remain usable without horizontal overflow.
- Given a wide desktop viewport, when a resident reaches the homepage starting points, then all four paths have equal visual weight with no empty grid quadrant.
- Given a wide desktop viewport, when resident starting points, featured cards, and contribution actions are shown, then related elements align consistently without being displaced by differing copy lengths.
- Given resident-facing content contains a date or time, when it is rendered, then its numerals use conventional unslashed forms.

## Scope

### Included

- Updates, projects, events, surveys, local information, volunteering, and source attribution.
- Search-engine and social metadata.

### Not included

- Accounts, comments, forum posts, private messaging, marketplace listings, or a social feed.
