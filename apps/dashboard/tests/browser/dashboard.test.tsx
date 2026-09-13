import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { ActionsPage } from '../../src/features/actions/ActionsPage';
import { ApplicationsPage } from '../../src/features/applications/ApplicationsPage';
import { InfrastructurePage } from '../../src/features/infrastructure/InfrastructurePage';
import { OverviewPage } from '../../src/features/overview/OverviewPage';

test('dashboard overview renders status tiles and start links', async () => {
  const screen = await render(<OverviewPage />);
  await expect
    .element(screen.getByRole('heading', { name: 'Overview' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: /GitHub repository/ }))
    .toBeVisible();
});

test('dashboard application view renders tracked apps', async () => {
  const screen = await render(<ApplicationsPage />);
  await expect
    .element(screen.getByRole('heading', { name: 'Applications' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('heading', { name: 'web' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('heading', { name: 'cms' }))
    .toBeVisible();
});

test('dashboard infrastructure view renders console links', async () => {
  const screen = await render(<InfrastructurePage />);
  await expect
    .element(screen.getByRole('heading', { name: 'Infrastructure' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: /Microsoft Clarity/ }))
    .toBeVisible();
});

test('dashboard actions view renders runnable commands', async () => {
  const screen = await render(<ActionsPage />);
  await expect
    .element(screen.getByRole('heading', { name: 'Build actions' }))
    .toBeVisible();
  await expect.element(screen.getByText('bun run lint')).toBeVisible();
});
