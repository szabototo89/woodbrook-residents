import { useEffect, useState } from 'react';

import { useViewMode, type SiteViewMode } from '../viewMode';
import { queryContactDetails } from './contactDetailsServices';
import type { ContactDetails } from './contactDetails';

export function useContactDetails(
  viewMode: SiteViewMode | undefined,
  fetchContent?: () => Promise<ContactDetails>,
): ContactDetails | undefined {
  const resolved = useViewMode(viewMode);
  const isLive = resolved === 'Preview' || resolved === 'Site';
  const [content, setContent] = useState<ContactDetails | undefined>(() =>
    viewMode === 'Preview' || viewMode === 'Site' ? undefined : {},
  );

  useEffect(() => {
    if (!isLive) {
      return;
    }
    const fetch = fetchContent ?? queryContactDetails;
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
