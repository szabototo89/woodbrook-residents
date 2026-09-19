import type { LucideIcon } from 'lucide-react';
import { Flower2, Gift, Leaf, Sparkles } from 'lucide-react';

import type { TreatmentCategory } from './treatmentCatalog';

type TreatmentCategoryPresentation = {
  description: string;
  Icon: LucideIcon;
};

export const treatmentCategoryPresentation = {
  Massage: {
    description: 'Release tension. Restore balance.',
    Icon: Leaf,
  },
  'Facials & skin': {
    description: 'Healthy skin. A brighter you.',
    Icon: Flower2,
  },
  'Beauty essentials': {
    description: 'Little luxuries. Everyday confidence.',
    Icon: Sparkles,
  },
  Packages: {
    description: 'Curated experiences for total wellbeing.',
    Icon: Gift,
  },
} satisfies Record<TreatmentCategory, TreatmentCategoryPresentation>;

export function categoryId(category: TreatmentCategory): string {
  return category.toLowerCase().replace('&', 'and').replaceAll(' ', '-');
}
