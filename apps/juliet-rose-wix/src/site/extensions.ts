import { jrBookingJourneyExtension } from './widgets/jr-booking-journey/jr-booking-journey.extension';
import { jrCategoryGridExtension } from './widgets/jr-category-grid/jr-category-grid.extension';
import { jrFeaturedGridExtension } from './widgets/jr-featured-grid/jr-featured-grid.extension';
import { jrHeroExtension } from './widgets/jr-hero/jr-hero.extension';
import { jrStudioSectionsExtension } from './widgets/jr-studio-sections/jr-studio-sections.extension';
import { jrTreatmentCatalogExtension } from './widgets/jr-treatment-catalog/jr-treatment-catalog.extension';
import { jrTreatmentGuidanceExtension } from './widgets/jr-treatment-guidance/jr-treatment-guidance.extension';
import type { SiteWidgetExtension } from './siteWidgetExtension';

export const siteWidgetExtensions: readonly SiteWidgetExtension[] = [
  jrHeroExtension,
  jrCategoryGridExtension,
  jrFeaturedGridExtension,
  jrTreatmentCatalogExtension,
  jrTreatmentGuidanceExtension,
  jrStudioSectionsExtension,
  jrBookingJourneyExtension,
];
