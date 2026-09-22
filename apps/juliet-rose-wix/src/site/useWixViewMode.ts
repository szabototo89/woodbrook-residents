import { window as wixWindow } from '@wix/site-window';
import { useEffect, useState } from 'react';

import type { ServicesViewMode } from './treatments/useServices';

function isViewMode(value: string): value is ServicesViewMode {
  return value === 'Editor' || value === 'Preview' || value === 'Site';
}

export function useWixViewMode(
  explicitMode?: ServicesViewMode,
): ServicesViewMode {
  const [resolvedMode, setResolvedMode] = useState<ServicesViewMode>(
    explicitMode ?? 'Editor',
  );

  useEffect(() => {
    if (explicitMode) {
      setResolvedMode(explicitMode);
      return;
    }

    const lifecycle = { isCurrent: true };
    async function resolveMode() {
      try {
        const mode = await wixWindow.viewMode();
        if (lifecycle.isCurrent && isViewMode(mode)) setResolvedMode(mode);
      } catch {
        if (lifecycle.isCurrent) setResolvedMode('Editor');
      }
    }
    void resolveMode();
    return () => {
      lifecycle.isCurrent = false;
    };
  }, [explicitMode]);

  return resolvedMode;
}
