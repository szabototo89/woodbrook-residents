import { page } from 'vitest/browser';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import '../../../src/cosmos.css';
import '../../../src/styles.css';
import BookingSidebarFixtures from '../../../src/features/booking/BookingSidebar.fixture';
import TreatmentSectionLinkFixture from '../../../src/features/home/TreatmentSectionLink.fixture';

test('booking sidebar fixture shows the summary on desktop', async () => {
  await page.viewport(1280, 900);
  const screen = await render(BookingSidebarFixtures.Selected);

  await expect
    .element(
      screen.getByRole('complementary', { name: 'Your booking summary' }),
    )
    .toBeVisible();
  await expect
    .element(screen.getByText(/BookingSidebar is hidden below 901px/))
    .not.toBeVisible();
});

test('booking sidebar fixture hides below 901px and explains its preview', async () => {
  await page.viewport(390, 844);
  const screen = await render(BookingSidebarFixtures.Selected);

  await expect.element(screen.getByText('Swedish massage')).not.toBeVisible();
  await expect
    .element(screen.getByText(/BookingSidebar is hidden below 901px/))
    .toBeVisible();
});

test('treatment section link fixture shows the link on desktop', async () => {
  await page.viewport(1280, 900);
  const screen = await render(TreatmentSectionLinkFixture);

  await expect
    .element(screen.getByRole('link', { name: 'View all treatments' }))
    .toBeVisible();
  await expect
    .element(screen.getByText(/TreatmentSectionLink is hidden below 901px/))
    .not.toBeVisible();
});

test('treatment section link fixture hides below 901px and explains its preview', async () => {
  await page.viewport(390, 844);
  const screen = await render(TreatmentSectionLinkFixture);

  await expect
    .element(screen.getByText(/View all treatments/))
    .not.toBeVisible();
  await expect
    .element(screen.getByText(/TreatmentSectionLink is hidden below 901px/))
    .toBeVisible();
});
