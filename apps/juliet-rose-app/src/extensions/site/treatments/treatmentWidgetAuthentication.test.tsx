import { expect, test, vi } from 'vitest';

const treatmentsInjector = vi.hoisted(() => vi.fn());
const homeContentInjector = vi.hoisted(() => vi.fn());

vi.mock('react-to-webcomponent', () => ({
  default: () => class {},
}));

vi.mock('./treatmentsServices', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./treatmentsServices')>()),
  getTreatmentsAccessTokenInjector: () => treatmentsInjector,
}));

vi.mock('../homeContent/homeContentServices', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../homeContent/homeContentServices')
  >()),
  getHomeContentAccessTokenInjector: () => homeContentInjector,
}));

import HomePageElement from '../widgets/jr-home-page/jr-home-page';
import FeaturedGridElement from '../widgets/jr-featured-grid/jr-featured-grid';
import TreatmentCatalogElement from '../widgets/jr-treatment-catalog/jr-treatment-catalog';
import TreatmentsPageElement from '../widgets/jr-treatments-page/jr-treatments-page';

test.each([
  ['treatment catalog', TreatmentCatalogElement],
  ['treatments page', TreatmentsPageElement],
])('%s accepts a Wix access token for CMS requests', (_, Element) => {
  const element = new Element();

  expect(element.accessTokenListener).toBe(treatmentsInjector);
});

test.each([
  ['home page', HomePageElement],
  ['featured grid', FeaturedGridElement],
])(
  '%s forwards a Wix access token to treatments and home content',
  (_, Element) => {
    const element = new Element();
    const listener = element.accessTokenListener;
    const getAccessTokenFn = () => Promise.resolve('token');

    expect(typeof listener).toBe('function');
    listener(getAccessTokenFn);

    expect(treatmentsInjector).toHaveBeenCalledWith(getAccessTokenFn);
    expect(homeContentInjector).toHaveBeenCalledWith(getAccessTokenFn);
  },
);
