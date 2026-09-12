import { useEffect } from 'react';

import { useCookieConsentChoice } from './CookieConsent';

export const CLARITY_TAG_URL = 'https://www.clarity.ms/tag/';

export const CLARITY_SCRIPT_ID = 'woodbrook-clarity-tag';

export function resolveClarityProjectId(
  env: Record<string, unknown>,
): string | undefined {
  const raw = env['VITE_CLARITY_PROJECT_ID'];
  if (typeof raw !== 'string') {
    return undefined;
  }
  const projectId = raw.trim();
  return projectId ? projectId : undefined;
}

export function getClarityProjectId(): string | undefined {
  return resolveClarityProjectId(import.meta.env);
}

export function createClaritySnippet(projectId: string) {
  return `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="${CLARITY_TAG_URL}"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${projectId}");`;
}

declare global {
  interface Window {
    clarity?: (...args: Array<unknown>) => void;
  }
}

export function signalClarityConsent(granted: boolean) {
  if (typeof window === 'undefined') {
    return;
  }
  const clarity = window.clarity;
  if (typeof clarity !== 'function') {
    return;
  }
  try {
    clarity(
      'consentv2',
      granted
        ? { ad_Storage: 'granted', analytics_Storage: 'granted' }
        : { ad_Storage: 'denied', analytics_Storage: 'denied' },
    );
  } catch {
    return;
  }
}

export function ClarityAnalytics() {
  const projectId = getClarityProjectId();
  const consentChoice = useCookieConsentChoice();

  useEffect(() => {
    if (!projectId || consentChoice === null) {
      return;
    }
    if (consentChoice === 'declined') {
      signalClarityConsent(false);
      document.getElementById(CLARITY_SCRIPT_ID)?.remove();
      return;
    }
    if (!document.getElementById(CLARITY_SCRIPT_ID)) {
      const script = document.createElement('script');
      script.id = CLARITY_SCRIPT_ID;
      script.async = true;
      script.textContent = createClaritySnippet(projectId);
      document.head.appendChild(script);
    }
    signalClarityConsent(true);
  }, [projectId, consentChoice]);

  return null;
}
