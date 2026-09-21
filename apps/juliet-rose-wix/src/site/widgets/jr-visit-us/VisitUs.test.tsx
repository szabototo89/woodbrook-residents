import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { VisitUs } from './VisitUs';

test('visit us renders the default contact content', () => {
  const view = renderUi(<VisitUs />);

  const section = view.container.querySelector('section[id="contact"]');
  expect(section?.getAttribute('aria-labelledby')).toBe('visit-heading');
  expect(section?.textContent).toContain('Visit us');
  expect(section?.textContent).toContain('Juliet Rose beauty studio');
  expect(section?.textContent).toContain(
    '10 Merville road, Stillorgan, Dublin, Ireland, A94YV78',
  );
  expect(section?.textContent).toContain('Monday – Friday');
  expect(section?.textContent).toContain('10.00am – 8.00pm');
  expect(
    section?.querySelector('a[href="tel:+353852867059"]')?.textContent,
  ).toContain('0852867059');
  expect(
    section?.querySelector('a[href="mailto:denizzza1@gmail.com"]')?.textContent,
  ).toContain('denizzza1@gmail.com');
  const image = section?.querySelector('img');
  expect(image?.getAttribute('src')).toBe('/images/studio-interior.jpg');
  expect(image?.getAttribute('alt')).toBe(
    'The warm and private Juliet Rose treatment studio',
  );
  expect(image?.getAttribute('loading')).toBe('lazy');
  view.unmount();
});

test('visit us honours widget properties', () => {
  const view = renderUi(
    <VisitUs
      title="Custom studio title"
      phoneHref="tel:+15551234567"
      phoneLabel="555 123 4567"
      studioImageUrl="https://example.com/studio.jpg"
    />,
  );

  expect(view.container.textContent).toContain('Custom studio title');
  expect(
    view.container.querySelector('a[href="tel:+15551234567"]')?.textContent,
  ).toContain('555 123 4567');
  expect(view.container.querySelector('img')?.getAttribute('src')).toBe(
    'https://example.com/studio.jpg',
  );
  view.unmount();
});
