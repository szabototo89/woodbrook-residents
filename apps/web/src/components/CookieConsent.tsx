import { useEffect, useState } from 'react';

export const COOKIE_CONSENT_STORAGE_KEY = 'woodbrook-cookie-consent';
export const COOKIE_CONSENT_CHANGED_EVENT = 'woodbrook:cookie-consent-changed';
export const COOKIE_CONSENT_MAX_AGE_SECONDS = 180 * 24 * 60 * 60;

export type CookieConsentChoice = 'accepted' | 'declined';

function isConsentChoice(value: unknown): value is CookieConsentChoice {
  return value === 'accepted' || value === 'declined';
}

export function parseCookieConsentChoice(
  cookieHeader: string | null | undefined,
): CookieConsentChoice | null {
  if (!cookieHeader) {
    return null;
  }
  const match = cookieHeader
    .split(';')
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${COOKIE_CONSENT_STORAGE_KEY}=`));
  if (!match) {
    return null;
  }
  const value = match.slice(COOKIE_CONSENT_STORAGE_KEY.length + 1);
  return isConsentChoice(value) ? value : null;
}

export function serializeCookieConsentChoice(
  choice: CookieConsentChoice,
  options: { maxAgeSeconds: number; secure: boolean },
): string {
  const attributes = [
    `${COOKIE_CONSENT_STORAGE_KEY}=${choice}`,
    `Max-Age=${options.maxAgeSeconds}`,
    'Path=/',
    'SameSite=Lax',
  ];
  if (options.secure) {
    attributes.push('Secure');
  }
  return attributes.join('; ');
}

function isSecurePage(): boolean {
  return (
    typeof window !== 'undefined' &&
    'location' in window &&
    window.location.protocol === 'https:'
  );
}

function notifyConsentChanged() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(COOKIE_CONSENT_CHANGED_EVENT));
  }
}

export function getCookieConsentChoice(): CookieConsentChoice | null {
  if (typeof document === 'undefined') {
    return null;
  }
  try {
    return parseCookieConsentChoice(document.cookie);
  } catch {
    return null;
  }
}

export function setCookieConsentChoice(choice: CookieConsentChoice) {
  if (typeof document === 'undefined') {
    return;
  }
  try {
    document.cookie = serializeCookieConsentChoice(choice, {
      maxAgeSeconds: COOKIE_CONSENT_MAX_AGE_SECONDS,
      secure: isSecurePage(),
    });
  } catch {
    return;
  }
  notifyConsentChanged();
}

export function clearCookieConsentChoice() {
  if (typeof document === 'undefined') {
    return;
  }
  try {
    document.cookie = serializeCookieConsentChoice('declined', {
      maxAgeSeconds: 0,
      secure: isSecurePage(),
    });
  } catch {
    return;
  }
  notifyConsentChanged();
}

export function useCookieConsentChoice(): CookieConsentChoice | null {
  const [choice, setChoice] = useState<CookieConsentChoice | null>(null);

  useEffect(() => {
    setChoice(getCookieConsentChoice());
    const refreshChoice = () => setChoice(getCookieConsentChoice());
    window.addEventListener(COOKIE_CONSENT_CHANGED_EVENT, refreshChoice);
    window.addEventListener('focus', refreshChoice);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGED_EVENT, refreshChoice);
      window.removeEventListener('focus', refreshChoice);
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
