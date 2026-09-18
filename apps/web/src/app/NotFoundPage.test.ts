import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

test('not found page requests noindex for search engines', async () => {
  const appRoot = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '.',
  );
  const source = await readFile(path.join(appRoot, 'NotFoundPage.tsx'), 'utf8');

  expect(source).toContain('name="robots"');
  expect(source).toContain('noindex');
});
