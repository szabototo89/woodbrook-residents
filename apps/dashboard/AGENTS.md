# AGENTS.md

Project-specific guidance for AI coding agents.

<!-- ASTRYX:START -->

Astryx v0.6.0 · 163 components
CLI: run every command as `bunx astryx <cmd>` (shown below as `astryx ...`).

SETUP (once, in your app entry e.g. main.tsx) — without these, components render unstyled:
import "@astryxdesign/core/reset.css";
import "@astryxdesign/core/astryx.css";

WORKFLOW — discover, don't guess. Before writing UI:

1. `astryx build "<idea>"` — START HERE: returns a kit (closest [page] + [block]s + [component]s). No args = full playbook.
2. `astryx template <name> [--skeleton]` — scaffold the [page]/[block]s it named, or study their layout. Templates are reference code.
3. `astryx component <Name>` — props + examples for every component you use.

RULES:

- No <div> — components do all layout/spacing, page frame included.
- Frame first: read `astryx docs layout` before writing any page or screen — page frame, region widths, breakpoint behavior.
- Dense data = rows (Table, List/Item), never Card-wrapped list items; Card is for standalone widgets. Status = StatusDot/Token; Badge = counts only.
- Custom styling: component props first; else style/className with tokens — var(--color-_|--spacing-_|--radius-*). No raw hex/px. (No StyleX/Tailwind compiler here — don't use xstyle/utility classes.)
- Tokens for every value (`astryx docs tokens`). Brand/accent belongs in the theme (`astryx theme list` / `theme add <slug>`, or `astryx theme template` for a custom one) — never override --color-* in :root.
- SELF-CHECK before you finish: re-read the file and replace any raw <div>/<span> layout, imported .css/@apply, or hardcoded value (#hex, 16px) with the component or a token (var(--color-_|--spacing-_|…)). If unsure a component/prop exists, run `astryx component <Name>` / `astryx search "<thing>"`; don't hand-roll CSS.

MORE CLI:
search "<query>" find any component / hook / doc / template / block
component --list 163 components by category
template --list page + block recipes
docs <topic> browser-support, cli-integrations, color, elevation, getting-started, icons, illustrations, internationalization, layout, migration, motion, principles, shadcn-compatibility, shape, spacing, styling-libraries, styling, theme, tokens, typography, working-with-ai
swizzle <Name> eject component source for deep customization
upgrade --apply run after any Astryx or integration dependency bump
<!-- ASTRYX:END -->

## Dashboard conventions

- Frame: `src/components/AdminShell.tsx` owns the Astryx `AppShell` + `SideNav` chrome and the `Outlet`. Do not add another skip link or `<main>`.
- Routes stay thin (`src/routes/`). Page UI lives in `src/features/<view>/`. Shared chrome lives in `src/components/`.
- Views are data-driven from `src/features/dashboard/registry.ts`, validated by `registrySchema.ts`. Add apps, links, and actions as data, not layout.
- Follow the repository `AGENTS.md`: TDD (failing test first), small commits, and verification below before handoff.

## Verification (mirrors apps/web)

```bash
bun run --cwd apps/dashboard test:unit    # Vitest with 90% coverage gate (statements/branches/functions/lines, per file)
bun run --cwd apps/dashboard test:browser # Real-browser component tests
bun run --cwd apps/dashboard test:e2e     # Build + Playwright desktop and mobile projects
bun run --cwd apps/dashboard typecheck    # Strict tsc --noEmit
bun run build:dashboard                   # Production build (from the repository root)
```

Root `bun run lint` and `bun run test` include the dashboard suites. Keep them green and document user-visible changes in `docs/features/developer-dashboard.md`.
