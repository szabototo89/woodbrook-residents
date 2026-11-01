import { expect, test } from '@playwright/test';

for (const width of [320, 390, 1440]) {
  test(`website presentation remains readable at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const title = page.getByText('Find what’s happening in Woodbrook, fast.', {
      exact: true,
    });
    await expect(title).toBeVisible();
    expect(
      await title.evaluate((element) =>
        parseFloat(getComputedStyle(element).fontSize),
      ),
    ).toBeGreaterThanOrEqual(34);
    const bounds = await title.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(16);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width - 15);
    const home = page.getByText('Home', { exact: true });
    await expect(home).toBeVisible();
    await page.getByText('Local', { exact: true }).last().click();
    await expect(page.getByText('1 contact', { exact: true })).toBeVisible();
    await page.getByText('Tall health service', { exact: true }).click();
    await expect(
      page.getByText('Tall health service', { exact: true }),
    ).toBeVisible();
    await expect(
      page.getByText('Back to local information', { exact: false }),
    ).toBeVisible();
    await page.getByText('More', { exact: true }).last().click();
    await page.getByText('Ways to help', { exact: true }).click();
    await expect(
      page.getByText('How residents can contribute', { exact: true }),
    ).toBeVisible();
  });
}
