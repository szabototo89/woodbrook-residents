# Search rich results for detail pages

Status: Available

## Job to be done

When a Woodbrook update or event appears in search results, I want it to carry structured data and article metadata, so search engines can understand the content and show richer results.

## User-visible behavior

- Update detail pages emit `og:type` `article` with `article:published_time` and `article:modified_time`, plus an `Article` JSON-LD script with headline, description, canonical URL, image, and dates.
- Event detail pages emit an `Event` JSON-LD script with name, description, canonical URL, start/end dates, and venue.
- Unavailable detail states emit no structured data.
- The public schedule PDF is listed in `sitemap.xml`.
- The document declares `lang="en-IE"`, matching the `en_IE` Open Graph locale.

## Acceptance criteria

- Given an update slug resolves, when the page head is built, then it contains `og:type` `article`, both article time tags, and one `application/ld+json` script describing an `Article`.
- Given an event slug resolves, when the page head is built, then it contains one `application/ld+json` script describing an `Event` with its start date and venue.
- Given a detail slug does not resolve, when the page head is built, then no JSON-LD script is emitted.
- Given the static build runs, when output is verified, then `sitemap.xml` contains the schedule PDF URL and detail HTML includes the JSON-LD scripts.

## Scope

### Included

- Article/Event JSON-LD builders, route head wiring for updates and events, sitemap PDF entry, document language.

### Not included

- Search Console submission, ranking guarantees, or structured data for projects, surveys, and local-information pages.
