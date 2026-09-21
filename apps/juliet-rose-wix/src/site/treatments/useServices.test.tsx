import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';
import type { BookingsServiceSummary } from './treatments';
import { useServices } from './useServices';

function Probe(props: {
  viewMode?: 'Editor' | 'Preview' | 'Site';
  listServices?: () => Promise<readonly BookingsServiceSummary[]>;
}) {
  const services = useServices(props.viewMode, props.listServices);
  return (
    <p>
      {services === undefined
        ? 'loading'
        : `loaded ${services.length} services`}
    </p>
  );
}

function emptyServices() {
  return vi.fn(async (): Promise<readonly BookingsServiceSummary[]> => []);
}

test('useServices stays unloaded without fetching outside live modes', async () => {
  const listServices = emptyServices();
  const view = renderUi(
    <Probe viewMode="Editor" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).not.toHaveBeenCalled();
  expect(view.container.textContent).toContain('loaded 0 services');
  view.unmount();
});

test('useServices loads services on the live site', async () => {
  const listServices = emptyServices();
  const view = renderUi(<Probe viewMode="Site" listServices={listServices} />);
  await act(async () => {
    await Promise.resolve();
  });

  expect(listServices).toHaveBeenCalledTimes(1);
  expect(view.container.textContent).toContain('loaded 0 services');
  view.unmount();
});

test('useServices falls back to an empty list when loading fails', async () => {
  const listServices = vi.fn(
    async (): Promise<readonly BookingsServiceSummary[]> => {
      throw new Error('offline');
    },
  );
  const view = renderUi(
    <Probe viewMode="Preview" listServices={listServices} />,
  );
  await act(async () => {
    await Promise.resolve();
  });

  expect(view.container.textContent).toContain('loaded 0 services');
  view.unmount();
});
