# Agent handoffs

After developing a feature, create `docs/handoffs/<feature-slug>/index.mdx` at the repository root. Keep all related screenshots, C4 sources, and evidence in that handoff's `assets/` folder; never share asset folders between handoffs. Update the same handoff when continuing the feature. Record observed facts and explicit unknowns; never include secrets.

Run the independent viewer with `bun run dev:handoffs` and open <http://127.0.0.1:3002/>. Documents open at `/#/<feature-slug>`; built previews need rebuilding after changes.

Use this small starting template. Record actual worktree, branch, HEAD and UTC update time; these fields appear in the document header. Status: in progress / blocked / ready for review / complete.

```mdx
import desktop from './assets/desktop.png';
import mobile from './assets/mobile.png';

export const metadata = {
  title: 'Feature name',
  status: 'in progress',
  worktree: '/absolute/path/to/session-worktree',
  branch: 'session/feature-name',
  commit: 'Recorded Git HEAD',
  updatedAt: 'YYYY-MM-DDTHH:mm:ssZ',
  summary: 'One sentence about the task and its current state.',
};

## Goal

What success looks like and what is in scope.

## Current state

What changed, what works, and decisions or uncommitted work to preserve.

## Appearance

<AppearanceGallery
  images={[
    {
      src: desktop,
      title: 'Desktop',
      alt: 'Desktop feature view',
      description:
        'Describe exactly what the reviewer should check in this image.',
    },
    {
      src: mobile,
      title: 'Mobile',
      alt: 'Mobile feature view',
      description:
        'Describe the mobile layout or behavior the reviewer should check.',
    },
  ]}
/>

## Architecture

C1 context, C2 containers, and C3 components when needed. Under each level, include its diagram and a short summary of what changed.

## Verification

Commands/checks, actual PASS / FAIL / NOT RUN results, and evidence. NOT RUN is not PASS.

## Next steps

Next concrete action, remaining work, blockers, and questions. Write "None" when complete.
```

The appearance gallery supports thumbnails, previous/next controls, arrow keys, and full-size images. Every image requires a review description. Clearly label sample content; omit Appearance and screenshot imports for features without a UI.

Use fenced `mermaid` blocks for C4 diagrams, or import a source from the handoff's own assets folder:

```mdx
import context from './assets/c1-context.mmd?raw';

<MermaidDiagram source={context} />

Change: describe the system-context change in one sentence.
```

Link the handoff and show desktop/mobile screenshots inline in the final response.
