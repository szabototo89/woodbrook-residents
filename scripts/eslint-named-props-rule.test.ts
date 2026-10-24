import { expect, test } from 'bun:test';
import { ESLint, Linter } from 'eslint';
import tseslint from 'typescript-eslint';
import { reactPropsParamConfig } from '../eslint.react-props-param.js';

const ruleId = 'woodbrook-props/no-inline-props-type';
const linter = new Linter();
const verify = (code: string) =>
  linter.verify(
    code,
    {
      files: ['**/*.tsx'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: { ecmaFeatures: { jsx: true } },
      },
      plugins: reactPropsParamConfig.plugins,
      rules: { [ruleId]: 'error' },
    },
    { filename: 'Component.tsx' },
  );

test('named props rule is enabled in the shared config', () => {
  expect(reactPropsParamConfig.rules[ruleId]).toBe('error');
});

test.each([
  'function Foo(props: { text: string }) { return <p>{props.text}</p>; }',
  'const Foo = (props: { text: string }) => <p>{props.text}</p>;',
  'const Foo = function(props: { text: string }) { return <p>{props.text}</p>; };',
  'function Foo({ text }: { text: string }) { return <p>{text}</p>; }',
  'function Foo(props: { text?: string } = {}) { return <p>{props.text}</p>; }',
  'function Foo(props: BaseProps & { text: string }) { return <p>{props.text}</p>; }',
  'function Foo(props: { text: string } | undefined) { return <p>{props?.text}</p>; }',
  'function Foo(props: Readonly<{ text: string }>) { return <p>{props.text}</p>; }',
  'export default (props: { text: string }) => <p>{props.text}</p>;',
  'export default function(props: { text: string }) { return <p>{props.text}</p>; }',
  'const parts = { Foo: (props: { text: string }) => <p>{props.text}</p> };',
  'const Foo = memo((props: { text: string }) => <p>{props.text}</p>);',
  'const Foo = React.memo((props: { text: string }) => <p>{props.text}</p>);',
  'const Foo = memo(forwardRef((props: { text: string }, ref) => <p ref={ref}>{props.text}</p>));',
  'const Foo = forwardRef<HTMLParagraphElement, { text: string }>((props, ref) => <p ref={ref}>{props.text}</p>);',
  'const Foo = React.memo<{ text: string }>((props) => <p>{props.text}</p>);',
  'const Foo: React.FC<{ text: string }> = (props) => <p>{props.text}</p>;',
  'const Foo: FunctionComponent<{ text: string }> = (props) => <p>{props.text}</p>;',
])('named props rule rejects inline props: %s', (code) => {
  const messages = verify(code);
  expect(messages).toHaveLength(1);
  expect(messages[0]?.ruleId).toBe(ruleId);
  expect(messages[0]?.message).toContain('named type or interface');
});

test.each([
  'type FooProps = { text: string }; function Foo(props: FooProps) { return <p>{props.text}</p>; }',
  'interface FooProps { text: string } const Foo = (props: FooProps) => <p>{props.text}</p>;',
  'function Foo(props: PropsWithChildren<FooProps>) { return <p>{props.text}</p>; }',
  'function Foo(props: FooProps | OtherProps) { return <p />; }',
  'function Foo(props: FooProps = { text: "hello" }) { return <p>{props.text}</p>; }',
  'function Foo(props) { return <p>{props.text}</p>; }',
  'const Foo: React.FC<FooProps> = (props) => <p>{props.text}</p>;',
  'const Foo = forwardRef<HTMLParagraphElement, FooProps>((props, ref) => <p ref={ref}>{props.text}</p>);',
  'function toLabel(props: { text: string }) { return props.text; }',
  'const toLabel = (props: { text: string }) => props.text;',
  'const toLabel = memo((props: { text: string }) => props.text);',
  'function Foo(props: FooProps): { text: string } { return { text: props.text }; }',
  'function Foo(props: FooProps) { const data: { text: string } = props; return <p>{data.text}</p>; }',
])('named props rule allows named props and unrelated types: %s', (code) => {
  expect(verify(code)).toEqual([]);
});

test('root ESLint config rejects the requested example', async () => {
  const eslint = new ESLint();
  const results = await eslint.lintText(
    'export function Foo(props: { text: string }) { return <p>{props.text}</p>; }',
    { filePath: 'apps/web/src/InlinePropsExample.tsx' },
  );
  expect(results[0]?.messages.map((message) => message.ruleId)).toContain(
    ruleId,
  );
});
