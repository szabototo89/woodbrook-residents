# One React component per file

Status: Available

## Job to be done

When I add or review React UI in a TanStack Start app, I want exactly one component per file, so components stay small, reviewable, and easy to move without untangling unrelated UI.

## Visible behavior

- `eslint.react-one-component.js` at the repository root exports the shared `reactOneComponentConfig` flat-config block.
- The root `eslint.config.js` reuses that shared block for every `**/*.{ts,tsx}` file, so `apps/web`, `apps/juliet-rose-web`, `apps/dashboard`, and any future `apps/*/src` TanStack Start app inherit the same rule without per-app config.
- A file declaring two or more components fails lint with `react/no-multi-comp`: `Declare only one React component per file`.
- The root `lint` script lints `"apps/*/src/**"`, `"apps/*/tests/**"`, and `scripts`, so new TanStack Start apps are enforced automatically once they add `src` or `tests` under `apps/`.
- `scripts/eslint-one-component-rule.test.ts` locks the shared config, the root reuse, and the future-proof lint globs.

## Acceptance criteria

- Given a file defines `First` and `Second` components, when ESLint runs with the repository config, then it reports `react/no-multi-comp`.
- Given a file defines a single component, when ESLint runs, then it reports no `react/no-multi-comp` error.
- Given `apps/web/src` and `apps/juliet-rose-web/src` are linted, when the shared rule is active, then both pass with no `react/no-multi-comp` errors.
- Given a new directory `apps/<new>/src` is added, when `bun run lint` runs, then its `*.tsx` files are linted without editing the lint script.
- Given the shared config changes, when the root flat config loads, then the change applies to all apps because the root imports `reactOneComponentConfig`.

## Scope

### Included

- Shared `react/no-multi-comp` config with `ignoreStateless: false` for all current and future TanStack Start apps.
- Root flat-config reuse and future-proof `apps/*/src/**` plus `apps/*/tests/**` lint coverage.
- Regression test and fixture verification for `apps/web` and `apps/juliet-rose-web`.

### Not included

- Automatic refactoring of existing multi-component files beyond what already passes.
- Class-component exemptions or per-file `eslint-disable` cleanups.
- Non-React lint rules or formatting policy changes.
