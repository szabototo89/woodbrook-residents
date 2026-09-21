import type { LucideIcon } from 'lucide-react';
import { Flower2, Gift, Leaf, Sparkles } from 'lucide-react';

export type TreatmentCategory =
  'Massage' | 'Facials & skin' | 'Beauty essentials' | 'Packages';

export type Treatment = Readonly<{
  slug: string;
  name: string;
  category: TreatmentCategory;
  durationMinutes: number;
  priceCents: number;
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
  },
  {
    slug: 'aromatherapy-massage',
    name: 'Aromatherapy massage',
    category: 'Massage',
    durationMinutes: 40,
    priceCents: 5500,
  },
  {
    slug: 'juliet-rose-signature-facial',
    name: 'Juliet Rose Signature Facial',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 9500,
  },
  {
    slug: 'anti-aging-facial',
    name: 'Anti aging facial',
    category: 'Facials & skin',
    durationMinutes: 60,
    priceCents: 8000,
  },
  {
    slug: 'gel-polish-pedicure',
    name: 'Gel polish pedicure',
    category: 'Beauty essentials',
    durationMinutes: 70,
    priceCents: 6000,
  },
  {
    slug: 'file-and-paint-with-gel-polish',
    name: 'File and paint with gel polish',
    category: 'Beauty essentials',
    durationMinutes: 45,
    priceCents: 4000,
  },
  {
    slug: 'purity-perfection',
    name: 'Purity Perfection',
    category: 'Packages',
    durationMinutes: 120,
    priceCents: 12000,
  },
  {
    slug: 'ethereal-elegance',
    name: 'Ethereal Elegance',
    category: 'Packages',
    durationMinutes: 100,
    priceCents: 11000,
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

export function bookTreatmentUrl(treatment: Treatment): string {
  return `/book?service=${treatment.slug}`;
}

export type BookingsServiceSummary = Readonly<{
  id: string;
  name: string;
  slug: string;
  categoryName?: string;
  durationMinutes?: number;
  priceCents?: number;
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
  };
}
