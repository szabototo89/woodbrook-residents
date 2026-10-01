import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { GalleryImage } from './GalleryImage';

test('local gallery photographs offer smaller sources and eager overview loading', () => {
  const html = renderToStaticMarkup(
    <GalleryImage
      src="/artwork/picsum-106.webp"
      alt="Flowers"
      loading="eager"
    />,
  );
  expect(html).toContain('/artwork/picsum-106-160.webp 160w');
  expect(html).toContain('/artwork/picsum-106-320.webp 320w');
  expect(html).toContain('/artwork/picsum-106.webp 640w');
  expect(html).toContain(
    'sizes="(max-width: 527px) calc(100vw - 40px), (max-width: 640px) calc((100vw - 48px) / 2), (max-width: 827px) calc((100vw - 78px) / 2), (max-width: 1097px) calc((100vw - 108px) / 3), (max-width: 1328px) calc((100vw - 138px) / 4), 297.5px"',
  );
  expect(html).toContain('loading="eager"');
});

test('CMS thumbnails use smaller sources with the same crop and format settings', () => {
  const src =
    'https://cdn.sanity.io/images/project/production/photo-1000x800.jpg?rect=0,25,1000,750&w=640&h=480&fit=crop&auto=format';
  const html = renderToStaticMarkup(
    <GalleryImage src={src} alt="An uploaded painting" sizes="148px" />,
  );
  expect(html).toContain('w=160&amp;h=120');
  expect(html).toContain('w=320&amp;h=240');
  expect(html).toContain('rect=0%2C25%2C1000%2C750');
  expect(html).toContain('fit=crop&amp;auto=format');
  expect(html).toContain('sizes="148px"');
  expect(html).toContain('loading="lazy"');
});

test('unrecognised image URLs keep their source and alternative text', () => {
  const html = renderToStaticMarkup(
    <GalleryImage
      src="https://example.com/painting.jpg"
      alt="A blue painting"
    />,
  );
  expect(html).toContain('src="https://example.com/painting.jpg"');
  expect(html).toContain('alt="A blue painting"');
  expect(html).not.toContain('srcSet=');
});
