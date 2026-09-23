import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('@wix/editor', () => ({
  widget: { getProp: vi.fn(), setProp: vi.fn() },
}));

import { widget } from '@wix/editor';
import { SettingsPanel } from './SettingsPanel';

const getProp = vi.mocked(widget.getProp);

beforeEach(() => {
  getProp.mockReset();
  getProp.mockResolvedValue('');
});

async function renderPanel() {
  const view = renderUi(
    <SettingsPanel
      dataHookPrefix="jr-layout-panel"
      title="Hero settings"
      subtitle="Homepage hero content, links and imagery"
      sections={[
        {
          title: 'Content',
          fields: [
            {
              key: 'eyebrow',
              label: 'Eyebrow',
              kind: 'text',
              help: 'Small line above the hero heading naming the studio specialties.',
            },
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Large hero heading visitors read first.',
            },
          ],
        },
        {
          title: 'Scheduling',
          fields: [
            {
              key: 'initial-service',
              label: 'Active page',
              kind: 'choice',
              help: 'Highlights the matching navigation item while visitors browse.',
              options: [
                { id: '', value: 'Automatic' },
                { id: '/', value: 'Home' },
              ],
            },
          ],
        },
      ]}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });
  return view;
}

test('help text uses Wix DS Text, not an unstyled div inside FormField', async () => {
  const view = await renderPanel();
  const help = view.container.querySelector(
    '[data-hook="jr-layout-panel-eyebrow-help"]',
  );
  expect(help, 'Expected help text element').not.toBe(null);
  // Unstyled <div> inherits the global serif leak; DS <Text size="small"> renders a span.
  expect(help?.tagName).toBe('SPAN');
  view.unmount();
});

test('choice fields render a full-width styled select (DS Dropdown is React-18-only)', async () => {
  const view = await renderPanel();
  const select = view.container.querySelector(
    'select[data-hook="jr-layout-panel-initial-service"]',
  );
  expect(select, 'Expected a styled native select for choice fields').not.toBe(
    null,
  );
  expect(select?.getAttribute('style')).toMatch(/width:\s*100%/);
  view.unmount();
});

test('fields are wrapped for vertical rhythm with full-width layout root', async () => {
  const view = await renderPanel();
  expect(
    view.container.querySelector('[data-hook="jr-layout-panel-field-eyebrow"]'),
    'Expected a field wrapper for vertical rhythm',
  ).not.toBe(null);
  expect(
    view.container.querySelector('[data-hook="jr-panel-layout-root"]'),
    'Expected a width-constrained layout root without horizontal overflow',
  ).not.toBe(null);
  view.unmount();
});
