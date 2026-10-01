# Laura gallery picture detail

Status: Removed

## Job to be done

Previously, visitors opened individual gallery pictures at separate detail URLs and read optional descriptions for each picture.

## Visible behavior

This model has been replaced by [named gallery collections](./laura-gallery-collections.md). Only collections have detail pages and descriptions. Their pictures can be browsed together on the collection page.

## Acceptance criteria

- Gallery and home links target collections rather than individual pictures.
- Per-picture descriptions, gallery-context labels and picture counters are removed.
- The collection experience retains breadcrumbs and picture navigation within the collection.

## Scope

The former individual-picture detail routes in `apps/laura-faichney-web`; the photography and generated hero remain in use by collections.
