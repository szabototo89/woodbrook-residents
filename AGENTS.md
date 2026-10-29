# Woodbrook repository guidance

## Before creating or refining GitHub issues

- Use the [writing-issues skill](.agents/skills/writing-issues/SKILL.md) for issue work. For UI, design, layout, responsiveness or interaction issues, also load [github-issue-investigation](.agents/skills/github-issue-investigation/SKILL.md) before finalizing the ticket, even when the request is only to create an issue.
- Capture and post relevant screenshots or recordings; for design alignment, compare the application and reference at matching viewports. If capture or reproduction is blocked, check available tools/runtimes and state the concrete limitation on the issue and in the final response. Deferring screenshots to future acceptance criteria is not a substitute for current evidence.
- Disposable prototypes remain optional, uncommitted and exempt from feature delivery checks. Investigation does not authorize product implementation; the normal workflow still applies to product changes.

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
- When the requested work is complete and verified, push the session branch and create or update a GitHub pull request targeting `main`. Do not merge the session branch into local or remote `main`, enable auto-merge, or deploy to production as part of handoff. Leave the PR open for review.
- Every PR must include a working temporary Cloudflare preview URL in its description, alongside a summary of the changes and verification evidence. Deploy the affected app or apps from the PR's latest commit, verify the preview, and refresh the deployment and links after subsequent changes. Do not substitute a production URL or localhost URL for the preview.
- Never overwrite, discard, reset, or include user-owned changes. Resolve conflicts by bringing `main` into the session branch without rewriting existing history, preserve the intended behavior of both branches, verify the resolved result, and update the PR and preview. Do not merge the session branch back into `main`.
- Never use `--no-verify` (or any hook-bypass flag) when committing. If hooks fail, fix the cause instead of bypassing them.
- Preserve the session branch, worktree and preview while the PR is open. Once the PR is merged or closed, remove only a worktree created by the current session with `scripts/worktree-remove.sh <path>` (it closes the linked cmux workspace; raw `git worktree remove` fires no hook). Delete a session branch only after it is merged or its removal is explicitly requested. Preserve a reused worktree and its branch for later sessions.

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
- Before PR handoff, deploy a temporary Cloudflare preview for each affected app using its preview environment or a non-production branch. Keep production domains, routes and deployments unchanged. Verify that the preview loads and smoke-test the changed behavior; record its URL and deployed commit in the PR description and final response.
- If preview deployment is blocked by missing credentials, configuration or a Cloudflare failure, create or update a draft PR, document the blocker, and report the missing preview explicitly. Do not claim the work is ready for review or complete until a working preview link is included.
- Temporary previews are subject to the repository's seven-day retention policy. Do not delete a preview merely because a session ends; refresh an expired preview and update the PR link when review resumes. Daily cleanup runs from `.github/workflows/cleanup-cloudflare-previews.yml`; see `docs/operations/cloudflare-preview-retention.md`. Cleanup deletes preview deployments strictly older than seven days even when their pull request remains open.

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
