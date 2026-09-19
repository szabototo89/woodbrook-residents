import {
  formatTreatmentDuration,
  requireTreatmentBySlug,
} from '../treatments/treatmentCatalog';

export const BOOKING_URL = '/book';
export const GIFT_CARD_URL = 'https://www.julietrosebeauty.com/gift-card';

export type TreatmentCategory = {
  name: string;
  description: string;
  image: string;
  action: string;
  href: string;
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    name: 'Facials & Skin',
    description: 'From our signature facial to advanced skin treatments.',
    image: '/images/facial-mask.jpg',
    action: 'View treatments',
    href: '/treatments#facials-and-skin',
  },
  {
    name: 'Massage',
    description: 'Relaxing and therapeutic massage treatments.',
    image: '/images/massage.jpg',
    action: 'View treatments',
    href: '/treatments#massage',
  },
  {
    name: 'Beauty Essentials',
    description: 'Nails, brows, lashes and more.',
    image: '/images/manicure.jpg',
    action: 'View treatments',
    href: '/treatments#beauty-essentials',
  },
  {
    name: 'Packages',
    description: 'A combination of treatments for the ultimate experience.',
    image: '/images/packages.jpg',
    action: 'View packages',
    href: '/treatments#packages',
  },
];

export type FeaturedTreatment = {
  slug: string;
  name: string;
  duration: string;
  price: string;
  image: string;
  imageAlt: string;
};

const featuredTreatmentImages = [
  {
    slug: 'juliet-rose-signature-facial',
    image: '/images/facial-mask.jpg',
    imageAlt: 'Juliet Rose Signature Facial treatment',
  },
  {
    slug: 'microneedling',
    image: '/images/microneedling.jpg',
    imageAlt: 'Microneedling skincare treatment',
  },
  {
    slug: 'deep-hydration-6-step-facial',
    image: '/images/facial-mask.jpg',
    imageAlt: 'Deep hydration facial treatment',
  },
  {
    slug: 'swedish-massage',
    image: '/images/massage.jpg',
    imageAlt: 'Swedish massage treatment',
  },
] as const;

export const featuredTreatments: FeaturedTreatment[] =
  featuredTreatmentImages.map((featured) => {
    const treatment = requireTreatmentBySlug(featured.slug);
    return {
      ...featured,
      name: treatment.name,
      duration: formatTreatmentDuration(treatment.durationMinutes).replace(
        'hr',
        'hour',
      ),
      price: `€${treatment.priceCents / 100}`,
    };
  });
