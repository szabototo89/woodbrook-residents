import { artworkUrl } from '../../../scripts/lauraSanitySource';
import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { GalleryCollectionPage } from './GalleryCollectionPage';
import { GalleryPage } from './GalleryPage';
import { GalleryPreview } from './GalleryPreview';
import { SiteHeader } from './SiteHeader';
import {
  galleryCollectionPath,
  getGalleryCollection,
  type CmsGalleryCollection,
  type CmsGalleryItem,
} from './lauraSanity';

const config = {
  projectId: 'uag6kepo',
  dataset: 'production',
  apiVersion: '2025-09-01',
};

function photo(alt: string, ref: string, order: number): CmsGalleryItem {
  const thumb = artworkUrl(
    config,
    { asset: { _ref: ref }, hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 } },
    640,
    480,
  );
  const full = artworkUrl(
    config,
    { asset: { _ref: ref }, hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 } },
    1280,
  );
  if (!thumb || !full) throw new Error(`Fixture image failed to build: ${ref}`);
  return {
    alt,
    image: { url: thumb, alt },
    fullImage: { url: full, alt },
    order,
  };
}

const galleryCollections: CmsGalleryCollection[] = [
  {
    title: 'Colour & nature',
    slug: 'colour-and-nature',
    description:
      'A study in natural colour, bringing together pink blossoms, blue skies and the rich reds of summer fruit.',
    order: 0,
    photos: [
      photo(
        'Pink flowers against a blue sky',
        'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
        0,
      ),
      photo(
        'Fresh strawberries in rich pink and red tones',
        'image-d854d44adc674ded75531906c9fb813b0bed4dca-640x480-webp',
        1,
      ),
    ],
  },
  {
    title: 'Everyday inspiration',
    slug: 'everyday-inspiration',
    description:
      'Quiet moments and creative corners, from a café table to an open book and a working desk.',
    order: 1,
    photos: [
      photo(
        'Coffee cups on a wooden café table',
        'image-c1949059522fb58517fa0e2696ce24ca46565f89-640x480-webp',
        0,
      ),
      photo(
        'An open book on a wooden table',
        'image-c11c7d1590363c8864a94a5a0c86e96539fe6c09-640x480-webp',
        1,
      ),
      photo(
        'A notebook, camera and laptop on a creative desk',
        'image-7da3b550ea1bcb7889533d8199ddbb20796928b3-640x480-webp',
        2,
      ),
    ],
  },
];

function collectionOrThrow(slug: string) {
  const collection = getGalleryCollection(galleryCollections, slug);
  if (!collection) throw new Error(`Collection is missing: ${slug}`);
  return collection;
}

function galleryPageData() {
  return {
    hero: {
      eyebrow: 'Gallery',
      titleLines: ['A glimpse of my work'],
      description: 'Explore.',
      image: {
        url: photo(
          'Hero',
          'image-d9bb83bbbb07c39f42f8c62a2c96a096c4c0e457-1374x1145-webp',
          0,
        ).image.url,
        alt: 'Hero',
      },
    },
    seo: {},
    collections: galleryCollections,
    settings: {
      email: 'laura@example.com',
      phone: '123',
      mailtoSubject: 'Subject',
      eyebrow: 'Tag',
      heading: 'Heading',
      copy: 'Copy',
    },
  };
}

test('gallery and home preview present named collections with collection URLs', () => {
  const gallery = renderToStaticMarkup(
    <GalleryPage data={galleryPageData()} />,
  );
  const preview = renderToStaticMarkup(
    <GalleryPreview
      collections={galleryCollections}
      heading="A glimpse of my work"
    />,
  );
  for (const collection of galleryCollections) {
    for (const html of [gallery, preview]) {
      expect(html).toContain(`href="${galleryCollectionPath(collection)}"`);
      expect(html).toContain(collection.title.replaceAll('&', '&amp;'));
    }
  }
  for (const slug of ['pink-flowers', '106', 'colour-and-nature-extra']) {
    expect(gallery + preview).not.toContain(`href="/gallery/${slug}"`);
  }
});

test('collection detail presents one collection description and browsable pictures', () => {
  const html = renderToStaticMarkup(
    <GalleryCollectionPage
      collection={collectionOrThrow('colour-and-nature')}
    />,
  );
  expect(html).toContain('<h1>Colour &amp; nature</h1>');
  expect(html).toContain(
    'A study in natural colour, bringing together pink blossoms',
  );
  expect(
    html.split(
      'A study in natural colour, bringing together pink blossoms, blue skies and the rich reds of summer fruit.',
    ),
  ).toHaveLength(2);
  expect(html).toContain('alt="Pink flowers against a blue sky"');
  expect(html).toContain(
    'aria-label="View picture: Fresh strawberries in rich pink and red tones"',
  );
  expect(html).toContain('aria-label="Picture navigation"');
  expect(html).toContain('Previous picture');
  expect(html).toContain('Next picture');
  expect(html).toContain('Back to gallery');
  expect(html).not.toContain('/artwork/gallery-detail-hero-cutout');
  expect(html).not.toContain('About this picture');
  expect(html).not.toContain('In the gallery');
  expect(html).not.toMatch(/Picture \d+ of \d+/);
  expect(html).not.toMatch(/href="\/gallery\/\d+/);
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('collection breadcrumbs link home and gallery and mark the collection', () => {
  const html = renderToStaticMarkup(
    <GalleryCollectionPage
      collection={collectionOrThrow('everyday-inspiration')}
    />,
  );
  expect(html).toContain('aria-label="Breadcrumb"');
  expect(html).toContain('href="/">Home</a>');
  expect(html).toContain('href="/gallery">Gallery</a>');
  expect(html).toContain('aria-current="page">Everyday inspiration</span>');
  expect(
    renderToStaticMarkup(<SiteHeader active="/gallery/everyday-inspiration" />),
  ).toContain('href="/gallery" aria-current="page"');
});

test('collection membership keeps every picture in exactly one collection', () => {
  const alts = galleryCollections.flatMap((collection) =>
    collection.photos.map((photo) => photo.alt),
  );
  expect(alts).toHaveLength(5);
  expect(new Set(alts).size).toBe(5);
});

test('unknown collection slugs and retired picture IDs are rejected', () => {
  for (const slug of ['missing', '106', '42', 'colour-and-nature-extra', '']) {
    expect(getGalleryCollection(galleryCollections, slug)).toBeUndefined();
  }
});
