import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { LiveFeaturedGrid } from './LiveFeaturedGrid';

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
