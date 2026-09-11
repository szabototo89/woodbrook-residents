# Local highlights

Status: Available

## Job to be done

When locally relevant information needs attention, I want to see its useful
facts before searching the full directory, so I can act without first opening
several listings.

## User-visible behavior

- A compact “Good to know locally” strip appears below the Local information
  introduction and above its search and filters when an eligible resource is
  featured.
- The Thorntons schedule shows its next recycling and waste/compost dates, a
  route-applicability qualification, and a link to the full schedule.
- The strip remains separate from search results, so filtering the directory
  does not make an editorial highlight look like a matching result.
- Resources without collection dates can use the same treatment with their
  description and up to two card-visible details.
- Expired collection schedules and unfeatured resources do not appear.

## Acceptance criteria

- Given the published Thorntons schedule is featured and has future dates,
  when Local information opens, then the strip appears before the directory
  tools and visibly labels both next collection dates.
- Given a highlight links to a resource, when its action is followed, then the
  resident reaches that resource’s detail page.
- Given a featured schedule has no remaining dates, when Local information
  opens, then it is omitted from the strip.
- Given a featured non-schedule resource is published, when Local information
  opens, then the generic strip can show its description and card-visible
  details without waste-specific copy.
- Given no eligible resource is featured, when Local information opens, then
  no empty highlights section is rendered.

## Scope

### Included

- A reusable resource-highlight model and responsive presentation.
- Editorial selection through the canonical resource `featured` field in
  Google Sheets and Strapi.
- Up to three eligible local highlights, preserving directory order.

### Not included

- Alerts, notifications, paid placement, personalization, or automatic
  relevance scoring.
- Highlighting unpublished records or changing directory filter results.
