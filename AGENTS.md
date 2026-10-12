# Woodbrook repository guidance

## Architecture

- `apps/web` is the TanStack Start public website.
- `apps/cms` is the Strapi headless CMS.
- Use Bun for dependency management and repository scripts.
- Keep route files focused on routing and loading. Put product UI and domain logic under `apps/web/src/features/`.
- Keep shared application chrome under `apps/web/src/components/`.
- Keep CMS content types small and task-focused. Prefer a field on an existing type over a new abstraction when the information has the same publishing lifecycle.

## Git workflow

- Every coding session must use a dedicated Git worktree and session branch created from `main`. Do not develop directly in the primary checkout. `git worktree add` automatically opens a Herdr entry for the new checkout via `.githooks/post-checkout` (override with `HERDR_BIN`); disable by pointing the override at a missing binary.
- Make all edits, builds, tests, and commits inside that session worktree.
- During development, create small, self-contained commits. Each commit must represent one coherent change and leave the repository in a usable state.
- When the requested work is complete and verified, automatically merge the session branch back into local `main`; do not stop after merely committing or handing off the branch.
- Before merging, confirm that the primary checkout is on `main` and has no unrelated uncommitted changes. Never overwrite, discard, reset, or include user-owned changes.
- Use a non-interactive merge without rewriting existing history. You are always authorized to resolve merge conflicts autonomously without asking for permission. Preserve the intended behavior of both branches and all user-owned changes, verify the resolved result, and continue the merge.
- Never use `--no-verify` (or any hook-bypass flag) when committing. If hooks fail, fix the cause instead of bypassing them.
- After a successful merge, remove the session worktree with `scripts/worktree-remove.sh <path>` (it closes the linked Herdr and cmux workspaces; raw `git worktree remove` fires no hook) and delete the merged session branch.

## Dev server and preview

- After creating the session worktree, `cd` into it and run `bun install`, then start the dev server in the background with `bun run dev`. Do not block the session waiting for it.
- Wait until the dev server is ready before opening it: the web app responds on `http://localhost:3000` (dashboard on `http://localhost:3001` when relevant).
- Once ready, open the dev site in a new cmux browser tab: `cmux browser open http://localhost:3000`.
- Name the tab so the worktree and feature are obvious: `cmux rename-tab "<worktree>: <feature>"` (2-5 words, max ~40 characters, plain text, no emoji, no secrets).
- Keep the dev server running in the background for the session; stop it when the worktree is removed.

## Herdr tab title

- Keep the current Herdr tab title in sync with the task: set it once at session start after the topic is known, and again only when the topic pivots (new feature, different bug, different area, explicit redirect). Do not rename on every message.
- First verify running inside Herdr: `test "${HERDR_ENV:-}" = 1`. If the check fails or `$HERDR_TAB_ID` is empty, stop silently.
- Rename only the current tab: `herdr tab rename "$HERDR_TAB_ID" "<title>"`. Never rename other tabs.
- Title: 2-5 words, max ~40 characters, plain text, no emoji, no secrets, no branch names with slashes. Describe the work, not the tool (e.g. `Fix login redirect`); optionally prefix with repo or area (e.g. `web: auth callback`).
- On failure, continue without retrying. Title sync never blocks real work.

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

- Document user-visible capabilities in `docs/features/` using a job-to-be-done, visible behavior, acceptance criteria, and explicit scope.
- Use one of these statuses: `Requested`, `In progress`, `Available`, `Deferred`, or `Removed`.
- Mark a capability `Available` only after implementation and verification agree.
