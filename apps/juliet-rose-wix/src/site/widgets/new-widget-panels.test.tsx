import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('@wix/editor', () => ({
  widget: { getProp: vi.fn(), setProp: vi.fn() },
}));

import { widget } from '@wix/editor';
import GiftCardPagePanel from './jr-gift-card-page/jr-gift-card-page.panel';
import HomePagePanel from './jr-home-page/jr-home-page.panel';
import StudioSectionsPanel from './jr-studio-sections/jr-studio-sections.panel';
import TreatmentHeroPanel from './jr-treatment-hero/jr-treatment-hero.panel';
import TreatmentsPagePanel from './jr-treatments-page/jr-treatments-page.panel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

beforeEach(() => {
  getProp.mockReset();
  setProp.mockReset();
  getProp.mockResolvedValue('');
  setProp.mockResolvedValue(undefined);
});

test('each new widget panel exposes the settings needed by its building block', async () => {
  const cases = [
    [<TreatmentHeroPanel />, 'jr-treatment-hero-panel-title'],
    [<GiftCardPagePanel />, 'jr-gift-card-page-panel-checkout-url'],
    [<StudioSectionsPanel />, 'jr-studio-sections-panel-gift-card-url'],
    [<HomePagePanel />, 'jr-home-page-panel-booking-base-url'],
    [<TreatmentsPagePanel />, 'jr-treatments-page-panel-contact-url'],
  ] as const;

  for (const [panel, dataHook] of cases) {
    const view = renderUi(panel);
    await act(async () => {
      await Promise.resolve();
    });
    expect(
      view.container.querySelector(`[data-hook="${dataHook}"] input`),
    ).not.toBe(null);
    view.unmount();
  }
});

test('new widget panels persist edited properties', async () => {
  const view = renderUi(<HomePagePanel />);
  await act(async () => {
    await Promise.resolve();
  });
  const field = view.container.querySelector<HTMLInputElement>(
    '[data-hook="jr-home-page-panel-booking-base-url"] input',
  );
  if (!field) throw new Error('Expected the booking base URL field');

  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, '/appointments');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });

  expect(setProp).toHaveBeenCalledWith('booking-base-url', '/appointments');
  view.unmount();
});
