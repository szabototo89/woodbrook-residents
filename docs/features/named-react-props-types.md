# Named React component props types

Status: Available

## Job to be done

When I review a React component, I want its props contract declared as a named type or interface so I can read the contract separately from the implementation.

## Visible behavior

- ESLint reports `woodbrook-props/no-inline-props-type` as an error for `function Foo(props: { text: string })`.
- `type FooProps = { text: string }; function Foo(props: FooProps)` passes. An interface also passes. No specific type name is required.
- The rule checks function declarations, function expressions, arrows, PascalCase object properties, and anonymous default exports.
- It also checks `memo` and `forwardRef` callbacks and props type arguments, plus `FC` and `FunctionComponent` annotations, with optional namespace qualification.
- Inline object literals inside props unions, intersections, and generic wrappers such as `Readonly` also fail.
- The diagnostic asks the author to extract a named type. It does not rewrite code automatically.
- The root shared props config enables the rule for TypeScript and TSX files. The script regression runs through `bun run test:scripts`.

## Acceptance criteria

- The user's `function Foo(props: { text: string })` example fails through the real repository ESLint configuration.
- Named type aliases and interfaces pass, including named types passed through React wrappers.
- Lowercase helper parameters, local object annotations, and return types remain outside this rule.
- Existing components and component test doubles use named props types and pass repository lint and typechecks.

## Scope

This is syntax-based enforcement. PascalCase declarations and properties are treated as components; anonymous default exports are also checked. Wrapper names are recognized by spelling. Imported aliases, custom higher-order components, class components, and mapped type syntax are outside this rule. It does not require a props annotation, a particular parameter name, or a particular alias name. Named declarations can contain nested object types. The existing rule against destructured component parameters remains active.
