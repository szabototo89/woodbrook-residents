export const AUTH_FEATURE_FLAG = 'clerk-auth';

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

export function isPublishableKey(key: string): boolean {
  if (!/^pk_(test|live)_/.test(key)) return false;
  try {
    return /^([a-z0-9-]+\.)+[a-z]{2,}\$$/i.test(atob(key.slice(8)));
  } catch {
    return false;
  }
}
