import { useRef, useState } from 'react';
import { authError } from './authError';

export function useAuthRequest() {
  const pending = useRef(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  async function run(action: () => Promise<void>, success = '') {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
    } catch (failure) {
      setError(authError(failure));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return { busy, error, message, run, setError };
}
