# Laura services reference design

Status: Available

## Job to be done

As someone considering artwork or a creative event, I want to understand Laura’s five services, see examples, and know how to start a project.

## Visible behavior

- The services page follows the supplied design’s cream canvas, navy editorial headings, pink labels and buttons, gold painted underlines, handwritten note, and colourful painted edges.
- The hero presents the published title, introduction and paintbrush artwork beside a generated transparent gold “Art brings people together” image in three lines of loose handwriting, with a hand-drawn heart. Its alt text preserves the wording for screen readers. The repeated Creative Services introduction is omitted at the user’s request, so the hero leads directly into the offerings.
- Five linked offerings follow the hero. Desktop rows alternate artwork on the left and right. On phones, each large image precedes its complete title, description and pale pink details panel. Each option occupies its own padded bullet row, with long text wrapping inside the panel.
- Published service names, descriptions, images and contact details continue to come from Sanity. Category wording comes from the supplied reference and is associated with the five existing service slugs. Other services retain their published content without inferred categories.
- “How It Works” explains Share Your Idea, Discuss the Brief, and Create Something Special using three icons and arrows. Desktop and tablet steps sit below the centered heading, with aligned icons, titles and descriptions and arrows centered between the icons. Phone steps stack in reading order.
- Each service opens the contact page with its service query parameter. The navy contact band retains phone, email and Start a Project actions.
- The shared footer includes accessible Instagram and Facebook icons on every page. Facebook opens the profile URL supplied by the user. Instagram temporarily links to its platform homepage at the user’s request.

## Acceptance criteria

- The services page has one primary heading, no repeated Creative Services heading, five service subheadings and three process steps before the contact band.
- At the reference width of 935px and desktop width of 1440px, service artwork alternates sides and the page retains the reference’s compact proportions.
- At 700, 935 and 1440px, all process icons clear the section heading by at least 24px; icons, step titles and descriptions align across their three columns, including when titles wrap.
- At 320, 390 and 640px, descriptions remain fully visible, details use separate padded rows without vertical separators, category text wraps inside the panel, and images precede service copy.
- All five routes fit within the viewport at 320, 390, 640, 700, 900 and 1440px; shared footer social links do not introduce overflow.
- Phone body text remains at least 16px. Visible phone links and buttons have at least 44px tap areas. Navigation and service enquiry links work with the keyboard, with visible focus and reduced-motion support.
- Contact actions use published phone/email settings. The social links use accessible names; Facebook links to `https://www.facebook.com/profile.php?id=61553821975045`.
- Focused unit and browser tests, final visual inspection, and the required repository build pass.

## Scope and sources

The redesign targets `/services` in `apps/laura-faichney-web`, plus its shared social footer and a new transparent motto asset. Other page content and the Sanity schema are unchanged. Existing service and transparent hero images are reused; the handwritten motto is a new generated transparent PNG; this is a visual interpretation using the app’s illustration assets, not a pixel-identical copy of the reference’s photographs.

Design and new category/process wording: user-supplied `clipboard-2026-10-01-155524-D4C647C9.png`, accessed 2026-10-01. Placeholder social links: explicitly requested by the user on 2026-10-01. The user subsequently requested an image asset for the motto and removal of the repeated introduction on 2026-10-01. The user then supplied `codex-clipboard-lhWEFM.png` as a gold handwriting reference and requested regeneration. Image provenance and the final generation prompt remain in `apps/laura-faichney-web/ASSETS.md`.

Process alignment and phone details layout fixes: user-supplied `clipboard-2026-10-02-133110-D9C59A33.png` and `clipboard-2026-10-02-133136-6BBF4F6A.png`, accessed 2026-10-02. These changes apply to services page styling only.

Facebook profile URL: supplied by the user on 2026-10-02, `https://www.facebook.com/profile.php?id=61553821975045`. The shared footer uses this exact destination without inferring profile details.

## Verification

Unit tests cover the page hierarchy, process copy, category labels, published descriptions, unknown service slugs, contact URLs, the image motto and social placeholders. `tests/e2e/services-design.spec.ts` covers alternating desktop rows, reference proportions, aligned process content and arrows below the heading, transparent image loading, separate phone details rows, phone wrapping and keyboard enquiry navigation. `tests/e2e/responsive.spec.ts` covers full phone descriptions, all-route viewport bounds, tap areas, navigation, hero artwork and contact decorations.

Verified on 2026-10-01: all 51 Laura unit tests and 61 Laura browser tests passed after integrating the latest local main; `bun run build` passed for the whole repository, including formatting, lint and type checks. Final desktop and phone renders were visually inspected with the regenerated gold motto.

Verified on 2026-10-02: the new layout regressions failed before the CSS fix; all 51 Laura unit tests and 32 services/responsive browser tests then passed. The required repository `bun run build` passed. Process renders at 935 and 1440px and details panels at 320 and 390px were visually inspected.
