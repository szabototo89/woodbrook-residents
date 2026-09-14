# Mobile iOS and web renderers

Status: Available

## Job to be done

When I use the Woodbrook mobile experience on an iPhone or in a browser, I want
the same focused resident app and current content, so the experience stays
consistent without maintaining two product implementations.

## User-visible behavior

- The mobile application renders natively through Lynx on iOS and through Lynx
  for Web in Chrome or Safari.
- Both renderers use the same ReactLynx components, navigation, styles, and
  runtime content client under `apps/mobile/src`.
- The browser renderer fills its host page and preserves the mobile app's
  existing home, collection, detail, filtering, loading, and retry behavior.
- Content is requested from the configured public `/api/mobile-content` endpoint
  when the application runs; it is not embedded during either build.

## Acceptance criteria

- Given the mobile development command is running, when a developer opens Lynx
  Explorer or the browser host, then each renderer loads its platform-specific
  bundle from the same application source.
- Given a current public content response, when either renderer launches and a
  resident navigates to a collection and record, then the same visible content
  and navigation outcome appear.
- Given a production build, when artifacts are inspected, then the native Lynx
  bundle is under `dist/ios` and the self-contained browser host is under
  `dist/web` with its web-target Lynx bundle on the same origin.
- Given quality checks run, when they complete, then strict TypeScript and
  Prettier pass, unit coverage remains at least 90% for statements, branches,
  functions, and lines, Chromium and WebKit browser tests pass, and the complete
  repository build succeeds.

## Scope

### Included

- iOS Lynx and browser renderers owned entirely by `apps/mobile`.
- Separate Bun commands for native, web, and combined development and builds.
- A minimal accessible browser host and same-origin production artifacts.
- Chrome 92+ and Safari 16.4+ build targets with Chromium and WebKit integration
  verification.

### Not included

- Changes to the `apps/web` website or duplication of its route implementation.
- New resident-facing capabilities, content types, or navigation destinations.
- Android packaging, accounts, submissions, comments, chat, forums, marketplace
  listings, or social feeds.
