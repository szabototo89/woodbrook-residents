# Account settings layout and edit feedback

Status: Available

## Job to be done

As a resident, I can find my private location settings, understand which edits are saved, and discard an edit without changing my account.

## Visible behavior

- A compact account heading leads into location and security navigation. The active location link is marked as the current page.
- A privacy note remains visible on desktop and mobile. Both location fields retain optional labels, autocomplete and existing limits.
- The Eircode input is short; the multiline address uses the available form width.
- The save area shows **Unsaved changes** after an edit. **Discard changes** restores the last loaded or saved values without writing to the account.
- Invalid Eircodes receive keyboard focus and an accessible error association. Editing or discarding clears stale errors.
- Successful saves and removals are announced. Failed saves retain edits for retry.
- **Remove saved location** appears only when the account has saved location details. Its separate explanation says that both fields are removed.

## Acceptance criteria

- Save, reload, edit, discard, retry and removal work at desktop and mobile sizes.
- An invalid Eircode is focused and marked invalid after submission.
- Discarding an edit makes no save request.
- A 320px phone has no horizontal overflow.
- Signed-out and feature-disabled routes retain their access controls.
- Build, unit tests and browser checks pass.

## Scope

Included: `/account` layout, copy, responsive styles and form feedback. Excluded: security-panel redesign, account deletion, new profile fields, address lookup, authentication changes and Firestore contract changes.

The screenshots use synthetic account and location data. See [the implementation handoff](../handoffs/account-settings-design/index.mdx) for research and verification.
