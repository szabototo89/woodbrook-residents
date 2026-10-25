# Forma Studio automatic deployment

Status: Available

## Job to be done

As the site maintainer, publish tested Forma Studio changes without manually uploading a build.

## Visible behavior

- The production website remains at https://forma-studio-web-ddv.pages.dev.
- Pushes to `main` that change Forma Studio, its workflow, `package.json` or `bun.lock` queue a production deployment.
- Maintainers can run **Deploy Forma Studio** manually from `main` in GitHub Actions.
- Failed dependency installation, type checks, unit coverage or builds prevent publication.

## Acceptance criteria

- A real GitHub Actions run builds and deploys the existing Cloudflare Pages project `forma-studio-web`.
- Only `dist/client` is uploaded, with the triggering commit recorded.
- Production deployment credentials come from existing GitHub repository secrets.
- Manual runs on other branches cannot publish production; concurrent deploys queue.
- The deployed home and blog routes load on desktop and mobile.

## Explicit scope

Adds production deployment automation for the existing static site. No new Pages project, custom domain, preview deployment, CMS integration or application UI is added. Existing draft commercial copy and illustrative imagery remain unchanged.
