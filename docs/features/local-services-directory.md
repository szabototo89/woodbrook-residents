# Local services directory

Status: Available

## Job to be done

When I need practical help nearby, I want to find and contact an appropriate local service quickly, so I do not have to search across unrelated websites or depend on unverified recommendations.

## User-visible behavior

- Residents can search the directory by provider name, service type, description, phone number, or additional details.
- Residents can filter contacts by category and by whether an out-of-hours contact is available.
- Each concise result card prioritises the primary phone action and a link to a dedicated provider page.
- Editors choose which CMS-managed label/value details are important enough to appear on a card.
- Provider addresses link to a Google Maps search from both directory cards and provider pages.
- Each provider page shows all supplied contact methods and additional details, such as address, service area, opening hours, accessibility, or professional registration.
- Each provider page identifies its source and the date on which the information was checked.
- The directory explains that inclusion is not an endorsement and does not provide ratings or reviews.
- The directory describes itself as a curated, unpaid starting set rather than a complete directory or recommendation.
- The directory links residents to the correction guidance, which uses the configured resident publishing email when available and otherwise states that corrections are not yet open.

## Acceptance criteria

- Given Strapi contains published resources, when a resident opens Local information, then the directory renders the CMS entries in configured display order.
- Given a resident enters a search term, when it matches core content or an additional detail, then only matching contacts remain visible.
- Given a resident selects a category or the out-of-hours option, when the filter is active, then results and the visible result count update immediately.
- Given no entries match the active filters, when the results update, then a clear empty state and filter reset action are available.
- Given a resource has additional details, when its card renders, then only details selected by the editor for card display are visible.
- Given a provider has an address detail, when that address appears on a directory card or provider page, then it links to a Google Maps search for the full address.
- Given a resident follows a provider’s detail link, when the provider is published, then its full contact methods, metadata, source, and last-reviewed date are visible.
- Given an unknown or unpublished resource slug, when a resident opens its detail URL, then a useful unavailable state links back to the directory.
- Given an editor needs to add new metadata, when they edit a Resource in Strapi, then they can add repeatable label/value details and choose whether each appears on the card without a schema change.
- Given a resident needs to judge the directory’s scope, when they read its guidance, then they can see that inclusion is curated and unpaid, is not comprehensive, and is not a recommendation.
- Given a resident spots inaccurate information, when they follow the correction link, then they reach the current correction guidance without being offered a non-functional submission form.

## Scope

### Included

- CMS-managed health, trades, professional, care, transport, council, community, waste, recreation, and safety contacts.
- Reusable contact fields, stable detail-page slugs, flexible additional metadata, card-display controls, category/search filtering, and source freshness.
- A curated starter set of source-backed Shankill and nearby services.

### Not included

- Ratings, reviews, paid placement, booking, quote requests, transactions, or claims that a listed provider is recommended.
- A promise that the directory is exhaustive or that a provider is currently available.
