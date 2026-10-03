# Laura image bandwidth

Status: Available

## Job to be done

When people browse Laura's site, I want site artwork to load at appropriate sizes from the static host, so page visits use less Sanity bandwidth while gallery pictures remain browsable.

## Visible behavior

- Builds download responsive WebP variants for the Home, About, Services and Gallery heroes, mural, biography images and service illustrations. These assets are served from `/site-images/` on Cloudflare Pages.
- Source asset hashes and transformation settings identify cached variants. Unchanged assets are reused on subsequent local builds and GitHub deployments. A changed source or crop generates a new URL.
- Gallery collection photos and thumbnails remain hosted on Sanity.
- Heroes and illustrations offer responsive image sources and sizes. The selected carousel picture and its immediate neighbours have full-size image sources; distant pictures load when selection approaches them. All thumbnails and navigation controls remain available.
- Publishing changes still requires a build and deployment. A required image download failure stops the build.

## Acceptance criteria

- Routine browser builds and browser checks read local content/image fixtures without live Sanity requests or a network fallback.
- Cached non-gallery image variants exist in the static output, including every responsive source. A repeat build needs no image downloads for unchanged assets.
- Updating an asset or transformation downloads a new variant and replaces obsolete generated public files without deleting the persistent cache.
- Phone browsers choose smaller local sources while artwork alt text, transparency and desktop layouts remain intact.
- Carousel initial rendering gives download sources only to the selected picture and immediate neighbours; arbitrary thumbnail selection, keyboard navigation, touch swipes and adjacent-collection browsing work in Chromium and WebKit.

## Scope

Included: local browser fixtures, cached site asset generation, GitHub deployment cache, responsive non-gallery artwork and carousel loading.

Excluded: gallery artwork migration, Sanity Studio or CMS schema changes, changes to existing decorative/brand assets already served locally, private image access, hosting changes, deployment and claims about historical bandwidth attribution.

## Verification

- Unit checks cover offline capture, cache reuse, changed crops, incomplete downloads, bounded source dimensions and carousel source selection.
- Browser checks cover local responsive sources, arbitrary thumbnail jumps, keyboard selection, native Chromium touch and mobile WebKit swipes, transparency and layouts.
- The production static build verifies every main and collection page. All 58 generated site-image variants referenced by its HTML were present, with immutable cache headers.
- `bun run build` passed across the repository.

Cached images remain part of Sanity bandwidth when first downloaded by a build. Cloudflare Pages dashboard builds need their own persistent cache; the repository's GitHub deploy workflow restores `.cache/image-assets` between runs. Test builds use a separate `.cache/test-image-assets` cache and cannot populate the production cache.
