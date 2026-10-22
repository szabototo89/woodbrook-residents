# Browseable agent handoffs

Status: Available

## Job to be done

When another agent continues a feature, it needs the technical changes, their reasons, appearance, architecture impact, and verification evidence in a durable document it can also review in a browser.

## Visible behavior

- New handoffs lead with a Technical changes table containing Area, Before, After, Why and Code; the comparison baseline is recorded in the document.
- Architecture changes account for C1/C2/C3, with concrete delta descriptions inside diagrams, including changed relationships. Unchanged levels explain why.
- Verification is a Check / Result / Evidence table using PASS, FAIL or NOT RUN, with commands, observed outcomes and limitations in the evidence cells.
- The handoff build and typecheck reject new documents that omit the required sections/tables or introduce diagrams without change annotations or unchanged reasons. Six historical records are exempt and remain unchanged.
- An independent viewer in `apps/handoffs` lists `docs/handoffs/*/index.mdx`, opened with `bun run dev:handoffs` at `http://127.0.0.1:3002/`.
- The index combines search, quick update windows and sorting. Search matches title, summary and status; All, 7, 30 and 90-day windows use `updatedAt`; sort options are newest, oldest and title. Undated documents appear under All and sort after dated documents.
- The visible count announces the filtered subset, and empty searches or windows offer `Show all handoffs` to restore the full list.
- Hash links such as `/#/agent-handoffs` open documents on any static server.
- Each handoff has its own folder containing index.mdx and assets; no handoff shares an asset directory.
- Appearance galleries support thumbnails, previous/next buttons, arrow keys, full-size images, and a per-image description of what to check.
- The document header shows recorded status, coding agent, agent session, worktree, Git branch/HEAD and UTC update time in a compact grid.
- Lucide icons supplement visible labels for status badges, search, filters, card actions, metadata, section outline, gallery controls and diagram controls.
- Section navigation jumps within the document; readable text width and expandable diagrams keep the document easy to scan.
- Development detects added/removed handoff folders without restarting. An empty index explains where to add documents.
- MDX renders headings, tables, disabled task lists, imported screenshots, and code.
- The `PlantUmlDiagram` component displays locally rendered C4-PlantUML SVGs with expandable source and a full-size link. Every C4 level has a short summary of what changed.
- All architecture views are written for a new engineer unfamiliar with the product. A shared JSON inventory defines canonical elements, responsibilities, boundaries, relationships and diagram ownership; Zod verifies its structure and references before generating PlantUML, and the build rejects stale sources.
- Diagrams start fitted to a bounded frame, with a compact icon toolbar for zoom out, zoom in and fit. Drag, pinch, Ctrl + scroll and focused arrow keys support inspection without enlarging the document. Ordinary scrolling continues to scroll the page.
- Tables scroll within the document on mobile. Unknown documents show a recovery link.

## Acceptance criteria

- Invalid new handoffs fail `docs:check`, the viewer build and the repository precommit typecheck.
- Per-view C4 changes render textual added/changed/removed labels and descriptions on elements and relationships, plus a key; annotations must refer to IDs in the view.
- Root and web guidance point to the simple `HANDOFF.md` template and require MDX under the repository's `docs/handoffs/` directory.
- Search, update windows and sorting combine without leaving the index, report an accurate visible count, and keep the full list recoverable from an empty result.
- Every handoff records a coding agent, agent session, worktree, Git branch/HEAD and UTC update time in its metadata; the header shows each recorded value or an explicit missing value.
- Metadata stays compact on desktop/mobile; section navigation preserves the current document URL.
- Completed handoffs are historical records: new work gets a new handoff slug, and only a required frontmatter metadata migration may change an old handoff.
- Handoff browsing runs independently of the public website and its CMS.
- Each handoff owns its document and all assets; gallery images include descriptions of what the reviewer should check.
- Repository MDX is listed and renders tables, task lists, screenshots, C4 diagrams and per-level change summaries.
- Desktop/mobile readers can return to the index without horizontal page overflow.
- Icon-only controls have accessible names; icons that accompany text remain decorative and do not replace the visible label.
- Diagram failures preserve readable source; ordinary code remains code.
- All existing C4 diagrams use versioned `.puml` and `.svg` assets; viewing them makes no requests to a diagram service and requires no local Java runtime.
- Changing a canonical element updates every generated view that references it. Invalid references, incorrect boundaries, abstraction mismatches and source drift fail verification.
- Opening a diagram shows the complete diagram within the frame; zoom and navigation work on desktop and mobile, and Fit restores the complete diagram after zooming, panning or resizing.
- The static build includes documents present at build time.

## Scope

Included: an enforced change-focused template, MDX structure checks, per-view C4 change annotations, repository-authored MDX, an independent browser reader with client-side search, update windows and sorting, C4-PlantUML source and SVG assets, and a zoomable diagram viewer.

Excluded: public website integration, editing, uploads, CMS storage, access control, and automatic publication. MDX is trusted repository code. Built output needs rebuilding when documents change.

## Implementation references

[MDX's Vite integration](https://mdxjs.com/getting-started/), [GFM extensions](https://mdxjs.com/docs/extending-mdx/), [C4-PlantUML](https://github.com/plantuml-stdlib/C4-PlantUML), [PlantUML local rendering](https://plantuml.com/command-line), and [react-zoom-pan-pinch](https://github.com/BetterTyped/react-zoom-pan-pinch) were reviewed on 21 October 2026.

See the [feature handoff](../handoffs/agent-handoffs/index.mdx) for architecture and verification evidence.
