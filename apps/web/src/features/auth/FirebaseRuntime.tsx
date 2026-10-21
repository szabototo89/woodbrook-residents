import { useEffect, useState, type ReactNode } from 'react';
import type { FirebaseConfig } from './authConfig';
import { AuthSessionContext, type AuthSession } from './AuthSession';
import { createFirebaseClient } from './firebaseClient';

export default function FirebaseRuntime(props: {
  config: FirebaseConfig;
  children: ReactNode;
}) {
  const { apiKey, authDomain, projectId, appId } = props.config;
  const [session, setSession] = useState<AuthSession>({
    status: 'loading',
    user: null,
    actions: null,
    providers: {
      google: import.meta.env['VITE_FIREBASE_GOOGLE_ENABLED'] === 'true',
      facebook: import.meta.env['VITE_FIREBASE_FACEBOOK_ENABLED'] === 'true',
    },
  });
  useEffect(() => {
    const failed = () =>
      setSession((current) => ({ ...current, status: 'error' }));
    try {
      const client = createFirebaseClient({
        apiKey,
        authDomain,
        projectId,
        appId,
      });
      return client.subscribe(
        (user) =>
          setSession((current) => ({
            ...current,
            status: 'ready',
            user,
            actions: client.actions,
          })),
        failed,
      );
    } catch {
      failed();
      return undefined;
    }
  }, [apiKey, authDomain, projectId, appId]);
  return (
    <AuthSessionContext value={session}>{props.children}</AuthSessionContext>
  );
}
