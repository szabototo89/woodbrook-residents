import { useEffect, useState } from 'react';

import { useViewMode, type SiteViewMode } from '../viewMode';
import { queryBookingPolicy } from './bookingPolicyServices';
import type { BookingPolicyContent } from './bookingPolicy';

export function useBookingPolicy(
  viewMode: SiteViewMode | undefined,
  fetchContent?: () => Promise<BookingPolicyContent>,
): BookingPolicyContent | undefined {
  const resolved = useViewMode(viewMode);
  const isLive = resolved === 'Preview' || resolved === 'Site';
  const [content, setContent] = useState<BookingPolicyContent | undefined>(
    () => (viewMode === 'Preview' || viewMode === 'Site' ? undefined : {}),
  );

  useEffect(() => {
    if (!isLive) {
      return;
    }
    const fetch = fetchContent ?? queryBookingPolicy;
    async function loadContent() {
      try {
        setContent(await fetch());
      } catch {
        setContent({});
      }
    }
    void loadContent();
  }, [isLive, fetchContent]);

  return content;
}
