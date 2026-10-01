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
  title: string;
  alt: string;
  description?: string;
};

export const galleryImages: readonly GalleryPhoto[] = [
  {
    id: 106,
    title: 'Pink flowers',
    alt: 'Pink flowers against a blue sky',
    description: 'Pink blossoms stand out against a clear blue sky.',
  },
  {
    id: 42,
    title: 'Coffee & conversation',
    alt: 'Coffee cups on a wooden café table',
  },
  {
    id: 1080,
    title: 'Summer reds',
    alt: 'Fresh strawberries in rich pink and red tones',
    description: 'Fresh strawberries bring together rich pink and red tones.',
  },
  { id: 24, title: 'An open book', alt: 'An open book on a wooden table' },
  {
    id: 180,
    title: 'A creative desk',
    alt: 'A notebook, camera and laptop on a creative desk',
  },
];
