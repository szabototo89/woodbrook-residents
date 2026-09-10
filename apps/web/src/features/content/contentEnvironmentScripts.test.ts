import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

type RootPackage = {
  scripts: Record<string, string>;
};

describe('content environment scripts', () => {
  it('loads the repository environment when building the static site', () => {
    const rootPackage = JSON.parse(
      readFileSync(
        new URL('../../../../../package.json', import.meta.url),
        'utf8',
      ),
    ) as RootPackage;

    expect(rootPackage.scripts['build:static']).toContain(
      'bun run --cwd apps/web --env-file=../../.env build:static',
    );
  });

  it('runs the static build through the content-aware build script', () => {
    const webPackage = JSON.parse(
      readFileSync(new URL('../../../package.json', import.meta.url), 'utf8'),
    ) as RootPackage;

    expect(webPackage.scripts['build:static']).toBe(
      'bun scripts/build-static.ts',
    );
  });
});
