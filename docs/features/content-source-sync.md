# Content source sync

Status: Available

## Job to be done

When maintaining Woodbrook content in Strapi or the private Google spreadsheet,
I want to preview and run a controlled sync so that missing records can be copied
without creating duplicates or silently overwriting editorial changes.

## Visible behavior

- `bun run sync:content` compares published Strapi documents with rows in the
  configured `Updates`, `Projects`, `Events`, `Consultations`, and `Local_Info`
  tabs.
- The default direction is `strapi-to-sheets`. The direction can be set to
  `strapi-to-sheets`, `sheets-to-strapi`, or `two-way`.
- The command is a dry run unless `--apply` is supplied.
- Records are matched by slug. Duplicate slugs and differing records are
  reported without being overwritten by default.
- A conflict policy can explicitly select `strapi-wins` or `sheets-wins`.
- New rows copied from Strapi are spreadsheet drafts (`publish=FALSE`) with an
  administrative review note. This leaves spreadsheet-only editorial fields
  for a person to confirm before publication.
- Only spreadsheet rows with `publish=TRUE` can create or update Strapi
  documents.

## Acceptance criteria

- Given a record exists only in Strapi, a Strapi-to-Sheets dry run reports one
  pending append and `--apply` appends it as an unpublished row.
- Given a published spreadsheet row exists only in Strapi, a Sheets-to-Strapi
  sync creates and publishes the Strapi document.
- Given the same slug has different shared fields, the default run reports a
  conflict and performs no overwrite.
- Given duplicate slugs within either source, the ambiguous slug is reported
  and is not used to overwrite an existing record.
- Given `--apply` completes, the command reads both sources again and fails if
  ordinary sync actions remain.

## Scope

- Synchronization of updates, projects, events, consultations, and local
  information through the Strapi 5 REST API and Google Sheets API.
- Shared content fields only. Spreadsheet-only editorial fields remain in the
  spreadsheet; Strapi-only fields remain in Strapi unless their source wins an
  explicitly configured conflict.
- Local information sync includes collection schedule dates and supporting
  document links.
- No deletions, media uploads, site settings, issue reports, or automatic
  publication of newly appended spreadsheet rows.

## Usage

Set the credentials in `.env`, then preview a sync:

```sh
bun run sync:content -- --direction two-way
```

Apply the reported changes explicitly:

```sh
bun run sync:content -- --direction two-way --apply
```

The Google service account needs edit access to the spreadsheet. Set
`STRAPI_API_TOKEN` to a token with create and update permission when the chosen
direction can write to Strapi. Use `--conflict strapi-wins` or
`--conflict sheets-wins` only when that source should overwrite differing
shared fields.
