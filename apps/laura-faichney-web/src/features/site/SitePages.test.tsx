import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import {
  AboutPage,
  ContactPage,
  GalleryPage,
  HomePage,
  ServicesPage,
  SiteHeader,
} from './SitePages';

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
  expect(html).toContain('lucide-phone');
  expect(html).toContain('lucide-mail');
  expect(html).toContain('fetchPriority="high"');
  expect(html).toContain('src="/artwork/portrait-cutout.png"');
  expect(html).toContain('alt="A brighter world through art"');
  expect(html).toContain('src="/artwork/about-studio.webp"');
  expect(html).toContain('What Clients Say');
  expect(html).toContain('Laura created a stunning mural for our nursery.');
  expect(html).toContain('Sarah O’Connor');
  expect(html.indexOf('What Clients Say')).toBeGreaterThan(
    html.indexOf('More About Laura'),
  );
  expect(html.indexOf('What Clients Say')).toBeLessThan(
    html.indexOf('Get in Touch'),
  );
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
  expect(html).not.toContain('picsum-');
  expect(html).toContain('src="/artwork/service-commissioned-paintings.webp"');
  expect(html).toContain('src="/artwork/service-murals.webp"');
  expect(html).toContain('src="/artwork/service-signage.webp"');
  expect(html).toContain('src="/artwork/service-facepainting.webp"');
  expect(html).toContain('src="/artwork/service-art-tutoring.webp"');
  expect(html).toContain('src="/artwork/services-hero-cutout.webp"');
  expect(html).toContain(
    'alt="Paintbrushes in a paint-splashed cup with sweeping colourful brushstrokes"',
  );
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
  expect(gallery).toContain('src="/artwork/gallery-hero-cutout.webp"');
  expect(gallery).toContain('loading="eager"');
  const contact = renderToStaticMarkup(<ContactPage />);
  expect(contact).toContain('src="/artwork/contact-hero-cutout.webp"');
  expect(contact).toContain(
    'mailto:lauralfaichney@gmail.com?subject=Art%20project%20enquiry',
  );
});

test('every subpage introduces its content with a distinct artwork-led hero', () => {
  const pages = [
    renderToStaticMarkup(<AboutPage />),
    renderToStaticMarkup(<ServicesPage />),
    renderToStaticMarkup(<GalleryPage />),
    renderToStaticMarkup(<ContactPage />),
  ];
  const heroImages = pages.map((html) => {
    const hero = html.match(
      /<section class="[^"]*page-hero[^"]*">([\s\S]*?)<\/section>/,
    )?.[1];
    expect(hero, 'each subpage should have a page hero').toBeDefined();
    expect(hero).toContain('<h1');
    expect(hero).toContain('gold-stroke');
    const image = hero?.match(/src="([^"]+)"/)?.[1];
    expect(image, 'each subpage hero should use artwork').toBeDefined();
    return image;
  });

  expect(new Set(heroImages).size).toBe(4);
  expect(heroImages.every((image) => image?.endsWith('.webp'))).toBe(true);
});

test('about values and arrows use Lucide icons instead of unicode glyphs', () => {
  const about = renderToStaticMarkup(<AboutPage />);
  const services = renderToStaticMarkup(<ServicesPage />);
  const home = renderToStaticMarkup(<HomePage />);
  const header = renderToStaticMarkup(<SiteHeader active="/" />);

  expect(about).toContain('lucide-palette');
  expect(about).toContain('lucide-heart');
  expect(about).toContain('lucide-sparkles');
  expect(about).toContain('lucide-map-pin');
  expect(about.match(/width="44"/g)).toHaveLength(4);
  expect(about).not.toContain('✳');
  expect(about).not.toContain('♡');
  expect(about).not.toContain('✧');
  expect(about).not.toContain('❧');

  expect(home).toContain('lucide-arrow-right');
  expect(about).toContain('lucide-arrow-right');
  expect(services).toContain('lucide-arrow-right');
  expect(header).toContain('lucide-arrow-right');
  expect(header).toContain('primary-navigation');
  expect(`${home}${about}${services}${header}`).not.toContain('→');
});

test('gallery uses distinct collection covers without displaying placeholder notices', () => {
  const html = renderToStaticMarkup(<GalleryPage />);

  expect(html).not.toContain('Temporary');
  expect(html).not.toContain('Picsum');
  expect(html.match(/src="\/artwork\/picsum-\d+\.webp"/g)).toHaveLength(2);
  expect(html).toContain('Colour &amp; nature');
  expect(html).toContain('Everyday inspiration');
  expect(html).not.toContain('colour-portrait.png');
  expect(html).not.toContain('pink-botanical.png');
});
