# Design proposal hosting

Status: Available

## Job to be done

When a design proposal is merged to `main`, I want each concept to be
live on its own public Cloudflare URL, so reviewers and customers can
open a single shareable link without running the repository locally.

## User-visible behavior

- The proposal gallery is live at
  `https://woodbrook-design-gallery.pages.dev/`.
- The Dog Salon concept is live at
  `https://woodbrook-dog-salon-concept.pages.dev/`.
- The Spotless precise concept is live at
  `https://woodbrook-spotless-concept.pages.dev/`
  (research document at `/research.html`).
- The Spotless warm concept is live at
  `https://woodbrook-spotless-warm-concept.pages.dev/`.
- Merging to `main` redeploys every site whose folder changed through
  `.github/workflows/deploy-design-proposals.yml`.
- Manual redeploys use the same directories with
  `bunx wrangler pages deploy <directory> --project-name=<project>`.
- The canonical mapping lives in `scripts/design-proposal-sites.ts` and
  is covered by `scripts/design-proposal-sites.test.ts`.

## Acceptance criteria

- Given a merge to `main` touches `apps/design-proposals`, when the
  `Deploy design proposals` workflow runs, then all four Cloudflare
  Pages projects receive a production deployment for the merged commit.
- Given a reviewer opens any concept URL above, when the page loads,
  then the concept renders with its own styles, script, and imagery
  (HTTP 200 for `/`, `/styles.css`, `/site.js`, and hero assets).
- Given a reviewer opens the Spotless concept, when they follow the
  research link, then the rationale document loads over HTTP 200.
- Given the repository is checked out locally, when
  `bun test scripts/design-proposal-sites.test.ts` runs, then all
  mapping, directory, relative-asset, and workflow assertions pass.
- Given Wrangler is authenticated, when
  `bunx wrangler pages project list --json` runs, then it lists the
  four `woodbrook-*` projects above.

## Scope

### Included

- Four Cloudflare Pages projects (gallery plus one per proposal) with
  production branch `main`.
- GitHub Actions auto-deploy on push to `main` (scoped to proposal
  paths) plus `workflow_dispatch`.
- Relative same-project asset paths so each concept works both in the
  gallery (`/projects/<name>/`) and standalone (`/`).
- `CLOUDFLARE_ACCOUNT_ID` repository secret.

### Not included

- The `CLOUDFLARE_API_TOKEN` value itself: create a Cloudflare API
  token with Pages write access and add it as a repository secret
  named `CLOUDFLARE_API_TOKEN`. Auto-deploy stays pending until it
  exists.
- Custom domains, access control, forms, analytics, or CMS
  integration for the concepts.
- Cross-proposal links on standalone sites: links that point at a
  sibling proposal (for example the warm concept's research link) are
  gallery-only and return 404 standalone by design.

## Site mapping

| Site             | Project                           | Directory                                                   | URL                                                  |
| ---------------- | --------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------- |
| Gallery          | `woodbrook-design-gallery`        | `apps/design-proposals`                                     | `https://woodbrook-design-gallery.pages.dev/`        |
| The Dog Salon    | `woodbrook-dog-salon-concept`     | `apps/design-proposals/projects/the-dog-salon`              | `https://woodbrook-dog-salon-concept.pages.dev/`     |
| Spotless precise | `woodbrook-spotless-concept`      | `apps/design-proposals/projects/spotless-dog-grooming`      | `https://woodbrook-spotless-concept.pages.dev/`      |
| Spotless warm    | `woodbrook-spotless-warm-concept` | `apps/design-proposals/projects/spotless-dog-grooming-warm` | `https://woodbrook-spotless-warm-concept.pages.dev/` |

Last verified 15 September 2026: all four production hosts returned
HTTP 200 with the expected titles, and concept assets returned
HTTP 200.
