---
name: gsc-search-console
description: Use when checking Google indexing status or requesting a re-crawl of a Woodbrook page via the gsc-cli Indexing API wrapper, especially when the task mentions gsc, Search Console, indexing check/update, service-account JSON, or google-site-verification.
---

# GSC Search Console CLI

Thin wrapper around the Google Indexing API (`gsc-cli@0.1.0`,
`ivankristianto/google-search-console-cli`). It does **not** expose Search
Analytics, sitemaps, or URL Inspection. Use the Search Console web UI for
those.

## When to Use

- Check the last crawl signal Google has for a Woodbrook URL.
- Signal that a published page changed and should be re-crawled.
- Set up or debug the local Indexing API credentials.

Do not use for ranking, traffic, or coverage reports. The tool cannot do that.

## Prerequisites

1. Google Cloud project with the Indexing API enabled.
2. Service-account JSON key with these fields: `type`, `project_id`,
   `private_key_id`, `private_key`, `client_email`, `client_id`, `auth_uri`,
   `token_uri`, `auth_provider_x509_cert_url`, `client_x509_cert_url`.
3. That service-account email added as an **owner** of the Search Console
   property (`Settings > Users and Permissions > Manage property owners`).
4. Woodbrook property: `https://woodbrook.shankill.workers.dev/`
   (verification file lives at `apps/web/public/google*.html`).

Never commit the JSON key to the repo. Keep it outside the checkout
(e.g. `~/.config/woodbrook/gsc-key.json`).

## Usage

Prefer `bunx` so no repo dependency changes are needed:

```bash
bunx -p gsc-cli gsc --help
bunx -p gsc-cli gsc config setup --jsonFile=<path/to/key.json>
bunx -p gsc-cli gsc indexing check <url>
bunx -p gsc-cli gsc indexing update <url>
```

Project examples:

```bash
SITE=https://woodbrook.shankill.workers.dev
bunx -p gsc-cli gsc indexing check "$SITE/events"
bunx -p gsc-cli gsc indexing update "$SITE/updates/my-post"
```

Useful flags:

- `--credentials <path>`: use a one-off key file instead of the stored config.
- `--disableSpinner`: use in scripts/CI for clean output.

## Behaviour Notes

- `config setup` validates the JSON key fields and writes it to
  `~/.google-search-console-cli`. `--credentials` overrides that file per call.
- Without a key the commands fail with `No key or keyFile set.`
- Responses report `url`, `latestUpdate.type`, `latestUpdate.notifyTime`.
- A successful `update` only **signals** fresh content. It does not guarantee
  an immediate crawl (upstream tool disclaimer).
- The Indexing API is designed for fast-changing content (job posts, live
  blogs). For normal Woodbrook pages, a sitemap + Search Console request is
  usually enough.

## Before Signalling Google

Verify the page is crawlable first:

```bash
SITE=https://woodbrook.shankill.workers.dev
curl -s "$SITE/robots.txt"
curl -s "$SITE/sitemap.xml" | head -n 20
curl -s "$SITE/events" | grep -i -E "canonical|noindex"
```

`robots.txt` and `sitemap.xml` are generated from
`apps/web/src/app/seoFiles.ts:192` and `apps/web/src/app/seoFiles.ts:177`.
Only signal URLs present in the sitemap with a correct canonical.
