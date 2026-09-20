import { CalendarDays, CircleCheck, Sparkles } from 'lucide-react';

import {
  EditorialPageHero,
  type EditorialPageHeroHighlight,
} from '../../components/EditorialPageHero';

const bookingHighlights = [
  {
    title: 'Choose a treatment',
    description: 'Compare services and prices',
    Icon: Sparkles,
  },
  {
    title: 'Pick a preferred date',
    description: 'Monday to Friday availability',
    Icon: CalendarDays,
  },
  {
    title: 'Await confirmation',
    description: 'Juliet Rose confirms with you',
    Icon: CircleCheck,
  },
] as const satisfies readonly [
  EditorialPageHeroHighlight,
  EditorialPageHeroHighlight,
  EditorialPageHeroHighlight,
];

export function BookingHero() {
  return (
    <EditorialPageHero
      eyebrow="Book your visit"
      title="Request an appointment"
      description="Choose your treatment, preferred weekday and time. Your appointment is confirmed when Juliet Rose gets back to you."
      scriptLines={['Relax', 'and', 'Rejuvenate']}
      highlights={bookingHighlights}
    />
  );
}
