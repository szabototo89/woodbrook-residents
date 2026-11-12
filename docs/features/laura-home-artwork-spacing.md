# Homepage artwork and text spacing

Status: Available

## Job to be done

As a visitor, I can read the homepage hero and mural text when the artist chooses a rectangular photograph.

## Visible behavior

The hero and mural use separate image and text columns with a gap above 640px. Artwork follows its natural proportions inside its column. At phone widths, copy comes above the image with a vertical gap. Sections with missing artwork continue to show their available text.

## Acceptance criteria

- Hero and mural artwork do not overlap text, headings or action links from 641 through 2560px.
- Both sections keep at least 24px between their desktop columns.
- At 390 and 640px, images follow the text without overlap or horizontal scrolling.
- Rectangular artwork works without relying on transparent corners.
- Existing homepage links, mural reveal motion and gallery navigation remain usable.

## Scope

The homepage hero and mural layout, responsive image size hints, and browser regression coverage. Published content and Studio schemas are unchanged.
