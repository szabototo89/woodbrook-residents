import { Check, LockKeyhole, MapPin } from 'lucide-react';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import {
  emptyAccountDetails,
  normalizeAccountDetails,
  type AccountDetails,
  type AccountDetailsActions,
} from './accountDetails';

export function AccountDetailsForm(props: { actions: AccountDetailsActions }) {
  const [details, setDetails] = useState<AccountDetails>(emptyAccountDetails);
  const [baseline, setBaseline] = useState<AccountDetails>(emptyAccountDetails);
  const [invalidEircode, setInvalidEircode] = useState(false);
  const eircodeInput = useRef<HTMLInputElement>(null);
  const dirty =
    details.eircode !== baseline.eircode ||
    details.address !== baseline.address;
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [attempt, setAttempt] = useState(0);
  const pending = useRef(false);
  const { actions } = props;

  useEffect(() => {
    const active = { current: true };
    setLoading(true);
    setError('');
    void actions
      .loadDetails()
      .then((value) => {
        if (!active.current) return;
        setDetails(value ?? emptyAccountDetails());
        setBaseline(value ?? emptyAccountDetails());
        setSaved(Boolean(value?.eircode || value?.address));
        setLoaded(true);
      })
      .catch(() => {
        if (active.current)
          setError('Your details could not be loaded. Please try again.');
      })
      .finally(() => {
        if (active.current) setLoading(false);
      });
    return () => {
      active.current = false;
    };
  }, [actions, attempt]);

  const change = useCallback((field: keyof AccountDetails, value: string) => {
    setDetails((current) => ({ ...current, [field]: value }));
    setMessage('');
    setError('');
    setInvalidEircode(false);
  }, []);

  function validateDetails(remove: boolean): AccountDetails | null {
    try {
      return remove ? emptyAccountDetails() : normalizeAccountDetails(details);
    } catch (failure) {
      setError(
        failure instanceof Error
          ? failure.message
          : 'Check your location details and try again.',
      );
      setMessage('');
      setInvalidEircode(true);
      eircodeInput.current?.focus();
      return null;
    }
  }

  async function persist(remove: boolean) {
    if (!loaded || loading || pending.current) return;
    const normalized = validateDetails(remove);
    if (!normalized) return;
    pending.current = true;
    setBusy(true);
    setInvalidEircode(false);
    setError('');
    setMessage('');
    try {
      if (remove) await actions.removeDetails();
      else await actions.saveDetails(normalized);
      setDetails(normalized);
      setBaseline(normalized);
      setSaved(Boolean(normalized.eircode || normalized.address));
      setMessage(
        remove || (!normalized.eircode && !normalized.address)
          ? 'Your saved location details have been removed.'
          : 'Your location details have been saved.',
      );
    } catch {
      setError(
        remove
          ? 'Your details could not be removed. Please try again.'
          : 'Your details could not be saved. Please try again.',
      );
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void persist(false);
  }

  return (
    <div data-clarity-mask="true" className="account-details-private">
      <header className="account-location-heading">
        <div className="account-location-title">
          <span className="account-location-icon">
            <MapPin size={22} aria-hidden="true" />
          </span>
          <h2>Your location</h2>
          <span className="account-private-badge">
            <LockKeyhole size={12} aria-hidden="true" /> Private
          </span>
        </div>
        <p>Add an Eircode, an address, or both. All fields are optional.</p>
      </header>
      {loading && (
        <p className="account-feedback" role="status">
          Loading your details…
        </p>
      )}
      {error && (
        <p
          id="location-error"
          className="account-feedback account-feedback-error"
          role="alert"
        >
          {error}
        </p>
      )}
      {!loaded && !loading && (
        <button
          className="button button-secondary"
          onClick={() => setAttempt((value) => value + 1)}
        >
          Try again
        </button>
      )}
      <form className="auth-form" onSubmit={submit}>
        <fieldset disabled={!loaded || loading || busy}>
          <div className="account-details-field">
            <label htmlFor="account-eircode">Eircode (optional)</label>
            <input
              ref={eircodeInput}
              id="account-eircode"
              name="eircode"
              autoComplete="postal-code"
              maxLength={8}
              value={details.eircode}
              onChange={(event) => change('eircode', event.target.value)}
              aria-invalid={invalidEircode || undefined}
              aria-describedby={
                invalidEircode ? 'eircode-help location-error' : 'eircode-help'
              }
              autoCapitalize="characters"
              spellCheck={false}
            />
          </div>
          <p id="eircode-help" className="account-details-hint">
            For example, A65 F4E2. We check the format, not the address.
          </p>
          <div className="account-details-field">
            <label htmlFor="account-address">Address (optional)</label>
            <textarea
              id="account-address"
              name="address"
              autoComplete="street-address"
              rows={4}
              maxLength={500}
              value={details.address}
              onChange={(event) => change('address', event.target.value)}
            />
          </div>
          <div className="account-save-area">
            <div className="account-save-actions">
              <button className="button" type="submit">
                {busy ? 'Saving…' : 'Save details'}
              </button>
              {dirty && (
                <button
                  className="account-discard"
                  type="button"
                  onClick={() => {
                    setDetails(baseline);
                    setError('');
                    setInvalidEircode(false);
                    setMessage('');
                  }}
                >
                  Discard changes
                </button>
              )}
            </div>
            {message ? (
              <p className="account-save-status" role="status">
                <Check size={16} aria-hidden="true" />
                {message}
              </p>
            ) : (
              <p className="account-save-status">
                {dirty ? 'Unsaved changes' : 'Save when you’re ready.'}
              </p>
            )}
          </div>
          {saved && (
            <div className="account-remove-area">
              <div>
                <strong>Prefer not to keep your location?</strong>
                <p>This removes both fields from your account.</p>
              </div>
              <button
                className="account-remove"
                type="button"
                onClick={() => void persist(true)}
              >
                Remove saved location
              </button>
            </div>
          )}
        </fieldset>
      </form>
    </div>
  );
}
