export const portrait = '/artwork/colour-portrait.png';
export const botanical = '/artwork/pink-botanical.png';
export const services = [
  {
    title: 'Commissioned Paintings',
    description:
      'Unique, hand-painted artwork made for your space or a special gift.',
    image: '/artwork/service-commissioned-paintings.webp',
    imageAlt: 'Colourful cow painting with a crown of bright wildflowers',
    position: '50% 50%',
  },
  {
    title: 'Murals (Indoor & Outdoor)',
    description:
      'Colourful large-scale artwork for homes, businesses and events.',
    image: '/artwork/service-murals.webp',
    imageAlt: 'Pink peony mural with green and gold leaves on a navy wall',
    position: '50% 50%',
  },
  {
    title: 'Signage',
    description:
      'Hand-painted signs that bring a personal touch to your space.',
    image: '/artwork/service-signage.webp',
    imageAlt: 'Gold Welcome lettering on a charcoal wooden sign with foliage',
    position: '50% 50%',
  },
  {
    title: 'Facepainting',
    description: 'Colourful facepainting for parties and events.',
    image: '/artwork/service-facepainting.webp',
    imageAlt: 'Pink, lilac and turquoise butterfly facepainting',
    position: '50% 50%',
  },
  {
    title: 'Art Tutoring',
    description: 'Creative art tutoring to build skills and confidence.',
    image: '/artwork/service-art-tutoring.webp',
    imageAlt: 'Artist paintbrushes beside a colourful watercolour palette',
    position: '50% 50%',
  },
] as const;

export type GalleryPhoto = {
  id: number;
  alt: string;
};

const galleryPhotos = {
  flowers: {
    id: 106,
    alt: 'Pink flowers against a blue sky',
  },
  coffee: {
    id: 42,
    alt: 'Coffee cups on a wooden café table',
  },
  strawberries: {
    id: 1080,
    alt: 'Fresh strawberries in rich pink and red tones',
  },
  book: { id: 24, alt: 'An open book on a wooden table' },
  desk: {
    id: 180,
    alt: 'A notebook, camera and laptop on a creative desk',
  },
} as const;

export const galleryImages: readonly GalleryPhoto[] =
  Object.values(galleryPhotos);

export type GalleryCollection = {
  slug: string;
  title: string;
  description: string;
  images: readonly [GalleryPhoto, ...GalleryPhoto[]];
};

export const galleryCollections: readonly GalleryCollection[] = [
  {
    slug: 'colour-and-nature',
    title: 'Colour & nature',
    description:
      'A study in natural colour, bringing together pink blossoms, blue skies and the rich reds of summer fruit.',
    images: [galleryPhotos.flowers, galleryPhotos.strawberries],
  },
  {
    slug: 'everyday-inspiration',
    title: 'Everyday inspiration',
    description:
      'Quiet moments and creative corners, from a café table to an open book and a working desk.',
    images: [galleryPhotos.coffee, galleryPhotos.book, galleryPhotos.desk],
  },
];
