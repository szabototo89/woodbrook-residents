import { useUser, UserButton } from '@clerk/react';
import { useAuthFeature } from './AuthProvider';
import { authHref } from './authConfig';

export default function ClerkAccount() {
  const { isLoaded, isSignedIn } = useUser();
  const { search } = useAuthFeature();
  if (!isLoaded) return <span role="status">Loading account…</span>;
  return isSignedIn ? (
    <UserButton />
  ) : (
    <a className="account-login" href={authHref('/login', search)}>
      Log in
    </a>
  );
}
