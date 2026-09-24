import { expect, test } from 'vitest';

import { applyPanelDefaults } from './usePanelProps';

test('applyPanelDefaults keeps explicit widget props over collection defaults', () => {
  expect(
    applyPanelDefaults(
      { 'phone-href': 'tel:+111', 'phone-label': '' },
      { 'phone-href': 'tel:+222', 'phone-label': '+222' },
    ),
  ).toEqual({ 'phone-href': 'tel:+111', 'phone-label': '+222' });
});

test('applyPanelDefaults falls back to empty string without defaults', () => {
  expect(applyPanelDefaults({ title: '  ' }, {})).toEqual({ title: '' });
});
