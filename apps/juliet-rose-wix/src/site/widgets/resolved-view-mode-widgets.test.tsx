import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('../useWixViewMode', () => ({
  useWixViewMode: () => 'Site',
}));

import { BookingJourneyWidget } from './jr-booking-journey/BookingJourneyWidget';
import { FeaturedGridWidget } from './jr-featured-grid/FeaturedGridWidget';
import { TreatmentCatalogWidget } from './jr-treatment-catalog/TreatmentCatalogWidget';

test('data-backed widget adapters use the resolved Wix site mode', async () => {
  const listServices = vi.fn(async () => []);
  const views = [
    renderUi(<FeaturedGridWidget listServices={listServices} />),
    renderUi(<TreatmentCatalogWidget listServices={listServices} />),
    renderUi(<BookingJourneyWidget listServices={listServices} />),
  ];

  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(3);
  for (const view of views) view.unmount();
});
