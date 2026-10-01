import { expect, test } from '@playwright/test';

test('visitors open a collection and browse pictures without leaving its page', async ({
  page,
}) => {
  await page.goto('/gallery');
  await page
    .getByRole('link', { name: 'View collection: Colour & nature' })
    .click();
  await expect(page).toHaveURL(/\/gallery\/colour-and-nature$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Colour & nature' }),
  ).toBeVisible();
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(
    breadcrumb.getByText('Colour & nature', { exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    breadcrumb.getByRole('link', { name: 'Gallery', exact: true }),
  ).toHaveAttribute('href', '/gallery');
  const viewer = page.getByRole('region', { name: 'Collection pictures' });
  const selected = viewer.locator('.collection-selected-picture img');
  await expect(selected).toHaveAttribute(
    'alt',
    'Pink flowers against a blue sky',
  );
  await viewer
    .getByRole('button', { name: 'Previous picture', exact: true })
    .click();
  await expect(selected).toHaveAttribute(
    'alt',
    'Fresh strawberries in rich pink and red tones',
  );
  await viewer
    .getByRole('button', { name: 'Next picture', exact: true })
    .click();
  await expect(selected).toHaveAttribute(
    'alt',
    'Pink flowers against a blue sky',
  );
  await viewer
    .getByRole('button', {
      name: 'View picture: Fresh strawberries in rich pink and red tones',
    })
    .click();
  await expect(selected).toHaveAttribute(
    'alt',
    'Fresh strawberries in rich pink and red tones',
  );
  await expect(page).toHaveURL(/\/gallery\/colour-and-nature$/);
  await expect(
    viewer.getByRole('button', {
      name: 'View picture: Fresh strawberries in rich pink and red tones',
    }),
  ).toHaveAttribute('aria-pressed', 'true');
  await expect(
    page.getByText('About this picture', { exact: true }),
  ).toHaveCount(0);
  await expect(page.getByText('In the gallery', { exact: true })).toHaveCount(
    0,
  );
  await expect(page.getByText(/^Picture \d+ of \d+$/)).toHaveCount(0);
  await page
    .getByRole('link', { name: 'Back to gallery', exact: true })
    .click();
  await expect(page).toHaveURL(/\/gallery$/);
});

test('home previews and direct links open collections with their own description', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', { name: 'View collection: Everyday inspiration' })
    .click();
  await expect(page).toHaveURL(/\/gallery\/everyday-inspiration$/);
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Everyday inspiration' }),
  ).toBeVisible();
  await expect(
    page.getByText(
      'Quiet moments and creative corners, from a café table to an open book and a working desk.',
      { exact: true },
    ),
  ).toHaveCount(1);
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Gallery', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page
    .getByRole('button', {
      name: 'View picture: A notebook, camera and laptop on a creative desk',
    })
    .click();
  await expect(
    page.locator('.collection-selected-picture img'),
  ).toHaveAttribute('alt', 'A notebook, camera and laptop on a creative desk');
  await page.getByRole('button', { name: 'Next picture', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.locator('.collection-selected-picture img'),
  ).toHaveAttribute('alt', 'Coffee cups on a wooden café table');
});

test('unknown collections and retired picture URLs show a helpful not-found page', async ({
  page,
}) => {
  for (const path of ['/gallery/missing', '/gallery/106']) {
    await page.goto(path);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Collection not found' }),
    ).toBeVisible();
    await page
      .getByRole('link', { name: 'Back to gallery', exact: true })
      .click();
    await expect(page).toHaveURL(/\/gallery$/);
  }
});

test('collection cards and picture controls remain readable and uncropped at phone and desktop widths', async ({
  page,
}) => {
  for (const width of [320, 390, 640, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of [
      '/gallery',
      '/gallery/colour-and-nature',
      '/gallery/everyday-inspiration',
    ]) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const undersized = await page
        .locator('main a, main button')
        .evaluateAll((elements) =>
          elements
            .filter((element) => element.getBoundingClientRect().height < 44)
            .map((element) => element.textContent),
        );
      expect(undersized).toEqual([]);
      if (path !== '/gallery') {
        const picture = page.locator('.collection-selected-picture img');
        await expect(picture).toBeVisible();
        expect(
          await picture.evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
        ).toBe(true);
        const bounds = await picture.boundingBox();
        if (!bounds) throw new Error('Picture is missing');
        expect(bounds.width / bounds.height).toBeCloseTo(4 / 3, 1);
      }
    }
  }
});
