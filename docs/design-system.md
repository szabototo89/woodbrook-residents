# Woodbrook visual system

## Audit of the first version

The first design was too close to its Taylor Hill reference: warm cream and dark green, Georgia display type, an italic hero phrase, rounded image mosaics, pill labels, and softly elevated cards. Those choices suited a residential development brochure but made the community hub feel more like property marketing than resident infrastructure.

## Direction: Woodbrook Lines

The new system treats the site as **coastal civic wayfinding**: a calm, highly legible public-information surface shaped by Woodbrook's three strongest local signals — the DART line, the Irish Sea, and the green edge around Shankill.

It should feel:

- useful before promotional;
- local without relying on shamrock or heritage clichés;
- optimistic without looking like a property sales site;
- structured like a station sign, community noticeboard, and local field guide;
- recognisable through lines, numbered actions, coordinates, and strong colour blocks.

## Research translated into decisions

- The [Government of Ireland Design System principles](https://ds.services.gov.ie/get-started/principles/) prioritise citizen needs, accessibility, consistency, and transparency. The interface therefore puts the next action and source freshness ahead of decoration.
- Its [typography guidance](https://ds.services.gov.ie/foundations/guidelines/typography/) recommends a responsive hierarchy, restrained secondary text, and 50–75 character reading measures. Woodbrook follows those constraints while using a distinct type family.
- The [Braille Institute](https://www.brailleinstitute.org/freefont/) designed Atkinson Hyperlegible Next to make characters easier to distinguish for readers with low vision. It becomes the sole interface family, using weight and scale instead of a decorative serif pairing.
- [Fáilte Ireland's wayfinding guidance](https://meetings.southdublin.ie/Home/ViewReply/67300) favours uncomplicated sans-serif letterforms, generous lowercase forms, and sentence case. Navigation and headings follow that public-space language.
- The [Center for Civic Design](https://civicdesign.org/fieldguides/creating-accessible-online-information/) stresses prominent information, headings, contrast, keyboard use, and small-screen testing. Cards remain fully labelled and status never depends on colour alone.
- Contemporary placemaking work warns against interchangeable civic branding. Woodbrook's system uses its own sea, rail, gorse, granite, and hedgerow references instead of a generic government or lifestyle palette.

## Palette

| Token | Value | Local reference | Use |
| --- | --- | --- | --- |
| Ink | `#102A2E` | wet evergreen | Primary text |
| Deep sea | `#123B5A` | Dublin Bay depth | Header, footer, high-emphasis fields |
| Tide | `#2C7484` | near-shore water | Links and secondary emphasis |
| Sea glass | `#D9EEF0` | water under cloud | Page fields and quiet surfaces |
| Gorse | `#F3C64E` | coastal gorse | Focus, active path, optimistic accent |
| Signal | `#E45B3E` | rail and civic warning | Urgent action and small highlights |
| Hedgerow | `#26604E` | Shankill green edge | Confirmed and active states |
| Granite | `#D5DAD5` | local stone and overcast sky | Rules and borders |
| Chalk | `#F7F8F4` | bright neutral daylight | Main page background |

The palette is deliberately blue-led rather than green-led. Every semantic colour is paired with text, an icon, or both.

## Typography

- **Atkinson Hyperlegible Next Variable** for headings, body text, controls, and navigation.
- Heavy, compact sentence-case headings replace the previous editorial serif and italics.
- System monospace is reserved for dates, location codes, step numbers, and source metadata, echoing transport and map notation without reducing body readability.
- Body copy is limited to roughly 65 characters per line wherever sustained reading occurs.

## Shape and composition

- Four-pixel corners and straight rules replace soft 22–30 pixel cards.
- A single documentary image anchors the hero; secondary images become a narrow local strip rather than a property-style mosaic.
- The three resident tasks form a line diagram with numbered stops: **Inform → Organise → Act**.
- Cards work as indexed notices with visible dates, stages, and source actions.
- Subpages use a blue civic field and a route-code marker, creating continuity without repeating the home hero.

## Accessibility invariants

- Visible focus uses gorse yellow with dark separation.
- Minimum control height is 44 pixels.
- Interactive elements are identified by shape, text, and contrast — never colour alone.
- Motion is subtle and disabled under `prefers-reduced-motion`.
- Headings stay in logical document order and paragraph measures remain readable at 200% zoom.
