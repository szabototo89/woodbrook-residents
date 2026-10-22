import { createContext, useContext } from 'react';
import type { AccountDetailsActions } from '../account/accountDetails';

export type AccountUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
};
export type SocialProvider = 'google' | 'facebook';
export type AuthActions = AccountDetailsActions & {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  socialLogin: (provider: SocialProvider) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateName: (name: string) => Promise<void>;
  sendVerification: () => Promise<void>;
  signOut: () => Promise<void>;
};
export type AuthSession = {
  status: 'loading' | 'ready' | 'error';
  user: AccountUser | null;
  providers: Record<SocialProvider, boolean>;
  actions: AuthActions | null;
};
export const AuthSessionContext = createContext<AuthSession>({
  status: 'loading',
  user: null,
  providers: { google: false, facebook: false },
  actions: null,
});
export const useAuthSession = () => useContext(AuthSessionContext);
