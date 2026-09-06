# Woodbrook visual system

## Audit of the first version

The first design was too close to its Taylor Hill reference: warm cream and dark green, Georgia display type, an italic hero phrase, rounded image mosaics, pill labels, and softly elevated cards. Those choices suited a residential development brochure but made the community hub feel more like property marketing than resident infrastructure.

## Direction: the Woodbrook community board

The new system is **modern civic + neighbourhood + slightly editorial**. It treats the site as a shared community board: useful enough to trust, warm enough to feel resident-owned, and composed with enough editorial character to make local information inviting.

The DART, coast, and green edge around Shankill inform small details, but none of them defines the product. Woodbrook station is one transport topic among housing, parks, events, services, consultations, and resident concerns.

It should feel:

- useful before promotional;
- local without relying on shamrock or heritage clichés;
- optimistic without looking like a property sales site;
- structured like a community noticeboard and local field guide;
- recognisable through locally rooted colour fields, plain-language actions, strong rules, and a mix of civic and editorial typography.

## Research translated into decisions

Woodbrook is not styled as a government service. Public-sector references are retained only as an accessibility and plain-language baseline; they do not determine its visual language.

- [Decidim](https://docs.decidim.org/en/develop/features/general-description.html) structures participation around meetings, surveys, proposals, information, and accountability. Woodbrook similarly treats components as ways residents can know, join, shape, or raise something—not as administrative departments.
- [Material 3's colour hierarchy](https://developer.android.com/codelabs/m3-design-theming) recommends calm surface roles for the majority of containers and stronger accent roles only for the most important actions. Cards therefore use tonal separation, quiet outlines, and soft depth; saturated teal and gorse are reserved for navigation, focus, and primary calls to action.
- The [Braille Institute](https://www.brailleinstitute.org/freefont/) designed Atkinson Hyperlegible Next to make characters easier to distinguish for readers with low vision. It is the main interface family, using weight and scale for confident but friendly hierarchy.
- The [Center for Civic Design](https://civicdesign.org/fieldguides/creating-accessible-online-information/) remains an accessibility check: headings, contrast, keyboard use, and small-screen testing. It is not a visual template.
- [Newsreader](https://productiontype.com/font/newsreader) was designed specifically for longer-form on-screen reading. It adds a quiet local-editorial register to introductions and articles.
- Woodbrook's visual identity comes from Atlantic teal, sea-glass, Wicklow fern, heather, and gorse—not national-government branding or generic lifestyle imagery.

## Palette

| Token        | Value     | Local reference           | Use                                   |
| ------------ | --------- | ------------------------- | ------------------------------------- |
| Ink          | `#20372F` | wet evergreen             | Primary text                          |
| Atlantic     | `#145E63` | Irish Sea off Shankill    | Header, controls, high-emphasis areas |
| Tide         | `#3F8F8A` | shallow coastal water     | Links and secondary emphasis          |
| Sea-glass    | `#DCEEE9` | pale water and sea mist   | Hero, quiet cards, section fields     |
| Wicklow fern | `#285F47` | wooded mountain foothills | Page introductions and active states  |
| Meadow       | `#A9CBB7` | new leaves and open green | Confirmed states and quiet accents    |
| Gorse        | `#F2CB57` | coastal gorse             | Focus, active path, optimistic accent |
| Heather      | `#765779` | Wicklow upland heather    | Important actions and editorial marks |
| Granite      | `#C8D3CE` | rain-softened stone       | Rules, borders, and shadows           |
| Cloud        | `#F3F7F4` | bright overcast sky       | Main page background                  |

The palette is led by sea and vegetation rather than beige neutrals. Atlantic teal supplies civic trust, Wicklow fern gives it a grounded natural register, and heather plus gorse keep the cooler colours lively and neighbourly. Every semantic colour is paired with text, an icon, or both.

## Typography

- **Atkinson Hyperlegible Next Variable** for headings, body text, controls, and navigation.
- **Newsreader Variable** only for introductions and long-form article text, adding a restrained editorial voice where reading benefits from it.
- Heavy, compact sentence-case sans headings replace the previous luxury-property serif treatment.
- System monospace is reserved for dates, small labels, and source metadata without reducing body readability.
- Body copy is limited to roughly 65 characters per line wherever sustained reading occurs.

## Shape and composition

- Twelve-pixel cards and tonal surface shifts feel friendly without returning to the oversized soft cards of the first version.
- A typographic welcome and live task board anchor the hero. Local photography supports the content it documents instead of defining the whole identity.
- The first screen leads with four resident jobs: stay informed, meet and join in, shape the area, and raise a concern. A broad sea-glass field and Atlantic/fern pairing locate the hub between coast and mountains without becoming a tourism motif.
- Cards work as calm editorial notices with visible dates, stages, and source actions. Hairline outlines and tonal surfaces separate them; hard black frames and offset block shadows are avoided.
- Subpages use a pale sea-and-fern field with a quiet `LOCAL` marker, creating continuity without the institutional feel of a dark government masthead.

## Accessibility invariants

- Visible focus uses gorse yellow with dark separation.
- Minimum control height is 44 pixels.
- Interactive elements are identified by shape, text, and contrast — never colour alone.
- Motion is subtle and disabled under `prefers-reduced-motion`.
- Headings stay in logical document order and paragraph measures remain readable at 200% zoom.
