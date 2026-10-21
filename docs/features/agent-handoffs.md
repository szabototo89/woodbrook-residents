# Browseable agent handoffs

Status: Available

## Job to be done

When another agent continues a feature, it needs the current context, decisions, appearance, architecture, and verification evidence in a durable document it can also review in a browser.

## Visible behavior

- An independent viewer in `apps/handoffs` lists `docs/handoffs/*/index.mdx`, opened with `bun run dev:handoffs` at `http://127.0.0.1:3002/`.
- Hash links such as `/#/agent-handoffs` open documents on any static server.
- Each handoff has its own folder containing index.mdx and assets; no handoff shares an asset directory.
- Appearance galleries support thumbnails, previous/next buttons, arrow keys, full-size images, and a per-image description of what to check.
- MDX renders headings, tables, disabled task lists, imported screenshots, and code.
- Mermaid fences and the `MermaidDiagram` component render C4 diagrams with expandable source. Every C4 level has a short summary of what changed.
- Tables and diagrams scroll within the document on mobile. Unknown documents show a recovery link.

## Acceptance criteria

- Root and web guidance point to the simple `HANDOFF.md` template and require MDX under the repository's `docs/handoffs/` directory.
- Handoff browsing runs independently of the public website and its CMS.
- Each handoff owns its document and all assets; gallery images include descriptions of what the reviewer should check.
- Repository MDX is listed and renders tables, task lists, screenshots, C4 diagrams and per-level change summaries.
- Desktop/mobile readers can return to the index without horizontal page overflow.
- Diagram failures preserve readable source; ordinary code remains code.
- The static build includes documents present at build time.

## Scope

Included: a small starting template, repository-authored MDX, an independent browser reader, and Mermaid C4 rendering.

Excluded: public website integration, editing, uploads, CMS storage, access control, and automatic publication. MDX is trusted repository code. Built output needs rebuilding when documents change.

## Implementation references

[MDX's Vite integration](https://mdxjs.com/getting-started/), [GFM extensions](https://mdxjs.com/docs/extending-mdx/), and [Mermaid C4 syntax](https://mermaid.js.org/syntax/c4.html) were reviewed on 21 October 2026.

See the [feature handoff](../handoffs/agent-handoffs/index.mdx) for architecture and verification evidence.
