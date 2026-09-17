# Search indexing for the public website

Status: Available

## Job to be done

When someone searches for Woodbrook residents information in Shankill, I want the public site to appear in Google results, so residents can find local updates, events, projects, consultations, and services.

## User-visible behavior

- Every public page emits a canonical URL built from the configured public origin, with Open Graph site name/locale and image alt text.
- The built site serves `/robots.txt` that allows crawling and points to `/sitemap.xml`.
- The built site serves `/sitemap.xml` listing the main routes plus every published update, project, event, consultation, and local-information detail URL.
- Pages include WebSite structured data (`application/ld+json`) naming Woodbrook Residents.
- Production canonicals and sitemap locations never fall back to `localhost`.

## Acceptance criteria

- Given `VITE_PUBLIC_SITE_URL` is missing, blank, or invalid, when page metadata is built, then canonicals use `https://woodbrook.shankill.workers.dev`.
- Given a page head is created, when it is inspected, then it contains `og:site_name`, `og:locale`, `og:image:alt`, and a canonical link.
- Given the static build runs, when output is verified, then `dist/client/robots.txt` allows `/` and references `sitemap.xml`, and `dist/client/sitemap.xml` is a valid URL set containing the required pages and detail slugs.
- Given the homepage HTML is fetched, when the head is inspected, then WebSite JSON-LD is present without invented local facts.

## Scope

### Included

- Canonical/site URL fallback, metadata enrichment, robots/sitemap generation during `build:static`, static output verification, and structured data.

### Not included

- Google Search Console submission, custom-domain migration, ranking guarantees, or changes to issue-report privacy.
