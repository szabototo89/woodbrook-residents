# Mobile website presentation

Status: In progress

## Job to be done

When I open Woodbrook Residents in the native app or mobile browser renderer,
I want the website's identity and clear information hierarchy so I can recognise
the product and find news, local information and ways to take part.

## Visible behavior

- The website logo, coastal introduction, paper/forest palette and serif headings
  appear in both mobile renderers.
- Shortcuts lead to source-linked news, events, local information and More.
- News and other records use text-led layouts when no editorial image is supplied.
  Event cards show dates; services use consistent bundled line icons.
- The native header reads the host's safe-area top inset so its brand and action
  sit below the status bar and Dynamic Island, including compact detail headers.
- Existing tabs, back navigation, filters, freshness notes and official actions
  retain their destinations and outcomes.

## Acceptance criteria

- Home, collections, events, local information, long details, More and Ways to help
  follow the recorded website reference at commit `d06366c`.
- Both mobile renderers use the same shared presentation components and styles.
- At 320px and 390px, text remains readable and the fixed tabs remain accessible.
- Native iOS review proves line icons render and header controls clear the system
  status area; a zero host inset adds no extra allowance.
- Chromium and WebKit checks cover navigation and long-detail source scrolling.

## Scope

Presentation, shared chrome, bundled line artwork and a native header inset fix.
Georgia is the native equivalent of the website's Newsreader heading font.
Existing content selection, orientation behavior, search/accounts/contribution
capabilities and editorial imagery contracts remain owned by their functional
issues. The existing title-case Health quick filter does not match lowercase
published categories; All still restores the full directory.
