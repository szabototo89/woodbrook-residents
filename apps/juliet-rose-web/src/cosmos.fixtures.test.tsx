import { renderToStaticMarkup } from 'react-dom/server';
import { expect, test } from 'vitest';

import CosmosDecorator from './cosmos.decorator';
import SiteFooterFixture from './components/SiteFooter.fixture';
import SiteHeaderFixtures from './components/SiteHeader.fixture';
import EditorialPageHeroFixture from './components/EditorialPageHero.fixture';
import HeroSectionFixture from './features/home/HeroSection.fixture';
import JulietRoseHomePageFixture from './features/home/JulietRoseHomePage.fixture';
import StudioSectionsFixture from './features/home/StudioSections.fixture';
import TreatmentSectionLinkFixture from './features/home/TreatmentSectionLink.fixture';
import TreatmentSectionsFixture from './features/home/TreatmentSections.fixture';
import NotFoundPageFixture, {
  notFoundPageRouter,
} from './app/NotFoundPage.fixture';
import RootDocumentFixture, {
  rootDocumentRouter,
} from './app/RootDocument.fixture';
import AppointmentDatePickerFixture from './features/booking/AppointmentDatePicker.fixture';
import BookingHeroFixture from './features/booking/BookingHero.fixture';
import BookingJourneyFixture from './features/booking/BookingJourney.fixture';
import BookingPageFixture from './features/booking/BookingPage.fixture';
import BookingReassuranceFixture from './features/booking/BookingReassurance.fixture';
import BookingSidebarFixtures from './features/booking/BookingSidebar.fixture';
import CustomerDetailsFormFixtures from './features/booking/CustomerDetailsForm.fixture';
import TimeSlotPickerFixtures from './features/booking/TimeSlotPicker.fixture';
import TreatmentPickerFixture from './features/booking/TreatmentPicker.fixture';
import TreatmentCategoryCardFixture from './features/treatments/TreatmentCategoryCard.fixture';
import TreatmentGuidanceFixture from './features/treatments/TreatmentGuidance.fixture';
import TreatmentHeroFixture from './features/treatments/TreatmentHero.fixture';
import TreatmentListPageFixture from './features/treatments/TreatmentListPage.fixture';
import TreatmentRowFixture from './features/treatments/TreatmentRow.fixture';

test('cosmos decorator renders its children', () => {
  const markup = renderToStaticMarkup(
    <CosmosDecorator>
      <span>cosmos probe</span>
    </CosmosDecorator>,
  );

  expect(markup).toContain('cosmos probe');
});

test('site header fixture renders the brand and booking action', () => {
  const markup = renderToStaticMarkup(SiteHeaderFixtures.Default);

  expect(markup).toContain('Juliet Rose');
  expect(markup).toContain('Book an appointment');
});

test('site header active fixture marks treatments as current', () => {
  const markup = renderToStaticMarkup(
    SiteHeaderFixtures.ActiveTreatmentsNavigation,
  );

  expect(markup).toContain('is-current');
  expect(markup).toContain('Treatments');
});

test('site footer fixture renders the tagline', () => {
  const markup = renderToStaticMarkup(SiteFooterFixture);

  expect(markup).toContain('Relax and Revitalize');
});

test('editorial page hero fixture renders its highlights', () => {
  const markup = renderToStaticMarkup(EditorialPageHeroFixture);

  expect(markup).toContain('Book your visit');
  expect(markup).toContain('Choose a treatment');
});

test('home hero fixture renders the headline', () => {
  const markup = renderToStaticMarkup(HeroSectionFixture);

  expect(markup).toContain('Relax and Revitalize');
});

test('studio sections fixture renders gift, contact, and policy sections', () => {
  const markup = renderToStaticMarkup(StudioSectionsFixture);

  expect(markup).toContain('gift-cards');
  expect(markup).toContain('Merville');
  expect(markup).toContain('booking-policy');
});

test('treatment section link fixture renders its call to action', () => {
  const markup = renderToStaticMarkup(TreatmentSectionLinkFixture);

  expect(markup).toContain('View all treatments');
});

test('treatment sections fixture renders the category grid', () => {
  const markup = renderToStaticMarkup(TreatmentSectionsFixture);

  expect(markup).toContain('Massage');
  expect(markup).toContain('View all treatments');
});

