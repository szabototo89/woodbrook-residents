import { expect, test, vi } from 'vitest';

const treatmentsInjector = vi.hoisted(() => vi.fn());
const homeContentInjector = vi.hoisted(() => vi.fn());
const contactDetailsInjector = vi.hoisted(() => vi.fn());
const bookingPolicyInjector = vi.hoisted(() => vi.fn());

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

vi.mock('../contactDetails/contactDetailsServices', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../contactDetails/contactDetailsServices')
  >()),
  getContactDetailsAccessTokenInjector: () => contactDetailsInjector,
}));

vi.mock('../bookingPolicy/bookingPolicyServices', async (importOriginal) => ({
  ...(await importOriginal<
    typeof import('../bookingPolicy/bookingPolicyServices')
  >()),
  getBookingPolicyAccessTokenInjector: () => bookingPolicyInjector,
}));

import HomePageElement from '../widgets/jr-home-page/jr-home-page';
import FeaturedGridElement from '../widgets/jr-featured-grid/jr-featured-grid';
import TreatmentCatalogElement from '../widgets/jr-treatment-catalog/jr-treatment-catalog';
import TreatmentsPageElement from '../widgets/jr-treatments-page/jr-treatments-page';
import VisitUsElement from '../widgets/jr-visit-us/jr-visit-us';
import StudioSectionsElement from '../widgets/jr-studio-sections/jr-studio-sections';
import BookingPolicyElement from '../widgets/jr-booking-policy/jr-booking-policy';
import GiftCardPageElement from '../widgets/jr-gift-card-page/jr-gift-card-page';

test.each([
  ['treatment catalog', TreatmentCatalogElement],
  ['treatments page', TreatmentsPageElement],
])('%s accepts a Wix access token for CMS requests', (_, Element) => {
  const element = new Element();

  expect(element.accessTokenListener).toBe(treatmentsInjector);
});

test.each([['booking policy', BookingPolicyElement]])(
  '%s accepts a Wix access token for CMS requests',
  (_, Element) => {
    const element = new Element();

    expect(element.accessTokenListener).toBe(bookingPolicyInjector);
  },
);

test.each([['gift card page', GiftCardPageElement]])(
  '%s accepts a Wix access token for CMS requests',
  (_, Element) => {
    const element = new Element();

    expect(element.accessTokenListener).toBe(contactDetailsInjector);
  },
);

function expectForwardsTo(
  Element: new () => { accessTokenListener: unknown },
  expected: ReturnType<typeof vi.fn>[],
) {
  const element = new Element();
  const listener = element.accessTokenListener;
  const getAccessTokenFn = () => Promise.resolve('token');

  if (typeof listener !== 'function') {
    throw new Error('Expected an access token listener function');
  }
  listener(getAccessTokenFn);

  expected.forEach((injector) => {
    expect(injector).toHaveBeenCalledWith(getAccessTokenFn);
  });
}

test.each([
  [
    'home page',
    HomePageElement,
    [
      treatmentsInjector,
      homeContentInjector,
      contactDetailsInjector,
      bookingPolicyInjector,
    ],
  ],
  [
    'featured grid',
    FeaturedGridElement,
    [treatmentsInjector, homeContentInjector],
  ],
  ['visit us', VisitUsElement, [homeContentInjector, contactDetailsInjector]],
  [
    'studio sections',
    StudioSectionsElement,
    [homeContentInjector, contactDetailsInjector, bookingPolicyInjector],
  ],
])(
  '%s forwards a Wix access token to its CMS collections',
  (_, Element, expected) => {
    expectForwardsTo(Element, expected);
  },
);
