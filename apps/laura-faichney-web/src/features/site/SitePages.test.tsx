import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import {
  AboutPage,
  ContactPage,
  GalleryPage,
  HomePage,
  ServicesPage,
  SiteHeader,
} from './SitePages';
import {
  artworkUrl,
  type AboutData,
  type CmsSettings,
  type GalleryData,
  type HomeData,
  type ServicesData,
} from './lauraSanity';

const config = {
  projectId: 'uag6kepo',
  dataset: 'production',
  apiVersion: '2025-09-01',
};

function image(ref: string, width: number, height?: number): string {
  const url = artworkUrl(
    config,
    { asset: { _ref: ref }, hotspot: { x: 0.5, y: 0.5, height: 1, width: 1 } },
    width,
    height,
  );
  if (!url) throw new Error(`Fixture image failed to build: ${ref}`);
  return url;
}

const settings: CmsSettings = {
  email: 'lauralfaichney@gmail.com',
  phone: '089-4007747',
  mailtoSubject: 'Art project enquiry',
  eyebrow: 'Let’s create something special',
  heading: 'Get in Touch',
  copy: 'Have a painting, mural, event or creative session in mind? I’d love to hear from you.',
};

const services: ServicesData['services'] = [
  {
    title: 'Commissioned Paintings',
    slug: 'commissioned-paintings',
    description:
      'Unique, hand-painted artwork made for your space or a special gift.',
    image: {
      url: image(
        'image-e31807d572fbe68ee33f28c40a908bc8591bef0d-1448x1086-webp',
        1448,
        1086,
      ),
      alt: 'Colourful cow painting with a crown of bright wildflowers',
    },
    order: 0,
  },
  {
    title: 'Murals (Indoor & Outdoor)',
    slug: 'murals-indoor-outdoor',
    description:
      'Colourful large-scale artwork for homes, businesses and events.',
    image: {
      url: image(
        'image-058c63ac168bd4c0b7f8b54317215cf08d20f5e9-1448x1086-webp',
        1448,
        1086,
      ),
      alt: 'Pink peony mural with green and gold leaves on a navy wall',
    },
    order: 1,
  },
  {
    title: 'Signage',
    slug: 'signage',
    description:
      'Hand-painted signs that bring a personal touch to your space.',
    image: {
      url: image(
        'image-25d211d18daea4f4b44d5ed5b957d59b60702f5b-1448x1086-webp',
        1448,
        1086,
      ),
      alt: 'Gold Welcome lettering on a charcoal wooden sign with foliage',
    },
    order: 2,
  },
  {
    title: 'Facepainting',
    slug: 'facepainting',
    description: 'Colourful facepainting for parties and events.',
    image: {
      url: image(
        'image-a22b8eb712a411006a5402b1bc6e03556c5dd119-1448x1086-webp',
        1448,
        1086,
      ),
      alt: 'Pink, lilac and turquoise butterfly facepainting',
    },
    order: 3,
  },
  {
    title: 'Art Tutoring',
    slug: 'art-tutoring',
    description: 'Creative art tutoring to build skills and confidence.',
    image: {
      url: image(
        'image-d9dafbf2f23ada70f12f69701ad2aaeffe6d05fd-1448x1086-webp',
        1448,
        1086,
      ),
      alt: 'Artist paintbrushes beside a colourful watercolour palette',
    },
    order: 4,
  },
];

