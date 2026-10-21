import { useAuthFeature } from './AuthProvider';
import { useAuthSession } from './AuthSession';
import { authHref } from './authConfig';

export default function FirebaseAccount() {
  const { status, user } = useAuthSession();
  const { search } = useAuthFeature();
  return status === 'loading' ? (
    <span role="status">Loading account…</span>
  ) : (
    <a className="account-login" href={authHref('/login', search)}>
      {user ? 'Account' : 'Log in'}
    </a>
  );
}
