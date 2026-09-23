import type { LucideIcon } from 'lucide-react';
import { Flower2, Gift, Leaf, Sparkles } from 'lucide-react';
import {
  facialMaskImage,
  manicureImage,
  massageImage,
  microneedlingImage,
  packagesImage,
} from '../imageAssets';

export type TreatmentCategory =
  'Massage' | 'Facials & skin' | 'Beauty essentials' | 'Packages';

export type Treatment = Readonly<{
  slug: string;
  name: string;
  category: TreatmentCategory;
  durationMinutes: number;
  priceCents: number;
  isFeatured: boolean;
}>;

export type CategoryMeta = Readonly<{
  category: TreatmentCategory;
  id: string;
  description: string;
  Icon: LucideIcon;
}>;

export const CATEGORIES: readonly CategoryMeta[] = [
  {
    category: 'Massage',
    id: 'massage',
    description: 'Release tension. Restore balance.',
    Icon: Leaf,
  },
  {
    category: 'Facials & skin',
    id: 'facials-and-skin',
    description: 'Healthy skin. A brighter you.',
    Icon: Flower2,
  },
  {
    category: 'Beauty essentials',
    id: 'beauty-essentials',
    description: 'Little luxuries. Everyday confidence.',
    Icon: Sparkles,
  },
  {
    category: 'Packages',
    id: 'packages',
    description: 'Curated experiences for total wellbeing.',
    Icon: Gift,
  },
];

const KNOWN_CATEGORIES: readonly TreatmentCategory[] = CATEGORIES.map(
  (meta) => meta.category,
);

/** Editor preview data. Real researched entries, never booked from. */
export const PREVIEW_TREATMENTS: readonly Treatment[] = [
  {
    slug: 'swedish-massage',
    name: 'Swedish massage',
    category: 'Massage',
    durationMinutes: 60,
    priceCents: 8000,
    isFeatured: true,
  },
  {
    slug: 'aromatherapy-massage',
    name: 'Aromatherapy massage',
    category: 'Massage',
    durationMinutes: 40,
    priceCents: 5500,
    isFeatured: false,
  },
  {
    slug: 'microneedling',
    name: 'Microneedling',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 13000,
    isFeatured: true,
  },
  {
    slug: 'juliet-rose-signature-facial',
    name: 'Juliet Rose Signature Facial',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 9500,
    isFeatured: true,
  },
  {
    slug: 'anti-aging-facial',
    name: 'Anti aging facial',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 8000,
    isFeatured: false,
  },
  {
    slug: 'deep-hydration-6-step-facial',
    name: 'Deep hydration 6 step facial',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 11000,
    isFeatured: true,
  },
  {
    slug: 'gel-polish-pedicure',
    name: 'Gel polish pedicure',
    category: 'Beauty essentials',
    durationMinutes: 70,
    priceCents: 6000,
    isFeatured: false,
  },
  {
    slug: 'file-and-paint-with-gel-polish',
    name: 'File and paint with gel polish',
    category: 'Beauty essentials',
    durationMinutes: 45,
    priceCents: 4000,
    isFeatured: false,
  },
  {
    slug: 'purity-perfection',
    name: 'Purity Perfection',
    category: 'Packages',
    durationMinutes: 120,
    priceCents: 12000,
    isFeatured: false,
  },
  {
    slug: 'ethereal-elegance',
    name: 'Ethereal Elegance',
    category: 'Packages',
    durationMinutes: 100,
    priceCents: 11000,
    isFeatured: false,
  },
];

export function formatTreatmentDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes === 0
    ? `${hours} hr`
    : `${hours} hr ${remainingMinutes} min`;
}

export function formatTreatmentPrice(priceCents: number): string {
  return `€${priceCents / 100}`;
}

export function formatFeaturedDuration(minutes: number): string {
  return formatTreatmentDuration(minutes).replace('hr', 'hour');
}

export function bookTreatmentUrl(
  treatment: Treatment,
  baseUrl = '/book',
): string {
  return `${baseUrl}?service=${treatment.slug}`;
}

export type CategoryCard = Readonly<{
  category: TreatmentCategory;
  description: string;
  image: string;
  action: string;
  href: string;
}>;

