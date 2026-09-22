import { useEffect, useState } from 'react';

import { queryBookingServices } from './bookingsServices';
import type { BookingsServiceSummary } from './treatments';
import { useViewMode } from '../viewMode';

export type ServicesViewMode = 'Editor' | 'Preview' | 'Site';

export function useServices(
  viewMode: ServicesViewMode | undefined,
  listServices?: () => Promise<readonly BookingsServiceSummary[]>,
): readonly BookingsServiceSummary[] | undefined {
  const resolved = useViewMode(viewMode);
  const isLive = resolved === 'Preview' || resolved === 'Site';
  const [services, setServices] = useState<
    readonly BookingsServiceSummary[] | undefined
  >(() => (viewMode === 'Preview' || viewMode === 'Site' ? undefined : []));

  useEffect(() => {
    if (!isLive) {
      return;
    }
    const list = listServices ?? queryBookingServices;
    async function loadServices() {
      try {
        setServices(await list());
      } catch {
        setServices([]);
      }
    }
    void loadServices();
  }, [isLive, listServices]);

  return services;
}
