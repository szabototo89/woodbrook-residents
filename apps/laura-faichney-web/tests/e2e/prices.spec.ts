import { createOfflinePage, expect, test } from '../fixtures/gallery-test';
import { readLauraSnapshot } from '../../scripts/lauraSnapshot';

for (const width of [320, 390, 640, 900, 1440]) {
  test(`prices reflow with visible price guidance at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/prices');
    await page.evaluate(() => document.fonts.ready);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Art, Creative Events & Tuition',
    );
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const amount = page.locator('.price-amount').first();
    if (width === 390)
      expect((await amount.boundingBox())!.y).toBeLessThan(844);
    for (const row of await page
      .locator('.price-option, .price-enquiry')
      .all()) {
      const box = await row.boundingBox();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '200%';
    });
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(
      page.getByRole('link', { name: 'Get a Quote', exact: true }),
    ).toBeVisible();
  });
}

test('every linked pricing category selects its published service after hydration', async ({
  page,
}) => {
  const { prices } = await readLauraSnapshot();
  for (const category of prices.categories.filter(
    (category) => category.serviceSlug,
  )) {
    await page.goto('/prices');
    await page
      .getByRole('link', {
        name: `${prices.enquiryLabel} about ${category.title}`,
        exact: true,
      })
      .click();
    await expect(page).toHaveURL(
      new RegExp(`/contact\\?service=${category.serviceSlug}#enquiry$`),
    );
    await expect(page.getByLabel('Service Interested In')).toHaveValue(
      category.serviceSlug!,
    );
    await page.reload();
    await expect(page.getByLabel('Service Interested In')).toHaveValue(
      category.serviceSlug!,
    );
  }
});

test('Prices is discoverable in Services, footer and the keyboard-dismissable phone menu', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/services');
  await expect(
    page.getByRole('link', { name: 'View prices', exact: true }),
  ).toHaveAttribute('href', '/prices');
  await expect(
    page
      .getByRole('navigation', { name: 'Footer navigation' })
      .getByRole('link', { name: 'Prices' }),
  ).toHaveAttribute('href', '/prices');
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open menu' })).toBeFocused();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Prices' })
    .click();
  await expect(page).toHaveURL('/prices');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Art, Creative Events & Tuition',
  );
  await expect(
    page.getByRole('navigation', { name: 'Primary navigation' }),
  ).toBeHidden();
  await page.getByRole('button', { name: 'Open menu' }).click();
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Prices' }),
  ).toHaveAttribute('aria-current', 'page');
});

test('Prices and enquiry URLs render with JavaScript disabled', async ({
  browser,
}) => {
  const { context, page } = await createOfflinePage(browser, {
    javaScriptEnabled: false,
  });
  await page.goto('/prices');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.locator('.price-amount').first()).toContainText('€120');
  await expect(
    page.getByRole('link', { name: 'Enquire about Commissioned Paintings' }),
  ).toHaveAttribute('href', '/contact?service=commissioned-paintings#enquiry');
  await context.close();
});

test('long category copy and 200 percent enlarged pricing text remain readable', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/prices');
  await page.evaluate(() => {
    const heading = document.querySelector('.price-category h2');
    if (heading)
      heading.textContent =
        'Personalised gifts, celebrations and creative keepsakes';
    const qualification = document.querySelector('.price-qualification');
    if (qualification)
      qualification.textContent =
        'Sample long qualification: final scope depends on the agreed dimensions, location, materials and the details provided with your enquiry.';
    const text = Array.from(
      document.querySelectorAll<HTMLElement>(
        '.prices-page h1, .prices-page h2, .prices-page p, .prices-page a, .prices-page small, .price-option-label > span',
      ),
    ).map((element) => ({
      element,
      size: parseFloat(getComputedStyle(element).fontSize),
    }));
    for (const { element, size } of text)
      element.style.fontSize = `${size * 2}px`;
  });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  for (const element of await page
    .locator('.price-option, .prices-contact, .price-category-heading')
    .all()) {
    expect(
      await element.evaluate(
        (element) => element.scrollWidth <= element.clientWidth + 1,
      ),
    ).toBe(true);
  }
});

test('small gold pricing text has readable contrast', async ({ page }) => {
  await page.goto('/prices');
  const contrast = await page
    .locator('.prices-intro .eyebrow')
    .evaluate((element) => {
      const luminance = (color: string) => {
        const channels = (color.match(/[\d.]+/g) ?? [])
          .slice(0, 3)
          .map(Number)
          .map((value) => {
            const channel = value / 255;
            return channel <= 0.04045
              ? channel / 12.92
              : ((channel + 0.055) / 1.055) ** 2.4;
          });
        return (
          channels[0]! * 0.2126 + channels[1]! * 0.7152 + channels[2]! * 0.0722
        );
      };
      const page = element.closest('.prices-page');
      if (!page) throw new Error('Prices page is missing');
      return (
        (luminance(getComputedStyle(page).backgroundColor) + 0.05) /
        (luminance(getComputedStyle(element).color) + 0.05)
      );
    });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('Prices navigation reuses the shared transition and focuses the destination', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/about');
  await page.waitForLoadState('networkidle');
  await page
    .getByRole('navigation', { name: 'Primary navigation' })
    .getByRole('link', { name: 'Prices' })
    .click();
  await expect(page).toHaveURL('/prices');
  await expect(page.getByRole('main')).toBeFocused();
});
