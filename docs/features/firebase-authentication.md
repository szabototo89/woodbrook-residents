# Firebase resident accounts

Status: In progress

## Job to be done

As a Woodbrook resident, I want to create and manage an account using email or a configured social provider, while keeping community information publicly accessible and the website hosted at `https://woodbrook.shankill.workers.dev`.

## Visible behavior

Accounts remain off by default. `?feature_flag=firebase-auth` enables the account links and `/login`, `/register`, and `/forgot-password` pages for that browser URL. Comma-separated and repeated `feature_flag` values survive navigation. `VITE_FIREBASE_AUTH_ENABLED=true` enables account UI for everyone. The old `clerk-auth` flag and Clerk environment variables no longer enable accounts.

Registration collects a display name, email, and matching passwords of at least eight characters. Firebase creates the account and sends an email verification link. Login uses email/password; social buttons appear only when enabled in the build. Signed-in residents can edit their display name, resend verification, request a password reset, and sign out. Firebase retains the browser session across reloads. The account link in the header opens these controls on `/login`.

Password recovery requests a link with account-neutral confirmation copy. Firebase's hosted action page handles verification and choosing a new password; no custom domain, email server, or Firebase Hosting deployment for the Woodbrook website is needed. Social login uses a popup, which may need browser permission. Account errors use safe public messages and requests cannot be double submitted. Missing configuration shows a setup message without collecting credentials; a runtime error leaves the public hub available.

## Configured project

The website ships the public configuration for Firebase project `woodbrook-auth-20261021` in `apps/web/src/features/auth/firebaseProject.json`. Email/password and Google are enabled in that Firebase project; its default managed auth domain is used. Google uses the approved support email. Facebook remains disabled until an app ID and secret are configured in Firebase. Phone and anonymous authentication are disabled. Firebase enforces an eight-character minimum and email enumeration protection; the current `workers.dev` domain and localhost are authorized. The project remains on the no-cost Spark plan, with no billing account attached.

The public profile makes Cloudflare builds repeatable without dashboard configuration. Environment values override the profile; explicitly setting the API key to an empty string disables configured auth for tests or setup previews. The feature itself remains off by default and still requires the query flag or explicit rollout environment flag. Firebase browser API keys are public project identifiers, not administrator credentials; see [Firebase API-key guidance](https://firebase.google.com/docs/projects/api-keys), accessed 2026-10-21.

One existing Clerk account was detected by a count-only check. The user explicitly requested leaving that account untouched. No Clerk account data is exported, imported, or deleted by this migration.

## Setup or project override

1. Create or select a Firebase project on the free Spark plan and register a web application. Keep the existing Google Sheets content project separate.
2. In Authentication, enable Email/Password (not email-link-only sign-in). Set the required password minimum to eight characters and enable email enumeration protection.
3. In Authentication settings, add `woodbrook.shankill.workers.dev` and `localhost` as authorized domains. Keep the project's default `PROJECT_ID.firebaseapp.com` domain for authentication helpers and email action pages.
4. To override the bundled project, copy its public web configuration into the worktree's ignored `apps/web/.env.local`, or into the Cloudflare build environment:

```dotenv
VITE_FIREBASE_API_KEY=PUBLIC_WEB_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=PROJECT_ID.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=PROJECT_ID
VITE_FIREBASE_APP_ID=WEB_APP_ID
VITE_FIREBASE_AUTH_ENABLED=false
VITE_FIREBASE_GOOGLE_ENABLED=true
VITE_FIREBASE_FACEBOOK_ENABLED=false
```

These are build-time variables. Updating Worker runtime bindings alone does not update the browser bundle. Rebuild and redeploy after changes. Firebase web configuration identifies the project; service-account credentials and OAuth client secrets must never enter `VITE_` variables or Git.

5. Enable Google in Firebase and choose the support email. For Facebook, supply your own Facebook app ID and secret in Firebase and register Firebase's displayed OAuth redirect URL in the Facebook app. Use production-ready provider settings. Set each corresponding `VITE_FIREBASE_*_ENABLED=true` only after its provider is configured. The bundled project already enables the Google button and keeps Facebook hidden. Firebase keeps the secrets; the website only receives public configuration.
6. Run `bun install`, then `bun run dev` from the session worktree. Open the port Vite reports at `/login?feature_flag=firebase-auth`.
7. For Cloudflare, build with the public environment values and deploy the existing Worker. Keep the global auth flag false for initial review. Check direct route loads and refreshes, signup/verification, password recovery, profile changes, persistent login, social login, and sign-out before enabling globally.

## Migration from Clerk

Clerk SDK imports, dependency, key configuration, provider components, and custom code-based recovery were removed. Existing Clerk sessions do not transfer. Existing Clerk users are not silently copied or deleted; migrating real users requires a separate account inventory and supported import/password-reset plan. Historical Clerk handoffs remain evidence of the previous implementation, not current setup instructions. Administration moves to Firebase Authentication's Users screen.

## Acceptance criteria

- Disabled accounts make no authentication service requests and do not alter public information or private issue submissions.
- The exact query flag or environment flag enables account navigation; missing configuration never collects credentials.
- Registration, login, profile editing, verification requests, recovery requests, and sign-out use Firebase.
- Session state survives reload and sign-out persists after reload.
- Password resets and verification complete using Firebase's hosted email action pages.
- Google/Facebook controls correspond to configured providers; popup errors permit retry.
- Desktop and mobile layouts remain usable, including 320px-wide phones.
- Production can use the existing `workers.dev` website with the default Firebase auth domain.

## Verification and scope

Unit/DOM tests cover feature flags, configuration, provider lifecycle and failures, forms, duplicate submissions, safe error messages, and Firebase SDK calls. `bun run --cwd apps/web test:auth` exercises the actual Firebase browser SDK with simulated REST responses on desktop and mobile; these checks create no real users and send no real emails. The ordinary end-to-end suite covers disabled/missing-config states and navigation. Live Firebase provider/email delivery checks must be recorded separately; simulated checks do not prove delivery or OAuth completion.

Included: browser authentication and account controls, setup/rollout documentation, tests, and a dedicated migration handoff. Excluded: public directories, permissions/roles, protected resident content, backend user synchronization, automatic Clerk-user migration, billing upgrades, and changes to issue-report access. The feature flag controls UI only. Future protected APIs must independently verify Firebase ID tokens and enforce permissions server-side.

## Sources

Firebase [web setup](https://firebase.google.com/docs/auth/web/start), [email/password](https://firebase.google.com/docs/auth/web/password-auth), [user management and email actions](https://firebase.google.com/docs/auth/web/manage-users), and [social redirect/storage behavior](https://firebase.google.com/docs/auth/web/redirect-best-practices), accessed 2026-10-21.
