# Forma Studio TypeScript quality gate

Status: Available

## Job to be done

As a Forma Studio developer, I want unsafe TypeScript rejected before a production build so missing values and untrusted input require explicit handling.

## Visible behavior

`bun run --cwd apps/forma-studio-web build` runs strict typechecking and blocking lint checks before Vite. Errors stop the build. The deployment workflow runs those checks and the enforcement regressions before publishing. Website copy, appearance and navigation do not change.

## Acceptance criteria

- All handwritten `.ts` and `.tsx` files use effective `strict`, `noImplicitAny`, `strictNullChecks` and `noUncheckedIndexedAccess` settings.
- Lint rejects explicit `any` and unsafe assignments, arguments, returns, calls and member access from an `any` API.
- Lint rejects postfix non-null and definite-assignment assertions, including optional-chain assertions.
- Validation of `unknown`, null guards, constructor initialization and logical negation pass.
- Type assertions, compiler suppression comments and inline lint suppressions cannot bypass the checks.
- Regression tests verify nonzero CLI exits, valid inputs, file coverage, generated-file exclusion, build order and CI wiring.
- Root lint, typecheck and tests continue to include Forma Studio.

## Scope

Includes application code, tests, scripts and configuration in `apps/forma-studio-web`, build commands, deployment checks and developer documentation. Generated files, dependency declarations, build output and other applications' type policies are excluded. `src/routeTree.gen.ts` is excluded from lint and compiler root-file discovery; imports still resolve normally. This work does not change the generator or integrate Sanity.

## Developer checks

```sh
bun run --cwd apps/forma-studio-web typecheck
bun run --cwd apps/forma-studio-web lint
bun test scripts/eslint-forma-type-safety.test.ts scripts/deploy-forma.test.ts
bun run --cwd apps/forma-studio-web test:unit
bun run build
```
