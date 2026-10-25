# Woodbrook repository guidance

## Architecture

- `apps/web` is the TanStack Start public website.
- `apps/sanity-studio` is the Sanity Studio content editor.
- Use Bun for dependency management and repository scripts.
- Keep route files focused on routing and loading. Put product UI and domain logic under `apps/web/src/features/`.
- Keep shared application chrome under `apps/web/src/components/`.
- Keep CMS content types small and task-focused. Prefer a field on an existing type over a new abstraction when the information has the same publishing lifecycle.

## Git workflow

- At session start, check whether the current checkout is already a linked Git worktree. If so, reuse that worktree and its branch; do not create a new worktree for each agentic session. Otherwise, create a dedicated Git worktree and session branch from `main`. Do not develop directly in the primary checkout.
- Make all edits, builds, tests, and commits inside that session worktree.
- During development, create small, self-contained commits. Each commit must represent one coherent change and leave the repository in a usable state.
- When the requested work is complete and verified, automatically merge the session branch back into local `main`; do not stop after merely committing or handing off the branch.
- Before merging, confirm that the primary checkout is on `main` and has no unrelated uncommitted changes. Never overwrite, discard, reset, or include user-owned changes.
- Use a non-interactive merge without rewriting existing history. You are always authorized to resolve merge conflicts autonomously without asking for permission. Preserve the intended behavior of both branches and all user-owned changes, verify the resolved result, and continue the merge.
- Never use `--no-verify` (or any hook-bypass flag) when committing. If hooks fail, fix the cause instead of bypassing them.
- After a successful merge, remove only a worktree created by the current session with `scripts/worktree-remove.sh <path>` (it closes the linked cmux workspace; raw `git worktree remove` fires no hook) and delete its merged session branch. Preserve a reused worktree and its branch for later sessions.

## GitHub issues

- When creating or updating a GitHub issue, add the label for the app or project it concerns alongside its issue-type label (for example, `enhancement` or `bug`).
- Forma Studio issues must include the `forma studio` label. Create the label if it does not exist, and preserve existing relevant labels.
- When working on an existing GitHub issue, post concise status comments on that issue when work starts, at meaningful progress or blockers, and on completion. State what changed, relevant verification, and any remaining work; do not imply implementation is complete when only planning or issue creation is done.

## Dev server and preview

- After creating the session worktree, `cd` into it and run `bun install`, then start the dev server in the background with `bun run dev`. Do not block the session waiting for it.
- Wait until the dev server is ready before opening it: the web app responds on `http://localhost:3000` (dashboard on `http://localhost:3001` when relevant).
- Once ready, open the dev site in a new cmux browser tab: `cmux browser open http://localhost:3000`.
- Name the tab so the worktree and feature are obvious: `cmux rename-tab "<worktree>: <feature>"` (2-5 words, max ~40 characters, plain text, no emoji, no secrets).
- Keep the dev server running in the background for the session; stop it when the worktree is removed.

## Product behavior

- The site is a public information and action hub for Woodbrook residents in Shankill, Ireland.
- Preserve the product hierarchy: inform, organise, then act.
- Do not add a forum, comments, chat, marketplace, or social feed.
- Do not invent local facts, events, statistics, or community outcomes. Every seeded factual item must include its source URL and access date.
- Keep issue-report submissions private; public API access may create them but must never list or read them.

## Quality

- Implement all code changes using TDD: write a failing test first, then the minimal implementation to pass, then refactor.
- Follow Clean Code, KISS, and pragmatic single responsibility.
- Prefer precise names and straightforward control flow.
- Tests should assert observable behavior through roles, labels, visible copy, URLs, and submitted outcomes.
- Run `bun run build` before handoff. Use focused tests while iterating.
- For every new user-visible feature, use Playwright to capture high-resolution screenshots of the implemented result in both desktop and mobile viewports. Share both screenshots inline in the final response so the user can review the change. Use representative sample content when needed and clearly identify it as sample content. Include a screencast when it helps demonstrate motion or interaction.

## Feature documentation

- Every new handoff must follow `HANDOFF.md`: lead with technical changes relative to a recorded base commit, including before/after behavior, reasons and code references. Do not use a Current state section.
- Reflect the technical changes in the C4 diagrams themselves using per-view added/changed/removed annotations for elements and relationships. Account for C1/C2/C3; explicitly explain unchanged levels without inventing changes.
- Verification must be a Markdown table with `Check`, `Result` and `Evidence` columns. Use only `PASS`, `FAIL` or `NOT RUN`; put commands, observed outcomes and limitations in the evidence cells.
- Run `bun run --cwd apps/handoffs docs:check` before completing a handoff. The handoff build and repository precommit typecheck enforce the structure. Never expand the frozen historical exemption list to bypass these rules.
- After developing a feature, read the project's `HANDOFF.md` (fall back to the repository root) and create a new handoff at `docs/handoffs/<new-feature-slug>/index.mdx` at the repository root. Link it in the final response.
- For every feature, create a separate handoff document. Never edit a completed handoff to document a new feature. A completed handoff is an immutable historical record: preserve its title, summary, body, evidence, screenshots, worktree, branch, commit and `updatedAt`, and use a new slug for subsequent work.
- While a feature is in progress, update its own handoff. Once it is complete, stop editing it. The only permitted change to a completed handoff is adding a newly required frontmatter field during a repository-wide metadata migration; record that migration in the new handoff.
- Document user-visible capabilities in `docs/features/` using a job-to-be-done, visible behavior, acceptance criteria, and explicit scope.
- Use one of these statuses: `Requested`, `In progress`, `Available`, `Deferred`, or `Removed`.
- Mark a capability `Available` only after implementation and verification agree.
