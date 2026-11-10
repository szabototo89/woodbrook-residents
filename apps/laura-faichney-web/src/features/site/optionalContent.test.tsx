import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test, vi, afterEach } from 'vitest';
import { LauraSanitySource } from '../../../scripts/lauraSanitySource';
import { HomePage } from './HomePage';
import { AboutPage } from './AboutPage';
import { ServicesPage } from './ServicesPage';
import { GalleryPage } from './GalleryPage';
import { ContactPage } from './ContactPage';

afterEach(() => vi.unstubAllGlobals());

test('renders all routes without broken images, empty links or empty optional sections', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        result: {
          home: null,
          about: null,
          page: null,
          settings: null,
          services: null,
          collections: null,
        },
      }),
    })),
  );
  const source = new LauraSanitySource();
  const home = await source.loadHome();
  const pages = [
    <HomePage data={home} />,
    <AboutPage data={await source.loadAbout()} />,
    <ServicesPage data={await source.loadServices()} />,
    <GalleryPage data={await source.loadGallery()} />,
    <ContactPage settings={home.settings} services={[]} />,
  ];
  for (const page of pages) {
    const html = renderToStaticMarkup(page);
    expect(html).toContain('<h1');
    expect(html).not.toMatch(/src=""|href="(?:mailto:|tel:)"|undefined|null/);
    expect(html).not.toContain('class="contact-section"');
  }
  const html = renderToStaticMarkup(pages[0]);
  for (const section of [
    'services-preview',
    'mural-feature',
    'gallery-preview',
    'about-preview',
    'testimonial',
  ])
    expect(html).not.toContain(`class="${section}"`);
  expect(html).not.toContain('<img');
});

test('keeps text-only stories and services visible without empty artwork frames', async () => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => ({
      ok: true,
      json: async () => ({
        result: {
          about: {
            storyHeading: 'Sample story',
            storyBody: 'Sample text',
            storyImage: null,
          },
          services: [
            {
              slug: { current: 'sample' },
              title: 'Sample service',
              image: null,
            },
          ],
        },
      }),
    })),
  );
  const source = new LauraSanitySource();
  const about = renderToStaticMarkup(
    <AboutPage data={await source.loadAbout()} />,
  );
  expect(about).toContain('<h2>Sample story</h2>');
  expect(about).toContain('<p>Sample text</p>');
  expect(about).not.toContain('<img');
  const services = renderToStaticMarkup(
    <ServicesPage data={await source.loadServices()} />,
  );
  expect(services).toContain('Sample service');
  expect(services).toContain('/contact?service=sample');
  expect(services).not.toContain('service-image-frame');
});
