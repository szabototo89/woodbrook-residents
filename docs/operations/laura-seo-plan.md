# Laura SEO audit and improvement goal

Audited 7 November 2026. Production: <https://allthingsart.ie/>. Repository baseline: `023a171ed765421ffb1512d66e83717aafaa80a5`. Evidence: [all-page audit](../handoffs/laura-seo-search-console/assets/production-audit.json) and [mobile Lighthouse summary](../handoffs/laura-seo-search-console/assets/lighthouse-summary.json).

## Findings

| Priority | Finding                                                             | Evidence and action                                                                                                                                                   |
| -------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | All 10 custom-domain pages declare the hosting domain as canonical. | Sitemap and robots also reference `pages.dev`. The PR changes metadata defaults, deployment defaults and CI to `https://allthingsart.ie`. Await merge and deployment. |
| P1       | Unknown URLs return the homepage with HTTP 200.                     | `/seo-audit-nonexistent-20261107` returns homepage content. Add a real static 404 page and check HTTP 404 on Cloudflare.                                              |
| P1       | Three HTTPS hosts serve the same site.                              | Apex, `www` and `pages.dev` return HTTP 200. Plan permanent, path-preserving redirects to the apex after checking Pages custom-domain routing.                        |
| P1       | Service discovery relies on one general services page.              | Services title is generic; copy covers five different services. Plan focused pages only where Laura can supply substantial original detail and examples.              |
| P2       | Location specificity is limited to Ireland.                         | Confirm actual location and service area with Laura before changing local search copy or creating a Business Profile. Do not invent a town or address.                |
| P2       | No JSON-LD or social preview image was found on the 10 pages.       | Consider accurate Person/WebSite and breadcrumb data; use an approved image with alt text for social sharing. Neither guarantees rankings.                            |
| P2       | Mobile homepage laboratory LCP is 3.1 seconds.                      | Lighthouse performance 94, SEO 100, FCP 1.0 seconds, CLS 0 and blocking time 0. Optimise the hero only after confirming repeatable results.                           |

Existing strengths: all 10 sitemap pages return HTTP 200 after route redirects, each has a distinct title and description, one H1, crawlable server-rendered content, internal navigation and image alt attributes. HTTPS works and robots allows crawling. Lighthouse SEO 100 checks basic eligibility; it does not establish ranking quality or validate the intended canonical host. The LCP result is one simulated mobile laboratory run, not Google's field Core Web Vitals assessment.

Also review URL formatting: Cloudflare redirects the nine non-home paths to a trailing slash, while their canonical and sitemap paths omit it. Align these with the final served URLs in a later URL-normalisation change, preserving existing links and redirects.

## Improvement goal

Owner: site maintainer. Start: the day the corrected production build goes live. This is a proposed success target, not a promise of Google indexing or rankings.

1. Within seven days of deployment, verify all 10 canonical URLs and every sitemap entry use the apex domain, submit the corrected sitemap and confirm Google can read it. Review URL Inspection for the homepage, services and a collection. Record any Google-selected canonical differences.
2. Within 30 days, target all 10 intended pages indexed with the correct Google-selected canonical, zero sitemap errors and no unexpected soft-404 reports. Resolve or explain each exception; Google controls indexing.
3. Use the first complete 28 days after deployment as the baseline. For the next 28 days, target at least 20% more non-brand impressions and no reduction in non-brand clicks. If baseline non-brand impressions are zero, target at least 10 non-brand impressions instead of an undefined percentage. Report low volumes plainly.
4. Review laboratory homepage LCP after the indexing fixes; aim for at most 2.5 seconds on a repeatable mobile test. Field LCP remains unknown until enough real-user data exists.

## Search Console setup and measurement

Verified property: [`sc-domain:allthingsart.ie`](https://search.google.com/search-console?resource_id=sc-domain%3Aallthingsart.ie), using the existing signed-in maintainer account. Google confirmed domain ownership on 7 November 2026 through a Cloudflare DNS TXT record. Preserve that record to retain verification. No additional users, service accounts, Google Analytics property or visitor scripts were added.

Google initially reports that performance and indexing data are processing. That is an unavailable baseline, not zero traffic. Search Console can start collecting search data without a sitemap; a sitemap aids discovery and does not guarantee indexing.

The initial homepage URL Inspection reports “URL is unknown to Google”, no last crawl, no referring sitemap and no selected canonical. This confirms that the homepage is not currently indexed; it does not establish the status of every other URL.

Sitemap submission is pending because the live `https://allthingsart.ie/sitemap.xml` still contains the hosting domain's URLs. After the PR is merged and the normal deployment finishes:

1. Fetch the production homepage, services, a collection, robots and sitemap. Confirm custom-domain canonical and sitemap URLs.
2. Open **Indexing → Sitemaps**, submit `https://allthingsart.ie/sitemap.xml`, and record its processing status and discovered count.
3. Open **URL inspection** for the three representative pages. Request indexing only after the canonical checks pass.
4. In **Performance → Search results**, choose Web and the last 28 complete days. Export query and page tables, then compare the previous 28 days with the same filters. Track clicks, impressions, CTR and average position; segment Ireland and mobile separately when volume allows.
5. Separate brand searches using a case-insensitive custom regex containing `laura|faichney|all.?things.?art`. Use “doesn't match regex” for non-brand queries. Google omits some query data, so query totals may differ from page totals.
6. Check **Pages**, **Sitemaps** and **Core Web Vitals** weekly for the first month, then monthly. Search Console does not measure submitted enquiry conversions; those need a separate authorised analytics task.

## Sources

Public production pages and crawl files were accessed on 7 November 2026; exact URLs and observations are recorded in the audit JSON. Google documentation was accessed the same day:

- [Get started with Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start)
- [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Canonical URL consolidation](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls)
- [Soft 404 errors](https://developers.google.com/search/docs/crawling-indexing/http-network-errors#soft-404-errors)
- [Search Console performance report](https://support.google.com/webmasters/answer/7576553)
