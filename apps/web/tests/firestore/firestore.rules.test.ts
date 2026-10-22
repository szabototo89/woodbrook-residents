import { afterAll, beforeAll, beforeEach, expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from '@firebase/rules-unit-testing';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
let environment: RulesTestEnvironment;
beforeAll(async () => {
  environment = await initializeTestEnvironment({
    projectId: 'demo-woodbrook-profiles',
    firestore: {
      host: '127.0.0.1',
      port: 8186,
      rules: await readFile(
        new URL('../../../../firebase/firestore.rules', import.meta.url),
        'utf8',
      ),
    },
  });
});
beforeEach(async () => environment.clearFirestore());
afterAll(async () => environment?.cleanup());
const data = () => ({
  eircode: 'A65 F4E2',
  address: 'Sample address only',
  updatedAt: serverTimestamp(),
});
const profile = (actor: string, owner = actor) =>
  doc(
    environment.authenticatedContext(actor).firestore(),
    'residentProfiles',
    owner,
  );

test('a resident can create, read, edit and delete only their own profile', async () => {
  const own = profile('resident-one');
  await assertSucceeds(setDoc(own, data()));
  expect((await assertSucceeds(getDoc(own))).data()?.address).toBe(
    'Sample address only',
  );
  await assertSucceeds(
    setDoc(own, { ...data(), address: 'Updated sample address' }),
  );
  await assertSucceeds(deleteDoc(own));
  expect((await assertSucceeds(getDoc(own))).exists()).toBe(false);
});

test('signed-out users and other accounts cannot get, change or remove a private profile', async () => {
  await environment.withSecurityRulesDisabled(async (context) =>
    setDoc(
      doc(context.firestore(), 'residentProfiles', 'resident-one'),
      data(),
    ),
  );
  for (const database of [
    environment.unauthenticatedContext().firestore(),
    environment.authenticatedContext('resident-two').firestore(),
  ]) {
    const other = doc(database, 'residentProfiles', 'resident-one');
    await assertFails(getDoc(other));
    await assertFails(setDoc(other, data()));
    await assertFails(deleteDoc(other));
  }
});

test('profile listing, extra fields, incorrect types, oversized text and forged timestamps are denied', async () => {
  const database = environment.authenticatedContext('resident-one').firestore();
  await assertFails(getDocs(collection(database, 'residentProfiles')));
  for (const invalid of [
    { ...data(), admin: true },
    { ...data(), address: 42 },
    { ...data(), address: 'x'.repeat(501) },
    { ...data(), eircode: 'not a code' },
    { ...data(), updatedAt: new Date(0) },
    { address: 'Sample only', updatedAt: serverTimestamp() },
  ])
    await assertFails(setDoc(profile('resident-one'), invalid));
  await assertFails(
    setDoc(doc(database, 'otherCollection', 'resident-one'), data()),
  );
});

test('either location field or both may be empty and the special D6W format is accepted', async () => {
  for (const details of [
    { eircode: '', address: '' },
    { eircode: 'D6W AB12', address: '' },
    { eircode: '', address: 'Sample address only' },
  ]) {
    await assertSucceeds(
      setDoc(profile('resident-one'), {
        ...details,
        updatedAt: serverTimestamp(),
      }),
    );
  }
});
