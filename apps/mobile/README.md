# Woodbrook mobile

An iOS-focused ReactLynx and TypeScript rendering of the current Woodbrook Residents home page. It is intentionally a homepage foundation, not a separate product surface.

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

Start Lynx Explorer in the iOS Simulator, then paste the bundle URL printed by Rspeedy into Explorer. The QR-code configuration adds fullscreen mode automatically.

## Quality checks

```sh
bun run --cwd apps/mobile format:check
bun run --cwd apps/mobile typecheck
bun run --cwd apps/mobile test
bun run --cwd apps/mobile build
```

The test command renders ReactLynx components in the official ReactLynx Testing Library and fails unless statements, branches, functions, and lines each reach at least 90% coverage.

## Current scope

The app renders the current public homepage hierarchy and source-attributed Woodbrook image. Its destination cards describe the same sections as the website, but native navigation and the destination screens are deferred until those existing web capabilities are deliberately brought to mobile.
