import { useEffect, useState } from 'react';

export const COOKIE_CONSENT_STORAGE_KEY = 'woodbrook-cookie-consent';
export const COOKIE_CONSENT_CHANGED_EVENT = 'woodbrook:cookie-consent-changed';

export type CookieConsentChoice = 'accepted' | 'declined';

function isConsentChoice(value: unknown): value is CookieConsentChoice {
  return value === 'accepted' || value === 'declined';
}

export function getCookieConsentChoice(): CookieConsentChoice | null {
  if (typeof window === 'undefined' || !('localStorage' in window)) {
    return null;
  }
  try {
    const stored = window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY);
    return isConsentChoice(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function setCookieConsentChoice(choice: CookieConsentChoice) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, choice);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
}

export function clearCookieConsentChoice() {
  try {
    window.localStorage.removeItem(COOKIE_CONSENT_STORAGE_KEY);
  } catch {
    return;
  }
  window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
}

export function useCookieConsentChoice(): CookieConsentChoice | null {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);

  useEffect(() => {
    setChoice(getCookieConsentChoice());
    const refreshChoice = () => setChoice(getCookieConsentChoice());
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, refreshChoice);
    window.addEventListener('storage', refreshChoice);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, refreshChoice);
      window.removeEventListener('storage', refreshChoice);
    };
  }, []);

  return choice;
}

export function CookieConsentBanner() {
  const choice = useCookieConsentChoice();

  if (choice !== null) {
    return null;
  }

  return (
    <div className="cookie-consent" role="region" aria-label="Cookie consent">
      <p>
        We use optional analytics cookies to understand how residents use this
        site. Nothing is recorded until you accept.
      </p>
      <div className="cookie-consent-actions">
        <button
          type="button"
          onClick={() => setCookieConsentChoice('accepted')}
        >
          Accept analytics cookies
        </button>
        <button
          type="button"
          onClick={() => setCookieConsentChoice('declined')}
        >
          Reject
        </button>
      </div>
    </div>
  );
}
