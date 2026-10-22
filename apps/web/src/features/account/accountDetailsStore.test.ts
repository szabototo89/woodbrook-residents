import { beforeEach, expect, test, vi } from 'vitest';
import { initializeApp } from 'firebase/app';
const sdk = vi.hoisted(() => ({
  getFirestore: vi.fn(),
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
  deleteDoc: vi.fn(),
  serverTimestamp: vi.fn(),
}));
vi.mock('firebase/firestore/lite', () => sdk);
import { createAccountDetailsStore } from './accountDetailsStore';
const app = initializeApp(
  { projectId: 'sample' },
  'account-details-store-test',
);
beforeEach(() => {
  vi.resetAllMocks();
  sdk.getFirestore.mockReturnValue('database');
  sdk.doc.mockReturnValue('own-document');
  sdk.serverTimestamp.mockReturnValue('server-time');
});

test('loads only the current user document and handles absent or malformed records', async () => {
  const store = createAccountDetailsStore(app, 'resident-one');
  expect(sdk.doc).toHaveBeenCalledWith(
    'database',
    'residentProfiles',
    'resident-one',
  );
  sdk.getDoc.mockResolvedValueOnce({ exists: () => false });
  expect(await store.loadDetails()).toBeNull();
  sdk.getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => ({ eircode: 'A65 F4E2', address: 'Sample address' }),
  });
  expect(await store.loadDetails()).toEqual({
    eircode: 'A65 F4E2',
    address: 'Sample address',
  });
  sdk.getDoc.mockResolvedValueOnce({
    exists: () => true,
    data: () => ({ eircode: 12 }),
  });
  await expect(store.loadDetails()).rejects.toThrow('unavailable');
});

test('normalizes writes, includes a server timestamp, and removes blank details', async () => {
  const store = createAccountDetailsStore(app, 'resident-one');
  await store.saveDetails({ eircode: 'd6wab12', address: ' Sample address ' });
  expect(sdk.setDoc).toHaveBeenCalledWith('own-document', {
    eircode: 'D6W AB12',
    address: 'Sample address',
    updatedAt: 'server-time',
  });
  await store.saveDetails({ eircode: '', address: '  ' });
  expect(sdk.deleteDoc).toHaveBeenCalledOnce();
  await store.removeDetails();
  expect(sdk.deleteDoc).toHaveBeenCalledTimes(2);
  await expect(
    store.saveDetails({ eircode: 'bad', address: '' }),
  ).rejects.toThrow('format');
  expect(sdk.setDoc).toHaveBeenCalledOnce();
});
