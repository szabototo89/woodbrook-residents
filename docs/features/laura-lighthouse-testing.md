# Laura Lighthouse testing

Status: In progress

## Job to be done

When Laura's artwork or website changes, I want to check every public page on mobile and desktop, so visitors can browse the portfolio and make an enquiry without slow downloads or accessibility regressions.

## Visible behavior

- `bun run test:lighthouse:laura` builds the production static site and checks its five main pages and every published collection from the generated sitemap.
- The runner uses Lighthouse 13.5.0 and checks mobile and desktop separately. Performance must reach 90; accessibility, best practices, and SEO must reach 100.
- It serves actual prerendered HTML with gzip compression on the existing CMS-approved localhost origin (`http://127.0.0.1:4176`). The port must be free. `--base-url` audits an already running server without modifying its responses.
- JSON reports and a readable summary are saved to `apps/laura-faichney-web/lighthouse-reports/`. Raw reports are generated artifacts; baseline and final summaries are kept in Git.
- `--route=/contact`, `--form-factor=mobile`, `--skip-build`, `--port=4176`, and `--retries=0` narrow local runs. A single retry of failing combinations is the default.
- The site loads responsive artwork, compact decorations and logos, a favicon, and readable testimonial labels. Its current hero artwork uses optimized derivatives of the exact original CMS asset; new CMS images retain responsive CDN delivery.

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

Pending final mobile/desktop matrix and regression checks. The first baseline scored 73–90 on mobile performance, 79–100 on desktop performance, 95–100 on accessibility, 96 on best practices, and 100 on SEO. Its temporary unregistered proxy origin also produced collection-preload CORS errors; the final runner uses the existing approved localhost origin.
