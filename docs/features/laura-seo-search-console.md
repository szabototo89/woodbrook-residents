# Laura search visibility

Status: Available

## Job to be done

When someone searches for Laura or her creative services, I want Google to identify the main website correctly, so prospective clients can find her artwork and contact her.

## User-visible behavior

Page canonical links, Open Graph URLs, the sitemap and robots sitemap reference use `https://allthingsart.ie` by default. Explicit preview origins remain supported. The verified Search Console domain property covers every protocol and subdomain; it reports clicks, impressions, queries, pages and indexing without a visitor tracking script.

The correction is deployed to production from `bc4de01` on 7 November 2026. All 10 live canonical URLs and sitemap entries use the custom domain. Search Console ownership is verified; after the user sets the corrected sitemap, Google identifies it as the homepage discovery source. The homepage is discovered but not yet indexed; search reports initially process data. No PR is created, as explicitly requested.

## Acceptance criteria

- Missing or invalid public-site configuration produces `allthingsart.ie` canonical URLs.
- The deployment script ignores an ambient localhost origin and CI uses the custom domain.
- All 10 currently published URLs appear in the generated sitemap on the custom domain.
- Search Console confirms ownership of `sc-domain:allthingsart.ie` through DNS verification.
- After deployment, the production sitemap and each canonical agree before sitemap submission.
- Monthly reporting compares equivalent 28-day periods, with brand and non-brand queries separated.

## Scope

Included: canonical-domain configuration, regression tests, the verified production deployment, a dated SEO audit, a measurable improvement plan and Search Console ownership setup.

Follow-up work: host redirects, missing-page behavior, service-specific landing pages, structured data and further performance work. Branded link previews are documented separately in [Laura sharing previews](laura-social-preview.md). No Google Analytics account, enquiry conversion tracking, scheduled API reporting, CMS content edits or ranking guarantee is included.

See [the audit and improvement goal](../operations/laura-seo-plan.md) and [the engineering handoff](../handoffs/laura-seo-search-console/index.mdx).
