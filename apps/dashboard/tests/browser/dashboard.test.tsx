import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { apps } from '../../src/features/dashboard/registry';
import { getAppByName } from '../../src/features/dashboard/appFocus';
import { AppActionsSection } from '../../src/features/workspace/AppActionsSection';
import { AppInfrastructureSection } from '../../src/features/workspace/AppInfrastructureSection';
import { AppOverviewSection } from '../../src/features/workspace/AppOverviewSection';
import { AppScriptsSection } from '../../src/features/workspace/AppScriptsSection';

function cmsApp() {
  const app = getAppByName(apps, 'cms');
  if (!app) throw new Error('cms app missing from registry');
  return app;
}

test('dashboard overview section renders the selected app', async () => {
  const screen = await render(<AppOverviewSection app={cmsApp()} />);

  await expect
    .element(screen.getByRole('heading', { name: 'cms', exact: true }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: 'http://localhost:1337' }))
    .toBeVisible();
});

test('dashboard scripts section renders copyable commands', async () => {
  const screen = await render(<AppScriptsSection app={cmsApp()} />);

  await expect
    .element(screen.getByRole('heading', { name: 'Scripts' }))
    .toBeVisible();
  await expect
    .element(screen.getByText('bun run --cwd apps/cms develop'))
    .toBeVisible();
});

test('dashboard infrastructure section filters per app', async () => {
  const screen = await render(<AppInfrastructureSection app={cmsApp()} />);

  await expect
    .element(screen.getByRole('heading', { name: 'Infrastructure' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: /Strapi local admin/ }))
    .toBeVisible();
});

test('dashboard actions section shows app and workspace actions', async () => {
  const web = getAppByName(apps, 'web');
  if (!web) throw new Error('web app missing from registry');
  const screen = await render(<AppActionsSection app={web} />);

  await expect
    .element(screen.getByRole('heading', { name: 'Actions', exact: true }))
    .toBeVisible();
  await expect.element(screen.getByText('bun run build:web')).toBeVisible();
  await expect.element(screen.getByText('bun run lint')).toBeVisible();
});
