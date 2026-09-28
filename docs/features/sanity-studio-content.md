# Sanity Studio content

Status: Available

## Job to be done

When editing Woodbrook community content in Sanity Studio, I want the TanStack Start website to read the same canonical snapshot as Strapi and Google Sheets, so editors can use Sanity without changing resident-facing pages.

## Visible behavior

- Studio lives at `apps/sanity-studio` bound to Sanity project `ca34quae`, dataset `production`, with siteSetting singleton, update, project, event, survey, resource (+ resourceDetail, collectionDate), and private issueReport types.
- The Studio desk mirrors the public site navigation (Updates, Events, Projects, Consultations, Directory, Site setting) with editorial filtered lists (featured items, upcoming/past events, open consultations, items missing source data).
- Every field carries a plain-language subtitle saying what it is, where residents see it on the site, and what breaks without it; fields are grouped into fieldsets ordered by render priority (identity, content, dates, source, featuring).
- List previews echo the public cards (kind/category pill, formatted date, featured star) and validation messages name the site breakage (e.g. empty dates crash pages); the navbar carries the Woodbrook brand mark.
- Residents see the same pages and content model regardless of whether `CONTENT_SOURCE=sanity`, `strapi`, or `google-sheets` supplied the build.
- Only published Sanity documents appear on the public site. Drafts require a token and preview flow.
- Every seeded factual item includes its source URL and access date. Sanity validation requires `sourceUrl` and `sourceReviewedOn` on all editorial types.
- Issue reports are create-only operational records in Studio. The public snapshot never lists or reads them.
- Invalid Sanity content stops the static build with the source validation message before prerendering.
- The deployed browser site never contacts Sanity at runtime. Mobile runtime reads remain via the existing Worker endpoint.

## Acceptance criteria

- Given `CONTENT_SOURCE=sanity`, when the site loads content, then it queries GROQ for siteSetting, updates, projects, events, surveys, and resources into one validated snapshot.
- Given Sanity slugs are `{current}` objects, images are asset references, and survey relations are references, when content is loaded, then slugs flatten to strings, image URLs build via `@sanity/image-url`, and `relatedProject._ref` maps to `relatedProjectId`.
- Given a published Sanity record has an invalid required field, taxonomy value, date, URL, or relation, when content is loaded, then the static build fails with the Sanity validation message.
- Given published records contain duplicate stable IDs (`_id`) or route slugs, when the snapshot is validated, then the build fails.
- Given `SANITY_PROJECT_ID` is unset, when the source is created, then it defaults to `ca34quae` with dataset `production` and API version `2025-09-01`.
- Given the Studio schema changes, when `bunx sanity schema validate` runs in `apps/sanity-studio`, then it reports zero errors.
- Given the prerenderer requests content for multiple routes, when one static build is running, then the validated snapshot is loaded only once.

## Scope

### Included

- Clean TypeScript Studio at `apps/sanity-studio` with `sanity.config.ts` bound to `ca34quae/production`, singleton siteSetting structure, validation, and Draft & Publish semantics.
- Read-only `SanityContentSource` (`name='sanity'`) using GROQ + `@sanity/client` image builder, `createContentSource` support for `CONTENT_SOURCE=sanity`, normalization to the existing snapshot schemas, unit tests with mocked fetch, and env example without secrets.
- Sanity MCP for OpenCode (`https://mcp.sanity.io`) configured via `bunx sanity mcp configure`.
- Seeded `production` dataset migrated from the legacy Sheets-style shape on 2026-09-28 (66 published rows mapped to the new schema, 7 unpublished rows preserved as drafts, legacy docs removed; pre-migration export kept by the operator). Editorial taxonomy values map 1:1 after lowercasing.

### Not included

- Next.js `web/` app. Rendering reuses `apps/web` TanStack Start routes/UI unchanged.
- Standalone `woodbrook-residents/` folder.
- Sanity draft preview UI, visual editing overlays, webhook-triggered rebuilds, media mirroring, or issue-report writes from the public site.
