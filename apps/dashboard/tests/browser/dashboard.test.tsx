import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { getAppByName } from '../../src/features/dashboard/appFocus';
import { apps } from '../../src/features/dashboard/registry';
import { CostIndicator } from '../../src/features/environments/CostIndicator';
import { EnvironmentDetailPage } from '../../src/features/environments/EnvironmentDetailPage';
import { EnvironmentsView } from '../../src/features/environments/EnvironmentsView';
import { getWorkspaceEnvironments } from '../../src/features/environments/environments';
import { StatusBadge } from '../../src/features/environments/StatusBadge';
import { TTLIndicator } from '../../src/features/environments/TTLIndicator';

function webEnv() {
  const env = getWorkspaceEnvironments(apps).find(
    (entry) => entry.id === 'web-local',
  );
  if (!env) throw new Error('web-local environment missing');
  return env;
}

function webApp() {
  const app = getAppByName(apps, 'web');
  if (!app) throw new Error('web app missing from registry');
  return app;
}

test('environments view renders the operational inventory', async () => {
  const screen = await render(
    <EnvironmentsView
      environments={getWorkspaceEnvironments(apps)}
      filters={{}}
      onFiltersChange={() => {}}
    />,
  );

  await expect
    .element(screen.getByRole('heading', { name: 'Environments' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: 'web-local' }))
    .toBeVisible();
  await expect.element(screen.getByText('3 stopped')).toBeVisible();
  await expect
    .element(screen.getByRole('columnheader', { name: 'TTL' }))
    .toBeVisible();
});

test('ttl and cost indicators stay honest without a backend', async () => {
  const ttlScreen = await render(<TTLIndicator ttl={null} />);
  await expect.element(ttlScreen.getByText('No TTL')).toBeVisible();
  const costScreen = await render(<CostIndicator cost={null} />);
  await expect.element(costScreen.getByText('—')).toBeVisible();
});

test('environments view offers recovery when filters match nothing', async () => {
  const screen = await render(
    <EnvironmentsView
      environments={getWorkspaceEnvironments(apps)}
      filters={{ search: 'no-such-environment' }}
      onFiltersChange={() => {}}
    />,
  );

  await expect
    .element(screen.getByText('No environments match these filters'))
    .toBeVisible();
  await expect
    .element(screen.getByRole('button', { name: 'Clear filters' }).nth(1))
    .toBeVisible();
});

test('status badge never communicates through color alone', async () => {
  const screen = await render(<StatusBadge status="stopped" />);
  await expect.element(screen.getByText('Stopped')).toBeVisible();
});

test('environment detail shows header, tabs, and start guidance', async () => {
  const screen = await render(
    <EnvironmentDetailPage
      env={webEnv()}
      app={webApp()}
      tab="overview"
      onTabChange={() => {}}
    />,
  );

  await expect
    .element(screen.getByRole('heading', { name: 'web-local' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: 'Open locally' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: 'Logs' }))
    .toBeVisible();
  await expect.element(screen.getByText('Start locally')).toBeVisible();
});

test('environment detail logs tab explains the honest empty state', async () => {
  const screen = await render(
    <EnvironmentDetailPage
      env={webEnv()}
      app={webApp()}
      tab="logs"
      onTabChange={() => {}}
    />,
  );

  await expect.element(screen.getByText('No live logs')).toBeVisible();
});
