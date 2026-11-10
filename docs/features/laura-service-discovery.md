# Laura painting and mural discovery

Status: In progress

## Job to be done

When I want a painting or mural, I can understand Laura's offer, browse her work and start an enquiry for the relevant service.

## Visible behavior

The original homepage introduction, Services heading and Gallery heading focus on paintings and murals. Page titles and descriptions match that focus. Homepage service cards land on the corresponding service; the mural action preselects murals on the contact form. The gallery links to the services hub. Contact invites painting and mural enquiries while keeping all service choices available.

The build revises only known original CMS wording or empty metadata. Custom editorial text stays authoritative. It reads published content without changing Sanity documents. The contact introduction remains application-owned, as before.

## Acceptance criteria

- The homepage, Services, Gallery and Contact metadata describe painting and mural discovery without adding an unconfirmed location.
- Homepage service cards link to matching anchors on the existing Services page.
- Painting and mural enquiry links select the corresponding form service.
- All five published service offers remain accessible.
- Gallery collection names, URLs and artwork remain unchanged.
- Custom CMS copy survives the build; visitors make no Sanity content requests.
- The pages remain usable at 320px, mobile and desktop widths, including JavaScript-free metadata.

## Scope

Included: approved existing-page copy, related internal links, tests, preview and review evidence for [the keyword/page plan](https://github.com/szabototo89/woodbrook-residents/issues/33#issuecomment-6744385006).

Deferred: separate service pages until original project detail is available; location targeting until coverage is confirmed; original-painting sales decisions; URL normalisation and real 404 work; structured data; private Search Console exports and the later 28-day comparison. Face painting is outside this SEO phase. Existing offers are not removed. No production deployment or main merge is part of this delivery.
