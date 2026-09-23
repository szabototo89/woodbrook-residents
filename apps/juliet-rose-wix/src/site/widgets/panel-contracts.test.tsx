import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('@wix/editor', () => ({
  widget: { getProp: vi.fn(), setProp: vi.fn() },
}));

import { widget } from '@wix/editor';
import BookingJourneyPanel from './jr-booking-journey/jr-booking-journey.panel';
import BookingPolicyPanel from './jr-booking-policy/jr-booking-policy.panel';
import CategoryGridPanel from './jr-category-grid/jr-category-grid.panel';
import FeaturedGridPanel from './jr-featured-grid/jr-featured-grid.panel';
import GiftCardPanel from './jr-gift-card/jr-gift-card.panel';
import GiftCardPagePanel from './jr-gift-card-page/jr-gift-card-page.panel';
import HeroPanel from './jr-hero/jr-hero.panel';
import HomePagePanel from './jr-home-page/jr-home-page.panel';
import SiteFooterPanel from './jr-site-footer/jr-site-footer.panel';
import SiteHeaderPanel from './jr-site-header/jr-site-header.panel';
import StudioSectionsPanel from './jr-studio-sections/jr-studio-sections.panel';
import TreatmentCatalogPanel from './jr-treatment-catalog/jr-treatment-catalog.panel';
import TreatmentGuidancePanel from './jr-treatment-guidance/jr-treatment-guidance.panel';
import TreatmentHeroPanel from './jr-treatment-hero/jr-treatment-hero.panel';
import TreatmentsPagePanel from './jr-treatments-page/jr-treatments-page.panel';
import VisitUsPanel from './jr-visit-us/jr-visit-us.panel';

const getProp = vi.mocked(widget.getProp);

type PanelCase = Readonly<{
  name: string;
  node: React.ReactNode;
  prefix: string;
  title: string;
  keys: readonly string[];
}>;

