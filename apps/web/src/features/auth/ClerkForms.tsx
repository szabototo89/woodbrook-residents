import {
  ClerkFailed,
  ClerkLoaded,
  ClerkLoading,
  SignIn,
  SignUp,
  useUser,
} from '@clerk/react';
import { useAuthFeature } from './AuthProvider';
import { authHref } from './authConfig';
import type { AuthPageName } from './AuthPage';
import { ForgotPasswordForm } from './ForgotPasswordForm';

export default function ClerkForms(props: { page: AuthPageName }) {
  const { search } = useAuthFeature();
  const { isSignedIn } = useUser();
  if (isSignedIn)
    return (
      <div>
        <h2>You’re logged in</h2>
        <p>
          Use the account menu above to manage your profile and security
          settings.
        </p>
        <a className="button" href={authHref('/', search)}>
          Back to Woodbrook
        </a>
      </div>
    );
  return (
    <>
      <ClerkFailed>
        <p role="alert">
          Account access is temporarily unavailable. Please reload this page to
          try again.
        </p>
      </ClerkFailed>
      <ClerkLoading>
        <p role="status">Connecting to secure account access…</p>
      </ClerkLoading>
      <ClerkLoaded>
        {props.page === 'register' ? (
          <SignUp routing="hash" />
        ) : props.page === 'login' ? (
          <SignIn routing="hash" />
        ) : (
          <ForgotPasswordForm />
        )}
      </ClerkLoaded>
    </>
  );
}
