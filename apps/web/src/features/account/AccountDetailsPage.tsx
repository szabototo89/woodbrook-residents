import {
  ArrowLeft,
  ArrowUpRight,
  MapPin,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
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
            <span className="auth-eyebrow">YOUR ACCOUNT</span>
            <h1>Account details</h1>
            <p>Manage the details you choose to share with Woodbrook.</p>
          </header>
          <div className="account-settings-layout">
            <aside className="account-settings-sidebar">
              <nav aria-label="Account settings">
                <a
                  className="account-settings-current"
                  href={authHref('/account', search)}
                  aria-current="page"
                >
                  <MapPin size={18} aria-hidden="true" /> Your location
                </a>
                <a href={authHref('/login', search)}>
                  <UserRound size={18} aria-hidden="true" />
                  <span>Name, sign-in and security settings</span>
                  <ArrowUpRight size={16} aria-hidden="true" />
                </a>
              </nav>
              <div className="account-privacy-note">
                <ShieldCheck size={21} aria-hidden="true" />
                <div>
                  <strong>Private by default</strong>
                  <p>
                    Your location is never shown publicly. You can change or
                    remove it at any time.
                  </p>
                </div>
              </div>
            </aside>
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
          </div>
        </div>
      )}
    </main>
  );
}
