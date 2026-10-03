import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { CollectionPictures } from './CollectionPictures';
import type { CmsGalleryItem } from './lauraSanity';

function picture(
  saleStatus?: CmsGalleryItem['saleStatus'],
  alt = 'Pink flowers',
): CmsGalleryItem {
  return {
    alt,
    image: { url: '/artwork/picsum-106.webp', alt },
    fullImage: { url: '/artwork/picsum-106.webp', alt },
    order: 0,
    saleStatus,
  };
}

test.each<[CmsGalleryItem['saleStatus'], string]>([
  ['for-sale', 'For sale'],
  ['not-for-sale', 'Not for sale'],
])(
  'shows %s availability beside the picture and on its thumbnail',
  (value, label) => {
    const html = renderToStaticMarkup(
      <CollectionPictures
        images={[picture(value), picture(value, 'Blue flowers')]}
      />,
    );
    expect(html).toContain('role="status"');
    expect(html).toContain(`<figcaption role="status"`);
    expect(html).toContain(`aria-label="View picture: Pink flowers. ${label}"`);
    expect(html.match(new RegExp(`>${label}<`, 'g'))).toHaveLength(3);
  },
);

test('a single picture shows availability without a duplicate thumbnail chooser', () => {
  const html = renderToStaticMarkup(
    <CollectionPictures images={[picture('for-sale')]} />,
  );
  expect(html).toContain('role="status"');
  expect(html).toContain('For sale');
  expect(html).not.toContain('aria-label="Choose a picture"');
  expect(html).not.toContain('aria-label="Picture navigation"');
  expect(html.match(/>For sale</g)).toHaveLength(1);
});

test('does not show an availability indicator without a picture', () => {
  expect(renderToStaticMarkup(<CollectionPictures images={[]} />)).toBe('');
});

test('only selected and neighbouring full pictures have download URLs', () => {
  const images = Array.from({ length: 7 }, (_, index) => ({
    ...picture(undefined, `Picture ${index}`),
    fullImage: { url: `/full-picture-${index}.webp`, alt: `Picture ${index}` },
  }));
  const html = renderToStaticMarkup(
    <CollectionPictures images={images} initialIndex={3} />,
  );
  for (const index of [2, 3, 4])
    expect(html).toContain(`src="/full-picture-${index}.webp"`);
  for (const index of [0, 1, 5, 6])
    expect(html).not.toContain(`src="/full-picture-${index}.webp"`);
  expect(html).toContain('aria-label="View picture: Picture 6"');
});

test('looping and cross-collection boundaries keep immediate neighbours available', () => {
  const images = Array.from({ length: 5 }, (_, index) => ({
    ...picture(undefined, `Picture ${index}`),
    fullImage: { url: `/full-picture-${index}.webp`, alt: `Picture ${index}` },
  }));
  expect(
    renderToStaticMarkup(<CollectionPictures images={images} />),
  ).toContain('src="/full-picture-4.webp"');
  const html = renderToStaticMarkup(
    <CollectionPictures
      images={images}
      previousPicture={{
        ...picture(),
        fullImage: { url: '/previous.webp', alt: 'Previous collection' },
      }}
      onSwipeBoundary={() => undefined}
    />,
  );
  expect(html).toContain('src="/previous.webp"');
  expect(html).not.toContain('src="/full-picture-4.webp"');
});

test.each(['none', undefined] as const)(
  'hides availability for %s without leaving a caption or changing thumbnail names',
  (value) => {
    const html = renderToStaticMarkup(
      <CollectionPictures
        images={[picture(value), picture(value, 'Blue flowers')]}
      />,
    );
    expect(html).not.toContain('artwork-availability');
    expect(html).not.toContain('<figcaption');
    expect(html).not.toContain('role="status"');
    expect(html).toContain('aria-label="View picture: Pink flowers"');
    expect(html).not.toContain('Enquire for availability');
  },
);
