// @vitest-environment happy-dom
import { expect, test } from 'vitest';

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
