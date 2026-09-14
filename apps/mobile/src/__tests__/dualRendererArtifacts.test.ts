import { readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

test('dual renderer configs keep native and browser artifacts separate', () => {
  const lynxConfig = readFileSync('lynx.config.ts', 'utf8');
  const webConfig = readFileSync('rsbuild.web.config.ts', 'utf8');

  expect(lynxConfig).toContain("root: 'dist/ios'");
  expect(lynxConfig).toContain("root: 'dist/web-lynx'");
  expect(webConfig).toContain("root: 'dist/web'");
  expect(webConfig).toContain("from: './dist/web-lynx'");
  expect(webConfig).toContain("to: './lynx'");
});
