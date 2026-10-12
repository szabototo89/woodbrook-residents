import { expect, type Page, type TestInfo } from '@playwright/test';

export async function captureSearchDesign(
  page: Page,
  testInfo: TestInfo,
  width: number,
  name: string,
  query = 'DART',
) {
  await page.context().addCookies([
    {
      name: 'woodbrook-cookie-consent',
      value: 'declined',
      url: 'http://127.0.0.1:4173',
    },
  ]);
  await page.setViewportSize({ width, height: 1000 });
  await page.goto(query ? `/search?q=${query}` : '/search');
  await expect(
    page.getByRole('link', { name: 'Back', exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole('article')).toHaveCount(query ? 5 : 0);
  if (!query)
    await expect(
      page.getByRole('heading', { name: 'What are you looking for?' }),
    ).toBeVisible();
  await page.evaluate(() => document.fonts.ready);
  const images = page.getByRole('article').locator('img');
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
  const dimensions = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client + 1);
  const cards = await page.getByRole('article').evaluateAll((elements) =>
    elements.map((element) => {
      const card = element.getBoundingClientRect();
      const title = element.querySelector('h2, h3')!.getBoundingClientRect();
      return {
        titleLeft: title.left,
        titleRight: title.right,
        cardLeft: card.left,
        cardRight: card.right,
      };
    }),
  );
  for (const card of cards) {
    expect(card.titleLeft).toBeGreaterThanOrEqual(card.cardLeft);
    expect(card.titleRight).toBeLessThanOrEqual(card.cardRight);
  }
  const path = testInfo.outputPath(
    `search-${name}${query ? '' : '-empty'}.png`,
  );
  await page.screenshot({ path, animations: 'disabled', fullPage: true });
  await testInfo.attach(`${name} search design — repository test content`, {
    path,
    contentType: 'image/png',
  });
}
