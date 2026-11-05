# Content source sync

Status: Removed

## Job to be done

When maintaining Woodbrook content, I want one canonical editing source so that sync tooling cannot silently overwrite editorial changes.

## Visible behavior

- The Strapi-to-Sheets sync script (`scripts/sync-content.ts`) has been removed with the Strapi CMS.
- Content is edited in Sanity Studio as the single source of truth; no synchronization service runs.
- `bun run sync:content` no longer exists.

## Acceptance criteria

- Given the repository is inspected, when `scripts/sync-content.ts` is looked for, then it does not exist.
- Given `package.json` scripts are inspected, when sync entries are looked for, then no `sync:content` script exists.

## Scope

- Removal of Strapi 5 REST sync, `STRAPI_URL`, `STRAPI_API_TOKEN`, `CONTENT_SYNC_DIRECTION`, and `CONTENT_SYNC_CONFLICT` configuration.
- No replacement sync; Sanity is the sole supported content source.
