import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { LiveTreatmentCatalog } from './LiveTreatmentCatalog';

test('live treatment catalog renders preview treatments in the editor without fetching', async () => {
  const listServices = vi.fn(async () => []);
  const view = renderUi(
    <LiveTreatmentCatalog viewMode="Editor" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.querySelector('section[id="massage"]')).not.toBeNull();
  view.unmount();
});

test('live treatment catalog lists live services on the live site', async () => {
  const listServices = vi.fn(async () => [
    {
      id: 'service-id',
      name: 'Swedish massage',
      slug: 'swedish-massage',
      categoryName: 'Massage',
      durationMinutes: 60,
      priceCents: 8000,
    },
  ]);
  const view = renderUi(
    <LiveTreatmentCatalog viewMode="Site" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(1);
  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.textContent).toContain('€80');
  view.unmount();
});
