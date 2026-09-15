export const OPEN_URL_EVENT = 'woodbrook:open-url';

export type OpenUrl = (url: string) => void;

/** Reads the requested URL from a host event without type assertions. */
export function requestedUrl(event: Event): string | undefined {
  const detail: unknown = 'detail' in event ? event.detail : undefined;
  if (typeof detail !== 'object' || detail === null) return undefined;
  const url: unknown = 'url' in detail ? detail.url : undefined;
  return typeof url === 'string' ? url : undefined;
}

/** Shows a short host (dlrcoco.ie) instead of a full mobile-unfriendly URL. */
export function domainOf(url: string): string {
  const withoutScheme = url.replace(/^[a-z][a-z0-9+.-]*:\/\//i, '');
  const host = withoutScheme.split('/')[0];
  if (!host) return url;
  return host.replace(/^www\./, '');
}

/**
 * Opens an external URL. Lynx bundles have no built-in browser opener, so
 * this uses a window opener when one exists (tests, previews) and otherwise
 * notifies the browser host through a document event the host listens for.
 * On iOS without a native opener it degrades to a no-op tap target that
 * still exposes an accessible button label.
 */
export function openExternalUrl(url: string): void {
  if (typeof globalThis.open === 'function') {
    globalThis.open(url, '_blank', 'noopener,noreferrer');
    return;
  }
  const targetDocument = globalThis.document;
  // Build the event in the document's own realm so host listeners
  // receive a genuine Event.
  const EventCtor =
    targetDocument?.defaultView?.CustomEvent ?? globalThis.CustomEvent;
  if (targetDocument && typeof EventCtor === 'function') {
    targetDocument.dispatchEvent(
      new EventCtor(OPEN_URL_EVENT, {
        detail: { url },
        bubbles: true,
      }),
    );
  }
}
