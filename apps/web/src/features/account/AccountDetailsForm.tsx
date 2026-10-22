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
        setSaved(value !== null);
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
      return null;
    }
  }

  async function persist(remove: boolean) {
    if (!loaded || loading || pending.current) return;
    const normalized = validateDetails(remove);
    if (!normalized) return;
    pending.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      if (remove) await actions.removeDetails();
      else await actions.saveDetails(normalized);
      setDetails(normalized);
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
      <h2>Your private location</h2>
      <p>
        Save an Eircode, an address, or both. These fields are optional and are
        not shown publicly.
      </p>
      {loading && <p role="status">Loading your details…</p>}
      {error && (
        <p className="auth-error" role="alert">
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
              id="account-eircode"
              name="eircode"
              autoComplete="postal-code"
              maxLength={8}
              value={details.eircode}
              onChange={(event) => change('eircode', event.target.value)}
              aria-describedby="eircode-help"
            />
          </div>
          <p id="eircode-help" className="account-details-hint">
            For example, A65 F4E2. This checks the format only; it does not
            verify your address.
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
          <button className="button" type="submit">
            {busy ? 'Saving…' : 'Save details'}
          </button>
          <button
            className="auth-text-button"
            type="button"
            disabled={!saved}
            onClick={() => void persist(true)}
          >
            Remove saved location
          </button>
        </fieldset>
      </form>
      {message && <p role="status">{message}</p>}
      <p className="account-details-hint">
        You can change or remove these details at any time. Leaving both fields
        blank and saving removes your saved location.
      </p>
    </div>
  );
}
