import type { FirebaseApp } from 'firebase/app';
import {
  deleteDoc,
  doc,
  getDoc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore/lite';
import {
  normalizeAccountDetails,
  type AccountDetailsActions,
} from './accountDetails';

export function createAccountDetailsStore(
  app: FirebaseApp,
  uid: string,
): AccountDetailsActions {
  const reference = doc(getFirestore(app), 'residentProfiles', uid);
  return {
    async loadDetails() {
      const snapshot = await getDoc(reference);
      if (!snapshot.exists()) return null;
      const data = snapshot.data();
      if (
        typeof data['eircode'] !== 'string' ||
        typeof data['address'] !== 'string'
      ) {
        throw new Error('Account details are unavailable.');
      }
      return normalizeAccountDetails({
        eircode: data['eircode'],
        address: data['address'],
      });
    },
    async saveDetails(details) {
      const normalized = normalizeAccountDetails(details);
      if (!normalized.eircode && !normalized.address) {
        await deleteDoc(reference);
        return;
      }
      await setDoc(reference, { ...normalized, updatedAt: serverTimestamp() });
    },
    async removeDetails() {
      await deleteDoc(reference);
    },
  };
}
