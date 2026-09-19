# Single `props` parameter for React components

Status: Available

## Job to be done

When I read or review a React component, I want prop reads to look like `props.<name>` and derived locals to look like plain names, so I can tell instantly which values come from the caller and which were computed inside the component.

## Visible behavior

- `eslint.react-props-param.js` at the repository root exports the shared `reactPropsParamConfig` flat-config block.
- The root `eslint.config.js` reuses that shared block for every `**/*.{ts,tsx}` file, so `apps/web`, `apps/juliet-rose-web`, `apps/dashboard`, `apps/mobile`, and any future `apps/*/src` app inherit the same rule without per-app config.
- A component declared as `function Card({ title }: Props)` fails lint with `woodbrook-props/no-destructured-props-param`: `Do not destructure React props in the parameter list. Use \`props: <Props>\` and access values as \`props.<name>\` ...`.
- The same applies to arrow components assigned to PascalCase names: `const Card = ({ title }: Props) => ...` fails, while `const Card = (props: Props) => ...` passes.
- Lowercase helpers are unaffected: `function toLabel({ title }: Item)` passes because only PascalCase component names are checked.
- Props with defaults use an explicit derived local: `function EventCard(props: Props)` plus `const headingLevel = props.headingLevel ?? 2;`, keeping the prop read (`props.headingLevel`) distinguishable from the derived value (`headingLevel`).
- `scripts/eslint-props-param-rule.test.ts` locks the shared config, the forbidden/allowed parameter shapes, and the root reuse.

## Acceptance criteria

- Given a file defines `export function Card({ title })`, when ESLint runs with the repository config, then it reports `woodbrook-props/no-destructured-props-param`.
- Given a file defines `export const Card = ({ title }) => ...`, when ESLint runs, then it reports `woodbrook-props/no-destructured-props-param`.
- Given a file defines `export function Card(props) { return props.title; }`, when ESLint runs, then it reports no `woodbrook-props` error.
- Given a lowercase helper `function toLabel({ title })`, when ESLint runs, then it reports no `woodbrook-props` error.
- Given `apps/web/src`, `apps/juliet-rose-web/src`, `apps/dashboard/src`, and `apps/mobile/src` are linted, when the shared rule is active, then all pass with no `woodbrook-props/no-destructured-props-param` errors.
- Given a new directory `apps/<new>/src` is added, when `bun run lint` runs, then its `*.tsx` files are linted without editing the lint script.

## Scope

### Included

- Shared `woodbrook-props/no-destructured-props-param` custom rule for all current and future apps.
- Root flat-config reuse and existing `apps/*/src/**` plus `apps/*/tests/**` lint coverage.
- Migration of all existing components to the single-`props` parameter shape.
- Regression test for forbidden destructured params, allowed `props` params, and non-component exemption.

### Not included

- Forbidding inner `const { x } = props;` destructuring inside the body; only the parameter list is enforced.
- Automatic codemod tooling beyond the one-off migration.
- Class-component prop handling or ref-parameter rules.
