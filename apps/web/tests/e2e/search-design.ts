import { expect, type Page, type TestInfo } from '@playwright/test';

export async function captureSearchDesign(
  page: Page,
  testInfo: TestInfo,
  width: number,
  name: string,
) {
  await page.context().addCookies([
    {
      name: 'woodbrook-cookie-consent',
      value: 'declined',
      url: 'http://127.0.0.1:4173',
    },
  ]);
  await page.setViewportSize({ width, height: 1000 });
  await page.goto('/search?q=DART');
  await expect(page.getByRole('article')).toHaveCount(5);
  await page.evaluate(() => document.fonts.ready);
  const images = page.locator('.search-result img');
  for (const image of await images.all()) {
    await expect(image).toBeVisible();
    await expect
      .poll(() =>
        image.evaluate((element) =>
          element instanceof HTMLImageElement ? element.naturalWidth : 0,
        ),
      )
      .toBeGreaterThan(0);
  }
  const height = await page
    .getByRole('main')
    .evaluate((element) => Math.ceil(element.getBoundingClientRect().bottom));
  await page.setViewportSize({ width, height });
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  const cards = await page.getByRole('article').evaluateAll((elements) =>
    elements.map((element) => {
      const card = element.getBoundingClientRect();
      const image = element
        .querySelector('.search-result-image')!
        .getBoundingClientRect();
      const title = element.querySelector('h2')!.getBoundingClientRect();
      return {
        imageRight: image.right,
        titleLeft: title.left,
        titleRight: title.right,
        cardRight: card.right,
      };
    }),
  );
  for (const card of cards) {
    expect(card.titleLeft).toBeGreaterThan(card.imageRight);
    expect(card.titleRight).toBeLessThanOrEqual(card.cardRight);
  }
  const path = testInfo.outputPath(`search-${name}.png`);
  await page.screenshot({ path, animations: 'disabled' });
  await testInfo.attach(`${name} search design — repository test content`, {
    path,
    contentType: 'image/png',
  });
}