const galleryItems: GalleryData['items'] = [
  {
    title: 'Pink flowers',
    slug: 'pink-flowers',
    alt: 'Pink flowers against a blue sky',
    image: {
      url: image(
        'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
        640,
        480,
      ),
      alt: 'Pink flowers against a blue sky',
    },
    detailImage: {
      url: image(
        'image-86bcd7146fcd95f2c8d1ea40f421767d5d8aadf2-640x480-webp',
        1280,
      ),
      alt: 'Pink flowers against a blue sky',
    },
    featured: true,
    order: 0,
  },
  {
    title: 'Coffee & conversation',
    slug: 'coffee-conversation',
    alt: 'Coffee cups on a wooden café table',
    image: {
      url: image(
        'image-c1949059522fb58517fa0e2696ce24ca46565f89-640x480-webp',
        640,
        480,
      ),
      alt: 'Coffee cups on a wooden café table',
    },
    detailImage: {
      url: image(
        'image-c1949059522fb58517fa0e2696ce24ca46565f89-640x480-webp',
        1280,
      ),
      alt: 'Coffee cups on a wooden café table',
    },
    featured: true,
    order: 1,
  },
  {
    title: 'Summer reds',
    slug: 'summer-reds',
    alt: 'Fresh strawberries in rich pink and red tones',
    image: {
      url: image(
        'image-d854d44adc674ded75531906c9fb813b0bed4dca-640x480-webp',
        640,
        480,
      ),
      alt: 'Fresh strawberries in rich pink and red tones',
    },
    detailImage: {
      url: image(
        'image-d854d44adc674ded75531906c9fb813b0bed4dca-640x480-webp',
        1280,
      ),
      alt: 'Fresh strawberries in rich pink and red tones',
    },
    featured: true,
    order: 2,
  },
  {
    title: 'An open book',
    slug: 'open-book',
    alt: 'An open book on a wooden table',
    image: {
      url: image(
        'image-c11c7d1590363c8864a94a5a0c86e96539fe6c09-640x480-webp',
        640,
        480,
      ),
      alt: 'An open book on a wooden table',
    },
    detailImage: {
      url: image(
        'image-c11c7d1590363c8864a94a5a0c86e96539fe6c09-640x480-webp',
        1280,
      ),
      alt: 'An open book on a wooden table',
    },
    featured: true,
    order: 3,
  },
  {
    title: 'A creative desk',
    slug: 'creative-desk',
    alt: 'A notebook, camera and laptop on a creative desk',
    image: {
      url: image(
        'image-7da3b550ea1bcb7889533d8199ddbb20796928b3-640x480-webp',
        640,
        480,
      ),
      alt: 'A notebook, camera and laptop on a creative desk',
    },
    detailImage: {
      url: image(
        'image-7da3b550ea1bcb7889533d8199ddbb20796928b3-640x480-webp',
        1280,
      ),
      alt: 'A notebook, camera and laptop on a creative desk',
    },
    featured: true,
    order: 4,
  },
];

const homeData: HomeData = {
  hero: {
    eyebrow: 'Bold art · brighter spaces · happier people',
    titleLines: ['Bold Art', 'Brighter Spaces'],
    description:
      'Commissioned paintings, murals, signage, facepainting and art tutoring — bringing more colour and creativity to everyday spaces.',
    image: {
      url: image(
        'image-3325501aef2b0082139bad8fabec12e8d19c1e8a-1374x1145-png',
        1374,
      ),
      alt: 'Expressive painted portrait in vivid pink, blue, orange and yellow',
    },
    ctaLabel: 'View My Work',
  },
  servicesHeading: 'Art for Homes, Businesses & Events',
  mural: {
    eyebrow: 'Transform spaces',
    heading: 'Murals that bring spaces to life',
    copy: 'From homes and nurseries to businesses and events, a hand-painted mural adds colour and character to a space.',
    ctaLabel: 'Enquire about a mural',
    image: {
      url: image(
        'image-56f7a815e06b8dc32777f6d44672f91e95d605f1-1254x1254-png',
        1254,
      ),
      alt: 'Large pink painted flower with green leaves',
    },
  },
  galleryHeading: 'A glimpse of my work',
  about: {
    heading: 'Art, colour and people are what inspire me',
    copy: 'Hi, I’m Laura — an artist and creative all-rounder.',
    image: {
      url: image(
        'image-5b7739acb7674b9e33bd37b480f6effabe3cc0b1-1448x1086-webp',
        1448,
        1086,
      ),
      alt: 'Paintbrushes, palettes and colourful canvases in an artist’s studio',
    },
  },
  testimonial: {
    quote:
      'Laura created a stunning mural for our nursery. It has completely transformed the space and the children absolutely love it!',
    author: 'Sarah O’Connor',
    role: 'Nursery owner',
  },
  seo: {},
  services,
  galleryPreview: galleryItems,
  settings,
};

