import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';
import { CollectionPictures } from './CollectionPictures';
import type { CmsGalleryItem } from './lauraSanity';

function picture(saleStatus?: CmsGalleryItem['saleStatus']): CmsGalleryItem {
  return {
    alt: 'Pink flowers',
    image: { url: '/artwork/picsum-106.webp', alt: 'Pink flowers' },
    fullImage: { url: '/artwork/picsum-106.webp', alt: 'Pink flowers' },
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
      <CollectionPictures images={[picture(value)]} />,
    );
    expect(html).toContain('role="status"');
    expect(html).toContain(`<figcaption role="status"`);
    expect(html).toContain(`aria-label="View picture: Pink flowers. ${label}"`);
    expect(html.match(new RegExp(`>${label}<`, 'g'))).toHaveLength(2);
  },
);

test('does not show an availability indicator without a picture', () => {
  expect(renderToStaticMarkup(<CollectionPictures images={[]} />)).toBe('');
});
