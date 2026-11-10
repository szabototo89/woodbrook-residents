import { createOfflinePage, expect, test } from '../fixtures/gallery-test';

test('contact metadata describes painting and mural enquiries without JavaScript', async ({
  browser,
}) => {
  const { context, page } = await createOfflinePage(browser, {
    javaScriptEnabled: false,
  });
  try {
    await page.goto('/contact');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      'Contact Laura Faichney about a commissioned painting or mural. Share your idea, preferred size or space, timeframe and project location.',
    );
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Discuss Your Painting or Mural',
    );
  } finally {
    await context.close();
  }
});

for (const width of [390, 1440]) {
  test(`painting and mural links reach their service and preselect an enquiry at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto('/');
    await page
      .locator('.service-card')
      .filter({ hasText: 'Commissioned Paintings' })
      .click();
    await expect(page).toHaveURL('/services#commissioned-paintings');
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Commissioned Paintingsand Murals',
    );
    const painting = page.getByRole('link', {
      name: /Commissioned Paintings.*Unique/,
    });
    await expect(painting).toBeInViewport();
    await painting.click();
    await expect(page).toHaveURL('/contact?service=commissioned-paintings');
    await expect(page.getByLabel('Service Interested In')).toHaveValue(
      'commissioned-paintings',
    );

    await page.goto('/');
    await page.locator('.mural-feature').getByRole('link').click();
    await expect(page).toHaveURL('/contact?service=murals-indoor-outdoor');
    await expect(page.getByLabel('Service Interested In')).toHaveValue(
      'murals-indoor-outdoor',
    );

    await page.goto('/gallery');
    await page
      .getByRole('link', { name: 'Explore commissioned paintings and murals' })
      .click();
    await expect(page).toHaveURL('/services');
    for (const name of ['Signage', 'Facepainting', 'Art Tutoring']) {
      await expect(
        page.getByRole('heading', { name, exact: true }),
      ).toHaveCount(1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
  });
}
