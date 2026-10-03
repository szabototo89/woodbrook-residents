# Gallery browser fixtures

Gallery browsing tests need known collections with multiple pictures, regardless of what Laura currently publishes. `site-content.json` supplies test-only sample collections, including a single-picture collection and artwork availability examples. It does not publish or edit CMS content.

`build:e2e` preloads `gallery-fetch.mjs` during content capture, before Vite builds the site. `site-content.json` supplies all four query responses locally. The normal source parser still validates and maps these responses, and tests read their expectations from the same snapshot. Normal builds and development servers never load these fixtures.

`site-fixtures.ts` serves every known image from repository artwork, using Sharp to produce the requested WebP sizes. The browser fixture in `gallery-test.ts` intercepts all Sanity images and rejects content API calls. Tests creating their own contexts call `routeGalleryFixture` explicitly. Unknown fixture URLs fail instead of falling back to a live request. The availability tests vary artwork aspect ratios without modifying published content.

The complete Laura browser suite uses no live Sanity requests during capture or image loading. Production content integrations remain covered separately by the source's unit tests; routine tests never require a live dataset. Cleanup removes artwork interceptions before closing pages and ignores pending-request cancellation errors.

The e2e content capture uses mode `test` and `.cache/test-image-assets/`, never the production `.cache/image-assets/`. Generated public files are replaced on every capture, so a subsequent production build restores the genuine published artwork.

The non-gallery fixture copy was captured from the published Laura project on 2026-10-02 ([Sanity project](https://www.sanity.io/manage/project/uag6kepo)). Gallery collections are synthetic test scenarios. Local artwork provenance is documented in `ASSETS.md`. Edit these fixtures deliberately when changing the design or test scenarios; they do not publish CMS content.
