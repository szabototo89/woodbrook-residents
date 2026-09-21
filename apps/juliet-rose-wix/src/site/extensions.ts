import { jrBookingJourneyExtension } from './widgets/jr-booking-journey/jr-booking-journey.extension';
import { jrHeroExtension } from './widgets/jr-hero/jr-hero.extension';
import { jrStudioSectionsExtension } from './widgets/jr-studio-sections/jr-studio-sections.extension';
import { jrTreatmentCardsExtension } from './widgets/jr-treatment-cards/jr-treatment-cards.extension';
import type { SiteWidgetExtension } from './siteWidgetExtension';

export const siteWidgetExtensions: readonly SiteWidgetExtension[] = [
  jrHeroExtension,
  jrTreatmentCardsExtension,
  jrStudioSectionsExtension,
  jrBookingJourneyExtension,
];
