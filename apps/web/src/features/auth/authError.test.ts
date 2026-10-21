import { expect, test } from 'vitest';
import { authError } from './authError';

test.each([
  ['auth/invalid-credential', 'Check your email and password'],
  ['auth/wrong-password', 'Check your email and password'],
  ['auth/user-not-found', 'Check your email and password'],
  ['auth/email-already-in-use', 'Unable to create this account'],
  ['auth/weak-password', 'stronger password'],
  ['auth/password-does-not-meet-requirements', 'stronger password'],
  ['auth/invalid-email', 'valid email address'],
  ['auth/too-many-requests', 'Too many attempts'],
  ['auth/network-request-failed', 'connection'],
  ['auth/popup-closed-by-user', 'closed'],
  ['auth/cancelled-popup-request', 'closed'],
  ['auth/popup-blocked', 'Allow the sign-in popup'],
  ['auth/account-exists-with-different-credential', 'original sign-in method'],
  ['auth/unknown', 'could not complete'],
])('maps %s to helpful public copy without internal details', (code, copy) => {
  expect(authError({ code, message: 'sensitive internal details' })).toContain(
    copy,
  );
  expect(
    authError({ code, message: 'sensitive internal details' }),
  ).not.toContain('sensitive');
});
test('unknown failures have safe fallback copy', () => {
  for (const failure of [undefined, null, 'bad', {}, new Error('internal')])
    expect(authError(failure)).toContain('could not complete');
});
