# All-project development launcher

Status: Available

## Job to be done

As a Woodbrook software engineer, I can start every browser-based project at
once, see which ones are ready, and stop or restart one project without losing
the others or my terminal session.

## Visible behavior

- `bun run dev:all` starts the Woodbrook web, dashboard, handoffs, Laura
  Faichney web, design proposals, Forma Studio web and Studio, mobile web, and
  both Sanity Studios concurrently.
- A terminal project list shows each project, its lifecycle state, announced
  URL, owned ports and the latest error. A selected project shows its own
  stdout/stderr/system log.
- Up/Down or `j`/`k` moves the selection. `s` or Enter starts the selected
  project, `x` stops it, `r` restarts it, and `q` or Ctrl+C quits.
- Readiness is reported only after an HTTP status below 500 or a TCP connection
  succeeds. A project that is still preparing stays `starting`.
- An occupied owned port makes that project `failed` without stopping the
  process that owns the port. A failed project keeps its error visible and can
  be restarted after the cause is fixed.
- Starting a running project or stopping a stopped project has no effect.
- Quitting, Ctrl+C, SIGTERM, a terminal error, or a startup error stops only the
  process groups the launcher created. It sends SIGTERM, waits five seconds,
  then sends SIGKILL.
- Redirected output or `--no-interactive` writes prefixed lifecycle and log
  lines instead of the terminal UI. Ctrl+C exits 0. The command exits 1 when
  every project fails.

## Acceptance criteria

- Lifecycle tests prove concurrent starts, readiness gating, start/stop/start,
  duplicate-start prevention, child-tree cleanup, occupied-port refusal,
  startup failure and unexpected exit handling.
- Interaction tests prove selection, start/stop/restart, visible states, URLs,
  errors, logs, resize behavior and quit cleanup.
- `bun run typecheck:scripts`, `bun run lint`, focused dev tests and
  `bun run build` pass.
- A real-terminal run starts the inventory, stops and restarts one project while
  the others remain reachable, then exits without orphan processes.

## Scope

- Local development tooling for browser projects. Native mobile simulators and
  production deployments are out of scope.
- The launcher does not install dependencies automatically and does not control
  processes it did not start.
- Existing `dev` and `dev:<project>` commands and unrelated test/build runners
  stay unchanged.
