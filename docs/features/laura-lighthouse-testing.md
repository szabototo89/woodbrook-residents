# Laura Lighthouse testing

Status: Available

## Job to be done

When Laura's artwork or website changes, I want to check every public page on mobile and desktop, so visitors can browse the portfolio and make an enquiry without slow downloads or accessibility regressions.

## Visible behavior

- `bun run test:lighthouse:laura` builds the production static site and checks its five main pages and every published collection from the generated sitemap.
- The runner uses Lighthouse 13.5.0 and checks mobile and desktop separately. Performance must reach 90; accessibility, best practices, and SEO must reach 100.
- It serves actual prerendered HTML with gzip compression on the default preview origin (`http://127.0.0.1:4176`). The port must be free. `--base-url` audits an already running server without modifying its responses.
- JSON reports and a readable summary are saved to `apps/laura-faichney-web/lighthouse-reports/`. Raw reports are generated artifacts; baseline and final summaries are kept in Git.
- `--route=/contact`, `--form-factor=mobile`, `--skip-build`, `--port=4176`, and `--retries=0` narrow local runs. A single retry of failing combinations is the default.
- The site loads responsive artwork, compact decorations and logos, a favicon, and readable testimonial labels. Its current hero artwork uses AVIF with WebP fallback derived from the exact original CMS asset. New CMS images and crop edits retain responsive CDN delivery. Minified styles arrive with the HTML and hydration reuses them without downloading another copy.

## Acceptance criteria

- All main pages and published collections meet the category minimums in both form factors.
- Hero artwork loads without browser errors; links and forms preserve their existing behavior.
- The testimonial eyebrow meets a contrast ratio of at least 4.5:1.
- Missing static routes return 404 rather than a successful unrelated page.
- Unit tests, browser regressions, the production static build, and the repository build agree with the final audit.

## Scope

Included: a local production audit command, generated reports, delivery and contrast fixes, and regression tests.

Excluded: deployment, CMS publishing changes, and automatic modification of user-supplied original artwork.

## Verification

Verified on 2026-10-03 with Lighthouse 13.5.0 against the production static build on port 4188, with retries disabled. All nine pages pass in both form factors. Accessibility, best practices, and SEO score 100 throughout.

| Page                         | Mobile performance | Desktop performance |
| ---------------------------- | -----------------: | ------------------: |
| `/`                          |                 93 |                 100 |
| `/about`                     |                 93 |                 100 |
| `/services`                  |                 90 |                 100 |
| `/gallery`                   |                 90 |                 100 |
| `/contact`                   |                 91 |                 100 |
| `/gallery/mad-cow`           |                 95 |                 100 |
| `/gallery/coco-after-dark`   |                 94 |                 100 |
| `/gallery/wild-at-heart`     |                 94 |                 100 |
| `/gallery/angus-has-notions` |                 94 |                 100 |

The final [JSON summary](../../apps/laura-faichney-web/lighthouse-reports/lighthouse-summary.json) and [readable summary](../../apps/laura-faichney-web/lighthouse-reports/lighthouse-summary.md) record the complete matrix. The baseline remains alongside them for comparison. The original baseline scored 73–90 on mobile performance, 79–100 on desktop performance, 95–100 on accessibility, 96 on best practices, and 100 on SEO. Its temporary unregistered proxy origin also produced collection-preload CORS errors. The current application embeds published CMS content during the build and performs no CMS reads in the browser.

Verification covers Laura's unit and script tests, all 98 browser regressions, the production static build and internal-link verifier, and the required repository-wide `bun run build`. The current Google Forms enquiry flow, gallery swipe position, Facebook link and footer overscroll fixes from local main are preserved. The touch regression waits for observed scroll stability before its next drag.

### Remaining diagnostics

Lighthouse still identifies framework JavaScript paths unused during a single initial navigation and possible further artwork compression. Navigation, hydration, enquiry interactions, and gallery controls retain their verified behavior; artwork keeps its verified resolution and encoding quality. These estimates do not fail the category targets.

Hashed Vite assets cache for one year. Replaceable artwork, branding and decorations cache for one day to bound update delays, so Lighthouse can recommend longer lifetimes for them. The production `_headers` file and audit preview use the same rules. These are deliberate caching and image-quality choices, not failing accessibility, best-practices or SEO checks.
