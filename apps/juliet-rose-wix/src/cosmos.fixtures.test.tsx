import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import HeroFixture from './site/widgets/jr-hero/Hero.fixture';
import GiftCardFixture from './site/widgets/jr-gift-card/GiftCard.fixture';
import VisitUsFixture from './site/widgets/jr-visit-us/VisitUs.fixture';
import BookingPolicyFixture from './site/widgets/jr-booking-policy/BookingPolicy.fixture';
import CategoryGridFixture from './site/widgets/jr-category-grid/CategoryGrid.fixture';
import FeaturedGridFixture from './site/widgets/jr-featured-grid/FeaturedGrid.fixture';
import TreatmentCatalogFixture from './site/widgets/jr-treatment-catalog/TreatmentCatalog.fixture';
import TreatmentGuidanceFixture from './site/widgets/jr-treatment-guidance/TreatmentGuidance.fixture';
import BookingJourneyFixtures from './site/widgets/jr-booking-journey/BookingJourney.fixture';

test('hero fixture renders the studio headline', () => {
  const markup = renderToStaticMarkup(HeroFixture);

  expect(markup).toContain('Relax and Revitalize');
  expect(markup).toContain('Book an appointment');
});

test('gift card fixture renders the gift content', () => {
  const markup = renderToStaticMarkup(GiftCardFixture);

  expect(markup).toContain('The perfect gift');
  expect(markup).toContain('Buy a gift card');
});

test('visit us fixture renders the contact content', () => {
  const markup = renderToStaticMarkup(VisitUsFixture);

  expect(markup).toContain('Juliet Rose beauty studio');
  expect(markup).toContain('0852867059');
});

test('booking policy fixture renders the policy content', () => {
  const markup = renderToStaticMarkup(BookingPolicyFixture);

  expect(markup).toContain('Booking policy');
  expect(markup).toContain('Read the full policy');
});

test('category grid fixture renders every category card', () => {
  const markup = renderToStaticMarkup(CategoryGridFixture);

  expect(markup).toContain('Find the right treatment for you');
  expect(markup).toContain('Facials &amp; skin');
});

test('featured grid fixture renders featured treatments', () => {
  const markup = renderToStaticMarkup(FeaturedGridFixture);

  expect(markup).toContain('Featured treatments');
  expect(markup).toContain('Juliet Rose Signature Facial');
});

test('treatment catalog fixture renders anchored sections', () => {
  const markup = renderToStaticMarkup(TreatmentCatalogFixture);

  expect(markup).toContain('Swedish massage');
  expect(markup).toContain('Book Swedish massage');
});

test('treatment guidance fixture renders the call to action', () => {
  const markup = renderToStaticMarkup(TreatmentGuidanceFixture);

  expect(markup).toContain('Not sure what to choose?');
});

test('booking journey fixture renders the mock flow', () => {
  const markup = renderToStaticMarkup(BookingJourneyFixtures.Default);

  expect(markup).toContain('Request an');
  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('Swedish massage');
});
