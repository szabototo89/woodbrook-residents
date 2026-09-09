# Issue reporting

Status: Removed

## Job to be done

Issue reporting was removed so the public hub can be deployed without a runtime backend.

## User-visible behavior

- The site does not display an issue-report form.
- Navigation and calls to action do not link to an issue-report route.
- The Ways to help page explicitly says that Woodbrook Residents does not accept issue reports.

## Acceptance criteria

- Given a resident browses the public site, when they use the header, footer, home page, or involvement page, then no issue-report action is offered.
- Given a resident opens Ways to help, when they read the contribution status, then they are not led to expect that an issue can be submitted through the site.
- Given a static deployment is published, when it is inspected, then it contains no issue-report submission code or runtime endpoint.

## Scope

### Included

- Removal of the resident-facing form, route, and navigation links.

### Not included

- Issue submission, triage, notifications, maps, or integrations with external reporting systems.
