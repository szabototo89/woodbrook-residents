import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import HeroFixture from './site/widgets/jr-hero/Hero.fixture';
import StudioSectionsFixture from './site/widgets/jr-studio-sections/StudioSections.fixture';
import TreatmentCardsFixtures from './site/widgets/jr-treatment-cards/TreatmentCards.fixture';
import BookingJourneyFixtures from './site/widgets/jr-booking-journey/BookingJourney.fixture';

test('hero fixture renders the studio headline', () => {
  const markup = renderToStaticMarkup(HeroFixture);

  expect(markup).toContain('Relax and Revitalize');
  expect(markup).toContain('Book an appointment');
});

test('studio fixture renders gift, visit, and policy sections', () => {
  const markup = renderToStaticMarkup(StudioSectionsFixture);

  expect(markup).toContain('The perfect gift');
  expect(markup).toContain('Juliet Rose beauty studio');
  expect(markup).toContain('Booking policy');
});

test('treatment cards fixture renders grids, catalog, and guidance', () => {
  const markup = renderToStaticMarkup(TreatmentCardsFixtures.All);

  expect(markup).toContain('Find the right treatment for you');
  expect(markup).toContain('Featured treatments');
  expect(markup).toContain('Swedish massage');
  expect(markup).toContain('Not sure what to choose?');
});

test('treatment cards home fixture hides the catalog', () => {
  const markup = renderToStaticMarkup(TreatmentCardsFixtures.HomeDisplay);

  expect(markup).toContain('Featured treatments');
  expect(markup).not.toContain('Not sure what to choose?');
});

test('treatment cards catalog fixture hides the home grids', () => {
  const markup = renderToStaticMarkup(TreatmentCardsFixtures.CatalogDisplay);

  expect(markup).toContain('Swedish massage');
  expect(markup).not.toContain('Find the right treatment for you');
});

test('booking journey fixture renders the mock flow', () => {
  const markup = renderToStaticMarkup(BookingJourneyFixtures.Default);

  expect(markup).toContain('Request an');
  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('Swedish massage');
});
