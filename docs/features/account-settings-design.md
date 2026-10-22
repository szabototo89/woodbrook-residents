# Account settings layout and edit feedback

Status: Available

## Job to be done

As a resident, I can find my private location settings, understand which edits are saved, and discard an edit without changing my account.

## Visible behavior

- A compact account heading leads into one centered location form. Name, sign-in and security settings remain available through a secondary link below it.
- A privacy line sits inside the form, directly before its fields. Both fields retain optional labels, autocomplete and existing limits.
- The Eircode input is short; the multiline address uses the available form width.
- Save enables only after an edit. Unchanged submissions make no write request. The action area shows **Unsaved changes** or **No unsaved changes**.
- **Discard changes** restores the last loaded or saved values without writing to the account.
- Invalid Eircodes receive keyboard focus and an accessible error association. Editing or discarding clears stale errors.
- Successful saves and removals are announced. Failed saves retain edits for retry.
- **Remove saved location** appears only when location details have been saved. Its explanation says that the Eircode and address are removed.
- On a 390px phone, the save action fits in the initial viewport. A single idle save action spans the form width.

## Acceptance criteria

- Save, reload, edit, discard, retry and removal work at desktop and mobile sizes.
- An unchanged form cannot produce a save request.
- An invalid Eircode is focused and marked invalid after submission.
- Discarding an edit makes no save request.
- The desktop form remains at a readable width; a 320px phone has no horizontal overflow.
- Signed-out and feature-disabled routes retain their access controls.
- Build, unit tests and browser checks pass.

## Scope

Included: `/account` layout, copy, responsive styles and form feedback. Excluded: security-panel redesign, account deletion, new profile fields, address lookup, authentication changes and Firestore contract changes.

Screenshots use synthetic account and location data. See [the current implementation handoff](../handoffs/account-form-refinement/index.mdx). The [earlier design handoff](../handoffs/account-settings-design/index.mdx) remains a historical record.
