# Agent handoff viewer

A standalone reader for `woodbrook/docs/handoffs/*/index.mdx`. It shares no routes, application chrome, CMS, or runtime services with the public website.

From the repository root:

```sh
bun install
bun run dev:handoffs
```

Open <http://127.0.0.1:3002/>. Documents use hash links such as `/#/agent-handoffs`, so built output can be served by a basic static file server.

```sh
bun run build:handoffs
bun run --cwd apps/handoffs preview
```

The built preview runs at <http://127.0.0.1:4182/>. Vite bundles repository-authored MDX and imported images. C4 diagrams use locally rendered PlantUML SVGs with expandable source and a full-size link. The viewer fits the complete diagram into a bounded frame and uses `react-zoom-pan-pinch` for zoom, drag, pinch and keyboard navigation. Its compact toolbar offers zoom out, zoom in and fit; Ctrl + scroll zooms while ordinary scrolling keeps reading the document. Each C4 level should include a short change summary. Follow the repository's `HANDOFF.md` for source/SVG authoring and regeneration. Keep each handoff and its assets in its own folder.

The canonical architecture inventory is `docs/architecture/c4-model.json`. Write its descriptions for a new engineer unfamiliar with the product. Name each component element after the code it owns: use the exported React component names for React surfaces, and keep a descriptive name for build modules that are not React. Generate `.puml` files with `bun run --cwd apps/handoffs c4:generate`, render their SVGs locally, and run `bun run --cwd apps/handoffs c4:check`. The check uses Zod to validate structure and cross-references, then checks for generated-source drift; it also runs before every viewer build. Shared elements and relationships are referenced by stable IDs across diagrams.

New handoffs follow the change-focused contract in `HANDOFF.md`: before/after technical changes with reasons and code references, C1/C2/C3 change accounting, and a `Check | Result | Evidence` verification table. Run `bun run --cwd apps/handoffs docs:check` from the repository root. The viewer build and typecheck run it automatically, so normal repository commits reject nonconforming new documents. The six pre-contract historical records remain frozen exceptions.

New C4 views use per-view `changes.elements` / `changes.relationships` annotations (`added`, `changed`, `removed`, plus a concrete description), or `unchangedReason` for unchanged context. Generated labels and a change key show the delta inside the SVG. Existing views are preserved.
