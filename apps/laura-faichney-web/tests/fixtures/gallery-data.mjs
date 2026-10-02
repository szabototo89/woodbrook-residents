const photo = (imageAlt, asset, order) => ({
  image: { asset: { _ref: asset } },
  imageAlt,
  alt: imageAlt,
  order,
});

export const galleryHeroAsset =
  'image-d9bb83bbbb07c39f42f8c62a2c96a096c4c0e457-1374x1145-webp';

export const galleryCollections = [
  {
    title: 'Colour & nature',
    slug: { current: 'colour-and-nature' },
    description: 'A study in natural colour, from blossoms to summer fruit.',
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
    slug: { current: 'everyday-inspiration' },
    description: 'Quiet moments and creative corners.',
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
  {
    title: 'Single picture study',
    slug: { current: 'single-picture-study' },
    description:
      'A standalone picture for the single-picture viewing scenario.',
    order: 2,
    photos: [
      photo(
        'A single flower study',
        'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
        0,
      ),
    ],
  },
  {
    title: 'Availability examples',
    slug: { current: 'availability-examples' },
    description: 'Test artwork availability',
    order: 3,
    photos: [
      {
        ...photo(
          'Available painting',
          'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
          0,
        ),
        saleStatus: 'for-sale',
      },
      {
        ...photo(
          'Portfolio painting',
          'image-d854d44adc674ded75531906c9fb813b0bed4dca-640x480-webp',
          1,
        ),
        saleStatus: 'not-for-sale',
      },
      {
        ...photo(
          'Unlabelled painting',
          'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
          2,
        ),
        saleStatus: null,
      },
      {
        ...photo(
          'Hidden availability painting',
          'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
          3,
        ),
        saleStatus: 'none',
      },
      photo(
        'Unset availability painting',
        'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
        4,
      ),
    ],
  },
];

export function isGalleryQuery(url) {
  const parsed = new globalThis.URL(url);
  return (
    parsed.hostname === 'uag6kepo.api.sanity.io' &&
    parsed.pathname.includes('/data/query/production') &&
    parsed.searchParams.get('query')?.includes('galleryCollection')
  );
}

export function withGalleryFixture(body) {
  const result = body.result;
  if (Array.isArray(result)) return { ...body, result: galleryCollections };
  return {
    ...body,
    result: {
      ...result,
      collections: galleryCollections,
      ...(result.page
        ? {
            page: {
              ...result.page,
              hero: {
                ...result.page.hero,
                image: { asset: { _ref: galleryHeroAsset } },
              },
            },
          }
        : {}),
    },
  };
}
