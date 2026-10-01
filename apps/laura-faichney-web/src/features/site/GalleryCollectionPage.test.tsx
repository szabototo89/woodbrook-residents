import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { GalleryCollectionPage } from './GalleryCollectionPage';
import { GalleryPage } from './GalleryPage';
import { GalleryPreview } from './GalleryPreview';
import { SiteHeader } from './SiteHeader';
import { galleryCollectionPath, getGalleryCollection } from './galleryContent';
import { galleryCollections, galleryImages } from './siteContent';

test('gallery and home preview present named collections with collection URLs', () => {
  const gallery = renderToStaticMarkup(<GalleryPage />);
  const preview = renderToStaticMarkup(<GalleryPreview />);
  for (const collection of galleryCollections) {
    for (const html of [gallery, preview]) {
      expect(html).toContain(`href="${galleryCollectionPath(collection)}"`);
      expect(html).toContain(collection.title.replaceAll('&', '&amp;'));
    }
  }
  for (const image of galleryImages) {
    expect(gallery + preview).not.toContain(`href="/gallery/${image.id}"`);
  }
});

test('collection detail presents one collection description and browsable pictures', () => {
  const collection = getGalleryCollection('colour-and-nature');
  if (!collection) throw new Error('Collection is missing');
  const html = renderToStaticMarkup(
    <GalleryCollectionPage collection={collection} />,
  );
  expect(html).toContain('<h1>Colour &amp; nature</h1>');
  expect(html).toContain(collection.description);
  expect(html.split(collection.description)).toHaveLength(2);
  expect(html).toContain('alt="Pink flowers against a blue sky"');
  expect(html).toContain(
    'aria-label="View picture: Fresh strawberries in rich pink and red tones"',
  );
  expect(html).toContain('aria-label="Picture navigation"');
  expect(html).toContain('Previous picture');
  expect(html).toContain('Next picture');
  expect(html).toContain('Back to gallery');
  expect(html).toContain('src="/artwork/gallery-detail-hero-cutout.webp"');
  expect(html).not.toContain('About this picture');
  expect(html).not.toContain('In the gallery');
  expect(html).not.toMatch(/Picture \d+ of \d+/);
  expect(html).not.toMatch(/href="\/gallery\/\d+/);
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('collection breadcrumbs link home and gallery and mark the collection', () => {
  const collection = getGalleryCollection('everyday-inspiration');
  if (!collection) throw new Error('Collection is missing');
  const html = renderToStaticMarkup(
    <GalleryCollectionPage collection={collection} />,
  );
  expect(html).toContain('aria-label="Breadcrumb"');
  expect(html).toContain('href="/">Home</a>');
  expect(html).toContain('href="/gallery">Gallery</a>');
  expect(html).toContain('aria-current="page">Everyday inspiration</span>');
  expect(
    renderToStaticMarkup(<SiteHeader active="/gallery/everyday-inspiration" />),
  ).toContain('href="/gallery" aria-current="page"');
});

test('collection membership includes each existing picture once with no image descriptions', () => {
  const images = galleryCollections.flatMap((collection) => collection.images);
  expect(images.map((image) => image.id).sort()).toEqual(
    galleryImages.map((image) => image.id).sort(),
  );
  expect(new Set(images.map((image) => image.id)).size).toBe(
    galleryImages.length,
  );
  for (const image of images) expect(image).not.toHaveProperty('description');
});

test('unknown collection slugs and retired picture IDs are rejected', () => {
  for (const slug of ['missing', '106', '42', 'colour-and-nature-extra', '']) {
    expect(getGalleryCollection(slug)).toBeUndefined();
  }
});
