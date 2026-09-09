import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';

import { CollectionSchedule } from '../../../src/features/resources/CollectionSchedule';

test('shows upcoming collections and accessible PDF actions', async () => {
  const screen = await render(
    <CollectionSchedule
      today="2026-09-09"
      collectionDates={[
        { id: 1, date: '2026-09-15', stream: 'recycling' },
        { id: 2, date: '2026-09-22', stream: 'waste-compost' },
      ]}
      documentLabel="2026 bin collection schedule"
      documentUrl="/documents/thorntons-bin-collection-schedule-2026.pdf"
    />,
  );

  await expect
    .element(screen.getByRole('heading', { name: 'Next collection dates' }))
    .toBeVisible();
  await expect.element(screen.getByText('15 September 2026')).toBeVisible();
  await expect.element(screen.getByText('22 September 2026')).toBeVisible();
  await expect
    .element(
      screen.getByRole('link', {
        name: /view 2026 bin collection schedule/i,
      }),
    )
    .toHaveAttribute(
      'href',
      '/documents/thorntons-bin-collection-schedule-2026.pdf',
    );
  await expect
    .element(screen.getByRole('link', { name: /download pdf/i }))
    .toHaveAttribute('download', 'thorntons-bin-collection-schedule-2026.pdf');
  await expect
    .element(screen.getByText(/collection arrangements can vary by route/i))
    .toBeVisible();
});
