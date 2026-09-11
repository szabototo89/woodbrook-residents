# Build-time content sources

Status: Available

## Job to be done

When maintaining the public website, I want to choose either the Woodbrook Google spreadsheet or Strapi as its content source, so the site can remain inexpensive and fully static now without preventing a future CMS deployment.

## User-visible behavior

- Residents see the same pages and content model regardless of which source supplied the build.
- Only rows explicitly marked for publishing in Google Sheets appear on the public site.
- Published content changes become visible after the next successful static build and deployment.
- Invalid content stops the build instead of publishing a partial or misleading site.
- Invalid content is reported before prerendering with the source validation message, including the affected spreadsheet tab, row, and field when available.
- The deployed site never contacts Google Sheets, Strapi, or a runtime application backend.

## Acceptance criteria

- Given `CONTENT_SOURCE=strapi`, when the site loads content, then it reads all public editorial collections from the configured Strapi URL into one validated snapshot.
- Given `CONTENT_SOURCE=google-sheets`, when the static build runs with read-only service-account credentials, then it reads the configured spreadsheet tabs in one batch and maps published rows into the canonical content model.
- Given a Google Sheets row has `publish != TRUE`, when content is loaded, then the row is ignored and its private `admin_notes` value is never included in the snapshot.
- Given a published row has an invalid required field, taxonomy value, date, URL, or relation, when content is loaded, then the error identifies the tab, row, and field and the static build fails.
- Given build-time content is invalid, when the static build runs, then it reports the actionable source error before starting Vite prerendering.
- Given published records contain duplicate stable IDs or route slugs, when the snapshot is validated, then the build fails.
- Given the prerenderer requests content for multiple routes, when one static build is running, then the validated snapshot is loaded only once.
- Given the built client artifact is inspected, then it contains no service-account credentials or runtime content-source endpoint.

## Scope

### Included

- Read-only Strapi and Google Sheets adapters, source selection, normalization, validation, build-time caching, service-account configuration, tests, and deployment guidance.
- Structured local-information collection schedules and supporting document
  links stored in the Google spreadsheet.

### Not included

- Editing the spreadsheet, synchronizing one source into the other, runtime content reads, media mirroring, issue-report writes, or a public CMS API.
