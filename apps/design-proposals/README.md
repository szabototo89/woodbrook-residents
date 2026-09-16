# Design proposals

Static, self-contained website concepts for review. The index is an independent
proposal gallery; each folder under `projects/` contains one clickable concept.

From the repository root, run:

```sh
bun run dev:proposals
```

Current proposals:

- `projects/juliet-rose/index.html`
- `projects/spotless-dog-grooming/index.html`
- `projects/spotless-dog-grooming-warm/index.html`
- `projects/the-dog-salon/index.html`

Each proposal may include a linked research document alongside the clickable
concept.

## Adding a proposal

Every proposal must be discoverable from the gallery; a standalone folder is
not complete on its own. Before marking a proposal available:

1. Put its self-contained static files under `projects/<proposal-slug>/`.
2. Add a newest-first card to the root `index.html` with a representative
   preview, plain-language summary, and relative link to the proposal.
3. Update the visible proposal count, its accessible label, card numbering, and
   the next empty-slot number.
4. Add the proposal to the user-visible behavior and scope in
   `docs/features/static-design-proposals.md`.
5. Start the gallery locally and confirm both the preview card and its “Open
   proposal” link work on desktop and mobile.

If a proposal is also kept in a standalone app directory, copy the same
finished files into `projects/<proposal-slug>/`; the gallery copy is required
because the gallery is deployed as its own static directory.

These concepts do not submit forms, store data, or connect to production systems.

## Customer-sharing standard

Every proposal is a sales presentation intended to be shared directly with the
prospective customer.

- Present a confident future vision and celebrate the business's strengths.
- Do not refer to “the current site”, “the existing website”, audits, faults, or
  shortcomings in customer-visible copy.
- Do not expose internal prompts such as “please confirm”, “before production”,
  unresolved placeholders, implementation caveats, or approval reminders.
- Phrase open decisions as collaborative next steps: “ready to refine together”,
  “we can tailor”, or “the finished website can include”.
- Keep research positive and strategic. Explain the opportunity, supporting
  evidence, design rationale, and recommended direction without criticising the
  customer's present materials.
- Keep genuinely internal notes in repository documentation, never in the
  clickable proposal.