const aboutData: AboutData = {
  hero: {
    eyebrow: 'About Laura',
    titleLines: ['A love for art', 'and community'],
    description: 'I’m Laura Faichney, an artist based in Ireland.',
    image: {
      url: image(
        'image-039ccadcad11f40cb3edf73e3badd086e040239c-1374x1145-webp',
        1374,
      ),
      alt: 'Painted flower study in an open sketchbook with a palette and brushes',
    },
    ctaLabel: 'Get in Touch',
  },
  values: [
    { icon: 'palette', title: 'Creative & Bespoke', text: 'Artwork tailored.' },
    {
      icon: 'heart',
      title: 'All Ages Welcome',
      text: 'Facepainting to tutoring.',
    },
    {
      icon: 'sparkles',
      title: 'Brighter Spaces',
      text: 'Colour and character.',
    },
    {
      icon: 'pin',
      title: 'Local & Community Focused',
      text: 'Work in Ireland.',
    },
  ],
  storyHeading: 'My Story',
  storyBody: 'Art has always been a big part of my life.',
  storyImage: {
    url: image(
      'image-6dc8b4ce1ddd05917a67627ed1140f7230f2ac9d-1122x1402-png',
      1122,
    ),
    alt: 'Colourful painted portrait',
  },
  seo: {},
  settings,
};

const servicesData: ServicesData = {
  hero: {
    eyebrow: 'My services',
    titleLines: ['Art for Every', 'Space and Occasion'],
    description: 'Creative services for homes, businesses and events.',
    image: {
      url: image(
        'image-7da19494c0d4338fc98b7b0373afa921a5b32f3f-1374x1145-webp',
        1374,
      ),
      alt: 'Paintbrushes in a paint-splashed cup with sweeping colourful brushstrokes',
    },
  },
  seo: {},
  services,
  settings,
};

const galleryData: GalleryData = {
  hero: {
    eyebrow: 'Gallery',
    titleLines: ['A glimpse of my work'],
    description:
      'Explore a selection of colourful paintings and creative work.',
    image: {
      url: image(
        'image-d9bb83bbbb07c39f42f8c62a2c96a096c4c0e457-1374x1145-webp',
        1374,
      ),
      alt: 'A collection of colourful paintings featuring a flower, a cow, and a coastal scene',
    },
  },
  seo: {},
  items: galleryItems,
  settings,
};

