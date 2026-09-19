import { expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');

test('pre-commit hook auto-formats staged files with prettier', async () => {
  const source = await readFile(join(root, '.githooks', 'pre-commit'), 'utf8');

  expect(source).toContain('prettier --write');
});

test('pre-commit hook re-stages auto-formatted files', async () => {
  const source = await readFile(join(root, '.githooks', 'pre-commit'), 'utf8');

  expect(source).toContain('xargs git add');
});

test('pre-commit hook still gates on lint and tests after formatting', async () => {
  const source = await readFile(join(root, '.githooks', 'pre-commit'), 'utf8');

  expect(source).toContain('bun run precommit');
});
