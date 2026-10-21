# Agent handoffs

After developing a feature, save `docs/handoffs/<feature-slug>.mdx` at the repository root (`woodbrook/docs/handoffs/`). Update the same document when continuing a feature. Record observed facts, durable evidence, and explicit unknowns; never include secrets.

The standalone viewer lists these documents at `http://127.0.0.1:3002/` and opens each at `/#/<feature-slug>`. Run `bun run dev:handoffs` from the repository root. It is independent of `apps/web`; built previews include documents present at build time.

Use this small starting template:

```mdx
export const metadata = {
  title: 'Feature name',
  summary: 'One sentence about the task and its current state.',
};

# Feature name

Status: in progress / blocked / ready for review / complete

## Goal

What success looks like and what is in scope.

## Current state

What changed, what works, and any decisions or uncommitted work to preserve.

## Appearance

Screenshots of desktop and mobile, with sample content clearly labelled. Omit for features without a UI.

## Architecture

Link version-controlled C4 diagrams: C1 context, C2 containers, and C3 components when needed. Add a short summary under each level explaining what changed.

## Verification

Commands/checks, actual PASS / FAIL / NOT RUN results, and evidence. NOT RUN is not PASS.

## Next steps

The next concrete action, remaining work, blockers, and open questions. Write "None" when complete.
```

Use fenced `mermaid` blocks for C4 diagrams; they render in the browser with expandable source. To reuse a version-controlled diagram without duplicating it:

```mdx
import context from '../architecture/c1-feature.mmd?raw';

<MermaidDiagram source={context} />
```

Keep screenshots in `docs/handoffs/assets/` and import them in MDX, for example `import desktop from './assets/feature-desktop.png';` followed by `<img src={desktop} alt="Desktop appearance" />`. This keeps browser links working after the session worktree is removed. Link the handoff and show desktop/mobile screenshots inline in the final response.
