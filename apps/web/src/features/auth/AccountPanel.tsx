import type { FormEvent } from 'react';
import type { AccountUser, AuthActions } from './AuthSession';
import type { useAuthRequest } from './useAuthRequest';
import { useAuthFeature } from './AuthProvider';
import { authHref } from './authConfig';

type AccountPanelProps = {
  user: AccountUser;
  actions: AuthActions;
  request: ReturnType<typeof useAuthRequest>;
};

export function AccountPanel(props: AccountPanelProps) {
  const { search } = useAuthFeature();
  const { busy, error, message, run } = props.request;
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = String(
      new FormData(event.currentTarget).get('name') ?? '',
    ).trim();
    void run(
      () => props.actions.updateName(name),
      'Your name has been updated.',
    );
  }
  return (
    <div className="auth-account">
      <div>
        <h2>Your Woodbrook account</h2>
        <p>{props.user.email}</p>
        <p>
          {props.user.emailVerified
            ? 'Email verified'
            : 'Please verify your email. Check your inbox for the verification link.'}
        </p>
      </div>
      <a
        className="button button-secondary"
        href={authHref('/account', search)}
      >
        Account details
      </a>
      <form className="auth-form" onSubmit={save}>
        <label>
          Display name
          <input
            name="name"
            autoComplete="name"
            defaultValue={props.user.displayName ?? ''}
            maxLength={100}
            required
          />
        </label>
        <button className="button" disabled={busy}>
          Save name
        </button>
      </form>
      {!props.user.emailVerified && (
        <button
          className="button button-secondary"
          disabled={busy}
          onClick={() =>
            void run(
              props.actions.sendVerification,
              'Verification email sent. Check your inbox.',
            )
          }
        >
          Send verification email
        </button>
      )}
      {props.user.email && (
        <button
          className="button button-secondary"
          disabled={busy}
          onClick={() =>
            void run(
              () => props.actions.resetPassword(props.user.email!),
              'If an account exists for that email, a password reset link is on its way.',
            )
          }
        >
          Send password reset email
        </button>
      )}
      <button
        className="auth-text-button"
        disabled={busy}
        onClick={() => void run(props.actions.signOut)}
      >
        Sign out
      </button>
      {message && <p role="status">{message}</p>}
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
