# Laura artwork availability

Status: Available

## Job to be done

When I browse a picture in Laura's gallery, I want to know whether it is for sale so I can decide whether to enquire about buying it.

## Implementation goal

Add a small, accessible availability indicator to each picture in `apps/laura-faichney-web`, using the existing cream, navy and pink design. Keep the artwork unobstructed and its browsing frame stable. Add an optional sale-availability field to the existing `galleryItem` in Laura's independent Sanity Studio, carry published values through the home and gallery queries, and display a badge only when Laura chooses a sale status; provide an explicit None choice to hide it. Verify behavior with failing tests before implementation, keyboard and thumbnail navigation, mobile and desktop layout review, Studio tests, typechecking, lint and production builds. Merge the verified implementation into local main and clean up its session worktree.

## Visible behavior

- Each collection picture with a selected sale status shows a small badge below the selected image and beneath its thumbnail when the collection has multiple pictures. Single-picture collections retain their selected-image badge without a duplicate thumbnail chooser.
- **For sale** uses the site's soft pink background and dark pink text; **Not for sale** uses a neutral cream background and slate text.
- **None**, missing, null or unrecognised status hides the badge on the selected image and thumbnail. No empty caption or availability text is added to the thumbnail name. Existing content is never automatically marked for sale or not for sale.
- The selected badge follows previous/next buttons, thumbnail selection and keyboard activation. Screen readers receive a polite status announcement when the label changes; each thumbnail's accessible name includes its availability.
- Laura edits **Sale availability** on each gallery item in `apps/laura-studio`, choosing **None**, **For sale** or **Not for sale** and publishing it through the existing content workflow. The field is optional and has no default sale claim. None lets Laura hide a previously selected badge.

## Acceptance criteria

- Both supported published statuses render their exact labels on the selected picture and corresponding thumbnail.
- None and unset status show no badge. Null and unrecognised values load safely and show no badge.
- Home and gallery loaders request and preserve each picture's sale status; older documents still load successfully.
- Selecting a different picture updates the status without changing the collection URL, losing keyboard focus or covering the artwork.
- Single-picture collections show at most one availability badge without a redundant thumbnail chooser. The existing collection introduction remains beside the picture at desktop widths and above it on smaller screens.
- At 320px and 1440px the badges remain readable and contained, with no horizontal scrolling; portrait and landscape browsing retains a stable image frame.
- Laura web and Studio tests pass, including a browser test that exercises every status without changing published CMS content; typechecks, lint and `bun run build` pass.

## Scope

Collection-picture browsing in the Laura web app, the existing Laura Studio gallery-item schema, content loading, tests and feature documentation. Collection covers represent a group of pictures and do not claim a group sale status. This capability does not add prices, checkout, reservations, sale filters or CMS content migrations. Published artwork availability is entered by Laura; no real artwork status is seeded or inferred. The updated schema and Laura Studio are deployed to the existing Sanity project and Studio. Public website deployment is outside this change.

## Verification

Verified on 2026-10-01: 48 Laura web unit tests, 19 Studio tests (100% schema coverage), mobile and desktop browser checks for thumbnail/keyboard navigation through For sale, Not for sale, None, null and unset statuses, collection layout and single-picture behavior, repository lint/typechecks, and `bun run build` passed. The 320px screenshot was reviewed; hidden statuses have no badge or empty caption, while explicit sale badges remain readable.

The updated schema and Studio were deployed successfully to Laura's existing Sanity production project (`uag6kepo`) at https://laura-faichney-all-things-art.sanity.studio/. No artwork documents were edited. The public website requires its usual separate deployment to show this revision.

Gallery browser fixtures keep navigation, motion and availability scenarios independent of editorial changes without altering CMS content.
