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
  [undefined, 'Enquire for availability'],
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
