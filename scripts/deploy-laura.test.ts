import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  buildStaticDeployEnv,
  getLauraDeployConfig,
  pagesDeployArgs,
} from './deploy-laura';

const repositoryRoot = resolve(import.meta.dir, '..');

test('uses the Laura Cloudflare Pages project and production URL by default', () => {
  const config = getLauraDeployConfig({});

  expect(config).toMatchObject({
    projectName: 'laura-faichney-all-things-art',
    siteUrl: 'https://laura-faichney-all-things-art.pages.dev',
    branch: 'main',
    appDir: 'apps/laura-faichney-web',
    distClientDir: 'apps/laura-faichney-web/dist/client',
  });
});

test('builds the static site with the production site URL', () => {
  const config = getLauraDeployConfig({});
  const env = buildStaticDeployEnv(config, {});

  expect(env.VITE_PUBLIC_SITE_URL).toBe(
    'https://laura-faichney-all-things-art.pages.dev',
  );
});

test('builds wrangler pages deploy args for the Laura project', () => {
  const config = getLauraDeployConfig({});

  expect(pagesDeployArgs(config, 'abc123')).toEqual([
    'pages',
    'deploy',
    'apps/laura-faichney-web/dist/client',
    '--project-name=laura-faichney-all-things-art',
    '--branch=main',
    '--commit-hash=abc123',
  ]);
});

test('wires a root deploy:laura script and an app deploy script', () => {
  const rootPackage = JSON.parse(
    readFileSync(join(repositoryRoot, 'package.json'), 'utf8'),
  );
  const appPackage = JSON.parse(
    readFileSync(
      join(repositoryRoot, 'apps/laura-faichney-web/package.json'),
      'utf8',
    ),
  );

  expect(rootPackage.scripts['deploy:laura']).toBe(
    'bun scripts/deploy-laura.ts',
  );
  expect(appPackage.scripts.deploy).toBe('bun ../../scripts/deploy-laura.ts');
});
