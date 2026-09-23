import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { StudioSections } from './StudioSections';

test('uses the bundled studio photo when Wix supplies a blank image URL', () => {
  const markup = renderToStaticMarkup(<StudioSections studioImageUrl=" " />);
  const imageSource = markup.match(/<img[^>]+src="([^"]+)"/)?.[1];

  expect(imageSource).toMatch(/^data:image\/jpeg;base64,/);
});

test('honours a configured studio photo URL', () => {
  const markup = renderToStaticMarkup(
    <StudioSections studioImageUrl="https://example.com/studio.jpg" />,
  );

  expect(markup).toContain('src="https://example.com/studio.jpg"');
});
