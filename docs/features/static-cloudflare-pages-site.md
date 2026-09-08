# Static Cloudflare Pages site

Status: Available

## Job to be done

When the public website is deployed, I want every published page to be generated from Strapi during the build, so residents can browse the complete hub on Cloudflare Pages without a runtime backend.

## User-visible behavior

- Listing pages and every linked update, project, event, and survey detail page are delivered as pre-rendered HTML.
- Client-side navigation reads immutable JSON emitted alongside the HTML instead of contacting Strapi or a server function.
- Published content reflects the most recent successful build. CMS changes become visible after the next deployment.
- The public site has no issue-report form or other runtime write action.

## Acceptance criteria

- Given Strapi is reachable and contains published content, when `bun run build:static` runs, then the output contains the main routes, every reachable detail route, and static CMS data under `apps/web/dist/client`.
- Given a listing links to a published detail route, when the static output is verified, then that route has a corresponding HTML file.
- Given Strapi cannot be reached or returns content that fails validation, when the static build runs, then it exits unsuccessfully instead of publishing unavailable or empty content.
- Given the contents of `apps/web/dist/client` are deployed, when a resident browses or navigates between generated pages, then no runtime application server or Strapi connection is required.
- Given the public artifact is inspected, then it contains no issue-report page or runtime server-function endpoint.

## Scope

### Included

- Build-time Strapi reads, static prerendering, linked dynamic-route discovery, immutable client-navigation data, and output verification.
- Cloudflare Pages build settings and Strapi-triggered rebuild guidance.

### Not included

- Runtime SSR, Pages Functions, API routes, issue reporting, live CMS reads, deployment credentials, or Cloudflare project provisioning.
