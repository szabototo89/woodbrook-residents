import { ArrowLeft, MapPin, ShieldCheck } from 'lucide-react';
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
        <div className="auth-layout">
          <section className="auth-intro">
            <span className="auth-eyebrow">YOUR WOODBROOK ACCOUNT</span>
            <h1>Account details</h1>
            <p>A little about where you live, on your terms.</p>
            <div className="auth-note">
              <ShieldCheck size={22} aria-hidden="true" />
              <p>
                Your location is private to your account. Adding it is optional,
                and you can remove it whenever you choose.
              </p>
            </div>
            <a
              className="account-settings-link"
              href={authHref('/login', search)}
            >
              Name, sign-in and security settings
            </a>
          </section>
          <section className="auth-card" aria-label="Account details">
            <div className="auth-card-icon">
              <MapPin size={23} aria-hidden="true" />
            </div>
            {configured ? (
              <AccountDetailsAccess />
            ) : (
              <div role="status">
                <h2>Account access is being set up</h2>
                <p>
                  Please check back soon. You can still explore the community
                  hub.
                </p>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
