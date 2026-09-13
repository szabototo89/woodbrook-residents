import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { apps } from '../../src/features/dashboard/registry';
import { AppWorkspacePage } from '../../src/features/workspace/AppWorkspacePage';
import { getAppByName } from '../../src/features/dashboard/appFocus';

test('dashboard app workspace renders the selected application context', async () => {
  const app = getAppByName(apps, 'cms');
  if (!app) throw new Error('cms app missing from registry');
  const screen = await render(<AppWorkspacePage app={app} />);

  await expect
    .element(screen.getByRole('heading', { name: 'cms', exact: true }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('heading', { name: 'Infrastructure for cms' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: /Strapi local admin/ }))
    .toBeVisible();
});

test('dashboard app workspace shows the selected app actions', async () => {
  const app = getAppByName(apps, 'web');
  if (!app) throw new Error('web app missing from registry');
  const screen = await render(<AppWorkspacePage app={app} />);

  await expect
    .element(screen.getByRole('heading', { name: 'web actions' }))
    .toBeVisible();
  await expect.element(screen.getByText('bun run build:web')).toBeVisible();
});
