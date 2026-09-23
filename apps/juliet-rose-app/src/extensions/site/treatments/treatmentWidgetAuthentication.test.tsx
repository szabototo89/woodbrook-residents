import { expect, test, vi } from 'vitest';

const injector = vi.hoisted(() => vi.fn());

vi.mock('react-to-webcomponent', () => ({
  default: () => class {},
}));

vi.mock('./treatmentsServices', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./treatmentsServices')>()),
  getTreatmentsAccessTokenInjector: () => injector,
}));

import HomePageElement from '../widgets/jr-home-page/jr-home-page';
import FeaturedGridElement from '../widgets/jr-featured-grid/jr-featured-grid';
import TreatmentCatalogElement from '../widgets/jr-treatment-catalog/jr-treatment-catalog';
import TreatmentsPageElement from '../widgets/jr-treatments-page/jr-treatments-page';

test.each([
  ['home page', HomePageElement],
  ['featured grid', FeaturedGridElement],
  ['treatment catalog', TreatmentCatalogElement],
  ['treatments page', TreatmentsPageElement],
])('%s accepts a Wix access token for CMS requests', (_, Element) => {
  const element = new Element();

  expect(element.accessTokenListener).toBe(injector);
});
