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
    'bun scripts/app.ts build:static web --env-file=../../.env',
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

test('web development has no Sheets command', () => {
  const webPackage: RootPackage = JSON.parse(
    readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'),
  );

  expect(webPackage.scripts['dev']).toBe('vite dev --port 3000');
  expect(webPackage.scripts['dev:sheets']).toBeUndefined();
});

test('root development has no Sheets command', () => {
  const rootPackage: RootPackage = JSON.parse(
    readFileSync(
      new URL('../../../../../package.json', import.meta.url),
      'utf8',
    ),
  );

  expect(rootPackage.scripts['dev:web:sheets']).toBeUndefined();
});
test('content development uses Sanity and mobile loads the repository environment', () => {
  const rootPackage: RootPackage = JSON.parse(
    readFileSync(
      new URL('../../../../../package.json', import.meta.url),
      'utf8',
    ),
  );

  expect(rootPackage.scripts['dev:web:content']).toBe(
    'CONTENT_SOURCE=sanity bun scripts/app.ts dev web --env-file=../../.env',
  );
  expect(rootPackage.scripts['dev:mobile']).toBe(
    'bun scripts/app.ts dev mobile --env-file=../../.env',
  );
});

test('default development commands select Sanity even with an older Sheets environment', () => {
  const rootPackage: RootPackage = JSON.parse(
    readFileSync(
      new URL('../../../../../package.json', import.meta.url),
      'utf8',
    ),
  );
  for (const script of ['dev', 'dev:web', 'dev:web:sanity']) {
    expect(rootPackage.scripts[script]).toBe(
      'CONTENT_SOURCE=sanity bun scripts/app.ts dev web --env-file=../../.env',
    );
  }
  const exampleEnvironment = readFileSync(
    new URL('../../../../../.env.example', import.meta.url),
    'utf8',
  );
  expect(exampleEnvironment).toMatch(/^CONTENT_SOURCE=sanity$/m);
});

test('scheduled rebuild identifies Sanity and delegates to the existing Cloudflare build hook', () => {
  const workflow = readFileSync(
    new URL(
      '../../../../../.github/workflows/daily-cloudflare-rebuild.yml',
      import.meta.url,
    ),
    'utf8',
  );
  expect(workflow).toContain('name: Daily Sanity Cloudflare rebuild');
  expect(workflow).toContain("cron: '15 3 * * *'");
  expect(workflow).toContain('secrets.CLOUDFLARE_DEPLOY_HOOK_URL');
  expect(workflow).toContain('--request POST');
});
