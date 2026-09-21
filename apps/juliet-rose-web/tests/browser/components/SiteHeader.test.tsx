import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import {
  SiteHeader,
  toActiveNavigationItem,
} from '../../../src/components/SiteHeader';

test('opens and closes the mobile navigation accessibly', async () => {
  const screen = await render(<SiteHeader />);
  const openMenu = screen.getByRole('button', { name: 'Open menu' });

  await expect.element(openMenu).toHaveAttribute('aria-expanded', 'false');
  await openMenu.click();

  const closeMenu = screen.getByRole('button', { name: 'Close menu' });
  await expect.element(closeMenu).toHaveAttribute('aria-expanded', 'true');
  await expect
    .element(screen.getByRole('navigation', { name: 'Mobile navigation' }))
    .toBeVisible();

  await closeMenu.click();
  await expect.element(openMenu).toHaveAttribute('aria-expanded', 'false');
});

test('identifies the current treatments page in both navigation menus', async () => {
  const screen = await render(
    <SiteHeader activeNavigationItem="/treatments" />,
  );
  const treatmentLinks = screen.getByRole('link', { name: 'Treatments' });

  await expect
    .element(treatmentLinks.first())
    .toHaveAttribute('aria-current', 'page');
  await expect
    .element(treatmentLinks.last())
    .toHaveAttribute('aria-current', 'page');
});

test('identifies the gift-card page for navigation highlighting', () => {
  expect(toActiveNavigationItem('/gift-cards')).toBe('/gift-cards');
});
