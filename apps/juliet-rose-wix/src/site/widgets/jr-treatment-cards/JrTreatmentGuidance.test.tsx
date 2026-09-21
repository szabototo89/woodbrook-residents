import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { JrTreatmentGuidance } from './JrTreatmentGuidance';

test('jr-treatment-guidance links to the contact section by default', () => {
  const view = renderUi(<JrTreatmentGuidance />);

  expect(view.container.textContent).toContain('Not sure what to choose?');
  expect(view.container.textContent).toContain(
    'Get in touch and we’ll be happy to recommend the perfect treatment for you.',
  );
  expect(
    view.container.querySelector('a[href="/#contact"]')?.textContent,
  ).toContain('Contact us');
  view.unmount();
});

test('jr-treatment-guidance honours a custom contact url', () => {
  const view = renderUi(<JrTreatmentGuidance contactUrl="/custom-contact" />);

  expect(
    view.container.querySelector('a[href="/custom-contact"]'),
  ).not.toBeNull();
  view.unmount();
});
