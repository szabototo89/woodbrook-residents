# Site analytics

Status: Available

## Job to be done

When the community hub is visited, I want privacy-friendly counts of visitors, page views, referrers, and devices, so I can understand reach without tracking residents personally.

## User-visible behavior

- Residents load no cookie banner for analytics; Cloudflare Web Analytics uses no cookies or local storage.
- When `VITE_CF_WEB_ANALYTICS_TOKEN` is configured, every public page emits the Cloudflare beacon (`https://static.cloudflareinsights.com/beacon.min.js`).
- When the token is absent, no analytics script is emitted.
- Visitor counts, top pages, referrers, countries, devices, and browsers are read in the Cloudflare dashboard under Web Analytics.
- Analytics never collects issue-report contents or other form input.

## Acceptance criteria

- Given `VITE_CF_WEB_ANALYTICS_TOKEN` is set, when any public route is rendered, then its document head contains a deferred beacon script whose `data-cf-beacon` payload carries that token.
- Given the token is absent or blank, when a public route is rendered, then no Cloudflare beacon script is emitted.
- Given the production token is configured in Cloudflare Pages/Workers, when residents browse the deployed site, then visits appear in Cloudflare Web Analytics for that hostname.
- Given `bun run build` runs, when verification completes, then analytics does not break prerendering or client navigation.

## Scope

### Included

- Token-gated Cloudflare Web Analytics beacon in the shared document head.
- `VITE_CF_WEB_ANALYTICS_TOKEN` configuration and dashboard setup notes.

### Not included

- Google Analytics, funnels, session recording, heatmaps, advertising identifiers, or cross-site tracking.
- Analytics of private issue-report submissions.
- Cloudflare account, hostname, or dashboard provisioning.

## Setup

1. In Cloudflare dashboard, open Web Analytics and add the production hostname.
2. Copy the site token.
3. Set `VITE_CF_WEB_ANALYTICS_TOKEN=<token>` in the Pages/Workers production environment and rebuild.
