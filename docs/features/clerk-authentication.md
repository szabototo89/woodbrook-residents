# Clerk accounts

Status: Removed

## Job to be done

Residents can create and manage an optional account using [Firebase Authentication](firebase-authentication.md).

## Visible behavior

Clerk is no longer part of the website. Account navigation, login, registration, password recovery and profile controls use Firebase when the Firebase feature flag is enabled. Old Clerk keys and flags do not enable accounts.

## Acceptance criteria

- Current setup instructions point to Firebase.
- Clerk has no runtime dependency, provider, environment configuration or account interface in the website.
- The existing hosted Clerk account and its user data remain untouched, as requested.

## Scope

The Clerk setup walkthrough and local CLI/preview tooling are retired. The [original Clerk handoff](../handoffs/clerk-authentication/index.mdx) remains an immutable historical record. No Clerk application, hosted account or user is deleted.
