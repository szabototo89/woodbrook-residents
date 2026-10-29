# Woodbrook mobile

A ReactLynx and TypeScript version of the Woodbrook Residents public hub. The
same application source renders in Lynx on iOS and through Lynx for Web in a
browser.

## Requirements

- Bun 1.4 or later
- Node.js 20.19 or later (Node.js 22.12 or later is also supported by the Lynx toolchain)
- Xcode and the iOS Simulator
- [Lynx Explorer for iOS](https://lynxjs.org/guide/start/quick-start.html)
- Chrome 92+, Safari 16.4+, or a compatible newer browser

## Develop on iOS and web

From the repository root:

```sh
bun install
bun run dev:mobile
```

`bun run dev:mobile` starts both mobile renderers: Rspeedy serves the native and
web Lynx bundles on port 3202, and the browser host runs at
`http://localhost:3203`. Open that browser URL for the web renderer. The iOS
renderer continues to use the native bundle URL printed by Rspeedy.

By default, the app loads content at runtime from the public Woodbrook Worker.
To use the repository's local Sanity-backed API, run these commands in
separate terminals:

```sh
bun run dev:web:content
WOODBROOK_API_URL=http://localhost:3000 bun run dev:mobile
```

Sanity is the single content source. The local command uses the same published-only
snapshot as the deployed Worker: site settings, updates, projects, events,
consultations, and resources. In the repository `.env`, set `SANITY_PROJECT_ID`
(default `ca34quae`), `SANITY_DATASET` (default `production`), and
`SANITY_API_VERSION` (default `2025-09-01`). Public datasets need no token.
For private datasets, set `SANITY_API_TOKEN` only on the backend. Never prefix a
token with `VITE_` or put it in a mobile build environment. No Sanity SDK or
credential is needed in either renderer. `CONTENT_SOURCE` may be unset or
`sanity`; the former Sheets source is no longer supported.

The backend port may change when 3000 is occupied; use the ready server's
origin in `WOODBROOK_API_URL`. An iOS Simulator can use the Mac's localhost;
a physical device needs a reachable HTTPS backend such as the temporary
Cloudflare preview. Native-host execution still requires Lynx Explorer and
its supported networking setup. `SANITY_API_HOST` is a server-only override
for a local test stub, not a mobile configuration value.

Start Lynx Explorer in the iOS Simulator, then paste the native
bundle URL printed by Rspeedy into Explorer. The QR-code configuration adds
fullscreen mode automatically.

Renderer-specific commands are also available from `apps/mobile`:

```sh
bun run dev:ios
bun run dev:web
bun run dev:all
```

`dev:web` starts the web-target bundle server as well as the browser host because
the host loads that bundle at runtime. `dev:all` adds the native bundle used by
Lynx Explorer.

Set `WOODBROOK_API_URL` when building the bundle for a device or production. It must be the HTTPS origin hosting the Woodbrook Worker, for example:

```sh
WOODBROOK_API_URL=https://woodbrook.shankill.workers.dev bun run build:mobile
```

When the content API cannot be reached, the app stays usable: navigation, empty
sections, and a "Try again" notice remain available, and retrying requests a new
runtime snapshot.

## Quality checks

```sh
bun run --cwd apps/mobile format:check
bun run --cwd apps/mobile typecheck
bun run --cwd apps/mobile test
bun run --cwd apps/mobile build
```

Install the browser engines once before the full mobile test suite:

```sh
bun run --cwd apps/mobile test:web:install
```

The test command renders ReactLynx components in the official ReactLynx Testing
Library and fails unless statements, branches, functions, and lines each reach
at least 90% coverage. It also builds the production artifacts and verifies
runtime content loading and navigation in Chromium and WebKit.

The production outputs are separate and can be built explicitly:

```sh
bun run --cwd apps/mobile build:ios
bun run --cwd apps/mobile build:web
bun run --cwd apps/mobile build:all
```

The native artifact is written to `dist/ios`. The browser host is written to
`dist/web` and includes its web-target Lynx bundle under `dist/web/lynx`.

## Current scope

The app loads live, validated content at runtime and provides shared in-app
navigation for updates, projects, events, consultations, local information,
their detail views, and ways to help. Local information includes search,
category, and out-of-hours filters. No accounts, submissions, social features,
or other mobile-only capabilities are included.
