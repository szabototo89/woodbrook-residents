import { useSignIn } from '@clerk/react';
import { useState, type FormEvent } from 'react';
import { useAuthFeature } from './AuthProvider';
import { authHref } from './authConfig';

export function ForgotPasswordForm() {
  const { signIn, fetchStatus } = useSignIn();
  const { search } = useAuthFeature();
  const [step, setStep] = useState<'email' | 'code' | 'password' | 'continue'>(
    'email',
  );
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || fetchStatus === 'fetching') return;
    const data = new FormData(event.currentTarget);
    setError('');
    setBusy(true);
    try {
      if (step === 'email') {
        const created = await signIn.create({
          identifier: String(data.get('email') ?? ''),
        });
        if (created.error) throw created.error;
        const sent = await signIn.resetPasswordEmailCode.sendCode();
        if (sent.error) throw sent.error;
        setStep('code');
      } else if (step === 'code') {
        const verified = await signIn.resetPasswordEmailCode.verifyCode({
          code: String(data.get('code') ?? ''),
        });
        if (verified.error) throw verified.error;
        setStep('password');
      } else if (step === 'password') {
        const password = String(data.get('password') ?? '');
        if (password !== data.get('confirmPassword'))
          throw new Error('Passwords do not match. Please try again.');
        const updated = await signIn.resetPasswordEmailCode.submitPassword({
          password,
          signOutOfOtherSessions: true,
        });
        if (updated.error) throw updated.error;
        if (signIn.status === 'complete') {
          const result = await signIn.finalize({
            navigate: ({ session }) => {
              window.location.assign(
                authHref(session?.currentTask ? '/login' : '/', search),
              );
            },
          });
          if (result.error) throw result.error;
        } else setStep('continue');
      }
    } catch (failure) {
      setError(
        failure &&
          typeof failure === 'object' &&
          'message' in failure &&
          typeof failure.message === 'string'
          ? failure.message
          : 'We could not complete that request. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (step === 'continue')
    return (
      <div role="status">
        <h2>Password updated</h2>
        <p>Continue to log in to complete your account’s security checks.</p>
        <a className="button" href={authHref('/login', search)}>
          Continue to log in
        </a>
      </div>
    );

  return (
    <form className="auth-form" onSubmit={submit}>
      <h2>
        {step === 'email'
          ? 'Forgot your password?'
          : step === 'code'
            ? 'Check your email'
            : 'Choose a new password'}
      </h2>
      <p>
        {step === 'email'
          ? 'Enter your email address to request a password reset code.'
          : step === 'code'
            ? 'Enter the reset code sent to your email address.'
            : 'Choose a strong password. Your other sessions will be signed out.'}
      </p>
      {step === 'email' && (
        <label>
          Email address
          <input name="email" type="email" autoComplete="email" required />
        </label>
      )}
      {step === 'code' && (
        <label>
          Reset code
          <input
            name="code"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
          />
        </label>
      )}
      {step === 'password' && (
        <>
          <label>
            New password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
          <label>
            Confirm new password
            <input
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
            />
          </label>
        </>
      )}
      {error && (
        <p className="auth-error" role="alert">
          {error}
        </p>
      )}
      <button
        className="button"
        type="submit"
        disabled={busy || fetchStatus === 'fetching'}
      >
        {busy
          ? 'Please wait…'
          : step === 'email'
            ? 'Send reset code'
            : step === 'code'
              ? 'Verify code'
              : 'Reset password'}
      </button>
      {step === 'code' && (
        <button
          className="auth-text-button"
          type="button"
          disabled={busy}
          onClick={() => {
            setStep('email');
            setError('');
          }}
        >
          Use another email or resend code
        </button>
      )}
    </form>
  );
}
