import { createPageHead } from '../../app/siteMetadata';

export type CmsImage = {
  url: string;
  alt: string;
};

export type CmsHero = {
  eyebrow: string;
  titleLines: string[];
  description: string;
  image: CmsImage;
  ctaLabel?: string;
};

export type CmsSeo = {
  title?: string;
  description?: string;
};

export type CmsService = {
  title: string;
  slug: string;
  description: string;
  image: CmsImage;
  order: number;
};

export type CmsGalleryItem = {
  alt: string;
  image: CmsImage;
  fullImage: CmsImage;
  saleStatus?: 'for-sale' | 'not-for-sale' | 'none';
  order: number;
};

export type CmsGalleryCollection = {
  title: string;
  slug: string;
  description: string;
  order: number;
  photos: CmsGalleryItem[];
};

export function galleryCollectionPath(
  collection: Pick<CmsGalleryCollection, 'slug'>,
): string {
  return `/gallery/${collection.slug}`;
}

export function getGalleryCollection(
  collections: CmsGalleryCollection[],
  slug: string,
): CmsGalleryCollection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export type CmsSettings = {
  email: string;
  phone: string;
  mailtoSubject: string;
  eyebrow: string;
  heading: string;
  copy: string;
};

export type HomeData = {
  hero: CmsHero;
  servicesHeading: string;
  mural: {
    eyebrow: string;
    heading: string;
    copy: string;
    ctaLabel: string;
    image: CmsImage;
  };
  galleryHeading: string;
  about: { heading: string; copy: string; image: CmsImage };
  testimonial: { quote: string; author: string; role: string };
  seo: CmsSeo;
  services: CmsService[];
  collections: CmsGalleryCollection[];
  settings: CmsSettings;
};

export type AboutValue = {
  icon: string;
  title: string;
  text: string;
};

export type AboutData = {
  hero: CmsHero;
  values: AboutValue[];
  storyHeading: string;
  storyBody: string;
  storyImage: CmsImage;
  seo: CmsSeo;
  settings: CmsSettings;
};

export type ServicesData = {
  hero: CmsHero;
  seo: CmsSeo;
  services: CmsService[];
  settings: CmsSettings;
};

export type GalleryData = {
  hero: CmsHero;
  seo: CmsSeo;
  collections: CmsGalleryCollection[];
  settings: CmsSettings;
};

export function splitTitleLines(title: string): string[] {
  return title
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

export function splitBalancedLines(title: string): string[] {
  const words = title.split(/\s+/).filter((word) => word.length > 0);
  if (words.length < 2) return words;
  const firstHalf = Math.ceil(words.length / 2);
  return [
    words.slice(0, firstHalf).join(' '),
    words.slice(firstHalf).join(' '),
  ];
}

export function pageHeadFromSeo(input: {
  seo: CmsSeo;
  fallbackTitle: string;
  fallbackDescription: string;
  path: string;
}) {
  return createPageHead({
    title: input.seo.title?.trim() || input.fallbackTitle,
    description: input.seo.description?.trim() || input.fallbackDescription,
    path: input.path,
  });
}
