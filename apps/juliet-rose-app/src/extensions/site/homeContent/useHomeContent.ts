import { useEffect, useState } from 'react';

import { useViewMode, type SiteViewMode } from '../viewMode';
import { queryHomeContent } from './homeContentServices';
import type { HomeContent } from './homeContent';

export function useHomeContent(
  viewMode: SiteViewMode | undefined,
  fetchContent?: () => Promise<HomeContent>,
): HomeContent | undefined {
  const resolved = useViewMode(viewMode);
  const isLive = resolved === 'Preview' || resolved === 'Site';
  const [content, setContent] = useState<HomeContent | undefined>(() =>
    viewMode === 'Preview' || viewMode === 'Site' ? undefined : {},
  );

  useEffect(() => {
    if (!isLive) {
      return;
    }
    const fetch = fetchContent ?? queryHomeContent;
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
