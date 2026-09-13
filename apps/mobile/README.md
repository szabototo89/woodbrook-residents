# Woodbrook mobile

An iOS-focused ReactLynx and TypeScript version of the Woodbrook Residents public hub.

## Requirements

- Bun 1.4 or later
- Node.js 20.19 or later (Node.js 22.12 or later is also supported by the Lynx toolchain)
- Xcode and the iOS Simulator
- [Lynx Explorer for iOS](https://lynxjs.org/guide/start/quick-start.html)

## Develop on iOS

From the repository root:

```sh
bun install
bun run dev:mobile
```

`dev:mobile` loads the repository `.env` file, so configure `GOOGLE_SHEETS_SPREADSHEET_ID`, `GOOGLE_SERVICE_ACCOUNT_EMAIL`, and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` there. The app fetches the Google Sheet directly from the device at runtime: it exchanges the service-account key for a read-only access token in process, reads the published tabs, and validates the snapshot on device with the same parsing and schemas as the website. No web server or Worker endpoint is required. Start Lynx Explorer in the iOS Simulator, then paste the bundle URL printed by Rspeedy into Explorer. The QR-code configuration adds fullscreen mode automatically.

When the sheet cannot be reached, the app stays usable: navigation, empty sections, and a "Try again" notice remain available, and a retry reloads the sheet.

Provide the same Google variables in the environment when building the bundle for a device or production:

```sh
bun run build:mobile
```

The service-account key ships inside the mobile bundle by design. Anyone can extract keys from a bundle, so keep the service account read-only on the content spreadsheet, share nothing else with it, and rotate the key if the bundle is widely distributed.

## Quality checks

```sh
bun run --cwd apps/mobile format:check
bun run --cwd apps/mobile typecheck
bun run --cwd apps/mobile test
bun run --cwd apps/mobile build
```

The test command renders ReactLynx components in the official ReactLynx Testing Library and fails unless statements, branches, functions, and lines each reach at least 90% coverage.

## Current scope

The app loads live, validated Google Sheets content at runtime directly from the device and provides native in-app navigation for updates, projects, events, consultations, local information, their detail views, and ways to help. Local information includes search, category, and out-of-hours filters. No accounts, submissions, social features, or other mobile-only capabilities are included.
