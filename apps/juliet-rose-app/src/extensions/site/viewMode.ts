import { window as wixWindow } from '@wix/site-window';
import { useEffect, useState } from 'react';

export type SiteViewMode = 'Editor' | 'Preview' | 'Site';

export async function resolveViewMode(): Promise<SiteViewMode> {
  try {
    const mode = await wixWindow.viewMode();
    return mode === 'Preview' || mode === 'Site' ? mode : 'Editor';
  } catch {
    return 'Editor';
  }
}

export function useViewMode(
  prop: SiteViewMode | undefined,
): SiteViewMode | undefined {
  const [mode, setMode] = useState<SiteViewMode | undefined>(prop);
  useEffect(() => {
    if (prop !== undefined) {
      setMode(prop);
      return;
    }
    const alive = { current: true };
    async function resolve() {
      const resolved = await resolveViewMode();
      if (alive.current) {
        setMode(resolved);
      }
    }
    void resolve();
    return () => {
      alive.current = false;
    };
  }, [prop]);
  return mode;
}
