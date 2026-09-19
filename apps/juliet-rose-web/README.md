# Juliet Rose web application

This directory is the TanStack Start skeleton for the Juliet Rose Beauty Studio website. It contains the approved design proposal, reusable content data, focused page sections, and a complete local verification setup without unrelated CMS or product-domain code.

## Development

From the repository root:

```bash
bun run dev:juliet-rose
```

The app runs on port 3002. The production origin used for canonical metadata defaults to `https://www.julietrosebeauty.com` and can be overridden with `VITE_PUBLIC_SITE_URL`.

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
