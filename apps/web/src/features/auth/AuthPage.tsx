import { ArrowLeft, KeyRound, ShieldCheck } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { useAuthFeature } from './AuthProvider';
import { authHref } from './authConfig';
const FirebaseForms = lazy(() => import('./FirebaseForms'));

export type AuthPageName = 'login' | 'register' | 'forgot-password';
const copy = {
  login: {
    title: 'Welcome back',
    description: 'Log in to manage your Woodbrook account.',
  },
  register: {
    title: 'Create your account',
    description: 'Make yourself at home in Woodbrook.',
  },
  'forgot-password': {
    title: 'Reset your password',
    description: 'A fresh start for your Woodbrook account.',
  },
};

export function AuthPage(props: { page: AuthPageName }) {
  const { enabled, configured, ready, search } = useAuthFeature();
  return (
    <main id="main-content" className="shell auth-page">
      <a className="auth-back" href={authHref('/', search)}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to the community hub
      </a>
      {!ready ? (
        <p role="status">Loading account access…</p>
      ) : !enabled ? (
        <section className="auth-card">
          <h1>Accounts are not enabled</h1>
          <p>
            You can still explore local information, events, and community
            updates.
          </p>
          <a className="button" href="/">
            Explore Woodbrook
          </a>
        </section>
      ) : (
        <div className="auth-layout">
          <section className="auth-intro">
            <span className="auth-eyebrow">WOODBROOK RESIDENTS</span>
            <h1>{copy[props.page].title}</h1>
            <p>{copy[props.page].description}</p>
            <div className="auth-note">
              <ShieldCheck size={22} aria-hidden="true" />
              <p>
                Your account stays yours. Manage your details and account
                security in one place.
              </p>
            </div>
            <p className="auth-public-note">
              Just looking around? Community information is always open to
              everyone.
            </p>
          </section>
          <section className="auth-card" aria-label="Account access">
            <div className="auth-card-icon">
              <KeyRound size={23} aria-hidden="true" />
            </div>
            {configured ? (
              <Suspense
                fallback={<p role="status">Loading secure account access…</p>}
              >
                <FirebaseForms page={props.page} />
              </Suspense>
            ) : (
              <div role="status">
                <h2>Account access is being set up</h2>
                <p>
                  Please check back soon. You can keep browsing the community
                  hub in the meantime.
                </p>
              </div>
            )}
            <nav className="auth-switch" aria-label="Account options">
              {props.page !== 'login' && (
                <a href={authHref('/login', search)}>Log in</a>
              )}
              {props.page !== 'register' && (
                <a href={authHref('/register', search)}>Create an account</a>
              )}
              {props.page === 'login' && (
                <a href={authHref('/forgot-password', search)}>
                  Forgot password?
                </a>
              )}
            </nav>
          </section>
        </div>
      )}
    </main>
  );
}
