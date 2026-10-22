# Woodbrook web application

The TanStack Start public website supports dynamic local development and a fully static production build.

Run the development server from the repository root with `bun run dev:web`.

## Development content sources

The dev server reads every page from the configured `CONTENT_SOURCE`
(`google-sheets` by default, or `sanity`) on each request, so content edits do not
require a restart.

- Google Sheets (default): `bun run dev:web` from the repository root. It sets
  `CONTENT_SOURCE=google-sheets`, loads repository credentials from
  `../../.env` (relative to `apps/web`), and starts `apps/web`.
- Sanity: `bun run dev:web:sanity` from the repository root. It sets
  `CONTENT_SOURCE=sanity`, loads repository credentials from
  `../../.env`, and starts `apps/web`. `SANITY_PROJECT_ID` defaults to the
  Woodbrook project (`ca34quae`), `SANITY_DATASET` to `production`, and
  `SANITY_API_VERSION` to `2025-09-01`. Set `SANITY_API_HOST` to point queries
  at a local stub during hermetic tests.
- From inside `apps/web`: `bun run dev:sheets` starts the same Sheets-backed
  server. Provide `GOOGLE_SHEETS_SPREADSHEET_ID` (optional, defaults to the
  Woodbrook workbook), `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and
  `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` via `apps/web/.env` or exported
  variables; the repository-root command above supplies them from the root
  `.env` instead.

Without Sheets credentials the pages still render with an unavailable-content
state in dev; static builds fail instead so a broken snapshot cannot replace
a working deployment.

## Static build

The repository-level command runs quality checks before producing and verifying the Cloudflare Pages artifact:

```bash
bun run build:static
```

Required build environment:

- `CONTENT_SOURCE`: optional; either `google-sheets` (default) or `sanity`.
- `VITE_PUBLIC_SITE_URL`: public origin embedded in canonical and social metadata.

For Google Sheets builds, the workbook defaults to the Woodbrook content spreadsheet and can be overridden with `GOOGLE_SHEETS_SPREADSHEET_ID`. Share the private workbook with a Google service account as a viewer, then set `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in the build environment. The private key may use escaped `\\n` newlines as shown in `.env.example`. For Sanity builds, the project defaults to `ca34quae/production`; override with `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION`, and optionally `SANITY_API_TOKEN`.

Google Sheets access uses the read-only spreadsheets scope. None of the content-source variables is prefixed with `VITE_`, so credentials remain in server-side code and are not included in client assets.

Deploy `dist/client` when the Pages project root is `apps/web`, or `apps/web/dist/client` when it is the repository root. Do not deploy `dist/server`; it is a temporary prerendering input and is not needed at runtime.

## Mobile content endpoint

The dynamic development server and production Cloudflare Worker expose `GET /api/mobile-content`. The endpoint reloads and validates the Google Sheets snapshot at request time, returns only published public fields, and responds with a short public cache window. Other HTTP methods are rejected.

Before deploying, configure `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` as Worker secrets. `GOOGLE_SHEETS_SPREADSHEET_ID` is optional and otherwise uses the current Woodbrook workbook. The Worker serves the existing static website assets unchanged for all non-API requests.

## Firebase accounts

See [Firebase setup and rollout](../../docs/features/firebase-authentication.md) for project configuration, login, registration, password recovery, and account management. Accounts are disabled by default; preview with `?feature_flag=firebase-auth`. The bundled public Firebase profile supports the deployed website; environment overrides are documented in the setup guide.

See [Private account details](../../docs/features/account-details.md) for optional Eircode/address storage, Firebase CLI commands and per-account Firestore rules.

Public loading performance and Lighthouse setup are documented in [Fast public page loading](../../docs/features/page-loading.md). Run `bun run test:lighthouse` to build and audit the static production site through local Wrangler; `--skip-build` requires an existing static build.
