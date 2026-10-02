import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PageHero } from './PageHero';
import { expect, test } from 'vitest';
import { heroImageSrcSet } from './heroImageSources';

test('delivers smaller transparent derivatives for the current CMS artwork', () => {
  const source =
    'https://cdn.sanity.io/images/uag6kepo/production/3325501aef2b0082139bad8fabec12e8d19c1e8a-1374x1145.png?w=1374&auto=format';
  expect(heroImageSrcSet(source)).toContain(
    '/artwork/portrait-cutout-768.webp 768w',
  );
});

test('newly published CMS artwork retains responsive CDN delivery', () => {
  const source =
    'https://cdn.sanity.io/images/uag6kepo/production/new-artwork-1374x1145.png?w=1374&auto=format';
  const sources = heroImageSrcSet(source);
  expect(sources).toContain('new-artwork-1374x1145.png?w=768');
  expect(sources).not.toContain('/artwork/portrait-cutout');
});

test('unrecognised third party artwork retains its original delivery', () => {
  expect(heroImageSrcSet('https://example.com/artwork.jpg')).toBeUndefined();
});

test('offers AVIF for known originals with a WebP fallback', () => {
  const source =
    'https://cdn.sanity.io/images/uag6kepo/production/3325501aef2b0082139bad8fabec12e8d19c1e8a-1374x1145.png';
  expect(heroImageSrcSet(source, 'avif')).toContain(
    '/artwork/portrait-cutout-768.avif 768w',
  );
  expect(heroImageSrcSet(source)).toContain('.webp');
  expect(
    heroImageSrcSet('https://example.com/image.jpg', 'avif'),
  ).toBeUndefined();
});

test('hero markup lets compatible browsers choose AVIF and retains accessible fallback artwork', () => {
  const html = renderToStaticMarkup(
    createElement(PageHero, {
      className: 'about-hero',
      eyebrow: 'About',
      title: 'Meet Laura',
      description: 'An artist',
      image:
        'https://cdn.sanity.io/images/uag6kepo/production/039ccadcad11f40cb3edf73e3badd086e040239c-1374x1145.webp',
      imageAlt: 'Colourful painted artwork',
    }),
  );
  expect(html).toContain('type="image/avif"');
  expect(html).toContain('about-hero-cutout-768.avif');
  expect(html).toContain('about-hero-cutout-768.webp');
  expect(html).toContain('alt="Colourful painted artwork"');
});

test('offers appropriately sized AVIF sources for the supplied contact artwork', () => {
  expect(
    heroImageSrcSet('/artwork/contact-studio-cutout.webp', 'avif'),
  ).toContain('/artwork/contact-studio-cutout-512.avif 512w');
});
