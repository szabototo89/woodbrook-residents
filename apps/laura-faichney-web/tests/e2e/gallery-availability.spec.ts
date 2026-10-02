import { expect, test } from '../fixtures/gallery-test';

for (const width of [320, 390, 1440]) {
  test(`picture availability follows thumbnail and keyboard selection at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    if (width === 390) {
      await page.route('https://cdn.sanity.io/images/**', (route) => {
        const portrait = route.request().url().includes('86bcd714');
        return route.fulfill({
          contentType: 'image/svg+xml',
          body: `<svg xmlns="http://www.w3.org/2000/svg" width="${portrait ? 200 : 400}" height="${portrait ? 400 : 200}"><rect width="100%" height="100%" fill="#d92755"/></svg>`,
        });
      });
    }
    await page.goto('/gallery/availability-examples');

    const viewer = page.getByRole('region', { name: 'Collection pictures' });
    const status = viewer.getByRole('status');
    await expect(status).toHaveText('For sale');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const frame = viewer.getByRole('figure', { name: 'Available painting' });
    const picture = frame.getByRole('img');
    await picture.evaluate((image: HTMLImageElement) => image.decode());
    const initialBounds = await frame.boundingBox();
    if (width === 390) {
      expect(
        await picture.evaluate(
          (image: HTMLImageElement) => image.naturalWidth / image.naturalHeight,
        ),
      ).toBeCloseTo(0.5, 1);
    }
    await expect(
      viewer.getByRole('button', {
        name: 'View picture: Portfolio painting. Not for sale',
        exact: true,
      }),
    ).toBeVisible();
    await viewer
      .getByRole('button', {
        name: 'View picture: Portfolio painting. Not for sale',
        exact: true,
      })
      .click();
    await expect(status).toHaveText('Not for sale');
    await expect(
      viewer.getByRole('figure', { name: 'Portfolio painting' }),
    ).toBeVisible();
    const portfolio = viewer.getByRole('figure', {
      name: 'Portfolio painting',
    });
    await portfolio
      .getByRole('img')
      .evaluate((image: HTMLImageElement) => image.decode());
    const portfolioBounds = await portfolio.boundingBox();
    expect(portfolioBounds?.width).toBe(initialBounds?.width);
    expect(portfolioBounds?.height).toBe(initialBounds?.height);
    if (width === 390) {
      expect(
        await portfolio
          .getByRole('img')
          .evaluate(
            (image: HTMLImageElement) =>
              image.naturalWidth / image.naturalHeight,
          ),
      ).toBeCloseTo(2, 1);
    }
    const next = viewer.getByRole('button', {
      name: 'Next picture',
      exact: true,
    });
    await next.focus();
    await page.keyboard.press('Enter');
    for (const alt of [
      'Unlabelled painting',
      'Hidden availability painting',
      'Unset availability painting',
    ]) {
      await expect(status).toHaveCount(0);
      await expect(
        viewer
          .getByRole('figure', { name: alt })
          .locator('.artwork-availability'),
      ).toHaveCount(0);
      await expect(
        viewer.getByRole('button', {
          name: `View picture: ${alt}`,
          exact: true,
        }),
      ).toBeVisible();
      await expect(next).toBeFocused();
      await page.keyboard.press('Enter');
    }
    await expect(status).toHaveText('For sale');
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .map((animation) => animation.finished.catch(() => undefined)),
      ),
    );

    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    for (const badge of await viewer.locator('.artwork-availability').all()) {
      await expect(badge).toBeVisible();
      expect(
        await badge.evaluate(
          (element) => element.scrollWidth <= element.clientWidth,
        ),
      ).toBe(true);
    }
    await viewer.screenshot({
      path: test.info().outputPath('artwork-availability.png'),
      animations: 'disabled',
    });
  });
}
