import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from 'vitest';

import { appStyles } from './appStyles';
import { minifyCss } from './css';

test('css minifier strips comments and collapses whitespace', () => {
  expect(
    minifyCss('a { color: red; } /* comment */\n\nb { color: blue; }'),
  ).toBe('a{color:red}b{color:blue}');
});

test('global app styles exclude booking-only calendar imports', () => {
  const sourcePath = join(
    dirname(fileURLToPath(import.meta.url)),
    'appStyles.ts',
  );
  const source = readFileSync(sourcePath, 'utf8');

  expect(source).not.toContain('react-day-picker');
  expect(source).not.toContain('.rdp-');
});

test('global app styles are minified to keep the document small', () => {
  expect(appStyles).not.toContain('/*');
  expect(appStyles).not.toContain('\n');
});