const CASES: readonly PanelCase[] = [
  {
    name: 'hero',
    node: <HeroPanel />,
    prefix: 'jr-hero-panel',
    title: 'Hero settings',
    keys: [
      'eyebrow',
      'title',
      'location',
      'copy',
      'copy-second-line',
      'booking-url',
      'treatments-url',
      'policy-url',
      'image-url',
      'image-alt',
    ],
  },
  {
    name: 'visit-us',
    node: <VisitUsPanel />,
    prefix: 'jr-visit-us-panel',
    title: 'Visit us settings',
    keys: [
      'eyebrow',
      'title',
      'address',
      'hours-days',
      'hours-time',
      'contact-button-label',
      'phone-href',
      'phone-label',
      'email-href',
      'email-label',
      'studio-image-url',
      'studio-image-alt',
    ],
  },
  {
    name: 'booking-journey',
    node: <BookingJourneyPanel />,
    prefix: 'jr-booking-journey-panel',
    title: 'Booking journey settings',
    keys: ['initial-service'],
  },
  {
    name: 'booking-policy',
    node: <BookingPolicyPanel />,
    prefix: 'jr-booking-policy-panel',
    title: 'Booking policy settings',
    keys: ['eyebrow', 'title', 'copy', 'full-label', 'full-url'],
  },
  {
    name: 'featured-grid',
    node: <FeaturedGridPanel />,
    prefix: 'jr-featured-grid-panel',
    title: 'Featured treatments settings',
    keys: [
      'featured-slugs',
      'booking-base-url',
      'view-all-label',
      'view-all-href',
    ],
  },
  {
    name: 'gift-card',
    node: <GiftCardPanel />,
    prefix: 'jr-gift-card-panel',
    title: 'Gift card teaser settings',
    keys: [
      'eyebrow',
      'title',
      'copy-lead',
      'copy-rest',
      'button-label',
      'card-url',
    ],
  },
  {
    name: 'category-grid',
    node: <CategoryGridPanel />,
    prefix: 'jr-category-grid-panel',
    title: 'Category grid settings',
    keys: ['view-all-label', 'view-all-href'],
  },
  {
    name: 'treatment-catalog',
    node: <TreatmentCatalogPanel />,
    prefix: 'jr-treatment-catalog-panel',
    title: 'Treatment catalog settings',
    keys: ['booking-base-url'],
  },
  {
    name: 'treatment-guidance',
    node: <TreatmentGuidancePanel />,
    prefix: 'jr-treatment-guidance-panel',
    title: 'Treatment guidance settings',
    keys: ['contact-url'],
  },
  {
    name: 'home-page',
    node: <HomePagePanel />,
    prefix: 'jr-home-page-panel',
    title: 'Home page settings',
    keys: [
      'booking-base-url',
      'treatments-url',
      'gift-card-url',
      'featured-slugs',
      'phone-href',
      'email-href',
      'hero-image-url',
      'studio-image-url',
    ],
  },
  {
    name: 'treatments-page',
    node: <TreatmentsPagePanel />,
    prefix: 'jr-treatments-page-panel',
    title: 'Treatments page settings',
    keys: [
      'booking-base-url',
      'contact-url',
      'hero-eyebrow',
      'hero-title',
      'hero-description',
      'hero-image-url',
    ],
  },
  {
    name: 'gift-card-page',
    node: <GiftCardPagePanel />,
    prefix: 'jr-gift-card-page-panel',
    title: 'Gift card page settings',
    keys: [
      'checkout-url',
      'image-url',
      'image-alt',
      'phone-href',
      'phone-label',
      'email-href',
      'email-label',
    ],
  },
  {
    name: 'site-header',
    node: <SiteHeaderPanel />,
    prefix: 'jr-site-header-panel',
    title: 'Site header settings',
    keys: [
      'active-navigation-item',
      'brand-title',
      'brand-subtitle',
      'home-url',
      'treatments-url',
      'gift-cards-url',
      'contact-url',
      'booking-url',
      'booking-label',
    ],
  },
  {
    name: 'site-footer',
    node: <SiteFooterPanel />,
    prefix: 'jr-site-footer-panel',
    title: 'Site footer settings',
    keys: [
      'brand-title',
      'brand-subtitle',
      'tagline',
      'copyright',
      'home-url',
      'treatments-url',
      'gift-cards-url',
      'contact-url',
      'instagram-url',
    ],
  },
  {
    name: 'studio-sections',
    node: <StudioSectionsPanel />,
    prefix: 'jr-studio-sections-panel',
    title: 'Studio sections settings',
    keys: [
      'gift-card-url',
      'policy-url',
      'phone-href',
      'phone-label',
      'email-href',
      'email-label',
      'studio-image-url',
      'studio-image-alt',
    ],
  },
  {
    name: 'treatment-hero',
    node: <TreatmentHeroPanel />,
    prefix: 'jr-treatment-hero-panel',
    title: 'Treatment hero settings',
    keys: [
      'eyebrow',
      'title',
      'description',
      'script-first-line',
      'script-second-line',
      'script-third-line',
      'image-url',
    ],
  },
];

beforeEach(() => {
  getProp.mockReset();
  getProp.mockResolvedValue('');
});

for (const panelCase of CASES) {
  test(`${panelCase.name} panel renders a titled section with every field, control and help`, async () => {
    const view = renderUi(panelCase.node);
    await act(async () => {
      await Promise.resolve();
    });

    expect(view.container.textContent).toMatch(panelCase.title);
    for (const key of panelCase.keys) {
      const control = view.container.querySelector(
        `[data-hook="${panelCase.prefix}-${key}"] input, ` +
          `[data-hook="${panelCase.prefix}-${key}"] textarea, ` +
          `select[data-hook="${panelCase.prefix}-${key}"]`,
      );
      expect(
        control,
        `Expected an editable control for "${key}" in ${panelCase.name}`,
      ).not.toBe(null);
      expect(
        view.container.querySelector(
          `[data-hook="${panelCase.prefix}-${key}-help"]`,
        )?.textContent,
        `Expected help text for "${key}" in ${panelCase.name}`,
      ).toMatch(/.{10,}/);
    }
    view.unmount();
  });
}
