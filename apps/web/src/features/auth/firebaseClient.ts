import { getApps, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import type { FirebaseConfig } from './authConfig';
import type { AccountUser, AuthActions } from './AuthSession';

const displayUser = (user: User | null): AccountUser | null =>
  user
    ? {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        emailVerified: user.emailVerified,
      }
    : null;

export function createFirebaseClient(config: FirebaseConfig) {
  const app =
    getApps().find((item) => item.name === 'woodbrook-auth') ??
    initializeApp(config, 'woodbrook-auth');
  const auth = getAuth(app);
  const currentUser = () => {
    if (!auth.currentUser) throw new Error('Please log in again.');
    return auth.currentUser;
  };
  const observer: { current?: (user: AccountUser | null) => void } = {};
  const detailsStore = async () => {
    const uid = currentUser().uid;
    const { createAccountDetailsStore } =
      await import('../account/accountDetailsStore');
    return createAccountDetailsStore(app, uid);
  };
  const actions: AuthActions = {
    async loadDetails() {
      return (await detailsStore()).loadDetails();
    },
    async saveDetails(details) {
      await (await detailsStore()).saveDetails(details);
    },
    async removeDetails() {
      await (await detailsStore()).removeDetails();
    },
    async login(email, password) {
      await signInWithEmailAndPassword(auth, email, password);
    },
    async register(email, password, name) {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(user, { displayName: name });
      observer.current?.(displayUser(auth.currentUser));
      await sendEmailVerification(user);
    },
    async socialLogin(provider) {
      await signInWithPopup(
        auth,
        provider === 'google'
          ? new GoogleAuthProvider()
          : new FacebookAuthProvider(),
      );
    },
    async resetPassword(email) {
      await sendPasswordResetEmail(auth, email);
    },
    async updateName(name) {
      const user = currentUser();
      await updateProfile(user, { displayName: name });
      observer.current?.(displayUser(auth.currentUser));
    },
    async sendVerification() {
      await sendEmailVerification(currentUser());
    },
    async signOut() {
      await signOut(auth);
    },
  };
  return {
    actions,
    subscribe(changed: (user: AccountUser | null) => void, failed: () => void) {
      observer.current = changed;
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => changed(displayUser(user)),
        failed,
      );
      return () => {
        observer.current = undefined;
        unsubscribe();
      };
    },
  };
}
