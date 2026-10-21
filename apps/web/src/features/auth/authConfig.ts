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
): FirebaseConfig | null {
  const value = (name: string) =>
    typeof env[name] === 'string' ? env[name].trim() : '';
  const config = {
    apiKey: value('VITE_FIREBASE_API_KEY'),
    authDomain: value('VITE_FIREBASE_AUTH_DOMAIN'),
    projectId: value('VITE_FIREBASE_PROJECT_ID'),
    appId: value('VITE_FIREBASE_APP_ID'),
  };
  return Object.values(config).every(Boolean) &&
    /^([a-z0-9-]+\.)+[a-z]{2,}$/i.test(config.authDomain)
    ? config
    : null;
}
