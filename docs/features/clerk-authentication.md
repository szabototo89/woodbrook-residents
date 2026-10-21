# Clerk accounts

Status: Available

## Job to be done

When I want a Woodbrook account, I can register, log in, recover my password, and manage my profile securely while the public community hub remains open to everyone.

## Visible behavior

- Accounts are off by default. Enable them with the build environment variable `VITE_CLERK_AUTH_ENABLED=true` or the URL parameter `?feature_flag=clerk-auth`.
- The header then shows **Log in** on desktop and mobile. Signed-in users get Clerk’s account menu, including profile/security management and sign out.
- `/login`, `/register`, and `/forgot-password` provide separate pages with links between them. Account pages are marked `noindex`.
- Login and registration use Clerk’s maintained components, including verification and security challenges configured in Clerk. Components use hash routing so nested authentication steps work on static hosting.
- Password recovery requests an email code, verifies the code, then accepts and confirms a new password. Clerk validates password strength. Successful recovery signs out other sessions and completes the new session, or hands additional security checks to login.
- Feature flags remain in account links, post-authentication destinations, and internal router navigation. Multiple flag names can be comma separated. There is no cookie, local-storage switch, settings toggle, or permanent query-based enablement: opening a URL without the flag disables the preview unless the environment enables it.
- With accounts disabled, direct account URLs explain that accounts are not enabled. No Clerk SDK is loaded and no credentials are collected.
- With a missing or malformed publishable key, enabled pages explain that account access is being set up. They do not display credential forms. Provider errors during recovery remain visible and can be retried.

## Setup

### 1. Create and configure a Clerk application

