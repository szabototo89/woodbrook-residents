import { jrBookingJourneyExtension } from './widgets/jr-booking-journey/jr-booking-journey.extension';
import { jrBookingPolicyExtension } from './widgets/jr-booking-policy/jr-booking-policy.extension';
import { jrCategoryGridExtension } from './widgets/jr-category-grid/jr-category-grid.extension';
import { jrFeaturedGridExtension } from './widgets/jr-featured-grid/jr-featured-grid.extension';
import { jrGiftCardExtension } from './widgets/jr-gift-card/jr-gift-card.extension';
import { jrHeroExtension } from './widgets/jr-hero/jr-hero.extension';
import { jrHomePageExtension } from './widgets/jr-home-page/jr-home-page.extension';
import { jrGiftCardPageExtension } from './widgets/jr-gift-card-page/jr-gift-card-page.extension';
import { jrStudioSectionsExtension } from './widgets/jr-studio-sections/jr-studio-sections.extension';
import { jrTreatmentCatalogExtension } from './widgets/jr-treatment-catalog/jr-treatment-catalog.extension';
import { jrTreatmentGuidanceExtension } from './widgets/jr-treatment-guidance/jr-treatment-guidance.extension';
import { jrTreatmentHeroExtension } from './widgets/jr-treatment-hero/jr-treatment-hero.extension';
import { jrTreatmentsPageExtension } from './widgets/jr-treatments-page/jr-treatments-page.extension';
import { jrVisitUsExtension } from './widgets/jr-visit-us/jr-visit-us.extension';
import type { SiteWidgetExtension } from './siteWidgetExtension';

export const siteWidgetExtensions: readonly SiteWidgetExtension[] = [
  jrHeroExtension,
  jrCategoryGridExtension,
  jrFeaturedGridExtension,
  jrTreatmentCatalogExtension,
  jrTreatmentGuidanceExtension,
  jrGiftCardExtension,
  jrVisitUsExtension,
  jrBookingPolicyExtension,
  jrBookingJourneyExtension,
  jrTreatmentHeroExtension,
  jrGiftCardPageExtension,
  jrStudioSectionsExtension,
  jrHomePageExtension,
  jrTreatmentsPageExtension,
];
