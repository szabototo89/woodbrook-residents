import { Flower2, Heart, Leaf } from 'lucide-react';

import {
  EditorialPageHero,
  type EditorialPageHeroHighlight,
} from '../../components/EditorialPageHero';

const treatmentHighlights = [
  {
    title: 'Relax & unwind',
    description: 'Expert care, tailored to you',
    Icon: Leaf,
  },
  {
    title: 'Natural radiance',
    description: 'Real results, naturally',
    Icon: Flower2,
  },
  {
    title: 'A more confident you',
    description: 'Because you deserve it',
    Icon: Heart,
  },
] as const satisfies readonly [
  EditorialPageHeroHighlight,
  EditorialPageHeroHighlight,
  EditorialPageHeroHighlight,
];

export function TreatmentHero() {
  return (
    <EditorialPageHero
      eyebrow="Our services"
      title="Treatments & prices"
      description="Choose a treatment and send an appointment request at a date and time that suits you."
      scriptLines={['Relax', 'and', 'Rejuvenate']}
      highlights={treatmentHighlights}
    />
  );
}
