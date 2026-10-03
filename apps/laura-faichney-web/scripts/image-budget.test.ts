import { expect, test } from 'bun:test';

for (const [asset, budget] of [
  ['brand/laura-faichney-signature-220.webp', 8_000],
  ['decoration/blush-gold-brush.webp', 45_000],
  ['decoration/colour-brush.webp', 30_000],
  ['artwork/contact-studio-cutout-512.webp', 100_000],
  ['decoration/contact-brush-up-left-360.webp', 25_000],
] as const) {
  test(`${asset} stays within its transfer budget`, async () => {
    const file = Bun.file(new URL(`../public/${asset}`, import.meta.url));
    expect(await file.exists()).toBe(true);
    expect(file.size).toBeLessThanOrEqual(budget);
  });
}

test('mobile Services hero stays within a 40KB delivery budget', async () => {
  const file = Bun.file(
    new URL('../public/artwork/services-hero-cutout-672.avif', import.meta.url),
  );
  expect(await file.exists()).toBe(true);
  expect(file.size).toBeLessThanOrEqual(40_000);
});

test('used DM Sans weights stay within a 24KB font budget', async () => {
  const file = Bun.file(
    new URL('../src/assets/fonts/dm-sans-latin-400-700.woff2', import.meta.url),
  );
  expect(await file.exists()).toBe(true);
  expect(file.size).toBeLessThanOrEqual(24_000);
});
