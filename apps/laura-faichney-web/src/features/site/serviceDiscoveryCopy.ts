import type {
  CmsHero,
  CmsSeo,
  GalleryData,
  HomeData,
  ServicesData,
} from './lauraSanity';

export const serviceDiscoveryCopy = {
  home: {
    title: 'Laura Faichney All Things Art',
    description:
      "Explore Laura Faichney's commissioned paintings and indoor and outdoor murals. View her work and get in touch about your project.",
    introduction:
      'Commissioned paintings and indoor and outdoor murals — bringing colour and character to your space.',
    servicesHeading: 'Commissioned Paintings, Murals & More',
  },
  services: {
    title: 'Commissioned Paintings & Murals',
    heading: 'Commissioned Paintings\nand Murals',
    description:
      'Discover bespoke paintings and murals by Laura Faichney, alongside her other creative services. Explore the options and discuss your idea.',
  },
  gallery: {
    title: 'Paintings & Creative Work',
    heading: 'Paintings and\nCreative Work',
    description:
      'Explore paintings and creative work by Laura Faichney. Browse the collections and get in touch about a commissioned piece.',
  },
  contact: {
    title: 'Contact',
    heading: 'Discuss Your Painting or Mural',
    description:
      'Contact Laura Faichney about a commissioned painting or mural. Share your idea, preferred size or space, timeframe and project location.',
    introduction:
      'Have a painting or mural in mind? Share your idea, preferred size or space, timeframe and project location.',
  },
};

// Revise only the original published copy. Later Studio edits remain authoritative.
function reviseText(value: string, original: string, approved: string): string {
  return !value.trim() || value === original ? approved : value;
}

function reviseSeo(seo: CmsSeo, original: CmsSeo, approved: CmsSeo): CmsSeo {
  return {
    title: reviseText(
      seo.title ?? '',
      original.title ?? '',
      approved.title ?? '',
    ),
    description: reviseText(
      seo.description ?? '',
      original.description ?? '',
      approved.description ?? '',
    ),
  };
}

function reviseHeading(
  hero: CmsHero,
  original: string,
  approved: string,
): CmsHero {
  return {
    ...hero,
    titleLines: reviseText(
      hero.titleLines.join('\n'),
      original,
      approved,
    ).split('\n'),
  };
}

export function reviseHomeCopy(data: HomeData): HomeData {
  const originalIntroduction =
    'Commissioned paintings, murals, signage, facepainting and art tutoring - bringing more colour and creativity to everyday spaces.';
  const description = reviseText(
    data.hero.description,
    originalIntroduction,
    serviceDiscoveryCopy.home.introduction,
  );
  return {
    ...data,
    hero: {
      ...data.hero,
      description: reviseText(
        description,
        originalIntroduction.replace(' - ', ' — '),
        serviceDiscoveryCopy.home.introduction,
      ),
    },
    servicesHeading: reviseText(
      data.servicesHeading,
      'Art for Homes, Businesses & Events',
      serviceDiscoveryCopy.home.servicesHeading,
    ),
    seo: reviseSeo(
      data.seo,
      {
        title: 'Laura Faichney All Things Art',
        description:
          'Colourful paintings, murals, signage, facepainting and art tutoring by Laura Faichney.',
      },
      serviceDiscoveryCopy.home,
    ),
  };
}

export function reviseServicesCopy(data: ServicesData): ServicesData {
  return {
    ...data,
    hero: {
      ...reviseHeading(
        data.hero,
        'Art for Every\nSpace and Occasion',
        serviceDiscoveryCopy.services.heading,
      ),
      description: reviseText(
        data.hero.description,
        'From bespoke paintings to large-scale murals, facepainting and art tutoring, I offer creative services for homes, businesses and events.',
        serviceDiscoveryCopy.services.description,
      ),
    },
    seo: reviseSeo(
      data.seo,
      {
        title: 'Services',
        description:
          'From bespoke paintings to large-scale murals, facepainting and art tutoring, creative services for homes, businesses and events.',
      },
      serviceDiscoveryCopy.services,
    ),
  };
}

export function reviseGalleryCopy(data: GalleryData): GalleryData {
  return {
    ...data,
    hero: {
      ...reviseHeading(
        data.hero,
        'A glimpse of my work',
        serviceDiscoveryCopy.gallery.heading,
      ),
      description: reviseText(
        data.hero.description,
        'Explore a selection of colourful paintings and creative work.',
        serviceDiscoveryCopy.gallery.description,
      ),
    },
    seo: reviseSeo(
      data.seo,
      {
        title: 'Gallery',
        description: 'A glimpse of Laura Faichney paintings and creative work.',
      },
      serviceDiscoveryCopy.gallery,
    ),
  };
}
