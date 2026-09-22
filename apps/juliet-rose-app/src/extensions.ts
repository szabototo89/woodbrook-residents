import { app } from '@wix/astro/builders';
import myPage from './extensions/dashboard/pages/my-page/my-page.extension.ts';

import jrHero from './extensions/site/widgets/jr-hero/jr-hero.extension.ts';

import jrCategoryGrid from './extensions/site/widgets/jr-category-grid/jr-category-grid.extension.ts';

import jrFeaturedGrid from './extensions/site/widgets/jr-featured-grid/jr-featured-grid.extension.ts';

import jrTreatmentCatalog from './extensions/site/widgets/jr-treatment-catalog/jr-treatment-catalog.extension.ts';

import jrTreatmentGuidance from './extensions/site/widgets/jr-treatment-guidance/jr-treatment-guidance.extension.ts';

import jrGiftCard from './extensions/site/widgets/jr-gift-card/jr-gift-card.extension.ts';

import jrVisitUs from './extensions/site/widgets/jr-visit-us/jr-visit-us.extension.ts';

import jrBookingPolicy from './extensions/site/widgets/jr-booking-policy/jr-booking-policy.extension.ts';

import jrBookingJourney from './extensions/site/widgets/jr-booking-journey/jr-booking-journey.extension.ts';

export default app()
  .use(myPage)
  .use(jrHero)
  .use(jrCategoryGrid)
  .use(jrFeaturedGrid)
  .use(jrTreatmentCatalog)
  .use(jrTreatmentGuidance)
  .use(jrGiftCard)
  .use(jrVisitUs)
  .use(jrBookingPolicy)
  .use(jrBookingJourney);
