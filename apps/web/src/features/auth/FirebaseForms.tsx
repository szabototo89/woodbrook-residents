import type { FormEvent } from 'react';
import type { AuthPageName } from './AuthPage';
import { AccountPanel } from './AccountPanel';
import { useAuthSession } from './AuthSession';
import { useAuthRequest } from './useAuthRequest';

type FirebaseFormsProps = { page: AuthPageName };

export default function FirebaseForms(props: FirebaseFormsProps) {
  const { status, user, actions, providers } = useAuthSession();
  const request = useAuthRequest();
  const { busy, error, message, run, setError } = request;
  const register = props.page === 'register';
  const recovery = props.page === 'forgot-password';
  if (status === 'loading')
    return <p role="status">Connecting to secure account access…</p>;
  if (status === 'error' || !actions)
    return (
      <p role="alert">
        Account access is temporarily unavailable. Please reload this page to
        try again.
      </p>
    );
  if (user)
    return <AccountPanel user={user} actions={actions} request={request} />;
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get('email') ?? '').trim();
    const password = String(data.get('password') ?? '');
    if (register && password !== data.get('confirmPassword')) {
      setError('Passwords do not match. Please try again.');
      return;
    }
    if (!actions) return;
    if (recovery)
      void run(
        () => actions.resetPassword(email),
        'If an account exists for that email, a password reset link is on its way. Follow the link to choose a new password.',
      );
    else if (register)
      void run(() =>
        actions.register(
          email,
          password,
          String(data.get('name') ?? '').trim(),
        ),
      );
    else void run(() => actions.login(email, password));
  }
  return (
    <>
      <form className="auth-form" onSubmit={submit}>
        <h2>
          {recovery
            ? 'Forgot your password?'
            : register
              ? 'Join Woodbrook'
              : 'Log in to Woodbrook'}
        </h2>
        {recovery && (
          <p>Enter your email address to request a password reset link.</p>
        )}
        {register && (
          <label>
            Display name
            <input name="name" autoComplete="name" maxLength={100} required />
          </label>
        )}
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required />
        </label>
        {!recovery && (
          <label>
            Password
            <input
              name="password"
              type="password"
              autoComplete={register ? 'new-password' : 'current-password'}
              minLength={register ? 8 : undefined}
              required
            />
          </label>
        )}
        {register && (
          <>
            <label>
              Confirm password
              <input
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                minLength={8}
                required
              />
            </label>
            <p>
              Use at least 8 characters. We’ll email you a verification link.
            </p>
          </>
        )}
        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}
        {message && <p role="status">{message}</p>}
        <button className="button" type="submit" disabled={busy}>
          {busy
            ? 'Please wait…'
            : recovery
              ? 'Send reset link'
              : register
                ? 'Create account'
                : 'Log in'}
        </button>
      </form>
      {!recovery && (
        <div className="auth-social">
          {providers.google && (
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={() => void run(() => actions.socialLogin('google'))}
            >
              Continue with Google
            </button>
          )}
          {providers.facebook && (
            <button
              className="button button-secondary"
              disabled={busy}
              onClick={() => void run(() => actions.socialLogin('facebook'))}
            >
              Continue with Facebook
            </button>
          )}
        </div>
      )}
    </>
  );
}
