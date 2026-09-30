import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  buildStaticDeployEnv,
  getLauraDeployConfig,
  pagesDeployArgs,
  pagesDeployCwd,
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

test('ignores ambient VITE_PUBLIC_SITE_URL from local dotenv files', () => {
  const config = getLauraDeployConfig({
    VITE_PUBLIC_SITE_URL: 'http://localhost:3000',
  });

  expect(config.siteUrl).toBe(
    'https://laura-faichney-all-things-art.pages.dev',
  );
});

test('forces the production site URL into the static build env', () => {
  const config = getLauraDeployConfig({
    VITE_PUBLIC_SITE_URL: 'http://localhost:3000',
  });
  const env = buildStaticDeployEnv(config, {
    VITE_PUBLIC_SITE_URL: 'http://localhost:3000',
  });

  expect(env.VITE_PUBLIC_SITE_URL).toBe(
    'https://laura-faichney-all-things-art.pages.dev',
  );
});

test('allows an explicit LAURA_SITE_URL override for preview deploys', () => {
  const config = getLauraDeployConfig({
    VITE_PUBLIC_SITE_URL: 'http://localhost:3000',
    LAURA_SITE_URL: 'https://preview.example.com/',
  });

  expect(config.siteUrl).toBe('https://preview.example.com/');
});

test('builds wrangler pages deploy args for the Laura project', () => {
  const config = getLauraDeployConfig({});

  expect(pagesDeployArgs(config, 'abc123')).toEqual([
    'pages',
    'deploy',
    'dist/client',
    '--project-name=laura-faichney-all-things-art',
    '--branch=main',
    '--commit-hash=abc123',
  ]);
});

test('runs the Pages deploy from the app dir so wrangler finds the Pages config', () => {
  const config = getLauraDeployConfig({});

  expect(pagesDeployCwd(config, repositoryRoot)).toBe(
    join(repositoryRoot, 'apps/laura-faichney-web'),
  );
});

test('declares a Pages wrangler config with the build output dir', () => {
  const appConfig = readFileSync(
    join(repositoryRoot, 'apps/laura-faichney-web/wrangler.jsonc'),
    'utf8',
  );

  expect(appConfig).toContain('"name": "laura-faichney-all-things-art"');
  expect(appConfig).toContain('"pages_build_output_dir": "./dist/client"');
});

test('deploys from the app dir in CI so wrangler finds the Pages config', () => {
  const workflow = readFileSync(
    join(repositoryRoot, '.github/workflows/deploy-laura-faichney.yml'),
    'utf8',
  );

  expect(workflow).toContain('workingDirectory: apps/laura-faichney-web');
  expect(workflow).toContain('command: pages deploy dist/client');
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
