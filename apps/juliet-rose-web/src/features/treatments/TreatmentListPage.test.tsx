import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import { TreatmentListPage } from './TreatmentListPage';

test('shows the sourced treatment catalog with internal booking links', () => {
  const markup = renderToStaticMarkup(<TreatmentListPage />);

  expect(markup).toContain('Treatments &amp; prices');
  expect(markup).toContain('Luxurious Espa massage');
  expect(markup).toContain('€100');
  expect(markup).toContain('Juliet Rose Signature Facial');
  expect(markup).toContain('Beauty essentials');
  expect(markup).toContain('Touch of Tranquility');
  expect(markup).toContain('/book?service=swedish-massage');
  expect(markup).toContain('Information checked 19 September 2026');
});
