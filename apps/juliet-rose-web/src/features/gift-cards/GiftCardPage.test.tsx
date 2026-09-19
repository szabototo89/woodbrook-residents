import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { GiftCardPage } from './GiftCardPage';

test('presents the gift-card purchase path and its checkout handoff', () => {
  const markup = renderToStaticMarkup(<GiftCardPage />);

  expect(markup).toContain('Give the gift of time to unwind');
  expect(markup).toContain('Choose an amount that feels right');
  expect(markup).toContain('Use it towards any Juliet Rose treatment');
  expect(markup).toContain('href="https://www.julietrosebeauty.com/gift-card"');
  expect(markup).toContain('Continue to gift card checkout');
  expect(markup).toContain(
    'alt="A Juliet Rose gift card surrounded by soft florals"',
  );
});
