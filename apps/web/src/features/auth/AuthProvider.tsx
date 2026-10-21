import { useRouterState } from '@tanstack/react-router';
import {
  createContext,
  lazy,
  Suspense,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { isAuthEnabled, readFirebaseConfig } from './authConfig';

const FirebaseRuntime = lazy(() => import('./FirebaseRuntime'));
const AuthFeatureContext = createContext({
  enabled: false,
  configured: false,
  ready: false,
  search: '',
});

export const useAuthFeature = () => useContext(AuthFeatureContext);

export function AuthProvider(props: { children: ReactNode }) {
  const search = useRouterState({
    select: (state) => state.location.searchStr,
  });
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const enabled =
    ready &&
    isAuthEnabled(search, import.meta.env['VITE_FIREBASE_AUTH_ENABLED']);
  const config = readFirebaseConfig(import.meta.env);
  const configured = config !== null;

  return (
    <AuthFeatureContext value={{ enabled, configured, ready, search }}>
      {enabled && config ? (
        <Suspense fallback={<p role="status">Loading account access…</p>}>
          <FirebaseRuntime config={config}>{props.children}</FirebaseRuntime>
        </Suspense>
      ) : (
        props.children
      )}
    </AuthFeatureContext>
  );
}
