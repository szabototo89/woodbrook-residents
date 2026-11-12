# Published Sanity content

Status: Available

## Job to be done

When maintaining Woodbrook content, I want to publish once in Sanity so the
website build and mobile API use the same validated content model.

## Visible behavior

- Sanity is the single source. Sheets configuration is rejected.
- Website pages reflect the latest successful static build; mobile loads at runtime.
- Only published documents appear, even when a backend read token is configured.
- Missing dates and unfamiliar categories use the [flexible content contract](flexible-sanity-content.md); records remain available.
- Unrecoverable validation and source failures still stop the build or return the API unavailable response.

## Acceptance criteria

- Missing, blank, or `sanity` source settings use the shared Sanity defaults.
- `google-sheets` and unsupported sources fail with a configuration error.
- All five collections and site settings use the same validation and normalization.
- Duplicate IDs, slugs, invalid stages or waste streams, and broken project relations fail validation.
- Dates and categories normalize without excluding documents or inventing dates.
- Drafts and release versions are excluded from every query.
- Static builds cache one snapshot; runtime requests load fresh snapshots.
- Credentials remain in backend/build infrastructure and never enter public assets.

## Scope

Included: read-only Sanity adapter, configuration, validation, caching, static
build and mobile API. Excluded: Sheets support, content migration, draft preview,
CMS schema changes, public issue-report reads, and mobile screen changes.
