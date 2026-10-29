# Cloudflare preview retention

Temporary Cloudflare previews are deleted seven days after Cloudflare creates
them. The cleanup runs every day from GitHub Actions and covers every
repository-owned Cloudflare application.

This page is the operational reference for
[#8](https://github.com/szabototo89/woodbrook-residents/issues/8). The
implementation is in `scripts/cloudflare-preview-cleanup.ts` and the scheduled
workflow is `.github/workflows/cleanup-cloudflare-previews.yml`.

## Retention rule

- One cutoff applies to the whole run: `runStartedAt - 7 * 24 hours`.
- A deployment is eligible only when Cloudflare reports
  `environment: "preview"` and a valid `created_on` **strictly earlier** than
  the cutoff. A deployment exactly seven days old is retained.
- Production deployments are never deleted. Production projects, Worker
  scripts, routes, domains and shared storage are never touched.
- An open pull request does not exempt an old preview. Review the pull request
  by deploying a fresh preview and updating its link.
- The seven-day window is fixed. Do not change it without a new product
  decision.

## App inventory

`scripts/cloudflare-preview-inventory.json` is the authoritative list. The
cleanup only calls the projects listed there; it never enumerates or deletes
account-wide resources. A test compares this list with the names in
`.github/workflows/deploy-*.yml` and `wrangler.jsonc`, so a new deployed app
fails the test until it is registered.

| App                               | Kind   | Preview mechanism         | Repository source                                           |
| --------------------------------- | ------ | ------------------------- | ----------------------------------------------------------- |
| `woodbrook`                       | Worker | None                      | `wrangler.jsonc`                                            |
| `forma-studio-web`                | Pages  | Pages preview deployments | `apps/forma-studio-web/wrangler.jsonc`                      |
| `laura-faichney-all-things-art`   | Pages  | Pages preview deployments | `apps/laura-faichney-web/wrangler.jsonc`                    |
| `woodbrook-design-gallery`        | Pages  | Pages preview deployments | `apps/design-proposals`                                     |
| `woodbrook-dog-salon-concept`     | Pages  | Pages preview deployments | `apps/design-proposals/projects/the-dog-salon`              |
| `woodbrook-spotless-concept`      | Pages  | Pages preview deployments | `apps/design-proposals/projects/spotless-dog-grooming`      |
| `woodbrook-spotless-warm-concept` | Pages  | Pages preview deployments | `apps/design-proposals/projects/spotless-dog-grooming-warm` |

### Worker limitation

The `woodbrook` Worker is deployed from `main` by Workers Builds. Repository
workflows create no Worker previews, and Cloudflare exposes no supported API to
delete an individual Worker version. The inventory therefore records the Worker
with mechanism `none` and the job summary reports the limitation on every run.
If the Worker adopts Worker Previews or another preview form, add a supported
deletion mechanism and tests before relying on this policy. Until then, the
Worker is an explicit, recorded gap rather than a silent claim of complete
enforcement.

### Temporary standalone Worker review sites

Issue #14 uses three temporary Worker scripts for its backend, mobile browser,
and handoff review: `woodbrook-mobile-sanity-14`, `woodbrook-mobile-ui-14`, and
`woodbrook-mobile-handoff-14`. They are previews of the existing apps, not
production targets. Created on 29 October 2026, they reach seven days on
5 November 2026. The Pages-only cleanup does not delete these Worker scripts.
The implementer must refresh their review links or manually remove the
isolated temporary scripts after the retention window. This is a recorded
Worker cleanup gap; no automated enforcement is claimed.

### Pages protections

Cloudflare Pages protects aliases and the latest deployment of a branch. The
cleanup sends `force=true` to the supported delete endpoint. This permits
deletion of an eligible aliased preview, so its branch alias stops resolving;
it never deletes a newer deployment. If Cloudflare still refuses a deletion,
the run records `provider-protected: <message>` as a skip and reports it in the
job summary. The documented resolution is to redeploy that branch, which
creates a newer deployment that becomes the alias target, and then rerun
cleanup. If a protection persists, the limitation remains an open acceptance
gap and must not be described as enforced.

## Schedule and commands

The workflow runs daily at **02:17 UTC** (`17 2 * * *`) from the default branch.
Scheduled runs delete eligible previews. Manual runs can do either:

```sh
# List candidates for every configured app; no DELETE requests are sent.
CLOUDFLARE_ACCOUNT_ID=<account-id> \
CLOUDFLARE_API_TOKEN=<token> \
bun scripts/cloudflare-preview-cleanup.ts --dry-run

# Run the same cleanup as the schedule.
CLOUDFLARE_ACCOUNT_ID=<account-id> \
CLOUDFLARE_API_TOKEN=<token> \
bun scripts/cloudflare-preview-cleanup.ts

# Read another inventory and use a fixed run-start time for local checks.
bun scripts/cloudflare-preview-cleanup.ts --dry-run \
  --config scripts/cloudflare-preview-inventory.json \
  --now 2026-10-25T02:17:00Z
```

`--now` is for local verification and tests. The scheduled workflow never sets
it.

To run from GitHub: **Actions → Clean up Cloudflare previews → Run workflow**.
Set `dry_run` to `true` to list candidates only.

## Secrets and permissions

The workflow grants `contents: read` only.

| Secret                                 | Required  | Purpose                                                              |
| -------------------------------------- | --------- | -------------------------------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID`                | Yes       | Account that owns the configured apps.                               |
| `CLOUDFLARE_PREVIEW_CLEANUP_API_TOKEN` | Preferred | Dedicated token with Pages Read and Pages Write.                     |
| `CLOUDFLARE_API_TOKEN`                 | Fallback  | Existing deploy token, used only when the dedicated token is absent. |

Use a token scoped to the minimum permissions: **Pages Read** and **Pages
Write**. The cleanup does not need Workers, DNS, zone or account-administration
permissions. Do not print or commit token values. The script never writes the
token to logs, errors or the job summary.

## Audit summary

Every run writes a Markdown summary to the GitHub Actions job summary and
stdout. It records:

- the run-start and cutoff timestamps in UTC;
- the retention window and whether the run was a dry run;
- per-app scanned, preview, candidate, deleted, retained, skipped and failed
  counts;
- deployment IDs, branch, creation time and reason for candidates, deletions,
  skips and failures;
- unsupported mechanisms and app-level errors.

Dry runs select the same candidates but issue no delete requests.

## Failure recovery

| Symptom                                                      | Cause                                                           | Recovery                                                                     |
| ------------------------------------------------------------ | --------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| `CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN must be set` | Missing secret or local environment variable.                   | Add the repository secrets or export both variables locally.                 |
| `Cloudflare rejected the credentials (HTTP 401/403)`         | Expired token or missing Pages permission.                      | Rotate the token with Pages Read and Pages Write, then rerun.                |
| `Inventory ... is not valid JSON` or a registration error    | Broken or incomplete inventory.                                 | Fix `scripts/cloudflare-preview-inventory.json`; run the cleanup tests.      |
| Failed app listing                                           | Transient Cloudflare error or wrong project name.               | Rerun; if it persists, confirm the project exists and the token can read it. |
| `failed with HTTP 5xx` after three attempts                  | Cloudflare outage or rate limiting.                             | Rerun later. Retries use exponential backoff and `Retry-After`.              |
| `provider-protected` skip                                    | Pages still protects an alias or latest branch deployment.      | Deploy that branch again, then rerun. Record the gap if it persists.         |
| `Retention = 7 days` and no candidates                       | No preview deployment is older than the cutoff. This is normal. | None.                                                                        |

A failed job exits non-zero. A run with only skips exits zero but lists every
skip and limitation in the summary.

## Refresh an expired preview

1. Check out the pull request's latest commit.
2. Deploy a fresh preview for the affected app on a non-production branch.
3. Verify the preview URL loads.
4. Replace the preview link in the pull request description and mention that
   the previous deployment passed the seven-day window.

Do not redeploy production for a preview refresh.

## Register another app

1. Add an entry to `scripts/cloudflare-preview-inventory.json` with `name`,
   `kind`, `previewMechanism` and `sourcePath`.
2. Use `pages-deployments` for a Pages project. Use `none` only when no
   supported preview deletion exists, and write the limitation in `note`.
3. Add or update the app's deploy workflow so its project name appears in
   `.github/workflows/deploy-*.yml`.
4. Run `bun test scripts/cloudflare-preview-cleanup.test.ts`. The inventory
   coverage test fails until the app is registered.
5. Run a dry run on a branch or with `workflow_dispatch` before enabling
   scheduled deletion for the new app.

## Run coordination

- Cleanup runs in the `cloudflare-preview-cleanup` concurrency group with
  `cancel-in-progress: false`, so two cleanup runs never overlap.
- Preview creation does not join that group. The fixed run-start cutoff makes
  that safe: a deployment created during a run has a timestamp after the
  cutoff and is retained. Only deployments listed as previews strictly older
  than the cutoff are deleted.
- Never delete a newer deployment to make an older one removable. If Cloudflare
  requires that, stop and record the limitation instead.
