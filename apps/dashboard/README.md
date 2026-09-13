# Woodbrook developer dashboard

A local admin dashboard for software engineers. It tracks every workspace application, links to infrastructure consoles, and documents runnable build actions. Data comes from the extendable registry in `src/features/dashboard/registry.ts`; add apps, links, and actions there without changing layout.

Run the dashboard from the repository root with `bun run dev:dashboard` (`http://localhost:3001`).

## Verification

The dashboard uses the same verification stack as `apps/web`:

```bash
bun run --cwd apps/dashboard test:unit    # Vitest, 90% coverage gate per file
bun run --cwd apps/dashboard test:browser # Vitest real-browser component tests
bun run --cwd apps/dashboard test:e2e     # Production build + Playwright (desktop and mobile)
bun run --cwd apps/dashboard typecheck    # Strict TypeScript
bun run build:dashboard                   # Production build (from the repository root)
```

Repository-level `bun run lint`, `bun run test`, and `bun run build` all include the dashboard. Every change follows TDD: write the failing test first, then the minimal implementation. See `AGENTS.md` for agent guidance.
