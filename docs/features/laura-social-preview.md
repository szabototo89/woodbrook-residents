# Laura branded sharing previews

Status: Available

## Job to be done

When someone shares a Laura website link, I want a recognisable artwork and brand preview, so recipients can identify the artist before opening it.

## User-visible behavior

Public pages offer the same branded 1200×630 cover alongside their own title and description. The cover contains Laura’s signature, the colourful portrait, Bold Art Brighter Spaces and allthingsart.ie. Open Graph and large-image card metadata include an absolute JPEG URL and descriptive alt text.

## Acceptance criteria

- Every public route includes the image metadata in its server-rendered HTML without JavaScript.
- The public image returns HTTP 200 with image/jpeg and decodes at 1200×630.
- Image URLs use the configured public origin on the homepage and nested pages.
- Existing page-specific titles, descriptions and canonicals remain present.
- Desktop and mobile representative card captures show readable artwork and text.

Verified on production on 8 November 2026 from `11c5a73`: all 10 public pages include the sharing tags without JavaScript, and the public JPEG matches the approved image.

## Scope

Included: one shared branded cover, image metadata, crawler regression checks and a separate handoff.

Platforms choose their final card layout and cache duration. This does not force a Google Search thumbnail, add per-collection artwork cards, edit CMS content or send test messages to anyone.

See [the handoff](../handoffs/laura-social-preview/index.mdx). Use a new versioned image filename for future cover replacements so cached shares can fetch the new asset.
