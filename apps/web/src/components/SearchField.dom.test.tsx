// @vitest-environment happy-dom
import { act, createRef } from 'react';
import { expect, test, vi } from 'vitest';

import { click, renderUi } from '../test-utils/renderUi';
import { SearchField } from './SearchField';

test('provides a labelled search field and forwards typed values', () => {
  const change = vi.fn();
  const { container, unmount } = renderUi(
    <SearchField
      label="Find a service"
      placeholder="Try a plumber"
      value=""
      onChange={change}
    />,
  );
  try {
    const input = container.querySelector('input')!;
    expect(container.querySelector('label')?.htmlFor).toBe(input.id);
    expect(input.type).toBe('search');
    expect(input.placeholder).toBe('Try a plumber');
    const setter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value',
    )!.set!;
    act(() => {
      setter.call(input, 'rail');
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });
    expect(change).toHaveBeenCalledWith('rail');
    expect(container.querySelector('button')).toBeNull();
  } finally {
    unmount();
  }
});

test('offers optional submission and clear controls and an input reference', () => {
  const clear = vi.fn();
  const inputRef = createRef<HTMLInputElement>();
  const { container, unmount } = renderUi(
    <SearchField
      label="Search community information"
      placeholder="Try rail"
      value="DART"
      onChange={vi.fn()}
      inputRef={inputRef}
      submitButton
      onClear={clear}
    />,
  );
  try {
    expect(inputRef.current).toBe(container.querySelector('input'));
    expect(
      container
        .querySelector('[aria-label="Submit search"]')
        ?.getAttribute('type'),
    ).toBe('submit');
    click(container.querySelector('[aria-label="Clear search"]')!);
    expect(clear).toHaveBeenCalledOnce();
  } finally {
    unmount();
  }
  const blank = renderUi(
    <SearchField
      label="Search"
      placeholder="Try rail"
      value=""
      onChange={vi.fn()}
      onClear={clear}
    />,
  );
  try {
    expect(
      blank.container.querySelector('[aria-label="Clear search"]'),
    ).toBeNull();
  } finally {
    blank.unmount();
  }
});
