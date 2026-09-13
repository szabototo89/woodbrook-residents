import { readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

type RootPackage = {
  scripts: Record<string, string>;
};

test('content environment scripts loads the repository environment when building the static site', () => {
  const rootPackage: RootPackage = JSON.parse(
    readFileSync(
      new URL('../../../../../package.json', import.meta.url),
      'utf8',
    ),
  );

  expect(rootPackage.scripts['build:static']).toContain(
    'bun run --cwd apps/web --env-file=../../.env build:static',
  );
});

test('content environment scripts runs the static build through the content-aware build script', () => {
  const webPackage: RootPackage = JSON.parse(
    readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'),
  );

  expect(webPackage.scripts['build:static']).toBe(
    'bun scripts/build-static.ts',
  );
});

test('mobile content development loads Google Sheets credentials from the repository environment', () => {
  const rootPackage: RootPackage = JSON.parse(
    readFileSync(
      new URL('../../../../../package.json', import.meta.url),
      'utf8',
    ),
  );

  expect(rootPackage.scripts['dev:mobile-content']).toBe(
    'CONTENT_SOURCE=google-sheets bun run --cwd apps/web --env-file=../../.env dev',
  );
  expect(rootPackage.scripts['dev:mobile']).toBe(
    'WOODBROOK_API_URL=http://localhost:3000 bun run --cwd apps/mobile dev',
  );
});
