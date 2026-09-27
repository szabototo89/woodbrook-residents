// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';

import { click, renderUi } from '../../test-utils/renderUi';
import type { CommunityEvent } from '../content/contentTypes';
import { AddToCalendarButton } from './AddToCalendarButton';

const { atcbActionMock } = vi.hoisted(() => ({ atcbActionMock: vi.fn() }));

vi.mock('add-to-calendar-button', () => ({
  atcb_action: atcbActionMock,
}));

const event: CommunityEvent = {
  documentId: 'event-123',
  title: 'Community clean-up, Woodbrook',
  slug: 'community-clean-up',
  summary: 'Meet neighbours; bags provided.',
  startsAt: '2026-10-17T08:00:00.000Z',
  endsAt: '2026-10-17T10:30:00.000Z',
  location: 'Woodbrook, Shankill',
  sourceUrl: 'https://example.com/event',
  sourceReviewedOn: '2026-09-05',
  featured: false,
};

test('renders a Woodbrook-styled button that opens calendar options', async () => {
  atcbActionMock.mockResolvedValue('openList:atcb-btn-1');
  const { container, unmount } = renderUi(
    <AddToCalendarButton event={event} />,
  );

  const button = container.querySelector('button');
  expect(button?.textContent).toContain('Add to calendar');
  expect(button?.className ?? '').toMatch(/button-secondary/);

  click(button!);
  await vi.waitFor(() => {
    expect(atcbActionMock).toHaveBeenCalledTimes(1);
  });

  const firstCall = atcbActionMock.mock.calls[0];
  expect(firstCall).toBeDefined();
  const [config, trigger] = firstCall!;
  expect(config.name).toBe('Community clean-up, Woodbrook');
  expect(config.timeZone).toBe('Europe/Dublin');
  expect(config.options).toContain('apple');
  expect(config.options).toContain('google');
  expect(trigger).toBe(button);
  unmount();
});
