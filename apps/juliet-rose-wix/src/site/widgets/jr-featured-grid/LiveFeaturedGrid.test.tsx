import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';

vi.mock('@wix/site-window', () => ({
  window: {
    viewMode: vi.fn(),
  },
}));

import { window as wixWindow } from '@wix/site-window';
import { LiveFeaturedGrid } from './LiveFeaturedGrid';

const viewMode = vi.mocked(wixWindow.viewMode);

test('live featured grid renders preview treatments in the editor without fetching', async () => {
  const listServices = vi.fn(async () => []);
  const view = renderUi(
    <LiveFeaturedGrid viewMode="Editor" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('Juliet Rose Signature Facial');
  expect(view.container.textContent).toContain('Featured treatments');
  view.unmount();
});

test('live featured grid resolves featured treatments from live services', async () => {
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
    <LiveFeaturedGrid
      viewMode="Site"
      featuredSlugs="swedish-massage"
      listServices={listServices}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(1);
  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.textContent).toContain('1 hour');
  view.unmount();
});

test('live featured grid detects preview mode without a viewMode prop', async () => {
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
  const view = renderUi(
    <LiveFeaturedGrid
      featuredSlugs="swedish-massage"
      listServices={listServices}
    />,
  );
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
