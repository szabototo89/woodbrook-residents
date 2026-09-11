export const CLOUDFLARE_BEACON_SRC =
  'https://static.cloudflareinsights.com/beacon.min.js';

export function resolveCloudflareWebAnalyticsToken(
  env: Record<string, unknown>,
): string | undefined {
  const raw = env['VITE_CF_WEB_ANALYTICS_TOKEN'];
  if (typeof raw !== 'string') {
    return undefined;
  }
  const token = raw.trim();
  return token ? token : undefined;
}

export function getCloudflareWebAnalyticsToken(): string | undefined {
  return resolveCloudflareWebAnalyticsToken(import.meta.env);
}

export function createCloudflareBeaconPayload(token: string) {
  return JSON.stringify({ token });
}

export function CloudflareWebAnalytics() {
  const token = getCloudflareWebAnalyticsToken();

  if (!token) {
    return null;
  }

  return (
    <script
      defer
      src={CLOUDFLARE_BEACON_SRC}
      data-cf-beacon={createCloudflareBeaconPayload(token)}
    />
  );
}