test('home presents the artwork-led journey and accessible contact actions', () => {
  const html = renderToStaticMarkup(<HomePage data={homeData} />);

  expect(html).toContain('Bold Art');
  expect(html).toContain('Brighter Spaces');
  expect(html).toContain('Art for Homes, Businesses &amp; Events');
  expect(html).toContain('Murals that bring spaces to life');
  expect(html).toContain('href="/services"');
  expect(html).toContain('href="/gallery"');
  expect(html).toContain('href="tel:0894007747"');
  expect(html).toContain('href="mailto:lauralfaichney@gmail.com"');
  expect(html).toContain('lucide-phone');
  expect(html).toContain('lucide-mail');
  expect(html).toContain('fetchPriority="high"');
  expect(html).toContain('https://cdn.sanity.io/images/uag6kepo/production/');
  expect(html).toContain('alt="A brighter world through art"');
  expect(html).toContain('What Clients Say');
  expect(html).toContain('Laura created a stunning mural for our nursery.');
  expect(html).toContain('Sarah O’Connor');
  expect(html.indexOf('What Clients Say')).toBeGreaterThan(
    html.indexOf('More About Laura'),
  );
  expect(html.indexOf('What Clients Say')).toBeLessThan(
    html.indexOf('Get in Touch'),
  );
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('services expose all five supplied offerings as complete links', () => {
  const html = renderToStaticMarkup(<ServicesPage data={servicesData} />);

  expect(
    [
      'Commissioned Paintings',
      'Murals (Indoor &amp; Outdoor)',
      'Signage',
      'Facepainting',
      'Art Tutoring',
    ].every((title) => html.includes(title)),
  ).toBe(true);
  expect(html.match(/class="service-list-link"/g)).toHaveLength(5);
  expect(html).not.toContain('picsum-');
  for (const slug of [
    'commissioned-paintings',
    'murals-indoor-outdoor',
    'signage',
    'facepainting',
    'art-tutoring',
  ]) {
    expect(html).toContain(`/contact?service=${slug}`);
  }
  expect(html).toContain(
    'alt="Paintbrushes in a paint-splashed cup with sweeping colourful brushstrokes"',
  );
  expect(html.match(/<h1\b/g)).toHaveLength(1);
});

test('about and gallery present routes without invented client claims', () => {
  const about = renderToStaticMarkup(<AboutPage data={aboutData} />);
  const gallery = renderToStaticMarkup(<GalleryPage data={galleryData} />);

  expect(about.replace(/<br\s*\/?\s*>/g, ' ')).toContain(
    'A love for art and community',
  );
  expect(about).toContain('My Story');
  expect(about).not.toContain('Sarah O’Connor');
  expect(gallery).toContain('A glimpse of my work');
  expect(gallery).toContain(
    'https://cdn.sanity.io/images/uag6kepo/production/',
  );
  expect(gallery).toContain('loading="lazy"');
  const contact = renderToStaticMarkup(<ContactPage settings={settings} />);
  expect(contact).toContain('src="/artwork/contact-hero-cutout.webp"');
  expect(contact).toContain(
    'mailto:lauralfaichney@gmail.com?subject=Art%20project%20enquiry',
  );
});

test('every subpage introduces its content with a distinct artwork-led hero', () => {
  const pages = [
    renderToStaticMarkup(<AboutPage data={aboutData} />),
    renderToStaticMarkup(<ServicesPage data={servicesData} />),
    renderToStaticMarkup(<GalleryPage data={galleryData} />),
    renderToStaticMarkup(<ContactPage settings={settings} />),
  ];
  const heroImages = pages.map((html) => {
    const hero = html.match(
      /<section class="[^"]*page-hero[^"]*">([\s\S]*?)<\/section>/,
    )?.[1];
    expect(hero, 'each subpage should have a page hero').toBeDefined();
    expect(hero).toContain('<h1');
    expect(hero).toContain('gold-stroke');
    const image = hero?.match(/src="([^"]+)"/)?.[1];
    expect(image, 'each subpage hero should use artwork').toBeDefined();
    return image;
  });

  expect(new Set(heroImages).size).toBe(4);
  expect(
    heroImages.filter((image) =>
      image?.includes('https://cdn.sanity.io/images/uag6kepo/production/'),
    ),
  ).toHaveLength(3);
});

test('about values and arrows use Lucide icons instead of unicode glyphs', () => {
  const about = renderToStaticMarkup(<AboutPage data={aboutData} />);
  const services = renderToStaticMarkup(<ServicesPage data={servicesData} />);
  const home = renderToStaticMarkup(<HomePage data={homeData} />);
  const header = renderToStaticMarkup(<SiteHeader active="/" />);

  expect(about).toContain('lucide-palette');
  expect(about).toContain('lucide-heart');
  expect(about).toContain('lucide-sparkles');
  expect(about).toContain('lucide-map-pin');
  expect(about.match(/width="44"/g)).toHaveLength(4);
  expect(about).not.toContain('✳');
  expect(about).not.toContain('♡');
  expect(about).not.toContain('✧');
  expect(about).not.toContain('❧');

  expect(home).toContain('lucide-arrow-right');
  expect(about).toContain('lucide-arrow-right');
  expect(services).toContain('lucide-arrow-right');
  expect(header).toContain('lucide-arrow-right');
  expect(header).toContain('primary-navigation');
  expect(`${home}${about}${services}${header}`).not.toContain('→');
});

test('gallery uses five distinct photos without displaying placeholder notices', () => {
  const html = renderToStaticMarkup(<GalleryPage data={galleryData} />);

  expect(html).not.toContain('Temporary');
  expect(html).not.toContain('Picsum');
  expect(html.match(/<figure/g)).toHaveLength(5);
  for (const [slug, title] of [
    ['pink-flowers', 'Pink flowers'],
    ['coffee-conversation', 'Coffee &amp; conversation'],
    ['summer-reds', 'Summer reds'],
    ['open-book', 'An open book'],
    ['creative-desk', 'A creative desk'],
  ]) {
    expect(html).toContain(`href="/gallery/${slug}"`);
    expect(html).toContain(`<figcaption>${title}</figcaption>`);
  }
  const sources = html.match(/src="(https:\/\/cdn\.sanity\.io[^"]+)"/g);
  expect(new Set(sources).size).toBe(6);
  for (const alt of [
    'Pink flowers against a blue sky',
    'Coffee cups on a wooden café table',
    'Fresh strawberries in rich pink and red tones',
    'An open book on a wooden table',
    'A notebook, camera and laptop on a creative desk',
  ]) {
    expect(html).toContain(`alt="${alt}"`);
  }
  expect(html).not.toContain('colour-portrait');
  expect(html).not.toContain('pink-botanical');
});
