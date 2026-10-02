import { expect, test } from 'vitest';
import { galleryPictureSizes } from './galleryPictureSizes';

test('portrait artwork selects a source for its contained width within the 4:3 frame', () => {
  expect(
    galleryPictureSizes(
      'https://cdn.sanity.io/images/project/production/painting-1536x2048.jpg?w=1280',
    ),
  ).toContain('calc((100vw - 40px) * 0.5625)');
});

test('landscape and unrecognised images keep the full frame width', () => {
  expect(galleryPictureSizes('/artwork/picsum-106.webp')).toContain(
    'calc((100vw - 40px) * 1)',
  );
  expect(
    galleryPictureSizes(
      'https://cdn.sanity.io/images/project/production/painting-1600x900.jpg?w=1280',
    ),
  ).toContain('calc((100vw - 40px) * 1)');
});
