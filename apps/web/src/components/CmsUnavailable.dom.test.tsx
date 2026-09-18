// @vitest-environment happy-dom
import { expect, test } from 'vitest';

import { renderUi } from '../test-utils/renderUi';
import { CmsUnavailable } from './CmsUnavailable';

test('cms outage notice explains the outage without substitute content', () => {
  const { container, unmount } = renderUi(<CmsUnavailable />);

  expect(container.querySelector('[role="status"]')).not.toBeNull();
  expect(container.querySelector('h2')?.textContent).toContain(
    'temporarily unavailable',
  );
  expect(container.textContent).toMatch(/could not be reached/);
  unmount();
});
