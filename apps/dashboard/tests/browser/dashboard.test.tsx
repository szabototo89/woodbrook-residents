import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { DashboardPage } from '../../src/features/dashboard/DashboardPage';

test('dashboard renders tracked apps and actions', async () => {
  const screen = await render(<DashboardPage />);

  await expect
    .element(
      screen.getByRole('heading', { name: 'Workspace status and actions' }),
    )
    .toBeVisible();
  await expect
    .element(screen.getByRole('heading', { name: 'web' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('heading', { name: 'cms' }))
    .toBeVisible();
  await expect
    .element(screen.getByRole('link', { name: /GitHub repository/ }))
    .toBeVisible();
});
