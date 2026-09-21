import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrTreatmentCards } from './JrTreatmentCards';

test('jr-treatment-cards renders preview treatments in the editor without fetching', async () => {
  const listServices = vi.fn(async () => []);
  const view = renderUi(
    <JrTreatmentCards viewMode="Editor" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.textContent).toContain('Juliet Rose Signature Facial');
  expect(view.container.textContent).toContain('Not sure what to choose?');
  view.unmount();
});

test('jr-treatment-cards renders preview treatments when the mode is unknown', async () => {
  const listServices = vi.fn(async () => []);
  const view = renderUi(<JrTreatmentCards listServices={listServices} />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Swedish massage');
  view.unmount();
});

test('jr-treatment-cards lists live bookings services on the live site', async () => {
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
    <JrTreatmentCards viewMode="Site" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(1);
  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.textContent).toContain('€80');
  view.unmount();
});

test('jr-treatment-cards explains when live treatments cannot load', async () => {
  const listServices = vi.fn(async () => {
    throw new Error('offline');
  });
  const view = renderUi(
    <JrTreatmentCards viewMode="Preview" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(view.container.textContent).toContain(
    'Treatments are unavailable right now.',
  );
  view.unmount();
});
