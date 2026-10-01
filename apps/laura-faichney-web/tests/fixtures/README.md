# Gallery browser fixtures

Gallery browsing tests need known collections with multiple pictures, regardless of what Laura currently publishes. `gallery-data.mjs` supplies the same sample photographs used by the app's unit tests, grouped into two collections with multiple pictures and one single-picture collection. It does not publish or edit CMS content.

`gallery-fetch.mjs` is loaded only by the Playwright configuration and its preview server. It substitutes gallery collections in Sanity responses, preserving other published page content. The browser fixture in `gallery-test.ts` applies the same substitution to client navigation and serves the gallery hero from the local artwork files, including its responsive variants and CORS headers. Tests creating their own browser contexts call `routeGalleryFixture` explicitly.

Production builds and normal development servers do not load these fixtures. Other page content and artwork still use Sanity, so the full suite requires network access. The availability tests supply their own picture statuses without modifying real artwork availability.

Public Sanity artwork requests omit the browser origin and receive test-only CORS headers so isolated preview ports work without changing Sanity's allowed origins. After assertions finish, cleanup removes interceptions before closing the page and ignores cancellation errors from requests still in flight.