export const CATEGORY_CARDS: readonly CategoryCard[] = [
  {
    category: 'Facials & skin',
    description: 'From our signature facial to advanced skin treatments.',
    image: facialMaskImage,
    action: 'View treatments',
    href: '/treatments#facials-and-skin',
  },
  {
    category: 'Massage',
    description: 'Relaxing and therapeutic massage treatments.',
    image: massageImage,
    action: 'View treatments',
    href: '/treatments#massage',
  },
  {
    category: 'Beauty essentials',
    description: 'Nails, brows, lashes and more.',
    image: manicureImage,
    action: 'View treatments',
    href: '/treatments#beauty-essentials',
  },
  {
    category: 'Packages',
    description: 'A combination of treatments for the ultimate experience.',
    image: packagesImage,
    action: 'View packages',
    href: '/treatments#packages',
  },
];

export const DEFAULT_FEATURED_SLUGS: readonly string[] = [
  'juliet-rose-signature-facial',
  'microneedling',
  'deep-hydration-6-step-facial',
  'swedish-massage',
];

export function parseFeaturedSlugs(value?: string): readonly string[] {
  if (!value) {
    return DEFAULT_FEATURED_SLUGS;
  }
  return value
    .split(',')
    .map((slug) => slug.trim())
    .filter((slug) => slug.length > 0);
}

export type FeaturedImage = Readonly<{
  image: string;
  imageAlt: string;
}>;

const FEATURED_IMAGES: Readonly<Record<string, FeaturedImage>> = {
  'juliet-rose-signature-facial': {
    image: facialMaskImage,
    imageAlt: 'Juliet Rose Signature Facial treatment',
  },
  microneedling: {
    image: microneedlingImage,
    imageAlt: 'Microneedling skincare treatment',
  },
  'deep-hydration-6-step-facial': {
    image: facialMaskImage,
    imageAlt: 'Deep hydration facial treatment',
  },
  'swedish-massage': {
    image: massageImage,
    imageAlt: 'Swedish massage treatment',
  },
};

export type FeaturedTreatment = Readonly<{
  treatment: Treatment;
  image: string;
  imageAlt: string;
}>;

function toFeaturedTreatment(treatment: Treatment): FeaturedTreatment {
  const imagery = FEATURED_IMAGES[treatment.slug];
  return {
    treatment,
    image: imagery?.image ?? '',
    imageAlt: imagery?.imageAlt ?? treatment.name,
  };
}

export function resolveFeatured(
  treatments: readonly Treatment[],
  slugs: readonly string[],
): readonly FeaturedTreatment[] {
  const bySlug = new Map(treatments.map((item) => [item.slug, item]));
  return slugs.flatMap((slug) => {
    const treatment = bySlug.get(slug);
    if (!treatment) {
      return [];
    }
    return [toFeaturedTreatment(treatment)];
  });
}

/**
 * Automatic featured selection driven by the CMS featured flag. Falls back
 * to the given slugs when no treatment is flagged, so existing grids keep
 * rendering instead of going empty.
 */
export function resolveAutomaticFeatured(
  treatments: readonly Treatment[],
  fallbackSlugs: readonly string[] = DEFAULT_FEATURED_SLUGS,
): readonly FeaturedTreatment[] {
  const flagged = treatments.filter((treatment) => treatment.isFeatured);
  if (flagged.length > 0) {
    return flagged.map(toFeaturedTreatment);
  }
  return resolveFeatured(treatments, fallbackSlugs);
}

export type BookingsServiceSummary = Readonly<{
  id: string;
  name: string;
  slug: string;
  categoryName?: string;
  durationMinutes?: number;
  priceCents?: number;
  isFeatured: boolean;
}>;

export function toCardTreatment(
  service: BookingsServiceSummary,
): Treatment | null {
  const category = KNOWN_CATEGORIES.find(
    (known) => known === service.categoryName,
  );
  if (!category) {
    return null;
  }
  return {
    slug: service.slug,
    name: service.name,
    category,
    durationMinutes: service.durationMinutes ?? 60,
    priceCents: service.priceCents ?? 0,
    isFeatured: service.isFeatured ?? false,
  };
}
