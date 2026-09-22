import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';

vi.mock('@wix/site-window', () => ({
  window: {
    viewMode: vi.fn(),
  },
}));

import { window as wixWindow } from '@wix/site-window';
import { LiveTreatmentCatalog } from './LiveTreatmentCatalog';

const viewMode = vi.mocked(wixWindow.viewMode);

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

test('live treatment catalog detects preview mode without a viewMode prop', async () => {
  viewMode.mockResolvedValueOnce('Site');
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
  const view = renderUi(<LiveTreatmentCatalog listServices={listServices} />);
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(1);
  expect(view.container.textContent).toContain('Swedish massage');
  view.unmount();
});
