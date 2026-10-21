import { expect, test } from '@playwright/test';

test.use({ deviceScaleFactor: 2 });

test('repository MDX handoffs open with tables, checklists and rendered C4 diagrams', async ({
  page,
}) => {
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await expect(
      page.getByRole('heading', { name: 'Agent handoffs', exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    if (process.env.HANDOFF_SCREENSHOT_DIR)
      await page.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/handoffs-${width}.png`,
        fullPage: true,
        scale: 'device',
      });
    await page.getByRole('link', { name: 'Browseable agent handoffs' }).click();
    await expect(page).toHaveURL(/#\/agent-handoffs$/);
    await expect(
      page.getByRole('heading', { name: 'Current state', exact: true }),
    ).toBeVisible();
    await expect(page.getByRole('table').first()).toContainText('Guidance');
    await expect(page.getByRole('checkbox').first()).toBeDisabled();
    const gallery = page.getByRole('region', { name: 'Appearance gallery' });
    await expect(
      gallery.getByRole('img', { name: 'Desktop handoff index' }),
    ).toBeVisible();
    await gallery.getByRole('button', { name: 'Show Mobile index' }).click();
    await expect(
      gallery.getByRole('img', { name: 'Mobile handoff index' }),
    ).toBeVisible();
    await expect(
      gallery.getByText(
        'Check that the card fits the phone width, text remains readable and the read link is easy to reach.',
      ),
    ).toBeVisible();
    expect(
      await gallery
        .getByRole('img', { name: 'Mobile handoff index' })
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    ).toBeGreaterThan(0);
    await expect(
      gallery.getByRole('link', { name: 'Open full size' }),
    ).toHaveAttribute('href', /\.png$/);
    await gallery.getByRole('button', { name: 'Next image' }).click();
    await expect(
      gallery.getByRole('img', { name: 'Desktop handoff index' }),
    ).toBeVisible();
    if (process.env.HANDOFF_SCREENSHOT_DIR)
      await gallery.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/gallery-${width}.png`,
        scale: 'device',
      });
    await expect(
      page.getByText(
        'Change: added a standalone handoff viewer outside the public website.',
        { exact: true },
      ),
    ).toBeVisible();
    await expect(
      page.getByRole('img', { name: 'C4 architecture diagram' }).first(),
    ).toBeVisible();
    await expect(page.locator('.handoff-diagram svg')).toHaveCount(3);
    await expect(page.locator('.handoff-diagram svg').last()).toBeVisible();
    if (process.env.HANDOFF_SCREENSHOT_DIR)
      await page.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/document-${width}.png`,
        scale: 'device',
      });
    if (process.env.HANDOFF_SCREENSHOT_DIR) {
      await page
        .getByRole('heading', { name: 'C1 - System context' })
        .scrollIntoViewIfNeeded();
      await page.screenshot({
        path: `${process.env.HANDOFF_SCREENSHOT_DIR}/architecture-${width}.png`,
        scale: 'device',
      });
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    await page.getByRole('link', { name: 'All handoffs' }).click();
    await expect(
      page.getByRole('heading', { name: 'Agent handoffs', exact: true }),
    ).toBeVisible();
  }
});

test('unknown handoffs show a recovery link', async ({ page }) => {
  await page.goto('/#/missing-handoff');
  await expect(
    page.getByRole('heading', { name: 'Handoff not found' }),
  ).toBeVisible();
  await page.getByRole('link', { name: 'All handoffs' }).click();
  await expect(
    page.getByRole('heading', { name: 'Agent handoffs', exact: true }),
  ).toBeVisible();
});
