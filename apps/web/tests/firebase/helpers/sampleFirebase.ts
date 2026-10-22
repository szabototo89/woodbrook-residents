import type { Page } from '@playwright/test';

// Simulated Firebase REST responses exercise the real browser SDK without
// sending mail, creating real users, or contacting a production auth service.
export async function sampleFirebase(page: Page) {
  const now = Math.floor(Date.now() / 1000);
  const idToken = [
    Buffer.from(JSON.stringify({ alg: 'none' })).toString('base64url'),
    Buffer.from(
      JSON.stringify({
        sub: 'sample-user',
        aud: 'sample',
        iat: now,
        exp: now + 3600,
        auth_time: now,
        firebase: { sign_in_provider: 'password' },
      }),
    ).toString('base64url'),
    'sample-signature',
  ].join('.');
  const account = {
    localId: 'sample-user',
    email: 'sample@example.com',
    displayName: 'Sample Resident',
    emailVerified: false,
    providerUserInfo: [
      {
        providerId: 'password',
        email: 'sample@example.com',
        rawId: 'sample@example.com',
      },
    ],
  };
  const requests: { path: string; body: Record<string, unknown> }[] = [];
  await page.route(
    'https://identitytoolkit.googleapis.com/**',
    async (route) => {
      const path = new URL(route.request().url()).pathname;
      const body: Record<string, unknown> | null = route
        .request()
        .postDataJSON();
      requests.push({ path, body: body ?? {} });
      if (path.endsWith('accounts:lookup'))
        return route.fulfill({ json: { users: [account] } });
      if (path.endsWith('accounts:sendOobCode'))
        return route.fulfill({ json: { email: account.email } });
      if (path.endsWith('accounts:update')) {
        Object.assign(account, body);
        return route.fulfill({ json: account });
      }
      if (
        path.endsWith('accounts:signInWithPassword') ||
        path.endsWith('accounts:signUp')
      )
        return route.fulfill({
          json: {
            ...account,
            idToken,
            refreshToken: 'sample-refresh-token',
            expiresIn: '3600',
          },
        });
      if (path.endsWith('/projects'))
        return route.fulfill({
          json: {
            projectId: 'sample',
            authorizedDomains: ['127.0.0.1', 'localhost'],
          },
        });
      return route.fulfill({
        status: 400,
        json: { error: { message: 'UNEXPECTED_TEST_REQUEST' } },
      });
    },
  );
  return requests;
}
