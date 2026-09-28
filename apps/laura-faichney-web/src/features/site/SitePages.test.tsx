import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { AboutPage, GalleryPage, HomePage, ServicesPage } from './SitePages';

test('home presents the artwork-led journey and accessible contact actions', () => {
  const html = renderToStaticMarkup(<HomePage />);

  expect(html).toContain('Bold Art');
  expect(html).toContain('Brighter Spaces');
  expect(html).toContain('Art for Homes, Businesses &amp; Events');
  expect(html).toContain('Murals that bring spaces to life');
  expect(html).toContain('href="/services"');
  expect(html).toContain('href="/gallery"');
  expect(html).toContain('href="tel:+353894007747"');
  expect(html).toContain('href="mailto:lauralfaichney@gmail.com"');
  expect(html).toContain('fetchPriority="high"');
  expect(html).toContain('src="/artwork/portrait-cutout.png"');
  expect(html).toContain('alt="A brighter world through art"');
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('services expose all five supplied offerings as complete links', () => {
  const html = renderToStaticMarkup(<ServicesPage />);

  expect(
    [
      'Commissioned Paintings',
      'Murals (Indoor &amp; Outdoor)',
      'Signage',
      'Facepainting',
      'Art Tutoring',
    ].every((title) => html.includes(title)),
  ).toBe(true);
  expect(html.match(/class="service-list-link"/g)).toHaveLength(5);
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('about and gallery present routes without invented client claims', () => {
  const about = renderToStaticMarkup(<AboutPage />);
  const gallery = renderToStaticMarkup(<GalleryPage />);

  expect(about.replace(/<br\s*\/?\s*>/g, ' ')).toContain(
    'A love for art and community',
  );
  expect(about).toContain('My Story');
  expect(about).not.toContain('Sarah O’Connor');
  expect(gallery).toContain('A glimpse of my work');
  expect(gallery).toContain('loading="lazy"');
});

test('gallery uses five distinct photos without displaying placeholder notices', () => {
  const html = renderToStaticMarkup(<GalleryPage />);

  expect(html).not.toContain('Temporary');
  expect(html).not.toContain('Picsum');
  expect(html.match(/src="\/artwork\/picsum-\d+\.webp"/g)).toHaveLength(5);
  expect(html).not.toContain('colour-portrait.png');
  expect(html).not.toContain('pink-botanical.png');
});
