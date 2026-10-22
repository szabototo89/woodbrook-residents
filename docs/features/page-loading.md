# Fast public page loading

Status: Available

## Job to be done

As a resident on a mobile connection, I can read the page and find relevant community information promptly, without downloading oversized branding or decorative images first.

## Visible behavior

The existing layout, illustrations, photography, links and content remain available. Header and footer share a small lossless logo; home artwork uses smaller WebP copies. The hero selects an image for its actual rendered width, remains eager and high priority, and retains its JPEG fallback. An illustrated event card does not also download a covered background photo. Unillustrated cards retain their coastal background.

Shared styles load as one file in the original cascade order. The body and heading fonts are discovered from the document head using their existing hashed URLs and anonymous font preloads.

## Acceptance criteria

- All seven existing Lighthouse routes pass the unchanged minimum of 90 for performance, accessibility, best practices and SEO, on both mobile and desktop.
- The audit builds the same static site deployed to Cloudflare and serves it through Cloudflare's local runtime; live CMS latency is a build concern, not a per-page audit dependency.
- Browser regressions enforce a logo below 20 KiB, bounded hero/artwork transfers and no redundant coastal background under the illustration.
- Desktop and mobile retain readable content, image sources, accessible navigation and no horizontal overflow.
- Required build, unit, browser and end-to-end checks pass before availability is marked.

## Scope

Included: optimized copies of existing public images, accurate responsive image selection, shared stylesheet delivery, font preload hints and production-equivalent Lighthouse audits. Excluded: redesign, content changes, new artwork, score threshold reductions, audit exclusions, disabling authentication or analytics, and changes to private profile storage.

Sources: [Optimize Largest Contentful Paint](https://web.dev/articles/optimize-lcp), [efficient image encoding](https://developer.chrome.com/docs/lighthouse/performance/uses-optimized-images/), accessed 2026-10-22. Lighthouse scores are lab results under the repository's configured throttling, not field-user performance guarantees.
