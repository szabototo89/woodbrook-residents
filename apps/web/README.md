# Woodbrook web application

The TanStack Start public website supports dynamic local development and a fully static production build.

Run the development server from the repository root with `bun run dev:web`.

## Sanity content

Sanity is the single content source. `bun run dev:web` and
`bun run dev:web:content` load the repository `.env` and query published content
on each request. Set `SANITY_API_HOST` only to use a local test stub.

The shared factory uses these server settings for development, the static
build, and the deployed mobile Worker:

| Setting              | Default      | Purpose                                         |
| -------------------- | ------------ | ----------------------------------------------- |
| `CONTENT_SOURCE`     | `sanity`     | Unset/blank or `sanity` only; other values fail |
| `SANITY_PROJECT_ID`  | `ca34quae`   | Sanity project                                  |
| `SANITY_DATASET`     | `production` | Published dataset                               |
| `SANITY_API_VERSION` | `2025-09-01` | Query API version                               |
| `SANITY_API_TOKEN`   | None         | Optional read token for private datasets        |
| `SANITY_API_HOST`    | Sanity API   | Server-only local stub override                 |

Project, dataset, and version also accept `VITE_SANITY_PROJECT_ID`,
`VITE_SANITY_DATASET`, and `VITE_SANITY_API_VERSION` as public fallbacks.
Server values take precedence. Tokens have no public alias: never use
`VITE_SANITY_API_TOKEN`. Google Sheets is no longer supported.

## Static build

```sh
bun run build:static
```

Set `VITE_PUBLIC_SITE_URL` to the deployed origin for canonical metadata.
The build validates published Sanity content before prerendering and verifies
all generated routes. Transport or validation errors stop the build.
Deploy `apps/web/dist/client`; `dist/server` is a prerendering input.

## Mobile content endpoint

Development and Cloudflare expose read-only `GET /api/mobile-content`.
The Worker uses its runtime bindings, independent of the static build's
process environment. Set any non-default project/dataset/version in the
Worker's runtime variables as well as the build environment. A public dataset
needs no secret. For a private dataset, configure `SANITY_API_TOKEN` as a
Worker secret (target the preview Worker name while reviewing):

```sh
bunx wrangler secret put SANITY_API_TOKEN --name <preview-worker-name>
```

Every GET loads and validates all five collections and site settings. Queries
explicitly request the `published` perspective and exclude `drafts.**` and
`versions.**`, even with a token. Responses contain canonical public fields.
Tokens stay on the server; neither mobile renderer talks directly to Sanity.

GET returns `Cache-Control: public, max-age=60, stale-while-revalidate=300`.
GET and OPTIONS allow cross-origin reads; writes return 405. Configuration,
upstream transport, HTTP, JSON, and content validation errors return 503 with
`Content is temporarily unavailable.` Detailed errors remain in server logs.
Non-endpoint paths keep using the existing static asset binding.

The static website reflects its last build; mobile fetches at runtime.
Publishing in Sanity is the single editorial action, while website refreshes
still require a successful rebuild. No synchronization or migration is needed.

## Firebase accounts

See [Firebase setup and rollout](../../docs/features/firebase-authentication.md) for project configuration, login, registration, password recovery, and account management. Accounts are disabled by default; preview with `?feature_flag=firebase-auth`. The bundled public Firebase profile supports the deployed website; environment overrides are documented in the setup guide.

See [Private account details](../../docs/features/account-details.md) for optional Eircode/address storage, Firebase CLI commands and per-account Firestore rules.

Public loading performance and Lighthouse setup are documented in [Fast public page loading](../../docs/features/page-loading.md). Run `bun run test:lighthouse` to build and audit the static production site through local Wrangler; `--skip-build` requires an existing static build.
