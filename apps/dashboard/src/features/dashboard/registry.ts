import type { z } from 'zod';

import type {
  actionSchema,
  appSchema,
  infraLinkSchema,
} from './registrySchema';
import { validateRegistry } from './registrySchema';

export type DashboardApp = z.infer<typeof appSchema>;
export type InfraLink = z.infer<typeof infraLinkSchema>;
export type DashboardAction = z.infer<typeof actionSchema>;

const GITHUB_REPO = 'https://github.com/szabototo89/woodbrook-residents';

export const apps: DashboardApp[] = [
  {
    name: 'web',
    description:
      'Public TanStack Start resident hub for Woodbrook, Shankill. Static Cloudflare build from CMS content.',
    stack: 'TanStack Start · React 19 · Vite · Vitest · Playwright',
    localUrl: 'http://localhost:3000',
    scripts: {
      dev: 'bun run --cwd apps/web dev',
      build: 'bun run --cwd apps/web build',
      'test:unit': 'bun run --cwd apps/web test:unit',
      'test:e2e': 'bun run --cwd apps/web test:e2e',
    },
    infraGroups: ['source', 'hosting', 'analytics'],
  },
  {
    name: 'cms',
    description:
      'Strapi headless CMS holding Woodbrook content types. Publishes trigger static rebuilds.',
    stack: 'Strapi 5 · SQLite · Node 24',
    localUrl: 'http://localhost:1337',
    scripts: {
      develop: 'bun run --cwd apps/cms develop',
      build: 'bun run --cwd apps/cms build',
    },
    infraGroups: ['cms', 'source', 'hosting'],
  },
  {
    name: 'dashboard',
    description:
      'Developer dashboard tracking workspace apps, infrastructure links, and build actions.',
    stack: 'TanStack Start · React 19 · Vite · Vitest · Playwright',
    localUrl: 'http://localhost:3001',
    scripts: {
      dev: 'bun run --cwd apps/dashboard dev',
      build: 'bun run --cwd apps/dashboard build',
      'test:unit': 'bun run --cwd apps/dashboard test:unit',
      'test:e2e': 'bun run --cwd apps/dashboard test:e2e',
    },
    infraGroups: ['source', 'hosting'],
  },
];

export const infraLinks: InfraLink[] = [
  { label: 'GitHub repository', url: GITHUB_REPO, group: 'source' },
  {
    label: 'GitHub Actions',
    url: `${GITHUB_REPO}/actions`,
    group: 'source',
  },
  {
    label: 'Lighthouse workflow',
    url: `${GITHUB_REPO}/actions/workflows/lighthouse.yml`,
    group: 'source',
  },
  {
    label: 'Daily Cloudflare rebuild workflow',
    url: `${GITHUB_REPO}/blob/main/.github/workflows/daily-cloudflare-rebuild.yml`,
    group: 'hosting',
  },
  {
    label: 'Cloudflare Workers and Pages docs',
    url: 'https://developers.cloudflare.com/pages/configuration/build-configuration/',
    group: 'hosting',
  },
  {
    label: 'Cloudflare deploy hooks docs',
    url: 'https://developers.cloudflare.com/pages/configuration/deploy-hooks/',
    group: 'hosting',
  },
  {
    label: 'Strapi local admin',
    url: 'https://docs.strapi.io/cms/admin-panel',
    group: 'cms',
  },
  {
    label: 'Microsoft Clarity',
    url: 'https://clarity.microsoft.com/',
    group: 'analytics',
  },
];

export const actions: DashboardAction[] = [
  { label: 'Install dependencies', command: 'bun run install', cwd: '.' },
  { label: 'Lint all', command: 'bun run lint', cwd: '.' },
  { label: 'Build web', command: 'bun run build:web', cwd: '.' },
  { label: 'Build dashboard', command: 'bun run build:dashboard', cwd: '.' },
  { label: 'Unit tests', command: 'bun run test:unit', cwd: '.' },
  { label: 'Browser tests', command: 'bun run test:browser', cwd: '.' },
  { label: 'E2E tests', command: 'bun run test:e2e', cwd: '.' },
];

validateRegistry({ apps, infraLinks, actions });
