# Local services directory

Status: Available

## Job to be done

When I need practical help nearby, I want to find and contact an appropriate local service quickly, so I do not have to search across unrelated websites or depend on unverified recommendations.

## User-visible behavior

- Residents can search the directory by provider name, service type, description, phone number, or additional details.
- Residents can filter contacts by category and by whether an out-of-hours contact is available.
- Each result prioritises direct phone and website actions and can also expose an email address.
- Each result can show any number of CMS-managed label/value details, such as address, service area, opening hours, accessibility, or professional registration.
- Each result identifies its source and the date on which the information was checked.
- The directory explains that inclusion is not an endorsement and does not provide ratings or reviews.

## Acceptance criteria

- Given Strapi contains published resources, when a resident opens Local information, then the directory renders the CMS entries in configured display order.
- Given a resident enters a search term, when it matches core content or an additional detail, then only matching contacts remain visible.
- Given a resident selects a category or the out-of-hours option, when the filter is active, then results and the visible result count update immediately.
- Given no entries match the active filters, when the results update, then a clear empty state and filter reset action are available.
- Given a resource has a phone number, website, email, or additional details, when its card renders, then only the supplied actions and details are shown.
- Given an editor needs to add new metadata, when they edit a Resource in Strapi, then they can add repeatable label/value details without a schema change.
- Given a source-backed resource, when its card renders, then its source and last-reviewed date are visible.

## Scope

### Included

- CMS-managed health, trades, professional, care, transport, council, community, waste, recreation, and safety contacts.
- Reusable contact fields, flexible additional metadata, category/search filtering, and source freshness.
- A curated starter set of source-backed Shankill and nearby services.

### Not included

- Ratings, reviews, paid placement, booking, quote requests, transactions, or claims that a listed provider is recommended.
- A promise that the directory is exhaustive or that a provider is currently available.
