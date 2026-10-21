import publicProject from './firebaseProject.json';

export const AUTH_FEATURE_FLAG = 'firebase-auth';

export function isAuthEnabled(
  search: string,
  environmentFlag: unknown,
): boolean {
  return (
    environmentFlag === 'true' ||
    new URLSearchParams(search)
      .getAll('feature_flag')
      .flatMap((value) => value.split(','))
      .includes(AUTH_FEATURE_FLAG)
  );
}

export function authHref(path: string, search: string): string {
  const flags = new URLSearchParams(search).getAll('feature_flag');
  const query = new URLSearchParams(
    flags.map((value) => ['feature_flag', value]),
  );
  return query.size ? `${path}?${query}` : path;
}

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId: string;
  appId: string;
};

export function readFirebaseConfig(
  env: Record<string, unknown>,
  defaults?: FirebaseConfig,
): FirebaseConfig | null {
  const value = (name: string, key: keyof FirebaseConfig) => {
    const candidate = env[name] === undefined ? defaults?.[key] : env[name];
    return typeof candidate === 'string' ? candidate.trim() : '';
  };
  const config = {
    apiKey: value('VITE_FIREBASE_API_KEY', 'apiKey'),
    authDomain: value('VITE_FIREBASE_AUTH_DOMAIN', 'authDomain'),
    projectId: value('VITE_FIREBASE_PROJECT_ID', 'projectId'),
    appId: value('VITE_FIREBASE_APP_ID', 'appId'),
  };
  return Object.values(config).every(Boolean) &&
    /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(config.authDomain)
    ? config
    : null;
}

export function readSocialProviders(env: Record<string, unknown>) {
  const enabled = (name: string, fallback: boolean) =>
    env[name] === undefined ? fallback : env[name] === 'true';
  return {
    google: enabled(
      'VITE_FIREBASE_GOOGLE_ENABLED',
      publicProject.providers.google,
    ),
    facebook: enabled(
      'VITE_FIREBASE_FACEBOOK_ENABLED',
      publicProject.providers.facebook,
    ),
  };
}
