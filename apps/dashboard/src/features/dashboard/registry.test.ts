import { expect, test } from 'vitest';

import { actions, apps, infraLinks } from './registry';
import { validateRegistry } from './registrySchema';

test('dashboard registry tracks every workspace app with ports and scripts', () => {
  const names = apps.map((app) => app.name);
  expect(names).toEqual(expect.arrayContaining(['web', 'cms', 'dashboard']));
  for (const app of apps) {
    expect(app.description.length).toBeGreaterThan(10);
    expect(app.localUrl).toMatch(/^http:\/\/localhost:\d+$/);
    expect(Object.keys(app.scripts).length).toBeGreaterThan(0);
  }
});

test('dashboard registry links only discovered infrastructure with https URLs', () => {
  expect(infraLinks.length).toBeGreaterThan(0);
  for (const link of infraLinks) {
    expect(link.label.length).toBeGreaterThan(2);
    expect(link.url).toMatch(/^https:\/\//);
  }
  const labels = infraLinks.map((link) => link.label).join(' ');
  expect(labels).toMatch(/GitHub/);
  expect(labels).toMatch(/Cloudflare/);
});

test('dashboard registry exposes runnable workspace actions as data', () => {
  expect(actions.length).toBeGreaterThan(0);
  for (const action of actions) {
    expect(action.command.startsWith('bun run')).toBe(true);
  }
});

test('dashboard registry stays extendable without layout changes', () => {
  expect(() =>
    validateRegistry({
      apps: [
        ...apps,
        {
          name: 'future-app',
          description: 'A future workspace application placeholder entry.',
          stack: 'Bun · TypeScript',
          localUrl: 'http://localhost:3002',
          scripts: { dev: 'bun run --cwd apps/future-app dev' },
        },
      ],
      infraLinks,
      actions,
    }),
  ).not.toThrow();
});
