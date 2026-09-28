export const portrait = '/artwork/colour-portrait.png';
export const botanical = '/artwork/pink-botanical.png';

export const services = [
  {
    title: 'Commissioned Paintings',
    description:
      'Unique, hand-painted artwork made for your space or a special gift.',
    image: portrait,
    imageAlt: 'Vibrant painted portrait in pink, blue and orange',
    position: '50% 46%',
  },
  {
    title: 'Murals (Indoor & Outdoor)',
    description:
      'Colourful large-scale artwork for homes, businesses and events.',
    image: botanical,
    imageAlt: 'Pink flowers and green leaves in a painterly composition',
    position: '43% 48%',
  },
  {
    title: 'Signage',
    description:
      'Hand-painted signs that bring a personal touch to your space.',
    image: '/artwork/picsum-42.webp',
    imageAlt: 'A warm café interior',
    position: '50% 50%',
  },
  {
    title: 'Facepainting',
    description: 'Colourful facepainting for parties and events.',
    image: '/artwork/picsum-106.webp',
    imageAlt: 'Pink flowers against a blue sky',
    position: '50% 50%',
  },
  {
    title: 'Art Tutoring',
    description: 'Creative art tutoring to build skills and confidence.',
    image: '/artwork/picsum-24.webp',
    imageAlt: 'An open book on a wooden table',
    position: '50% 50%',
  },
] as const;

export const galleryImages = [
  { id: 106, alt: 'Pink flowers against a blue sky' },
  { id: 42, alt: 'Coffee cups on a wooden café table' },
  { id: 1080, alt: 'Fresh strawberries in rich pink and red tones' },
  { id: 24, alt: 'An open book on a wooden table' },
  { id: 180, alt: 'A notebook, camera and laptop on a creative desk' },
] as const;
