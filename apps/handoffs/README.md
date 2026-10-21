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

The canonical architecture inventory is `docs/architecture/c4-model.json`. Write its descriptions for a new engineer unfamiliar with the product. Generate `.puml` files with `bun run --cwd apps/handoffs c4:generate`, render their SVGs locally, and run `bun run --cwd apps/handoffs c4:check`. The check uses Zod to validate structure and cross-references, then checks for generated-source drift; it also runs before every viewer build. Shared elements and relationships are referenced by stable IDs across diagrams.
