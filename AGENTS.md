# Woodbrook repository guidance

## Architecture

- `apps/web` is the TanStack Start public website.
- `apps/cms` is the Strapi headless CMS.
- Use Bun for dependency management and repository scripts.
- Keep route files focused on routing and loading. Put product UI and domain logic under `apps/web/src/features/`.
- Keep shared application chrome under `apps/web/src/components/`.
- Keep CMS content types small and task-focused. Prefer a field on an existing type over a new abstraction when the information has the same publishing lifecycle.

## Git workflow

- Every coding session must use a dedicated Git worktree and session branch created from `main`. Do not develop directly in the primary checkout.
- Make all edits, builds, tests, and commits inside that session worktree.
- During development, create small, self-contained commits. Each commit must represent one coherent change and leave the repository in a usable state.
- When the requested work is complete and verified, automatically merge the session branch back into local `main`; do not stop after merely committing or handing off the branch.
- Before merging, confirm that the primary checkout is on `main` and has no unrelated uncommitted changes. Never overwrite, discard, reset, or include user-owned changes.
- Use a non-interactive merge without rewriting existing history. If `main` cannot be merged cleanly, stop and report the conflict instead of forcing the merge.
- After a successful merge, remove the session worktree and delete the merged session branch.

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

## Feature documentation

- Document user-visible capabilities in `docs/features/` using a job-to-be-done, visible behavior, acceptance criteria, and explicit scope.
- Use one of these statuses: `Requested`, `In progress`, `Available`, `Deferred`, or `Removed`.
- Mark a capability `Available` only after implementation and verification agree.
