import { expect, test } from '../fixtures/gallery-test';

for (const width of [320, 390, 1440]) {
  test(`picture availability follows thumbnail and keyboard selection at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/gallery');
    const link = page.getByRole('link', { name: /^View collection:/ }).first();
    const slug = (await link.getAttribute('href'))?.split('/').pop();
    const image = {
      asset: {
        _ref: 'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
      },
    };
    const landscapeImage = {
      asset: {
        _ref: 'image-d854d44adc674ded75531906c9fb813b0bed4dca-640x480-webp',
      },
    };
    if (width === 390) {
      await page.route('https://cdn.sanity.io/images/**', (route) => {
        const portrait = route.request().url().includes('86bcd714');
        return route.fulfill({
          contentType: 'image/svg+xml',
          body: `<svg xmlns="http://www.w3.org/2000/svg" width="${portrait ? 200 : 400}" height="${portrait ? 400 : 200}"><rect width="100%" height="100%" fill="#d92755"/></svg>`,
        });
      });
    }
    await page.route('https://uag6kepo.api.sanity.io/**', (route) =>
      route.fulfill({
        json: {
          result: {
            page: {
              hero: {
                eyebrow: 'Gallery',
                title: 'Gallery',
                description: 'Explore',
                image,
                imageAlt: 'Flowers',
              },
              seo: {},
            },
            settings: {
              contactEmail: 'laura@example.com',
              contactPhone: '123',
              contactMailtoSubject: 'Enquiry',
              contactEyebrow: 'Contact',
              contactHeading: 'Get in touch',
              contactCopy: 'Contact Laura',
            },
            collections: [
              {
                title: 'Availability examples',
                slug: { current: slug },
                description: 'Test artwork',
                order: 0,
                photos: [
                  {
                    image,
                    order: 0,
                    imageAlt: 'Available painting',
                    saleStatus: 'for-sale',
                  },
                  {
                    image: landscapeImage,
                    order: 1,
                    imageAlt: 'Portfolio painting',
                    saleStatus: 'not-for-sale',
                  },
                  {
                    image,
                    order: 2,
                    imageAlt: 'Unconfirmed painting',
                    saleStatus: null,
                  },
                ],
              },
            ],
          },
        },
      }),
    );
    await link.click();

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
    await expect(status).toHaveText('Enquire for availability');
    await expect(next).toBeFocused();
    await page.keyboard.press('Enter');
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
