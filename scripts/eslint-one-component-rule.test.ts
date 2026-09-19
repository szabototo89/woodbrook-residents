import { expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');

test('one-component rule ships as a shared flat config', async () => {
  const shared = await import('../eslint.react-one-component.js');

  expect(shared.reactOneComponentConfig.files).toEqual(['**/*.{ts,tsx}']);
  expect(shared.reactOneComponentConfig.rules?.['react/no-multi-comp']).toEqual(
    ['error', { ignoreStateless: false }],
  );
});

test('root flat config reuses the shared one-component config', async () => {
  const source = await readFile(join(root, 'eslint.config.js'), 'utf8');

  expect(source).toContain('eslint.react-one-component.js');
  expect(source).toContain('reactOneComponentConfig');
});

test('root lint covers TanStack Start apps now and in the future', async () => {
  const raw = await readFile(join(root, 'package.json'), 'utf8');
  const manifest: { scripts: { lint: string } } = JSON.parse(raw);

  expect(manifest.scripts.lint).toContain('apps/*/src');
  expect(manifest.scripts.lint).toContain('apps/*/tests');
});
