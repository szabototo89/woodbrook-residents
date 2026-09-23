import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { CATEGORY_CARDS } from '../../treatments/treatments';
import { CategoryGrid } from './CategoryGrid';

test('category pictures are embedded for Wix Studio', () => {
  const markup = renderToStaticMarkup(<CategoryGrid cards={CATEGORY_CARDS} />);
  const sources = [...markup.matchAll(/<img[^>]+src="([^"]+)"/g)].map(
    ([, source]) => source,
  );

  expect(sources).toHaveLength(4);
  expect(
    sources.every((source) => source?.startsWith('data:image/jpeg;base64,')),
  ).toBe(true);
});
