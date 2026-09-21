import { CalendarDays, CircleCheck, Sparkles } from 'lucide-react';

import {
  EditorialPageHero,
  type EditorialPageHeroHighlight,
} from '../../components/EditorialPageHero';

const bookingHighlights = [
  {
    title: 'Professional & friendly care',
    description: '',
    Icon: Sparkles,
  },
  {
    title: 'Relaxing environment',
    description: '',
    Icon: CalendarDays,
  },
  {
    title: 'Tailored to your needs',
    description: '',
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
      title={
        <>
          <span className="booking-hero-title-line">Request an</span>{' '}
          <span className="booking-hero-title-line">appointment</span>
        </>
      }
      description="Choose your treatment, preferred weekday and time. Your appointment is confirmed when Juliet Rose gets back to you."
      scriptLines={['Relax', 'Restore', 'Rejuvenate']}
      highlights={bookingHighlights}
    />
  );
}
