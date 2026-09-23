import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

import { chromium } from 'playwright';

const rendererUrl = 'http://127.0.0.1:5054';
const thumbnailDirectory = fileURLToPath(
  new URL('../../juliet-rose-app/public/', import.meta.url),
);

const previews = [
  ['jr-hero', 'jr-hero/Hero.fixture.tsx'],
  ['jr-category-grid', 'jr-category-grid/CategoryGrid.fixture.tsx'],
  ['jr-featured-grid', 'jr-featured-grid/FeaturedGrid.fixture.tsx'],
  ['jr-treatment-catalog', 'jr-treatment-catalog/TreatmentCatalog.fixture.tsx'],
  [
    'jr-treatment-guidance',
    'jr-treatment-guidance/TreatmentGuidance.fixture.tsx',
  ],
  ['jr-gift-card', 'jr-gift-card/GiftCard.fixture.tsx'],
  ['jr-visit-us', 'jr-visit-us/VisitUs.fixture.tsx'],
  [
    'jr-booking-policy',
    'jr-booking-policy/BookingPolicy.fixture.tsx',
    { targetId: 'booking-policy' },
  ],
  [
    'jr-booking-journey',
    'jr-booking-journey/BookingJourney.fixture.tsx',
    { name: 'Default' },
  ],
  ['jr-treatment-hero', 'jr-treatment-hero/TreatmentHero.fixture.tsx'],
  ['jr-gift-card-page', 'jr-gift-card-page/GiftCardPage.fixture.tsx'],
  [
    'jr-studio-sections',
    'jr-studio-sections/StudioSections.fixture.tsx',
    { focusText: 'Visit us', offset: -150 },
  ],
  [
    'jr-home-page',
    'jr-home-page/HomePage.fixture.tsx',
    { focusText: 'Find the right treatment for you', offset: -120 },
  ],
  [
    'jr-treatments-page',
    'jr-treatments-page/TreatmentsPage.fixture.tsx',
    { focusText: 'Not sure what to choose?', offset: -160 },
  ],
];

await mkdir(thumbnailDirectory, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1000, height: 400 },
  deviceScaleFactor: 1,
});

try {
  for (const [assetName, fixturePath, options = {}] of previews) {
    const fixtureId = JSON.stringify({
      path: `src/site/widgets/${fixturePath}`,
      ...(options.name ? { name: options.name } : {}),
    });
    const url = `${rendererUrl}/?fixtureId=${encodeURIComponent(fixtureId)}&locked=true`;

    await page.goto(url, { waitUntil: 'networkidle' });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((image) => {
          if (image.complete) return undefined;
          return new Promise((resolveImage) => {
            image.addEventListener('load', resolveImage, { once: true });
            image.addEventListener('error', resolveImage, { once: true });
          });
        }),
      );
    });

    if (options.targetId) {
      await page.evaluate((targetId) => {
        window.location.hash = targetId;
      }, options.targetId);
      await page.locator(`#${options.targetId}`).waitFor({ state: 'visible' });
    }

    if (options.focusText) {
      const focus = page.getByText(options.focusText, { exact: true }).first();
      await focus.scrollIntoViewIfNeeded();
      await page.evaluate(
        (offset) => window.scrollBy(0, offset),
        options.offset,
      );
    }

    await page.screenshot({
      path: `${thumbnailDirectory}/${assetName}-thumbnail.png`,
      animations: 'disabled',
    });
  }
} finally {
  await browser.close();
}
