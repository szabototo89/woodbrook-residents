import { statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { HeroSection } from './HeroSection';

const appRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const imageBytes = (name: string) =>
  statSync(join(appRoot, '..', 'public', 'images', name)).size;

test('homepage hero image serves a smaller variant to small screens', () => {
  const markup = renderToStaticMarkup(<HeroSection />);
  const img = markup.match(/<img[^>]*>/)?.[0] ?? '';

  expect(img).toContain('srcSet=');
  expect(img).toContain('facial-hero-640.jpg');
  expect(img).toContain('sizes=');
  expect(img).toContain('width="840"');
  expect(img).toContain('height="420"');
});

test('homepage images stay within the mobile performance budget', () => {
  expect(imageBytes('facial-hero.jpg')).toBeLessThan(60_000);
  expect(imageBytes('facial-hero-640.jpg')).toBeLessThan(45_000);
  expect(imageBytes('studio-interior.jpg')).toBeLessThan(100_000);
  expect(imageBytes('gift-card.jpg')).toBeLessThan(100_000);
  expect(imageBytes('packages.jpg')).toBeLessThan(80_000);
});
