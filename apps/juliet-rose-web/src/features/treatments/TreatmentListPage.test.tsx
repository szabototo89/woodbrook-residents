import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { TreatmentListPage } from './TreatmentListPage';

test('shows the sourced treatment catalog with internal booking links', () => {
  const markup = renderToStaticMarkup(<TreatmentListPage />);

  expect(markup).toContain('Treatments &amp; prices');
  expect(markup).toContain('Relax &amp; unwind');
  expect(markup).toContain('Natural radiance');
  expect(markup).toContain('A more confident you');
  expect(markup).toContain('Luxurious Espa massage');
  expect(markup).toContain('€100');
  expect(markup).toContain('Juliet Rose Signature Facial');
  expect(markup).toContain('Release tension. Restore balance.');
  expect(markup).toContain('Healthy skin. A brighter you.');
  expect(markup).toContain('Beauty essentials');
  expect(markup).toContain('Little luxuries. Everyday confidence.');
  expect(markup).toContain('Touch of Tranquility');
  expect(markup).toContain('Curated experiences for total wellbeing.');
  expect(markup).toContain('/book?service=swedish-massage');
  expect(markup).toContain('Not sure what to choose?');
  expect(markup).toContain('href="/#contact"');
  expect(markup).toContain('lucide-leaf');
  expect(markup).toContain('lucide-heart');
  expect(markup).toContain('lucide-flower-2');
  expect(markup).toContain('lucide-gift');
  expect(markup).toContain('Information checked 19 September 2026');
});
