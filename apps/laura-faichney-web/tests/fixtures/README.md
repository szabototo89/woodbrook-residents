# Gallery browser fixtures

Gallery browsing tests need known collections with multiple pictures, regardless of what Laura currently publishes. `gallery-data.mjs` supplies test-only sample collections, including a single-picture collection and artwork availability examples. It does not publish or edit CMS content.

`build:e2e` preloads `gallery-fetch.mjs` during content capture, before Vite builds the site. The built snapshot contains these gallery fixtures on direct visits and browser navigation. Tests read their expectations from the same snapshot rather than querying live Sanity. Normal builds and development servers never load these fixtures.

The browser fixture in `gallery-test.ts` serves the gallery hero from local artwork files, including responsive variants. Public Sanity artwork requests omit the browser origin and receive test-only CORS headers so isolated preview ports work without changing Sanity's allowed origins. Tests creating their own contexts call `routeGalleryFixture` explicitly. The availability tests vary artwork aspect ratios without modifying published content.

Other page content and artwork still use Sanity during capture and image loading, so the full suite requires network access. The static-content regression test blocks all Sanity API and API CDN hosts to verify that direct visits, route transitions and gallery browsing make no content requests. Cleanup removes artwork interceptions before closing pages and ignores pending-request cancellation errors.
