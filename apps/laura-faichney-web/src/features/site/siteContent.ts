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
    image: botanical,
    imageAlt: 'Painted botanical detail',
    position: '80% 28%',
  },
  {
    title: 'Facepainting',
    description: 'Colourful facepainting for parties and events.',
    image: portrait,
    imageAlt: 'Colourful portrait detail',
    position: '50% 20%',
  },
  {
    title: 'Art Tutoring',
    description: 'Creative art tutoring to build skills and confidence.',
    image: botanical,
    imageAlt: 'Hand-painted flower detail',
    position: '23% 65%',
  },
] as const;
