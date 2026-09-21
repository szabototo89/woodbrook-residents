import { useEffect, useState } from 'react';

import { queryBookingServices } from './bookingsServices';
import type { BookingsServiceSummary } from './treatments';

export type ServicesViewMode = 'Editor' | 'Preview' | 'Site';

export function useServices(
  viewMode: ServicesViewMode | undefined,
  listServices?: () => Promise<readonly BookingsServiceSummary[]>,
): readonly BookingsServiceSummary[] | undefined {
  const isLive = viewMode === 'Preview' || viewMode === 'Site';
  const [services, setServices] = useState<
    readonly BookingsServiceSummary[] | undefined
  >(() => (isLive ? undefined : []));

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
