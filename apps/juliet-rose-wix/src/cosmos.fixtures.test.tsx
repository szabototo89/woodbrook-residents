import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import JrHeroFixture from './site/widgets/jr-hero/JrHero.fixture';
import JrStudioSectionsFixture from './site/widgets/jr-studio-sections/JrStudioSections.fixture';
import JrTreatmentCardsFixtures from './site/widgets/jr-treatment-cards/JrTreatmentCards.fixture';
import JrBookingJourneyFixtures from './site/widgets/jr-booking-journey/JrBookingJourney.fixture';

test('hero fixture renders the studio headline', () => {
  const markup = renderToStaticMarkup(JrHeroFixture);

  expect(markup).toContain('Relax and Revitalize');
  expect(markup).toContain('Book an appointment');
});

test('studio fixture renders gift, visit, and policy sections', () => {
  const markup = renderToStaticMarkup(JrStudioSectionsFixture);

  expect(markup).toContain('The perfect gift');
  expect(markup).toContain('Juliet Rose beauty studio');
  expect(markup).toContain('Booking policy');
});

test('treatment cards fixture renders grids, catalog, and guidance', () => {
  const markup = renderToStaticMarkup(JrTreatmentCardsFixtures.All);

  expect(markup).toContain('Find the right treatment for you');
  expect(markup).toContain('Featured treatments');
  expect(markup).toContain('Swedish massage');
  expect(markup).toContain('Not sure what to choose?');
});

test('treatment cards home fixture hides the catalog', () => {
  const markup = renderToStaticMarkup(JrTreatmentCardsFixtures.HomeDisplay);

  expect(markup).toContain('Featured treatments');
  expect(markup).not.toContain('Not sure what to choose?');
});

test('treatment cards catalog fixture hides the home grids', () => {
  const markup = renderToStaticMarkup(JrTreatmentCardsFixtures.CatalogDisplay);

  expect(markup).toContain('Swedish massage');
  expect(markup).not.toContain('Find the right treatment for you');
});

test('booking journey fixture renders the mock flow', () => {
  const markup = renderToStaticMarkup(JrBookingJourneyFixtures.Default);

  expect(markup).toContain('Request an');
  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('Swedish massage');
});
