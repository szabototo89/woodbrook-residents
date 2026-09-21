import { expect, test } from 'vitest';

import { renderUi } from '../../../test-utils/renderUi';
import { StudioSections } from './StudioSections';

test('jr-studio-sections renders gift, visit, and policy content by default', () => {
  const view = renderUi(<StudioSections />);

  const gift = view.container.querySelector('section[id="gift-cards"]');
  expect(gift?.getAttribute('aria-labelledby')).toBe('gift-heading');
  expect(gift?.textContent).toContain('The perfect gift');
  expect(gift?.textContent).toContain(
    'Treat someone special to a Juliet Rose gift card.',
  );
  expect(gift?.textContent).toContain('Available for any treatment or amount.');
  expect(gift?.querySelector('a[href="/gift-cards"]')?.textContent).toContain(
    'Buy a gift card',
  );

  const visit = view.container.querySelector('section[id="contact"]');
  expect(visit?.getAttribute('aria-labelledby')).toBe('visit-heading');
  expect(visit?.textContent).toContain('Juliet Rose beauty studio');
  expect(visit?.textContent).toContain(
    '10 Merville road, Stillorgan, Dublin, Ireland, A94YV78',
  );
  expect(visit?.textContent).toContain('Monday – Friday');
  expect(visit?.textContent).toContain('10.00am – 8.00pm');
  expect(
    visit?.querySelector('a[href="tel:+353852867059"]')?.textContent,
  ).toContain('0852867059');
  expect(
    visit?.querySelector('a[href="mailto:denizzza1@gmail.com"]')?.textContent,
  ).toContain('denizzza1@gmail.com');
  const studioImage = visit?.querySelector('img');
  expect(studioImage?.getAttribute('src')).toBe('/images/studio-interior.jpg');
  expect(studioImage?.getAttribute('alt')).toBe(
    'The warm and private Juliet Rose treatment studio',
  );
  expect(studioImage?.getAttribute('loading')).toBe('lazy');

  const policy = view.container.querySelector('section[id="booking-policy"]');
  expect(policy?.getAttribute('aria-labelledby')).toBe('policy-heading');
  expect(policy?.textContent).toContain('Booking policy');
  expect(policy?.textContent).toContain('at least 24 hours’ notice');
  expect(
    policy?.querySelector('a[href="https://www.julietrosebeauty.com/"]')
      ?.textContent,
  ).toContain('Read the full policy');
  view.unmount();
});

test('jr-studio-sections honours widget properties for links and imagery', () => {
  const view = renderUi(
    <StudioSections
      giftTitle="Custom gift title"
      giftCardUrl="https://example.com/gift"
      phoneHref="tel:+15551234567"
      phoneLabel="555 123 4567"
      studioImageUrl="https://example.com/studio.jpg"
      studioImageAlt="Custom studio alt"
      policyFullUrl="https://example.com/policy"
    />,
  );

  expect(view.container.textContent).toContain('Custom gift title');
  expect(
    view.container.querySelector('a[href="https://example.com/gift"]'),
  ).not.toBeNull();
  expect(
    view.container.querySelector('a[href="tel:+15551234567"]')?.textContent,
  ).toContain('555 123 4567');
  expect(view.container.querySelector('img')?.getAttribute('src')).toBe(
    'https://example.com/studio.jpg',
  );
  expect(view.container.querySelector('img')?.getAttribute('alt')).toBe(
    'Custom studio alt',
  );
  expect(
    view.container.querySelector('a[href="https://example.com/policy"]'),
  ).not.toBeNull();
  view.unmount();
});
