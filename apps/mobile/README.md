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
bun run dev:mobile-content
bun run dev:mobile
```

Run the two development commands in separate terminals. The web process provides the read-only runtime content endpoint at `http://localhost:3000/api/mobile-content`; it reads the configured Google Sheet on each request. Start Lynx Explorer in the iOS Simulator, then paste the bundle URL printed by Rspeedy into Explorer. The QR-code configuration adds fullscreen mode automatically.

Set `WOODBROOK_API_URL` when building the bundle for a device or production. It must be the HTTPS origin hosting the Woodbrook Worker, for example:

```sh
WOODBROOK_API_URL=https://woodbrook.shankill.workers.dev bun run build:mobile
```

Google service-account credentials stay in the web server or Cloudflare Worker and are never embedded in the mobile bundle. For local development, configure `CONTENT_SOURCE=google-sheets` and the existing Google variables in the repository `.env` file.

## Quality checks

```sh
bun run --cwd apps/mobile format:check
bun run --cwd apps/mobile typecheck
bun run --cwd apps/mobile test
bun run --cwd apps/mobile build
```

The test command renders ReactLynx components in the official ReactLynx Testing Library and fails unless statements, branches, functions, and lines each reach at least 90% coverage.

## Current scope

The app loads live, validated content at runtime and provides native in-app navigation for updates, projects, events, consultations, local information, their detail views, and ways to help. Local information includes search, category, and out-of-hours filters. No accounts, submissions, social features, or other mobile-only capabilities are included.
