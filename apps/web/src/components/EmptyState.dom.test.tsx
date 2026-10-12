// @vitest-environment happy-dom
import { expect, test } from 'vitest';
import { Search } from 'lucide-react';

import { renderUi } from '../test-utils/renderUi';
import { EmptyState } from './EmptyState';

test('empty state shows the given title and message', () => {
  const { container, unmount } = renderUi(
    <EmptyState title="Nothing here" message="Try again later." />,
  );

  expect(container.querySelector('h2')?.textContent).toBe('Nothing here');
  expect(container.textContent).toContain('Try again later.');
  unmount();
});

test('can include a context icon and a recovery action', () => {
  const { container, unmount } = renderUi(
    <EmptyState
      title="No results"
      message="Try another category."
      icon={Search}
    >
      <button>View all results</button>
    </EmptyState>,
  );
  try {
    expect(container.querySelector('button')?.textContent).toBe(
      'View all results',
    );
  } finally {
    unmount();
  }
});
