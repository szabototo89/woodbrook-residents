import { beforeEach, expect, test, vi } from 'vitest';
const sdk = vi.hoisted(() => ({
  auth: { currentUser: { email: 'resident@example.com' } },
  initializeApp: vi.fn(),
  getApps: vi.fn<() => { name: string }[]>(() => []),
  getAuth: vi.fn(),
  onAuthStateChanged: vi.fn(),
  signInWithEmailAndPassword: vi.fn(),
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
  sendEmailVerification: vi.fn(),
  sendPasswordResetEmail: vi.fn(),
  signOut: vi.fn(),
  signInWithPopup: vi.fn(),
}));
vi.mock('firebase/app', () => ({
  initializeApp: sdk.initializeApp,
  getApps: sdk.getApps,
}));
vi.mock('firebase/auth', () => ({
  ...sdk,
  GoogleAuthProvider: class {},
  FacebookAuthProvider: class {},
}));
import { createFirebaseClient } from './firebaseClient';
const config = {
  apiKey: 'key',
  authDomain: 'sample.firebaseapp.com',
  projectId: 'sample',
  appId: 'app',
};
beforeEach(() => {
  vi.clearAllMocks();
  sdk.getAuth.mockReturnValue(sdk.auth);
  sdk.initializeApp.mockReturnValue({ name: 'woodbrook-auth' });
});
test('registration creates the user, stores their name and sends verification', async () => {
  const user = { email: 'resident@example.com' };
  sdk.createUserWithEmailAndPassword.mockResolvedValue({ user });
  await createFirebaseClient(config).actions.register(
    'resident@example.com',
    'long-password',
    'Sample Resident',
  );
  expect(sdk.createUserWithEmailAndPassword).toHaveBeenCalledWith(
    sdk.auth,
    'resident@example.com',
    'long-password',
  );
  expect(sdk.updateProfile).toHaveBeenCalledWith(user, {
    displayName: 'Sample Resident',
  });
  expect(sdk.sendEmailVerification).toHaveBeenCalledWith(user);
});
test('login, recovery and sign-out use Firebase without a custom email domain', async () => {
  const client = createFirebaseClient(config);
  await client.actions.login('resident@example.com', 'password');
  expect(sdk.signInWithEmailAndPassword).toHaveBeenCalledWith(
    sdk.auth,
    'resident@example.com',
    'password',
  );
  await client.actions.resetPassword('resident@example.com');
  expect(sdk.sendPasswordResetEmail).toHaveBeenCalledWith(
    sdk.auth,
    'resident@example.com',
  );
  await client.actions.signOut();
  expect(sdk.signOut).toHaveBeenCalledWith(sdk.auth);
});
test('state subscriptions expose only account display data and can unsubscribe', () => {
  const unsubscribe = vi.fn();
  sdk.onAuthStateChanged.mockReturnValue(unsubscribe);
  const client = createFirebaseClient(config);
  const changed = vi.fn();
  const failed = vi.fn();
  const stop = client.subscribe(changed, failed);
  const callback = sdk.onAuthStateChanged.mock.calls[0]?.[1];
  callback({
    email: 'resident@example.com',
    displayName: 'Sample',
    emailVerified: true,
    refreshToken: 'secret',
  });
  expect(changed).toHaveBeenCalledWith({
    email: 'resident@example.com',
    displayName: 'Sample',
    emailVerified: true,
  });
  callback(null);
  expect(changed).toHaveBeenLastCalledWith(null);
  stop();
  expect(unsubscribe).toHaveBeenCalledOnce();
});
test('profile updates and verification require a signed-in user', async () => {
  const client = createFirebaseClient(config);
  await client.actions.updateName('Updated');
  expect(sdk.updateProfile).toHaveBeenCalledWith(sdk.auth.currentUser, {
    displayName: 'Updated',
  });
  await client.actions.sendVerification();
  expect(sdk.sendEmailVerification).toHaveBeenCalledWith(sdk.auth.currentUser);
  const user = sdk.auth.currentUser;
  Object.assign(sdk.auth, { currentUser: null });
  await expect(client.actions.updateName('Name')).rejects.toThrow(
    'log in again',
  );
  Object.assign(sdk.auth, { currentUser: user });
});
test('Google and Facebook login open Firebase OAuth popups', async () => {
  const client = createFirebaseClient(config);
  await client.actions.socialLogin('google');
  await client.actions.socialLogin('facebook');
  expect(sdk.signInWithPopup).toHaveBeenCalledTimes(2);
});
test('an existing named Firebase app is reused and profile changes refresh subscribers', async () => {
  const existing = { name: 'woodbrook-auth' };
  sdk.getApps.mockReturnValueOnce([existing]);
  const client = createFirebaseClient(config);
  expect(sdk.initializeApp).not.toHaveBeenCalled();
  const changed = vi.fn();
  const stop = client.subscribe(changed, vi.fn());
  await client.actions.updateName('Updated');
  expect(changed).toHaveBeenCalled();
  sdk.createUserWithEmailAndPassword.mockResolvedValue({
    user: sdk.auth.currentUser,
  });
  await client.actions.register('resident@example.com', 'password', 'Sample');
  expect(changed).toHaveBeenCalledTimes(2);
  stop();
});

test('a delayed profile update does not restore an account that signed out in another tab', async () => {
  const pending = Promise.withResolvers<void>();
  sdk.updateProfile.mockReturnValueOnce(pending.promise);
  const client = createFirebaseClient(config);
  const changed = vi.fn();
  const stop = client.subscribe(changed, vi.fn());
  const original = sdk.auth.currentUser;
  const saving = client.actions.updateName('Sample');
  Object.assign(sdk.auth, { currentUser: null });
  pending.resolve();
  await saving;
  expect(changed).toHaveBeenLastCalledWith(null);
  Object.assign(sdk.auth, { currentUser: original });
  stop();
});