1. Open the [Clerk Dashboard](https://dashboard.clerk.com/) and create an application for Woodbrook Residents. Use its development instance locally.
2. In user/authentication settings, enable **Email** and **Password**. Configure email verification for registrations. This integration’s dedicated recovery page requires an email address and email password-reset codes.
3. Review the application’s password policy, email templates, sender settings, and any MFA or social connections you want to enable. Clerk’s login/registration components handle the configured security steps; recovery hands further checks to login.
4. Use the Dashboard’s **Users** area to inspect and manage users. Do not create a public user directory in the website.

### 2. Configure local environment variables

Create an ignored `apps/web/.env.local` file (Vite loads it automatically):

```dotenv
VITE_CLERK_PUBLISHABLE_KEY=pk_test_REPLACE_WITH_YOUR_DEVELOPMENT_PUBLISHABLE_KEY
VITE_CLERK_AUTH_ENABLED=false
```

Copy the complete **publishable key** from Clerk’s API Keys screen; the value above is a placeholder. This browser integration needs no secret key. Never put a Clerk secret key in a `VITE_` variable, source file, screenshot, or committed environment file. The repository-root `.env.example` also lists these variables for commands that forward the root environment.

Install and start the web app with Bun:

```sh
bun install
bun run --cwd apps/web dev
```

Open `http://localhost:3000/login?feature_flag=clerk-auth` (use the actual port Vite prints if 3000 is occupied). The query parameter can also be added to any public page. Other flags can coexist, for example `/?feature_flag=other-preview,clerk-auth&source=review`.

To enable accounts for every visitor, change `VITE_CLERK_AUTH_ENABLED` to exactly `true` and restart Vite. Values such as `false`, `1`, and an empty value do not enable accounts. The query parameter enables the preview even when the environment flag is false; it cannot turn off an environment-enabled rollout.

### 3. Configure Clerk URLs

In Clerk’s paths/redirect settings, use the application’s origin and these application paths:

| Purpose                                                         | Path               |
| --------------------------------------------------------------- | ------------------ |
| Login                                                           | `/login`           |
| Registration                                                    | `/register`        |
| Password recovery                                               | `/forgot-password` |
| Default post-login, post-registration, and sign-out destination | `/`                |

The website passes its login, registration, and fallback destinations to `ClerkProvider`, retaining preview flags. The **Forgot password?** link on `/login` opens the dedicated recovery page; Clerk’s own login component also includes its built-in recovery flow. Keep email/password enabled for both.

### 4. Verify with development credentials

1. Open `/login` without the flag while the environment flag is false: no account navigation or forms should appear.
2. Add `?feature_flag=clerk-auth`: log in, create an account, and verify its email. Navigate through public pages and confirm the flag stays in the URL.
3. Confirm the header changes to an account menu. Open it to manage profile/security and sign out.
4. On `/forgot-password?feature_flag=clerk-auth`, request a code for the test account, enter the emailed code, then enter matching new passwords. Verify the new password works and other sessions are revoked.
5. Try an incorrect/expired code, a weak password, and mismatched passwords. Errors must remain visible and must not complete the reset.
6. If MFA or session tasks are enabled, confirm the subsequent login completes those checks. Test enabled social connections through Clerk’s login and registration components.
7. Open a new URL without the query flag: the preview should disappear. It must not persist in browser storage.

Automated checks mock the Clerk SDK for configured login/registration, profile controls, recovery requests/results, retry errors, and session completion. Browser checks cover the actual routes, flag persistence, missing-key state, and desktop/mobile layouts. Real email delivery and live Clerk sessions require your application’s credentials and the manual verification above; no Clerk application or real user is provisioned by this change.

### 5. Deploy and roll out

1. Finish Clerk’s production-instance setup for the public website’s domain, including Clerk’s required DNS/domain verification and production email settings.
2. In the hosting **build environment**, set `VITE_CLERK_PUBLISHABLE_KEY` to that instance’s `pk_live_...` key. Start with `VITE_CLERK_AUTH_ENABLED=false` to review via query parameter.
3. Build and deploy using the repository’s normal static-site workflow. Vite embeds these public variables at build time; changing a host runtime variable alone does not update an existing build.
4. Verify the three account URLs load directly and refresh successfully, including hash-based Clerk steps. Test signup/email verification, recovery, profile management, and sign out on the deployed origin.
5. Set `VITE_CLERK_AUTH_ENABLED=true` and rebuild when ready for rollout. To remove account UI for ordinary visitors, set it to false and rebuild. A visitor with the explicit preview query can still enable it.

## CLI configuration and current production status

The official Clerk CLI is installed globally with `bun add --global clerk` (verified version `4.0.0`) and linked to the existing Woodbrook application. Use `clerk whoami` to verify the target before changes. `clerk config pull`, `clerk config schema`, and `clerk config patch --dry-run` inspect and validate narrow updates; explicitly select the development or production instance when applying a patch.

The development instance currently requires verified email for registration and permits email sign-in. Phone registration, sign-in and SMS second factors are disabled. The existing password policy and Google/Facebook providers were preserved. These are Clerk instance settings, not code or feature-flag changes.

As checked on 2026-10-21, `clerk deploy status` reports that production setup has not started. The selected public URL is `https://woodbrook.shankill.workers.dev`. Clerk's standard production setup requires a domain with DNS control for authentication and email-sending records; that prerequisite is unresolved for the current hosted address. No production instance, production key, hosting configuration change or website deployment was created by this setup request. The Frontend API proxy option does not replace production email-domain setup.

See the [Clerk handoff](../handoffs/clerk-authentication/index.mdx) for verified configuration, screenshots, architecture and remaining production steps.

## Acceptance criteria

- Disabled authentication leaves the public hub usable and makes no Clerk requests.
- Either explicit opt-in mechanism enables account navigation and all three account pages when a valid Clerk key is configured.
- Missing/malformed keys show an honest setup message instead of a broken provider or a nonfunctional credential form.
- Registration and login are handled by Clerk, and signed-in users can manage their own account and sign out.
- Recovery sends/verifies an email code, checks password confirmation, updates the password through Clerk, revokes other sessions, and handles errors and additional security checks.
- The query flag survives internal navigation and account transitions without browser-storage persistence.
- Both desktop and mobile layouts stay usable, and account pages carry `noindex` metadata.

## Scope

Included: browser-side Clerk integration compatible with static hosting, gated account navigation, login/registration/recovery pages, account profile/security menu, tests, and setup/rollout instructions.

Excluded: a public member directory, admin UI in the website, roles/permissions, protected resident content, backend user synchronization, webhooks, billing, organizations, and changes to issue-report access. Clerk’s Dashboard supplies administrative user management. The feature flag controls UI availability only; any future protected API must independently verify Clerk session tokens and permissions server-side.

## References

Clerk’s [React quickstart](https://clerk.com/docs/react/getting-started/quickstart) and [password recovery guide](https://clerk.com/docs/guides/development/custom-flows/authentication/forgot-password), accessed 2026-10-21.
