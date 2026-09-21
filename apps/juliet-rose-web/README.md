# Juliet Rose web application

This directory is the TanStack Start skeleton for the Juliet Rose Beauty Studio website. It contains the approved design proposal, reusable content data, focused page sections, and a complete local verification setup without unrelated CMS or product-domain code.

## Development

From the repository root:

```bash
bun run dev:juliet-rose
```

The app runs on port 3002. The production origin used for canonical metadata defaults to `https://www.julietrosebeauty.com` and can be overridden with `VITE_PUBLIC_SITE_URL`.

## Component previews

Every component has a React Cosmos fixture colocated with its source as `*.fixture.tsx`. From this directory:

```bash
bun run cosmos
```

Cosmos runs on port 5001 with its renderer on port 5050 (see `cosmos.config.json`). The shared decorator in `src/cosmos.decorator.tsx` applies the global stylesheet and fonts, and `src/cosmosRouter.tsx` provides a memory router for the fixtures that need router context (`NotFoundPage`, `RootDocument`). `RootDocument` renders the document shell as static markup because React cannot mount a nested `<html>` element inside the Cosmos container.

## Verification

Run checks from this directory:

```bash
bun run typecheck
bun run test:unit
bun run test:browser
bun run test:e2e
bun run test:lighthouse
bun run build
bun run build:static
```

The static build is written to `dist/client` and verifies generated pages, internal links, crawler metadata, and the absence of runtime-only output.
