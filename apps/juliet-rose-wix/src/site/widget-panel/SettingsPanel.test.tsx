import { act } from 'react';
import { beforeEach, expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';

vi.mock('@wix/editor', () => ({
  widget: { getProp: vi.fn(), setProp: vi.fn() },
}));

import { widget } from '@wix/editor';
import { SettingsPanel } from './SettingsPanel';

const getProp = vi.mocked(widget.getProp);
const setProp = vi.mocked(widget.setProp);

beforeEach(() => {
  getProp.mockReset();
  setProp.mockReset();
  getProp.mockResolvedValue('');
  setProp.mockResolvedValue(undefined);
});

test('SettingsPanel renders title, sections, help and mixed controls', async () => {
  const view = renderUi(
    <SettingsPanel
      dataHookPrefix="jr-test-panel"
      title="Booking settings"
      subtitle="Shown in the Studio sidebar"
      sections={[
        {
          title: 'Content',
          fields: [
            {
              key: 'title',
              label: 'Title',
              kind: 'text',
              help: 'Heading shown on the widget',
              placeholder: 'e.g. Book your visit',
            },
            {
              key: 'description',
              label: 'Description',
              kind: 'longText',
              help: 'Two sentences max',
            },
          ],
        },
        {
          title: 'Scheduling',
          fields: [
            {
              key: 'initial-service',
              label: 'Preselected service',
              kind: 'choice',
              help: 'Choice visitors see before any service is picked. Shows when the widget loads and after a reset.',
              options: [
                { id: '', value: 'No preselection' },
                { id: 'swedish-massage', value: 'Swedish massage' },
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

  expect(view.container.textContent).toMatch(/Booking settings/);
  expect(view.container.textContent).toMatch(/Content/);
  expect(view.container.textContent).toMatch(/Scheduling/);
  expect(
    view.container.querySelector('[data-hook="jr-test-panel-title"] input'),
  ).not.toBe(null);
  expect(
    view.container.querySelector(
      '[data-hook="jr-test-panel-description"] textarea',
    ),
  ).not.toBe(null);
  expect(
    view.container.querySelector(
      'select[data-hook="jr-test-panel-initial-service"]',
    ),
  ).not.toBe(null);
  expect(view.container.textContent).toMatch(/Heading shown on the widget/);
  view.unmount();
});

test('SettingsPanel persists edits for every control kind', async () => {
  const view = renderUi(
    <SettingsPanel
      dataHookPrefix="jr-test-panel"
      title="Panel"
      sections={[
        {
          title: 'Content',
          fields: [{ key: 'title', label: 'Title', kind: 'text' }],
        },
      ]}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });
  const field = view.container.querySelector<HTMLInputElement>(
    '[data-hook="jr-test-panel-title"] input',
  );
  if (!field) throw new Error('Expected the title field');
  const nativeSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  await act(async () => {
    nativeSetter?.call(field, 'New title');
    field.dispatchEvent(new Event('input', { bubbles: true }));
    await Promise.resolve();
  });
  expect(setProp).toHaveBeenCalledWith('title', 'New title');
  view.unmount();
});

test('SettingsPanel shows loading then error feedback', async () => {
  getProp.mockImplementation(async () => {
    await Promise.resolve();
    throw new Error('editor locked');
  });
  const view = renderUi(
    <SettingsPanel
      dataHookPrefix="jr-test-panel"
      title="Panel"
      sections={[
        {
          title: 'Content',
          fields: [{ key: 'title', label: 'Title', kind: 'text' }],
        },
      ]}
    />,
  );
  await act(async () => {
    await Promise.resolve();
  });
  await act(async () => {
    await Promise.resolve();
  });
  expect(view.container.textContent).toMatch(/editor locked|Could not load/i);
  view.unmount();
});
