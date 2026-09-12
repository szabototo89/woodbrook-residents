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

export function ClarityAnalytics() {
  const projectId = getClarityProjectId();
  const consentChoice = useCookieConsentChoice();

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }
    if (!projectId || consentChoice !== 'accepted') {
      return;
    }
    if (document.getElementById(CLARITY_SCRIPT_ID)) {
      return;
    }
    const script = document.createElement('script');
    script.id = CLARITY_SCRIPT_ID;
    script.async = true;
    script.textContent = createClaritySnippet(projectId);
    document.head.appendChild(script);
  }, [projectId, consentChoice]);

  return null;
}
