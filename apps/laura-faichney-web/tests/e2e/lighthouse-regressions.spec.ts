import { expect, test } from '@playwright/test';

for (const path of ['/', '/about', '/services', '/gallery', '/contact']) {
  test(`${path} loads its hero and favicon without browser errors`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(path);
    const hero = page.locator('.hero-art img, .page-hero-art img');
    await expect(hero).toBeVisible();
    await expect
      .poll(() =>
        hero.evaluate((image: HTMLImageElement) => image.naturalWidth),
      )
      .toBeGreaterThan(0);
    const favicon = page.locator('link[rel="icon"]');
    await expect(favicon).toHaveAttribute('href', '/favicon.svg');
    expect((await page.request.get('/favicon.svg')).ok()).toBe(true);
    expect(errors).toEqual([]);
  });
}

test('testimonial small text meets AA contrast', async ({ page }) => {
  await page.goto('/');
  const colors = await page
    .locator('.testimonial .eyebrow')
    .evaluate((node) => {
      return {
        text: getComputedStyle(node).color,
        background: getComputedStyle(node.closest('.testimonial')!)
          .backgroundColor,
      };
    });
  const luminance = (color: string) => {
    const channels = color
      .match(/\d+/g)!
      .map(Number)
      .slice(0, 3)
      .map((value) => {
        const component = value / 255;
        return component <= 0.04045
          ? component / 12.92
          : ((component + 0.055) / 1.055) ** 2.4;
      });
    return (
      channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
    );
  };
  const foreground = luminance(colors.text);
  const background = luminance(colors.background);
  expect(
    (Math.max(foreground, background) + 0.05) /
      (Math.min(foreground, background) + 0.05),
  ).toBeGreaterThanOrEqual(4.5);
});

test('initial page styling is available without a separate stylesheet request', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.route('**/*.css', (route) => route.abort());
  await page.goto('/');
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(251, 247, 241)',
  );
  await expect(page.getByRole('heading', { level: 1 })).toHaveCSS(
    'color',
    'rgb(13, 41, 66)',
  );
  await context.close();
});

test('inline stylesheet is not downloaded again inside client JavaScript', async ({
  page,
}) => {
  const scripts: Promise<string>[] = [];
  page.on('response', (response) => {
    if (response.ok() && response.request().resourceType() === 'script')
      scripts.push(response.text());
  });
  await page.goto('/');
  await page.getByRole('link', { name: 'About', exact: true }).first().click();
  await expect(page.locator('.page-hero')).toBeVisible();
  await expect(page.locator('body')).toHaveCSS(
    'background-color',
    'rgb(251, 247, 241)',
  );
  expect((await Promise.all(scripts)).join('\n').includes('.hero-art{')).toBe(
    false,
  );
});
