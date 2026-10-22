import { expect, test } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`public images fit a small transfer budget at ${width}px`, async ({
    page,
  }) => {
    const imageRequests: string[] = [];
    page.on('request', (request) => {
      if (request.resourceType() === 'image') imageRequests.push(request.url());
    });
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    const logo = page
      .getByRole('banner')
      .getByRole('link', {
        name: 'Woodbrook Residents',
        exact: true,
      })
      .locator('img');
    await expect(logo).toBeVisible();
    const logoResponse = await page.request.get(
      (await logo.getAttribute('src'))!,
    );
    expect(logoResponse.ok()).toBe(true);
    expect((await logoResponse.body()).byteLength).toBeLessThan(20 * 1024);
    const backgrounds = imageRequests.filter((url) =>
      url.includes('shankill-coast'),
    );
    if (await page.locator('.home-featured-event img').count()) {
      expect(backgrounds).toEqual([]);
    }
    for (const url of backgrounds) {
      const response = await page.request.get(url);
      expect(response.ok()).toBe(true);
      expect((await response.body()).byteLength).toBeLessThan(80 * 1024);
    }
    const heroUrl = await page
      .locator('.coastal-hero-image img')
      .evaluate((image: HTMLImageElement) => image.currentSrc);
    const heroResponse = await page.request.get(heroUrl);
    expect(heroResponse.ok()).toBe(true);
    expect((await heroResponse.body()).byteLength).toBeLessThan(
      (width < 760 ? 100 : 250) * 1024,
    );
    const art = page.locator('.coast-note, .home-featured-event img');
    for (const image of await art.all()) {
      const response = await page.request.get(
        (await image.getAttribute('src'))!,
      );
      expect(response.ok()).toBe(true);
      expect((await response.body()).byteLength).toBeLessThan(160 * 1024);
    }
  });
}
