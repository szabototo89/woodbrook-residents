# Forma Studio UX and customer acquisition review

Reviewed: 2026-10-11. Scope: `apps/forma-studio-web`, homepage and journal, desktop, tablet and mobile. This is an expert review supported by browser checks, not a user study or a measured conversion experiment.

## Intended customer journey

A prospective small-business customer should quickly understand what Forma does, examine the services and a real example, compare starting packages, understand the collaboration, and contact the studio with a useful project brief.

The existing forest-green palette, local-business focus, clear logo, laptop imagery and handwritten annotation give the site a coherent identity. They are retained. The main weaknesses were information and interaction, rather than a need for a new brand.

## Findings and changes

| Priority | Finding                                                                                                      | Effect on a prospective customer                                                                               | Implemented change                                                                                                                                   |
| -------- | ------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| High     | `Work` and `See Our Work` targeted the hero photograph                                                       | The promised portfolio exploration returned visitors to an image without project context or a live destination | A dedicated selected-work section shows Laura Faichney's actual website, its capabilities and a live link                                            |
| High     | All five service “Learn more” links targeted packages                                                        | Visitors could not learn what an individual service includes                                                   | Native expandable details list proposed deliverables for each service                                                                                |
| High     | The enquiry address was a reserved `.example` placeholder                                                    | Enquiries could not reach the studio                                                                           | The user-approved `szabototo89@gmail.com` address is visible and linked; the email action includes a subject and short editable project brief        |
| High     | A fictional owner, testimonial and five stars supplied social proof                                          | A small illustrative label still required visitors to distinguish fabricated praise from evidence              | The testimonial is removed and replaced with practical preparation guidance; the work example supplies inspectable evidence                          |
| Medium   | Packages had prices but no next step                                                                         | Interested visitors had to find another route to contact                                                       | Each package has a named discussion link to contact                                                                                                  |
| Medium   | “Most Popular” and “No hidden fees” lacked supporting evidence                                               | Draft marketing copy sounded like established customer behavior and settled commercial terms                   | The highlighted plan is described factually as “Website + local SEO”; starting prices are qualified by a final scope, hosting and ongoing-cost quote |
| Medium   | Process copy omitted review, handover and customer input                                                     | Visitors could not judge what collaboration would involve                                                      | Three stages explain planning, design/review and launch/handover; a preparation panel explains what to bring                                         |
| Medium   | `About` described a process, and “View all FAQs” linked back to the same FAQ block                           | Navigation labels promised different information                                                               | Navigation says “How we work”; the redundant FAQ self-link is removed                                                                                |
| Medium   | Tablet copy shrank to 11–13px, five service columns were cramped, and the mobile menu control was below 44px | Scanning and touch interaction were unnecessarily difficult                                                    | Larger copy, balanced service cards, more breathing room, one-column mobile services and a 44px menu control                                         |
| Medium   | Mobile menu lacked Escape dismissal and focus return                                                         | Keyboard users had an incomplete dismissal path                                                                | Escape closes the menu and returns focus to its button                                                                                               |
| Low      | Responsive removal of a line break joined “package” and “that”                                               | Mobile heading visibly read “packagethat”                                                                      | Explicit spacing, protected by a browser regression check                                                                                            |

## Research and design decisions

All research links below were accessed on 2026-10-11.

- [Webflow: 8 web design trends to watch in 2026](https://webflow.com/blog/web-design-trends-2026): proprietary visual language, handmade detail, concise copy and structured overviews are relevant to this site. Preserve the handwritten accent and brand palette; make the opening proposition shorter and let visitors choose which service details to expand. This trend report is direction, not evidence of conversion uplift. Extra animation, infinite canvases and scroll effects would not answer the identified purchasing questions.
- [Nielsen Norman Group: B2B vs. B2C Websites](https://www.nngroup.com/articles/b2b-vs-b2c/): service purchasing requires useful details, realistic pricing and concrete examples. The work section, deliverables and qualified starting prices apply that research to a small-business studio. This established research remains useful alongside the current trend report.
- [W3C: Target Size (Minimum), WCAG 2.2](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html): the AA criterion specifies a 24 CSS-pixel minimum with exceptions. The main controls use 44–48px as a more comfortable design choice; 44px is not being presented as the AA minimum.
- [W3C: Focus Not Obscured (Minimum)](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html): preserve visible focus and avoid introducing a fixed overlay that hides controls. The existing skip link and reduced-motion preference remain supported; the menu now has keyboard dismissal.
- [Google: Web Vitals](https://web.dev/articles/vitals): assess performance with LCP, INP and CLS in real use. Local Lighthouse is used as a regression check; its lab results do not establish field Core Web Vitals or customer outcomes.

Project evidence: [Laura Faichney · All Things Art](https://laura-faichney-all-things-art.pages.dev), accessed and captured with Playwright on 2026-10-11. The portfolio asset is a capture of the real homepage hero, excluding the adjacent temporary announcement. Capability descriptions are supported by the live site and the existing Laura application. No sales, traffic, testimonial or customer-result claims were added. The existing hero café image remains visibly identified as an illustrative mockup.

## Remaining business decisions and measurement

- Existing GBP starting prices and package scope remain draft commercial content inherited from the reference. Confirm currency, tax treatment, recurring costs and actual service commitments before launch; no new commercial amounts were invented.
- Add a factual founder/team introduction when approved information is available. This review does not invent biographies, location, credentials or years of experience.
- Add more genuine projects and approved client quotes as they become available. A single real example is a useful starting point, not proof of results for every customer segment.
- Email is a working destination but relies on a configured email app. The visible address can be copied if the action does not open an app. No message is sent automatically and no enquiry database or contact form backend was added.
- No analytics baseline or visitor research was supplied. After deployment, measure qualified enquiries against visits and review where customers leave the services → work → packages → contact journey. A mail link click is intent, not proof of an enquiry. Qualify actual received enquiries and test further changes against that baseline; no uplift is promised.
- Changes are implemented and merged locally. Publishing the site is a separate action.

## Verification

Tests were observed failing before implementation for the new work section, service disclosures, enquiry destination, package actions, keyboard dismissal, tablet readability and visible mobile heading spacing. Component tests assert accessible names, destinations, disclosure state and editable email content. Browser tests check prerendering, hydration, image loading, responsive overflow, real section navigation, touch sizes and visible copy. Desktop and mobile captures are inspected visually.

Final command results and local Lighthouse scores are recorded in [the capability document](../features/forma-studio-customer-journey.md).
