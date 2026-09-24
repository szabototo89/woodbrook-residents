import { useEffect, useState } from 'react';

import {
  resolveContactPanelDefaults,
  type ContactDetails,
  type ContactPanelDefaults,
} from './contactDetails';
import { queryContactDetails } from './contactDetailsServices';

/**
 * Loads panel defaults from the single ContactDetails item. Starts with
 * CONTACT_DETAILS_DEFAULTS-derived values so editors never see empty
 * contact inputs, then replaces them with collection values when the fetch
 * resolves. Empty or failed fetches keep the hardcoded fallback.
 */
export function useContactPanelDefaults(
  fetchContact: () => Promise<ContactDetails> = queryContactDetails,
): ContactPanelDefaults {
  const [defaults, setDefaults] = useState<ContactPanelDefaults>(() =>
    resolveContactPanelDefaults(undefined),
  );

  useEffect(() => {
    const cancellation = { current: false };
    async function loadDefaults() {
      try {
        const contact = await fetchContact();
        if (!cancellation.current) {
          setDefaults(resolveContactPanelDefaults(contact));
        }
      } catch {
        if (!cancellation.current) {
          setDefaults(resolveContactPanelDefaults(undefined));
        }
      }
    }
    void loadDefaults();
    return () => {
      cancellation.current = true;
    };
  }, [fetchContact]);

  return defaults;
}
