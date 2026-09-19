import { expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');

test('props-param rule ships as a shared flat config', async () => {
  const shared = await import('../eslint.react-props-param.js');

  expect(shared.reactPropsParamConfig.files).toEqual(['**/*.{ts,tsx}']);
  expect(
    shared.reactPropsParamConfig.rules?.[
      'woodbrook-props/no-destructured-props-param'
    ],
  ).toEqual('error');
});

test('props-param rule forbids destructured component params', async () => {
  const shared = await import('../eslint.react-props-param.js');
  const { Linter } = await import('eslint');
  const plugin = shared.reactPropsParamConfig.plugins?.['woodbrook-props'];
  const rule = plugin?.rules?.['no-destructured-props-param'];

  expect(rule).toBeDefined();

  const linter = new Linter();
  const flatConfig = {
    plugins: {
      'woodbrook-props': plugin,
    },
    rules: {
      'woodbrook-props/no-destructured-props-param': 'error',
    },
  };
  const verify = (code: string) => linter.verify(code, flatConfig);

  const bad = `export function Card({ title }) { return title; }`;
  const badMessages = verify(bad);
  expect(badMessages).toHaveLength(1);
  expect(badMessages[0]?.message).toContain('Do not destructure');
  expect(badMessages[0]?.message).toContain('props.');

  const arrowBad = `export const Card = ({ title }) => title;`;
  expect(verify(arrowBad)).toHaveLength(1);

  const good = `export function Card(props) { return props.title; }`;
  expect(verify(good)).toHaveLength(0);

  const nonComponent = `function toLabel({ title }) { return title; }`;
  expect(verify(nonComponent)).toHaveLength(0);
});

test('root flat config reuses the shared props-param config', async () => {
  const source = await readFile(join(root, 'eslint.config.js'), 'utf8');

  expect(source).toContain('eslint.react-props-param.js');
  expect(source).toContain('reactPropsParamConfig');
});
