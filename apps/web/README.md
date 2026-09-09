# Woodbrook web application

The TanStack Start public website supports dynamic local development and a fully static production build.

Run the development server from the repository root with `bun run dev:web`.

## Static build

The repository-level command runs quality checks before producing and verifying the Cloudflare Pages artifact:

```bash
bun run build:static
```

Required build environment:

- `CONTENT_SOURCE`: required; either `strapi` or `google-sheets`.
- `VITE_PUBLIC_SITE_URL`: public origin embedded in canonical and social metadata.

For Strapi builds, set `STRAPI_URL` to the reachable CMS origin. For Google Sheets builds, the workbook defaults to the Woodbrook content spreadsheet and can be overridden with `GOOGLE_SHEETS_SPREADSHEET_ID`. Share the private workbook with a Google service account as a viewer, then set `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` in the build environment. The private key may use escaped `\\n` newlines as shown in `.env.example`.

Google Sheets access uses the read-only spreadsheets scope. None of the content-source variables is prefixed with `VITE_`, so credentials remain in the temporary build server and are not included in client assets.

Deploy `dist/client` when the Pages project root is `apps/web`, or `apps/web/dist/client` when it is the repository root. Do not deploy `dist/server`; it is a temporary prerendering input and is not needed at runtime.
