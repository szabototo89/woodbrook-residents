# Mobile published content API

Status: Available

## Job to be done

When I open the resident mobile app, I want published content from the same
Sanity source as the website so I can rely on one editorial record.

## Visible behavior

- iOS and browser renderers fetch `/api/mobile-content` at runtime.
- The deployed Worker and local development route use the website's Sanity factory.
- The snapshot contains site settings, updates, projects, events, surveys, and resources.
- Website content reflects its latest build; mobile reads can refresh after the API cache window.
- Unavailable or invalid upstream content returns the existing 503 error and permits retry.
- Drafts, release versions, private editorial fields, and backend tokens remain private.

## Acceptance criteria

- Missing, blank, and `sanity` source settings select Sanity with the shared defaults.
- Other source settings, including `google-sheets`, fail visibly without source fallback.
- Server project/dataset/version values take precedence over public aliases and defaults.
- All six queries request `published` and exclude draft/release paths with or without a token.
- Invalid records, duplicate identities, or broken project relations return the public 503 error.
- GET preserves its short public cache and CORS headers; OPTIONS returns 204 without loading content.
- Writes return 405; non-endpoint paths retain static-asset serving.
- No Sanity credential or SDK is required in a mobile bundle.

## Scope

Included: Sanity-only backend selection, publication filters, validation, protocol
regressions, configuration documentation, and temporary preview verification.
Excluded: mobile UI changes, content migration, CMS schemas, accounts, submissions,
production configuration, and production deployment.
