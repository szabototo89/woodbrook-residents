import { ClerkProvider } from '@clerk/react';
import type { ReactNode } from 'react';
import { authHref } from './authConfig';

export default function ClerkRuntime(props: {
  children: ReactNode;
  publishableKey: string;
  search: string;
}) {
  return (
    <ClerkProvider
      publishableKey={props.publishableKey}
      signInUrl={authHref('/login', props.search)}
      signUpUrl={authHref('/register', props.search)}
      signInFallbackRedirectUrl={authHref('/', props.search)}
      signUpFallbackRedirectUrl={authHref('/', props.search)}
      afterSignOutUrl={authHref('/', props.search)}
      appearance={{
        variables: {
          colorPrimary: '#254f40',
          colorForeground: '#102e2b',
          fontFamily: 'Inter Variable, sans-serif',
          borderRadius: '12px',
        },
      }}
    >
      {props.children}
    </ClerkProvider>
  );
}
