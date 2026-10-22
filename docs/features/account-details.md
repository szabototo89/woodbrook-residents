# Private account details

Status: Available

## Job to be done

As a signed-in resident, I can optionally save where I live and change or remove it later without publishing my address.

## Visible behavior

- With Firebase accounts enabled, signed-in header **Account** links open `/account`; the existing security/name panel also links to **Account details**.
- Both **Eircode (optional)** and **Address (optional)** may be left blank. Either or both may be saved. Eircodes are uppercased and spaced; validation checks their shape, not their existence or residency. Addresses support up to 500 characters.
- The page loads saved details before enabling edits. It shows loading, retry, validation, save and removal states. Failed saves retain edits. Saving two blank fields or selecting **Remove saved location** deletes the location document.
- Details are private to the signed-in account. They are absent from public content, URLs and server-rendered HTML. Account changes/sign-out unmount the form, and delayed responses cannot restore a previous account’s details.
- The location form is masked from Clarity recordings. Firestore Lite performs explicit server reads/writes without a persistent offline profile cache.
- Existing `?feature_flag=firebase-auth` and `VITE_FIREBASE_AUTH_ENABLED=true` controls apply. Without the flag, account UI is disabled. Signed-out visitors are offered login and cannot fetch details. The route is `noindex`.

## Storage and access

Firebase Authentication stores sign-in identities; Cloud Firestore stores one `residentProfiles/{Firebase uid}` document per resident. Only `eircode`, `address` and a server-owned `updatedAt` timestamp are allowed. No email, password, roles or address verification result is copied into this document.

`firebase/firestore.rules` grants single-document get/create/update/delete only when `request.auth.uid` matches the document ID. All collection listing, cross-account access, anonymous access, extra fields, invalid types, invalid Eircode shape, excessive address length and forged timestamps are denied. Unknown collection paths remain closed. Firebase project administrators retain their normal administrative access; there is no public resident directory.

The existing Firebase project is `woodbrook-auth-20261021`. Its first `(default)` database is Standard edition, Native mode, `europe-west1` (Belgium). The CLI reports `freeTier: true`; point-in-time recovery is disabled. No billing account or paid feature was added.

Firestore currently includes 1 GiB stored data, 50,000 reads/day, 20,000 writes/day, 20,000 deletes/day and 10 GiB outbound/month for one qualifying database. Stay within Spark quotas to remain free; increasing quotas requires a separate billing decision. Avoid polling and broad reads: this UI makes one document read on opening and explicit writes on user actions.

## CLI and verification

The official Firebase CLI is installed globally and versioned as a repository development dependency. `.firebaserc` selects Woodbrook, and `firebase.json` points to the committed rules. Login credentials are held by the CLI outside the repository; no admin credential is shipped to the browser.

```sh
firebase login
firebase firestore:databases:list --project woodbrook-auth-20261021
firebase deploy --only firestore:rules --project woodbrook-auth-20261021
bun run test:firestore
bun run --cwd apps/web test:auth
```

The rules test requires a Java 21+ runtime for the Firestore emulator. It uses the isolated `demo-woodbrook-profiles` project on loopback port 8186 and cannot access production profile documents. Existing account browser tests use synthetic accounts and simulated Firebase responses; screenshots must be labelled as illustrative sample data.

## Acceptance criteria

- A signed-in resident can save either location field, reload to retrieve it, edit it and remove it.
- Errors preserve edits and offer a safe retry. No edit is allowed before initial loading succeeds.
- Cross-account, signed-out and list access are denied by deployed rules, independently of the UI.
- No prior account’s location appears after switching accounts or signing out.
- Account navigation preserves feature flags, and direct routes remain disabled without opt-in.
- Desktop and mobile forms remain usable, including 320px screens.
- Builds, profile/rules tests and required repository checks pass before availability is marked.

## Scope

Included: optional private Eircode/address storage, resident editing/removal, Firebase CLI configuration and reproducible rules tests. Excluded: proof of residency, address lookup/geocoding, maps, public profiles, household membership, access privileges, admin address browsing, marketing, migrating old accounts, billing upgrades and changes to issue-report privacy. Removing location details does not delete the authentication account. Full authentication-account deletion and an administrator’s broader retention policy are separate capabilities.

Sources: [Firestore quotas](https://firebase.google.com/docs/firestore/quotas), [field-level rules validation](https://firebase.google.com/docs/firestore/security/rules-fields), [Firestore Lite](https://firebase.google.com/docs/firestore/solutions/firestore-lite), [Firestore locations](https://firebase.google.com/docs/firestore/locations), accessed 2026-10-22.
