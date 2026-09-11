# Site analytics

Status: Available

## Job to be done

When the community hub is visited, I want privacy-friendly counts of visitors, page views, referrers, and devices, so I can understand reach without tracking residents personally. When residents struggle with a page, I want heatmaps and session recordings, so I can see where the page fails them.

## User-visible behavior

- Residents load no cookie banner for analytics; Cloudflare Web Analytics uses no cookies or local storage.
- When `VITE_CF_WEB_ANALYTICS_TOKEN` is configured, every public page emits the Cloudflare beacon (`https://static.cloudflareinsights.com/beacon.min.js`).
- When the token is absent, no analytics script is emitted.
- Visitor counts, top pages, referrers, countries, devices, and browsers are read in the Cloudflare dashboard under Web Analytics.
- When `VITE_CLARITY_PROJECT_ID` is configured, every public page loads the Microsoft Clarity tag (`https://www.clarity.ms/tag/`), enabling heatmaps and session recordings in the Clarity dashboard.
- When the Clarity project ID is absent, no Clarity script is emitted.
- Analytics never collects issue-report contents or other form input.

## Acceptance criteria

- Given `VITE_CF_WEB_ANALYTICS_TOKEN` is set, when any public route is rendered, then its document head contains a deferred beacon script whose `data-cf-beacon` payload carries that token.
- Given the token is absent or blank, when a public route is rendered, then no Cloudflare beacon script is emitted.
- Given the production token is configured in Cloudflare Pages/Workers, when residents browse the deployed site, then visits appear in Cloudflare Web Analytics for that hostname.
- Given `bun run build` runs, when verification completes, then analytics does not break prerendering or client navigation.
- Given `VITE_CLARITY_PROJECT_ID` is set, when any public route is rendered, then its document head contains the Clarity tag loading `https://www.clarity.ms/tag/` for that project.
- Given the Clarity project ID is absent or blank, when a public route is rendered, then no Clarity script is emitted.

## Scope

### Included

- Token-gated Cloudflare Web Analytics beacon in the shared document head.
- `VITE_CF_WEB_ANALYTICS_TOKEN` configuration and dashboard setup notes.
- Project-gated Microsoft Clarity tag in the shared document head for heatmaps and session recordings.
- `VITE_CLARITY_PROJECT_ID` configuration.

### Not included

- Google Analytics, funnels, advertising identifiers, or cross-site tracking.
- Cookie-consent handling: Clarity sets its own cookies, so consent remains the site owner's responsibility outside this capability.
- Analytics of private issue-report submissions.
- Cloudflare account, hostname, or dashboard provisioning.

## Setup

1. In Cloudflare dashboard, open Web Analytics and add the production hostname. Note: `*.workers.dev` hostnames cannot be registered because that zone belongs to Cloudflare; this step needs a custom domain attached to the Worker.
2. Copy the site token.
3. Set `VITE_CF_WEB_ANALYTICS_TOKEN=<token>` in the Pages/Workers production environment and rebuild.

## Clarity setup

1. In the Clarity dashboard, open the project and copy its project ID.
2. Set `VITE_CLARITY_PROJECT_ID=<project-id>` in the Pages/Workers production environment and rebuild.
3. Visit the deployed site once; sessions and heatmaps appear in Clarity within a few hours.