test('home page fixture composes hero and studio sections', () => {
  const markup = renderToStaticMarkup(JulietRoseHomePageFixture);

  expect(markup).toContain('Relax and Revitalize');
  expect(markup).toContain('gift-cards');
});

test('treatment hero fixture renders the catalog introduction', () => {
  const markup = renderToStaticMarkup(TreatmentHeroFixture);

  expect(markup).toContain('Our services');
});

test('treatment guidance fixture renders its contact call to action', () => {
  const markup = renderToStaticMarkup(TreatmentGuidanceFixture);

  expect(markup).toContain('Not sure what to choose?');
});

test('treatment row fixture renders name and price', () => {
  const markup = renderToStaticMarkup(TreatmentRowFixture);

  expect(markup).toContain('Swedish massage');
  expect(markup).toContain('€80');
});

test('treatment category card fixture renders its treatment count', () => {
  const markup = renderToStaticMarkup(TreatmentCategoryCardFixture);

  expect(markup).toContain('Massage');
  expect(markup).toContain('6 treatments');
});

test('treatment list page fixture renders the full catalog', () => {
  const markup = renderToStaticMarkup(TreatmentListPageFixture);

  expect(markup).toContain('Our services');
  expect(markup).toContain('Not sure what to choose?');
});

test('booking hero fixture renders the booking introduction', () => {
  const markup = renderToStaticMarkup(BookingHeroFixture);

  expect(markup).toContain('Book your visit');
});

test('booking reassurance fixture renders its promises', () => {
  const markup = renderToStaticMarkup(BookingReassuranceFixture);

  expect(markup).toContain('Relaxing environment');
});

test('treatment picker fixture renders the treatment select', () => {
  const markup = renderToStaticMarkup(TreatmentPickerFixture);

  expect(markup).toContain('<select');
  expect(markup).toContain('Swedish massage');
});

test('time slot picker fixture renders the available times', () => {
  const markup = renderToStaticMarkup(TimeSlotPickerFixtures.WithTimes);

  expect(markup).toContain('radiogroup');
  expect(markup).toContain('10:00');
});

test('empty time slot picker fixture renders its hint', () => {
  const markup = renderToStaticMarkup(TimeSlotPickerFixtures.Empty);

  expect(markup).toContain('Choose a date to see preferred times.');
});

test('appointment date picker fixture renders the fixed month', () => {
  const markup = renderToStaticMarkup(AppointmentDatePickerFixture);

  expect(markup).toContain('October 2026');
});

test('customer details form fixture renders its fields', () => {
  const markup = renderToStaticMarkup(CustomerDetailsFormFixtures.Default);

  expect(markup).toContain('<form');
  expect(markup).toContain('Your full name');
});

test('disabled customer details form fixture disables its fields', () => {
  const markup = renderToStaticMarkup(CustomerDetailsFormFixtures.Disabled);

  expect(markup).toContain('disabled');
});

test('booking sidebar fixture renders the selected summary', () => {
  const markup = renderToStaticMarkup(BookingSidebarFixtures.Selected);

  expect(markup).toContain('Swedish massage');
  expect(markup).toContain('19 October 2026');
});

test('empty booking sidebar fixture renders its placeholders', () => {
  const markup = renderToStaticMarkup(BookingSidebarFixtures.Empty);

  expect(markup).toContain('Choose a treatment');
});

test('booking journey fixture renders the booking steps', () => {
  const markup = renderToStaticMarkup(BookingJourneyFixture);

  expect(markup).toContain('Choose a treatment');
  expect(markup).toContain('Book your visit');
});

test('booking page fixture renders the journey and summary', () => {
  const markup = renderToStaticMarkup(BookingPageFixture);

  expect(markup).toContain('Your booking');
});

test('not found page fixture renders the 404 message', async () => {
  await notFoundPageRouter.load();
  const markup = renderToStaticMarkup(NotFoundPageFixture);

  expect(markup).toContain('That page could not be found');
  expect(markup).toContain('Return to the homepage');
});

test('root document fixture renders the shell and its child', async () => {
  await rootDocumentRouter.load();
  const markup = renderToStaticMarkup(RootDocumentFixture);

  expect(markup).toContain('Skip to content');
  expect(markup).toContain('Cosmos preview content');
});
