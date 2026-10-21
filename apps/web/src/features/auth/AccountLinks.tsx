import { lazy, Suspense } from 'react';
import { useAuthFeature } from './AuthProvider';
import { authHref } from './authConfig';
const FirebaseAccount = lazy(() => import('./FirebaseAccount'));

export function AccountLinks() {
  const { enabled, configured, search } = useAuthFeature();
  if (!enabled) return null;
  const links = (
    <a className="account-login" href={authHref('/login', search)}>
      Log in
    </a>
  );
  return (
    <div className="account-links">
      {configured ? (
        <Suspense fallback={links}>
          <FirebaseAccount />
        </Suspense>
      ) : (
        links
      )}
    </div>
  );
}
