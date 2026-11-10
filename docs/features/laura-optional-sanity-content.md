# Optional Laura content

Status: Available

## Job to be done

As the artist, I can publish partial content without preventing the website from building.

## Visible behavior

All Studio content fields are optional. Missing text, objects and lists are normalized before rendering. Pages retain a fallback title. Empty optional sections and missing images are omitted. Text-only sections use the available width. Missing email and phone values produce no contact links; the project enquiry form remains usable.

Valid gallery photos remain visible when alt text or order is absent. Missing alt text uses the collection name and “artwork”, without guessing the picture content. Broken photo references, photos without assets, collections without photos or a slug, and services without a slug are omitted.

An explicit numeric order is used first. Otherwise, creation time is used, falling back to update time. Timestamps sort oldest first. Entries with neither valid timestamp follow dated entries and keep their source order when tied. The same rule applies to services, collections and photos. Existing explicit values, including zero, are preserved. New Studio records no longer receive an automatic order of zero.

## Acceptance criteria

- Null or absent fields, nested objects, lists and singleton documents do not prevent page generation.
- Missing images produce no empty image URL and reserve no artwork column.
- Usable collection photos remain accessible through the gallery viewer.
- Optional announcements without a heading or message are hidden; incomplete actions are omitted.
- Supplied malformed field types, unsafe announcement links and failed Sanity requests still report errors.
- Unit tests, browser checks, static export and repository build pass.

## Scope

Laura’s content reader, snapshot image cache, public page components and Studio schemas. This change edits no published CMS documents and makes no production deployment. It does not relax required fields on the visitor enquiry form.
