import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { CmsUnavailable } from '../../../src/components/CmsUnavailable';

test('explains a CMS outage without displaying substitute content', async () => {
  const screen = await render(<CmsUnavailable />);

  await expect
    .element(
      screen.getByRole('heading', {
        name: 'Community information is temporarily unavailable',
      }),
    )
    .toBeVisible();
  await expect
    .element(screen.getByText(/no substitute or placeholder information/i))
    .toBeVisible();
});
