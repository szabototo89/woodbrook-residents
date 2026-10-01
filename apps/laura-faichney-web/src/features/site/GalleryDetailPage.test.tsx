import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { GalleryDetailPage } from './GalleryDetailPage';
import { GalleryPage } from './GalleryPage';
import { GalleryPreview } from './GalleryPreview';
import { SiteHeader } from './SiteHeader';
import { getGalleryPhoto, galleryPhotoPath } from './galleryContent';
import { galleryImages } from './siteContent';

test('gallery and home previews link each photo to its own detail URL', () => {
  const gallery = renderToStaticMarkup(<GalleryPage />);
  const preview = renderToStaticMarkup(<GalleryPreview />);
  for (const image of galleryImages) {
    expect(gallery).toContain(`href="${galleryPhotoPath(image)}"`);
    expect(preview).toContain(`href="${galleryPhotoPath(image)}"`);
  }
});

test('photo detail shows the selected picture, optional description and gallery return', () => {
  const photo = getGalleryPhoto('106');
  if (!photo) throw new Error('Photo is missing');
  const html = renderToStaticMarkup(<GalleryDetailPage photo={photo} />);
  expect(html).toContain('<h1>Pink flowers</h1>');
  expect(html).toContain('src="/artwork/picsum-106.webp"');
  expect(html).toContain('alt="Pink flowers against a blue sky"');
  expect(html).toContain('Pink blossoms stand out against a clear blue sky.');
  expect(html).toContain('Picture 1 of 5');
  expect(html).toContain('Back to gallery');
  expect(html).toContain('src="/artwork/gallery-detail-hero-cutout.webp"');
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('photo detail omits the description section when no description is supplied', () => {
  const photo = getGalleryPhoto('42');
  if (!photo) throw new Error('Photo is missing');
  const html = renderToStaticMarkup(<GalleryDetailPage photo={photo} />);
  expect(html).toContain('<h1>Coffee &amp; conversation</h1>');
  expect(html).not.toContain('About this picture');
  expect(html).not.toContain('undefined');
});

test('previous and next links follow gallery order and wrap at the ends', () => {
  for (const [id, previous, next] of [
    ['106', '180', '42'],
    ['1080', '42', '24'],
    ['180', '24', '106'],
  ]) {
    const photo = getGalleryPhoto(id!);
    if (!photo) throw new Error('Photo is missing');
    const html = renderToStaticMarkup(<GalleryDetailPage photo={photo} />);
    expect(html).toContain(`href="/gallery/${previous}" rel="prev"`);
    expect(html).toContain(`href="/gallery/${next}" rel="next"`);
    expect(html).toContain('aria-label="Picture navigation"');
    expect(html).toContain('Previous picture');
    expect(html).toContain('Next picture');
  }
});

test('unknown and malformed photo IDs are rejected', () => {
  for (const id of ['missing', '999', '106anything', '0106', '']) {
    expect(getGalleryPhoto(id)).toBeUndefined();
  }
});

test('gallery navigation remains active on photo detail pages', () => {
  const html = renderToStaticMarkup(<SiteHeader active="/gallery/106" />);
  expect(html).toContain('href="/gallery" aria-current="page"');
});

test('photo breadcrumbs link home and gallery and mark the current picture', () => {
  const photo = getGalleryPhoto('106');
  if (!photo) throw new Error('Photo is missing');
  const html = renderToStaticMarkup(<GalleryDetailPage photo={photo} />);
  expect(html).toContain('aria-label="Breadcrumb"');
  expect(html).toContain('href="/">Home</a>');
  expect(html).toContain('href="/gallery">Gallery</a>');
  expect(html).toContain('aria-current="page">Pink flowers</span>');
});
