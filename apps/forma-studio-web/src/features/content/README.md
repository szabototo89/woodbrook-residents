# Forma Studio content: start here

Forma Studio is a public website for prospective website-design customers. Its two routes, `/` and `/blog`, are static HTML pages. Sanity is the editing backend; Zod is the runtime gate that decides whether content is safe and complete enough to build.

## Follow one content change

1. An editor changes **Homepage** in [Forma Studio content](https://forma-studio-content.sanity.studio/) and publishes it. Saving a draft alone does not change the public site.
2. A maintainer runs **Deploy Forma Studio** on `main` in GitHub Actions. The optional publish webhook described below can send the same rebuild event.
3. `vite.config.ts` calls `scripts/buildContent.ts` before building either page. `fetchContent.ts` makes one fresh Sanity query with `perspective=published`, bypassing the query CDN.
4. `schema.ts` parses the unknown query response with Zod. All required pages, text, links, dates, images and references must pass. A failure stops the build with a field path. There is no old snapshot or local-copy fallback.
5. Vite emits only the parsed content as `virtual:forma-content`. `content.ts` parses that module again for consumers. Both prerendering and browser hydration use this same content. The public browser never queries Sanity or receives the read token.
6. Routes pass CMS metadata to `pageHead.ts`. Page components read the validated content. Cloudflare deploys `dist/client` only after the build succeeds.

A publish therefore becomes public only after a successful rebuild and deployment. Invalid published content leaves the existing deployment online.

## Documents and publishing ownership

The dedicated project is `ms27me7o`, dataset `production`. It contains no Woodbrook resident content. The Studio source is `apps/forma-studio`; its schema lives in `schemaTypes/index.ts`.

| Document type  | Identity and ownership                                    | Public use                                                            |
| -------------- | --------------------------------------------------------- | --------------------------------------------------------------------- |
| `siteSettings` | One document with ID `siteSettings`                       | Header, navigation, logo, footer and mailto settings                  |
| `homePage`     | One document with ID `homePage`                           | Hero, services, packages, process, preparation, FAQs, contact and SEO |
| `journalPage`  | One document with ID `journalPage`                        | Journal introduction, ordered guide references, contact and SEO       |
| `selectedWork` | Independently published project; referenced by homepage   | Screenshot, project summary and live-site link                        |
| `journalGuide` | Independently published guide; referenced by journal page | Expandable plain-text guide, source URL and check date                |

Services, packages, steps and FAQs are nested objects because they publish with the homepage. They are not independent documents. References allow work and guides to keep their own publishing lifecycle. An unpublished, missing or deleted required reference resolves to `null` and fails validation; the query must not filter out nulls to hide this failure.

`journalGuide.editorialStatus` records whether copy still needs review. It does **not** control Sanity publication or bypass draft exclusion. The legacy guides were already public. Migration preserves that public baseline plus matching Sanity drafts, retains `needs-review`, and keeps their original source URLs and access dates.

## Read the contract

`schema.ts` is the application contract. Every `.describe()` explains what a field means, where the application uses it and any rule a reviewer needs to understand. Read these descriptions before changing a field. Application types come from `z.infer`; do not add parallel interfaces or cast API responses to trusted content.

- `_id` identifies a Sanity document. The three singleton IDs are fixed. `drafts.*` and `versions.*` IDs must never reach public content.
- `_key` identifies an item inside a Sanity array. Preserve it when editing or reordering services, packages, FAQs or navigation.
- A guide's `id` is its public HTML anchor, such as `local-search`. It differs from `_id` and must be unique on `/blog`.
- A stored Sanity image contains `asset: {_type: 'reference', _ref: 'image-…'}`. The query dereferences that asset into `{_id, url, width, height}`. Zod requires this resolved shape and non-empty alt text. An optional guide image may be absent; a supplied but incomplete image fails.
- `price` is display copy with a currency symbol. It does not create a charge or a payment integration.
- Text is rendered as text, never arbitrary HTML. Service icon names are a supported enum; `home/serviceIcons.ts` owns the React icon components.
- Unknown fields, such as Sanity revision metadata, are stripped by the object schemas. Required fields never receive defaults.

## Add or change a field

1. Write a failing test in `formaContent.test.ts` or the relevant page test, using an observable result or a malformed payload.
2. Add the field and essential editorial validation to `apps/forma-studio/schemaTypes/index.ts`. Keep it on the document that owns its publishing lifecycle.
3. Add runtime validation and a contextual `.describe()` to `schema.ts`. Its inferred type updates consumers automatically.
4. Update `FORMA_QUERY` if the field needs projection or reference expansion. Keep the published perspective and null reference behavior.
5. Update the relevant component or metadata helper. Keep routing and presentation responsibilities in their existing files.
6. Update the offline fixture under `migration/legacy-content.json` only when tests need representative content; this file is never a production content source. Publish the real field in Studio before deploying an application that requires it.
7. Run the focused tests, types and build below. Restart the dev server after a publish; it loads a fresh snapshot at startup.

Do not loosen Zod validation to make an incomplete document build. Fix and publish the document, then rebuild.

## Configuration and commands

Defaults select the dedicated Forma project. Build-side overrides are `FORMA_SANITY_PROJECT_ID`, `FORMA_SANITY_DATASET`, and optional `FORMA_SANITY_READ_TOKEN`. Use a least-privilege read token for private datasets. Never prefix a secret with `VITE_` or place it in CMS content. The production dataset currently allows published reads without a token.

From the repository root:

```sh
bun install
bun run --cwd apps/forma-studio dev
bun run --cwd apps/forma-studio-web dev
bun run --cwd apps/forma-studio-web test:unit
bun run --cwd apps/forma-studio test:unit
bun run --cwd apps/forma-studio-web typecheck
bun run --cwd apps/forma-studio-web test:e2e
bun run build
```

Forma previews on port 3005; Studio uses 3335. Deploy local Studio changes with `bun run --cwd apps/forma-studio deploy -- --yes`. This updates the hosted editor and its schema; it does not deploy the public website.

## Initial migration

`migration/legacy-content.json` records the pre-CMS copy from base commit `c0e96a4221951871b72c27a5cad5e3ecb1167058`. It is input to an explicit one-time command and to offline tests. Production never imports it.

```sh
# Store FORMA_SANITY_WRITE_TOKEN in ignored .env.forma.local first.
bun --env-file=.env.forma.local apps/forma-studio-web/scripts/migrateContent.ts
```

The script uploads the existing three original image assets, resolves and validates the full snapshot, then creates missing documents in one transaction. It uses generated document IDs and a `legacyId` lookup to make reruns preserve existing content. `createIfNotExists` never replaces an editor's changes. Guide draft copies retain the earlier editorial state. Native Sanity asset metadata supplies real dimensions. Existing local image files remain migration inputs.

## Publish and deploy

The supported workflow is: publish in Studio, run [Deploy Forma Studio](https://github.com/szabototo89/woodbrook-residents/actions/workflows/deploy-forma-studio.yml) on `main`, then inspect the successful build and Cloudflare Pages deployment. A failed content check prevents the deploy step.

The workflow also accepts the isolated `repository_dispatch` event `forma-sanity-update`. Automatic webhook delivery is **not configured** by this change; it requires a separately managed GitHub credential. To enable it in Sanity Manage for this project and dataset, configure:

- URL: `https://api.github.com/repos/szabototo89/woodbrook-residents/dispatches`; method: POST.
- Published create/update/delete events; filter: `_type in ["siteSettings", "homePage", "journalPage", "selectedWork", "journalGuide", "sanity.imageAsset"] && !(_id in path("drafts.**")) && !(_id in path("versions.**"))`.
- Projection: `{"event_type": "forma-sanity-update"}`.
- Headers: `Accept: application/vnd.github+json`, `X-GitHub-Api-Version: 2022-11-28`, `Authorization: Bearer <dedicated repository dispatch token>`.
- Keep the credential only in Sanity webhook settings. Serialize deliveries; the workflow already queues deployments. Verify a published change produces a 2xx webhook attempt and a successful GitHub run before relying on automation.

The event differs from Laura's `sanity-update`, so publishing Forma content cannot select the Laura workflow. Manual rebuilds work without a webhook.
