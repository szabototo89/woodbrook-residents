# Developer dashboard

Status: Available

## Job to be done

As a Woodbrook software engineer, I can answer “what is running?”, “what is
broken?”, and “what can I do about it?” from one operational inventory of
workspace environments.

## Visible behavior

- `/` redirects to `/environments`, the operational home page: a small
  clickable status summary, search/filter controls, and a dense environment
  table (environment, status, owner, TTL, cost, actions). No giant metric
  cards and no decorative charts.
- Every environment name is a real link to `/environments/<id>`; filters
  persist in URL query parameters (`search`, `status`, `owner`, `template`,
  `lifecycle`) so filtered views are shareable.
- Environment detail shows name, status badge (dot plus text, never color
  alone), type, owner, repository, branch, region, TTL, cost, and primary
  actions, with deep-linkable tabs (`?tab=`): Overview, Scripts,
  Infrastructure, Actions, Logs.
- Status uses a normalized vocabulary (running, starting, stopping, stopped,
  updating, paused, failed, unhealthy, expired, deleting). Local targets
  report stopped until a live probe confirms otherwise; TTL and cost render
  honest empty states (“No TTL”, cost not tracked) instead of invented data.
- Sidebar navigates Overview, Environments, Templates, Projects, Activity,
  with Infrastructure and Actions separated under Workspace. Legacy
  `/app/<name>` URLs redirect to their environment detail page.
- `⌘K`/`Ctrl+K` opens a command palette for environments and pages; `/`
  focuses the environment search; `Esc` closes overlays.
- New apps, links, and actions are added as data in
  `src/features/dashboard/registry.ts` and validated by `registrySchema.ts`;
  environments derive from that registry, so no layout change is needed.

## Acceptance criteria

- Unit tests validate the status vocabulary, honest registry-derived
  environments, filtering, summaries, and URL filter round-trips.
- Browser tests render the inventory, the filter empty state with recovery,
  status/TTL/cost indicators, and the detail page with tabs.
- E2E tests prove home redirect, URL-persisted search with clear recovery,
  deep-linkable tabs with working history, legacy redirects, sidebar
  navigation, the command palette shortcut, and skip-link focus.
- Mobile E2E test verifies no horizontal overflow on a phone viewport.
- UI uses the Astryx butter theme with monospace commands, sentence-case
  copy, visible focus, keyboard operation, and reduced-motion support.
- `bun run build:dashboard`, typecheck, lint, and dashboard unit/browser/e2e
  suites pass.

## Scope

- Local engineering tool only; not linked from the public resident site.
- No production secrets, no remote command execution; actions are documented
  commands plus console deep-links.
- Infrastructure URLs are discovered from repository config and docs; none
  are invented. Status, TTL, and cost show only what the registry and repo
  config actually support.
