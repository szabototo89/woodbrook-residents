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
import { isAuthEnabled, isPublishableKey } from './authConfig';

const ClerkRuntime = lazy(() => import('./ClerkRuntime'));
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
    ready && isAuthEnabled(search, import.meta.env['VITE_CLERK_AUTH_ENABLED']);
  const publishableKey =
    import.meta.env['VITE_CLERK_PUBLISHABLE_KEY']?.trim() ?? '';
  const configured = isPublishableKey(publishableKey);

  return (
    <AuthFeatureContext value={{ enabled, configured, ready, search }}>
      {enabled && configured ? (
        <Suspense fallback={<p role="status">Loading account access…</p>}>
          <ClerkRuntime publishableKey={publishableKey} search={search}>
            {props.children}
          </ClerkRuntime>
        </Suspense>
      ) : (
        props.children
      )}
    </AuthFeatureContext>
  );
}
