// @vitest-environment happy-dom

import { act } from 'react';
import { expect, test, vi } from 'vitest';

import { renderUi } from '../../test-utils/renderUi';
import { listTreatments } from '../treatments/treatmentCatalog';
import { TimeSlotPicker } from './TimeSlotPicker';
import { TreatmentPicker } from './TreatmentPicker';

test('treatment picker reports the selected treatment', () => {
  const onChange = vi.fn();
  const view = renderUi(
    <TreatmentPicker
      treatments={listTreatments()}
      value=""
      onChange={onChange}
    />,
  );
  const select = view.container.querySelector('select')!;

  act(() => {
    select.value = 'swedish-massage';
    select.dispatchEvent(new Event('change', { bubbles: true }));
  });
  expect(onChange).toHaveBeenCalledWith('swedish-massage');
  view.unmount();
});

test('time picker explains its empty state and reports a chosen time', () => {
  const emptyView = renderUi(
    <TimeSlotPicker times={[]} value="" onChange={vi.fn()} />,
  );
  expect(emptyView.container.textContent).toContain(
    'Choose a date to see preferred times.',
  );
  emptyView.unmount();

  const onChange = vi.fn();
  const view = renderUi(
    <TimeSlotPicker
      times={['10:00', '11:00']}
      value="10:00"
      onChange={onChange}
    />,
  );
  expect(view.container.querySelector('label.is-selected')?.textContent).toBe(
    '10:00',
  );
  act(() =>
    view.container
      .querySelector<HTMLInputElement>('input[value="11:00"]')!
      .click(),
  );
  expect(onChange).toHaveBeenCalledWith('11:00');
  view.unmount();
});
