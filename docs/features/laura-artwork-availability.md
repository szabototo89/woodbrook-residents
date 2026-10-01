# Laura artwork availability

Status: Available

## Job to be done

When I browse a picture in Laura's gallery, I want to know whether it is for sale so I can decide whether to enquire about buying it.

## Implementation goal

Add a small, accessible availability indicator to each picture in `apps/laura-faichney-web`, using the existing cream, navy and pink design. Keep the artwork unobstructed and its browsing frame stable. Add an optional sale-availability field to the existing `galleryItem` in Laura's independent Sanity Studio, carry published values through the home and gallery queries, and show an honest enquiry label when availability has not been confirmed. Verify behavior with failing tests before implementation, keyboard and thumbnail navigation, mobile and desktop layout review, Studio tests, typechecking, lint and production builds. Merge the verified implementation into local main and clean up its session worktree.

## Visible behavior

- Each collection picture shows a small badge below the selected image and beneath its thumbnail.
- **For sale** uses the site's soft pink background and dark pink text; **Not for sale** uses a neutral cream background and slate text.
- Pictures with missing, null or unrecognised status show **Enquire for availability**. Existing content is never automatically marked for sale or not for sale.
- The selected badge follows previous/next buttons, thumbnail selection and keyboard activation. Screen readers receive a polite status announcement when the label changes; each thumbnail's accessible name includes its availability.
- Laura edits **Sale availability** on each gallery item in `apps/laura-studio`, choosing **For sale** or **Not for sale** and publishing it through the existing content workflow. The field has no default sale claim.

## Acceptance criteria

- Both supported published statuses render their exact labels on the selected picture and corresponding thumbnail.
- Unconfirmed status displays the enquiry label and never implies a sale state.
- Home and gallery loaders request and preserve each picture's sale status; older documents still load successfully.
- Selecting a different picture updates the status without changing the collection URL, losing keyboard focus or covering the artwork.
- At 320px and 1440px the badges remain readable and contained, with no horizontal scrolling; portrait and landscape browsing retains a stable image frame.
- Laura web and Studio tests pass, including a browser test that exercises every status without changing published CMS content; typechecks, lint and `bun run build` pass.

## Scope

Collection-picture browsing in the Laura web app, the existing Laura Studio gallery-item schema, content loading, tests and feature documentation. Collection covers represent a group of pictures and do not claim a group sale status. This capability does not add prices, checkout, reservations, sale filters or CMS content migrations. Published artwork availability is entered by Laura; no real artwork status is seeded or inferred. Deployment is outside this implementation.

## Verification

Verified on 2026-10-01: 43 Laura web unit tests, 19 Studio tests (100% schema coverage), all 48 Laura browser tests, repository-wide lint, typechecks and tests, `bun run build`, and the Laura Studio build passed. The production static build verified 9 HTML files and every internal link; availability badges rendered on all four published collection pages. Phone and desktop screenshots were reviewed, with explicit portrait/landscape frame checks at 390px.

Gallery browser fixtures keep navigation, motion and availability scenarios independent of editorial changes without altering CMS content. The production static export was checked separately against published Sanity content without those fixtures.
