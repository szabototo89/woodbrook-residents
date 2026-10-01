import { expect, test } from '@playwright/test';

test('visitors open a photo, browse the whole gallery and return', async ({
  page,
}) => {
  await page.goto('/gallery');
  await page
    .getByRole('link', {
      name: 'View picture: Pink flowers against a blue sky',
    })
    .click();
  await expect(page).toHaveURL(/\/gallery\/106$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Pink flowers' }),
  ).toBeVisible();
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(
    breadcrumb.getByRole('link', { name: 'Home', exact: true }),
  ).toHaveAttribute('href', '/');
  await expect(
    breadcrumb.getByRole('link', { name: 'Gallery', exact: true }),
  ).toHaveAttribute('href', '/gallery');
  await expect(
    breadcrumb.getByText('Pink flowers', { exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    page.getByText('Pink blossoms stand out against a clear blue sky.'),
  ).toBeVisible();
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Gallery', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  const navigation = page.getByRole('navigation', {
    name: 'Picture navigation',
  });
  await navigation.getByRole('link', { name: /Previous picture/ }).click();
  await expect(page).toHaveURL(/\/gallery\/180$/);
  await expect(page.getByText('Picture 5 of 5')).toBeVisible();
  await navigation.getByRole('link', { name: /Next picture/ }).click();
  await expect(page).toHaveURL(/\/gallery\/106$/);
  await navigation.getByRole('link', { name: /Next picture/ }).click();
  await expect(page).toHaveURL(/\/gallery\/42$/);
  await expect(
    page.getByRole('heading', { name: 'About this picture' }),
  ).toHaveCount(0);
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Coffee & conversation' }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Back to gallery/ }).click();
  await expect(page).toHaveURL(/\/gallery$/);
});

test('home gallery preview opens the selected photo directly', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('link', {
      name: 'View gallery: Fresh strawberries in rich pink and red tones',
    })
    .click();
  await expect(page).toHaveURL(/\/gallery\/1080$/);
  await expect(
    page.getByRole('heading', { level: 1, name: 'Summer reds' }),
  ).toBeVisible();
});

test('unknown photo URLs show a helpful not-found page', async ({ page }) => {
  await page.goto('/gallery/not-a-picture');
  await expect(
    page.getByRole('heading', { level: 1, name: 'Picture not found' }),
  ).toBeVisible();
  await page.getByRole('link', { name: /Back to gallery/ }).click();
  await expect(page).toHaveURL(/\/gallery$/);
});

test('photo detail remains readable, uncropped and keyboard navigable on phones and desktop', async ({
  page,
}) => {
  for (const width of [320, 390, 640, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/gallery/106');
    await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    const photo = page.getByRole('img', {
      name: 'Pink flowers against a blue sky',
      exact: true,
    });
    await expect(photo).toBeVisible();
    expect(
      await photo.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    ).toBe(true);
    const bounds = await photo.boundingBox();
    if (!bounds) throw new Error('Picture is missing');
    expect(bounds.width / bounds.height).toBeCloseTo(4 / 3, 1);
    const hero = page.locator('.page-hero-art img');
    expect(
      await hero.evaluate(
        (image: HTMLImageElement) => image.complete && image.naturalWidth > 0,
      ),
    ).toBe(true);
    const undersized = await page
      .locator('main a')
      .evaluateAll((links) =>
        links
          .filter((link) => link.getBoundingClientRect().height < 44)
          .map((link) => link.textContent),
      );
    expect(undersized).toEqual([]);
  }
  const next = page
    .getByRole('navigation', { name: 'Picture navigation' })
    .getByRole('link', { name: /Next picture/ });
  await next.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/gallery\/42$/);
});
