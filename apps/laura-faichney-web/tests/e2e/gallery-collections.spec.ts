import { expect, test } from '../fixtures/gallery-test';

import {
  browsableCollections,
  galleryCollections as collections,
} from './galleryCms';

test('visitors open a collection and browse pictures without leaving its page', async ({
  page,
}) => {
  const [first] = await browsableCollections();
  if (!first) throw new Error('Collections are missing');
  const firstPhoto = first.photos[0];
  const secondPhoto = first.photos[1];
  const lastPhoto = first.photos[first.photos.length - 1];
  if (!firstPhoto || !secondPhoto || !lastPhoto) {
    throw new Error('Collection photos are missing');
  }

  await page.goto('/gallery');
  await page
    .getByRole('link', { name: `View collection: ${first.title}` })
    .click();
  await expect(page).toHaveURL(new RegExp(`/gallery/${first.slug}$`));
  await expect(
    page.getByRole('heading', { level: 1, name: first.title }),
  ).toBeVisible();
  const breadcrumb = page.getByRole('navigation', { name: 'Breadcrumb' });
  await expect(
    breadcrumb.getByText(first.title, { exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await expect(
    breadcrumb.getByRole('link', { name: 'Gallery', exact: true }),
  ).toHaveAttribute('href', '/gallery');
  const viewer = page.getByRole('region', { name: 'Collection pictures' });
  const selected = viewer.locator('.collection-selected-picture img');
  await expect(selected).toHaveAttribute('alt', firstPhoto);
  await viewer
    .getByRole('button', { name: 'Previous picture', exact: true })
    .click();
  await expect(selected).toHaveAttribute('alt', lastPhoto);
  await viewer
    .getByRole('button', { name: 'Next picture', exact: true })
    .click();
  await expect(selected).toHaveAttribute('alt', firstPhoto);
  await viewer
    .getByRole('button', { name: `View picture: ${secondPhoto}` })
    .click();
  await expect(selected).toHaveAttribute('alt', secondPhoto);
  await expect(page).toHaveURL(new RegExp(`/gallery/${first.slug}$`));
  await expect(
    viewer.getByRole('button', { name: `View picture: ${secondPhoto}` }),
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
  const all = await browsableCollections();
  const target = all[1] ?? all[0];
  if (!target) throw new Error('Collections are missing');
  const targetPhoto = target.photos[target.photos.length - 1];
  const firstPhoto = target.photos[0];
  if (!targetPhoto || !firstPhoto)
    throw new Error('Collection photos are missing');

  await page.goto('/');
  await page
    .getByRole('link', { name: `View collection: ${target.title}` })
    .click();
  await expect(page).toHaveURL(new RegExp(`/gallery/${target.slug}$`));
  await page.reload();
  await expect(
    page.getByRole('heading', { level: 1, name: target.title }),
  ).toBeVisible();
  await expect(page.getByText(target.description, { exact: true })).toHaveCount(
    1,
  );
  await expect(
    page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Gallery', exact: true }),
  ).toHaveAttribute('aria-current', 'page');
  await page
    .getByRole('button', { name: `View picture: ${targetPhoto}` })
    .click();
  await expect(
    page.locator('.collection-selected-picture img'),
  ).toHaveAttribute('alt', targetPhoto);
  await page.getByRole('button', { name: 'Next picture', exact: true }).focus();
  await page.keyboard.press('Enter');
  await expect(
    page.locator('.collection-selected-picture img'),
  ).toHaveAttribute('alt', firstPhoto);
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
  const all = await collections();
  const paths = [
    '/gallery',
    ...all.map((collection) => `/gallery/${collection.slug}`),
  ];
  for (const width of [320, 360, 390, 430, 640, 768, 900, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of paths) {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toHaveCount(1);
      expect(
        await page.evaluate(() => document.documentElement.scrollWidth),
      ).toBe(width);
      const undersized = await page
        .locator('a:visible, button:visible')
        .evaluateAll((elements) =>
          elements
            .filter((element) => {
              const bounds = element.getBoundingClientRect();
              return bounds.height < 44 || bounds.width < 44;
            })
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
