# Site analytics

Status: Available

## Job to be done

When the community hub is visited, I want privacy-friendly counts of visitors, page views, referrers, and devices, so I can understand reach without tracking residents personally. When residents struggle with a page, I want heatmaps and session recordings, so I can see where the page fails them.

## User-visible behavior

- Cloudflare Web Analytics needs no cookie banner; it uses no cookies or local storage. Clarity is gated behind the consent banner below.
- When `VITE_CF_WEB_ANALYTICS_TOKEN` is configured, every public page emits the Cloudflare beacon (`https://static.cloudflareinsights.com/beacon.min.js`).
- When the token is absent, no analytics script is emitted.
- Visitor counts, top pages, referrers, countries, devices, and browsers are read in the Cloudflare dashboard under Web Analytics.
- When `VITE_CLARITY_PROJECT_ID` is configured, every public page loads the Microsoft Clarity tag (`https://www.clarity.ms/tag/`), enabling heatmaps and session recordings in the Clarity dashboard.
- When the Clarity project ID is absent, no Clarity script is emitted.
- First-time visitors see a cookie consent banner explaining that optional analytics cookies are used; nothing is recorded until they choose.
- The Clarity tag loads only after a visitor accepts analytics cookies; rejecting leaves it off entirely.
- The choice is stored in a first-party consent cookie so clearing site cookies resets it, and the footer Cookie settings control clears it so the banner can be answered again.
- Analytics never collects issue-report contents or other form input.

## Acceptance criteria

- Given `VITE_CF_WEB_ANALYTICS_TOKEN` is set, when any public route is rendered, then its document head contains a deferred beacon script whose `data-cf-beacon` payload carries that token.
- Given the token is absent or blank, when a public route is rendered, then no Cloudflare beacon script is emitted.
- Given the production token is configured in Cloudflare Pages/Workers, when residents browse the deployed site, then visits appear in Cloudflare Web Analytics for that hostname.
- Given `bun run build` runs, when verification completes, then analytics does not break prerendering or client navigation.
- Given `VITE_CLARITY_PROJECT_ID` is set, when any public route is rendered, then its document head contains the Clarity tag loading `https://www.clarity.ms/tag/` for that project.
- Given the Clarity project ID is absent or blank, when a public route is rendered, then no Clarity script is emitted.
- Given a first-time visitor, when any public route is rendered, then a cookie consent banner offers Accept analytics cookies and Reject.
- Given the visitor accepts, when the choice is stored, then the banner hides and the Clarity tag loads.
- Given the visitor rejects, when the choice is stored, then the banner hides and no Clarity script is emitted.
- Given a returning visitor with a stored choice, when a public route is rendered, then no banner is shown.
- Given the visitor clears site cookies, when a public route is rendered, then the banner is shown again.
- Given the visitor activates Cookie settings in the footer, when the stored choice is cleared, then the banner is shown again.

## Scope

### Included

- Token-gated Cloudflare Web Analytics beacon in the shared document head.
- `VITE_CF_WEB_ANALYTICS_TOKEN` configuration and dashboard setup notes.
- Project-gated Microsoft Clarity tag in the shared document head for heatmaps and session recordings.
- `VITE_CLARITY_PROJECT_ID` configuration.
- Cookie consent banner gating Clarity behind explicit acceptance, with the choice stored locally and a footer Cookie settings control to revisit it.

### Not included

- Google Analytics, funnels, advertising identifiers, or cross-site tracking.
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
