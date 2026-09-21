import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { PREVIEW_TREATMENTS } from './treatments';
import { TreatmentCatalog } from './TreatmentCatalog';

test('jr-treatment-catalog renders one anchored section per category with counts', () => {
  const view = renderUi(<TreatmentCatalog treatments={PREVIEW_TREATMENTS} />);

  const massage = view.container.querySelector('section[id="massage"]');
  expect(massage?.textContent).toContain('Massage');
  expect(massage?.textContent).toContain('Release tension. Restore balance.');
  expect(massage?.textContent).toContain('2 treatments');
  expect(
    view.container.querySelector('section[id="facials-and-skin"]'),
  ).not.toBeNull();
  expect(
    view.container.querySelector('section[id="beauty-essentials"]'),
  ).not.toBeNull();
  expect(view.container.querySelector('section[id="packages"]')).not.toBeNull();
  view.unmount();
});

test('jr-treatment-catalog renders treatment rows with duration, price, and booking links', () => {
  const view = renderUi(<TreatmentCatalog treatments={PREVIEW_TREATMENTS} />);

  expect(view.container.textContent).toContain('Swedish massage');
  expect(view.container.textContent).toContain('1 hr');
  expect(view.container.textContent).toContain('€80');
  const bookLink = view.container.querySelector(
    'a[aria-label="Book Swedish massage"]',
  );
  expect(bookLink?.getAttribute('href')).toBe('/book?service=swedish-massage');
  expect(bookLink?.textContent).toBe('Book');
  view.unmount();
});

test('jr-treatment-catalog skips categories without treatments', () => {
  const view = renderUi(
    <TreatmentCatalog treatments={PREVIEW_TREATMENTS.slice(0, 2)} />,
  );

  expect(view.container.querySelector('section[id="massage"]')).not.toBeNull();
  expect(
    view.container.querySelector('section[id="facials-and-skin"]'),
  ).toBeNull();
  view.unmount();
});
