# Laura Sanity auto-rebuild

Status: In progress

## Job to be done

When Laura publishes a content change in Sanity Studio, I want the static Cloudflare Pages site to rebuild automatically, so the public site reflects the publish without a manual deploy.

## Visible behavior

- Sanity project `uag6kepo` ("Laura Faichney All Things Art"), dataset `production`, has a GROQ-powered webhook named e.g. `laura-github-rebuild`.
- The webhook fires on published `create`, `update`, and `delete` for `_type in [homePage, aboutPage, servicesPage, galleryPage, siteSettings, service, galleryItem]`; drafts and versions are ignored.
- The webhook `POST`s to `https://api.github.com/repos/szabototo89/woodbrook-residents/dispatches` with headers `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`, and `Authorization: Bearer <fine-grained PAT>`, and a projection body of `{"event_type": "sanity-update", "client_payload": {"_id": _id, "_type": _type}}`.
- The `Deploy Laura Faichney` GitHub workflow accepts `repository_dispatch` type `sanity-update` in addition to its existing `push` and `workflow_dispatch` triggers, logs the triggering event and `client_payload`, then runs the unchanged static build (`bun run --cwd apps/laura-faichney-web build:static`) and Cloudflare Pages deploy (`laura-faichney-all-things-art`, branch `main`).
- Overlapping publishes queue behind `concurrency: group: laura-faichney-pages, cancel-in-progress: false`, matching Sanity's at-least-once delivery (1 concurrent request, 2 retries at 30s, 30s timeout); rebuilds are idempotent.
- Webhook delivery health is visible in the Sanity manage Attempts log; GitHub run history shows the dispatch source.

## Acceptance criteria

- Given a publish of one of the listed types in `production`, when the document commits, then the Sanity Attempts log records a 2xx `POST` to the GitHub dispatches endpoint.
- Given a valid `sanity-update` dispatch, when GitHub receives it, then a `Deploy Laura Faichney` run starts, logs `event=repository_dispatch` with the `_id`/`_type` payload, builds the static site, and deploys `dist/client` to Cloudflare Pages project `laura-faichney-all-things-art`.
- Given a push to `main` touching `apps/laura-faichney-web/**`, when CI runs, then the same deploy job still runs unchanged.
- Given `bun test scripts/deploy-laura.test.ts`, when it runs, then the repository_dispatch trigger test passes alongside the existing deploy-config tests.
- Given the production origin, when the Pages deployment finishes, then `https://laura-faichney-all-things-art.pages.dev` serves the rebuilt static output.

## Scope

### Included

- `.github/workflows/deploy-laura-faichney.yml` `repository_dispatch` trigger, concurrency group, and payload logging.
- `scripts/deploy-laura.test.ts` trigger-preservation test.
- This feature doc plus the manual Sanity webhook recipe (URL, method, headers, filter, projection, dataset, published-only triggers).

### Not included

- Website code reading from Sanity (`laura-faichney-web` still builds baked-in content until the Sanity read follow-up lands).
- Storing the GitHub PAT anywhere in the repo; the token lives only in the Sanity webhook header config and is replaced with a placeholder in any shared webhook URL.
- Draft-preview rebuilds, per-document incremental builds, or changes to the Woodbrook site, Strapi CMS, or other workflows.
- Creating/rotating the PAT or the Sanity webhook itself from CI; both are manual steps in `manage.sanity.io` confirmed via the Attempts log.

## Verification

- `bun test scripts/deploy-laura.test.ts` covers the workflow trigger wiring.
- `bun run --cwd apps/laura-faichney-web build:static` plus `verify:static` covers the Pages artifact.
- End-to-end is confirmed manually: publish in hosted Studio -> Attempts log 2xx -> GitHub run green -> Pages URL updated. Free-tier note: webhooks are included; plan limits that apply are the generic webhook concurrency/retry/timeout behavior documented above.
