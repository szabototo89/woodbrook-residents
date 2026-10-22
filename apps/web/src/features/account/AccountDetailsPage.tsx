import { ArrowLeft, ChevronRight, UserRound } from 'lucide-react';
import { useAuthFeature } from '../auth/AuthProvider';
import { authHref } from '../auth/authConfig';
import { AccountDetailsAccess } from './AccountDetailsAccess';

export function AccountDetailsPage() {
  const { ready, enabled, configured, search } = useAuthFeature();
  return (
    <main id="main-content" className="shell auth-page account-details-page">
      <a className="auth-back" href={authHref('/', search)}>
        <ArrowLeft size={16} aria-hidden="true" /> Back to the community hub
      </a>
      {!ready ? (
        <p role="status">Loading account details…</p>
      ) : !enabled ? (
        <section className="auth-card">
          <h1>Accounts are not enabled</h1>
          <p>You can keep browsing the public community hub.</p>
          <a className="button" href="/">
            Explore Woodbrook
          </a>
        </section>
      ) : (
        <div className="account-settings">
          <header className="account-settings-heading">
            <h1>Account details</h1>
            <p>A little about where you live. Always optional.</p>
          </header>
          <section
            className="account-location-card"
            aria-label="Account details"
          >
            {configured ? (
              <AccountDetailsAccess />
            ) : (
              <div className="account-location-unavailable" role="status">
                <h2>Account access is being set up</h2>
                <p>
                  Please check back soon. You can still explore the community
                  hub.
                </p>
              </div>
            )}
          </section>
          <a
            className="account-security-link"
            href={authHref('/login', search)}
          >
            <UserRound size={18} aria-hidden="true" />
            <span>Name, sign-in and security settings</span>
            <ChevronRight size={16} aria-hidden="true" />
          </a>
        </div>
      )}
    </main>
  );
}
