export const BOOKING_URL = 'https://www.julietrosebeauty.com/book-online';
export const GIFT_CARD_URL = 'https://www.julietrosebeauty.com/gift-card';

export type TreatmentCategory = {
  name: string;
  description: string;
  image: string;
  action: string;
};

export const treatmentCategories: TreatmentCategory[] = [
  {
    name: 'Facials & Skin',
    description: 'From our signature facial to advanced skin treatments.',
    image: '/images/facial-mask.jpg',
    action: 'View treatments',
  },
  {
    name: 'Massage',
    description: 'Relaxing and therapeutic massage treatments.',
    image: '/images/massage.jpg',
    action: 'View treatments',
  },
  {
    name: 'Beauty Essentials',
    description: 'Nails, brows, lashes and more.',
    image: '/images/manicure.jpg',
    action: 'View treatments',
  },
  {
    name: 'Packages',
    description: 'A combination of treatments for the ultimate experience.',
    image: '/images/packages.jpg',
    action: 'View packages',
  },
];

export type FeaturedTreatment = {
  name: string;
  duration: string;
  price: string;
  image: string;
  imageAlt: string;
};

export const featuredTreatments: FeaturedTreatment[] = [
  {
    name: 'Juliet Rose Signature Facial',
    duration: '1 hour',
    price: '€95',
    image: '/images/facial-mask.jpg',
    imageAlt: 'Juliet Rose Signature Facial treatment',
  },
  {
    name: 'Microneedling',
    duration: '1 hour',
    price: '€130',
    image: '/images/microneedling.jpg',
    imageAlt: 'Microneedling skincare treatment',
  },
  {
    name: 'Deep hydration 6 step facial',
    duration: '1 hour',
    price: '€110',
    image: '/images/facial-mask.jpg',
    imageAlt: 'Deep hydration facial treatment',
  },
  {
    name: 'Swedish massage',
    duration: '1 hour',
    price: '€80',
    image: '/images/massage.jpg',
    imageAlt: 'Swedish massage treatment',
  },
];
