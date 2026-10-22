import { useAuthFeature } from '../auth/AuthProvider';
import { useAuthSession } from '../auth/AuthSession';
import { authHref } from '../auth/authConfig';
import { AccountDetailsForm } from './AccountDetailsForm';

export function AccountDetailsAccess() {
  const { status, user, actions } = useAuthSession();
  const { search } = useAuthFeature();
  if (status === 'loading')
    return <p role="status">Connecting to your account…</p>;
  if (status === 'error' || !actions)
    return (
      <p role="alert">
        Account access is temporarily unavailable. Please reload to try again.
      </p>
    );
  if (!user)
    return (
      <div>
        <h2>Log in to manage your details</h2>
        <p>
          Your location details belong to your account. Log in to view or change
          them.
        </p>
        <a className="button" href={authHref('/login', search)}>
          Log in
        </a>
      </div>
    );
  return <AccountDetailsForm key={user.uid} actions={actions} />;
}
