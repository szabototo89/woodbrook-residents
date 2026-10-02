import { expect, test } from 'bun:test';

for (const [asset, budget] of [
  ['brand/laura-faichney-signature-220.webp', 8_000],
  ['decoration/blush-gold-brush.webp', 80_000],
  ['decoration/colour-brush.webp', 60_000],
  ['artwork/contact-studio-cutout-512.webp', 100_000],
] as const) {
  test(`${asset} stays within its transfer budget`, async () => {
    const file = Bun.file(new URL(`../public/${asset}`, import.meta.url));
    expect(await file.exists()).toBe(true);
    expect(file.size).toBeLessThanOrEqual(budget);
  });
}
