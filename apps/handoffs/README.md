# Agent handoff viewer

A standalone reader for `woodbrook/docs/handoffs/*.mdx`. It shares no routes, application chrome, CMS, or runtime services with the public website.

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

The built preview runs at <http://127.0.0.1:4182/>. Vite bundles repository-authored MDX and imported images. Mermaid renders C4 diagrams in the browser with expandable source; each C4 level should include a short change summary. Follow the repository's `HANDOFF.md` when adding a document.
