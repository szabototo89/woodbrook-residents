import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { CardFeed } from '../features/content/CardFeed.js';

const cards = [
  {
    slug: 'first',
    title: 'First record',
    summary: 'Newest summary.',
    meta: 'Planning · 5 Sept 2026',
  },
  {
    slug: 'second',
    title: 'Second record',
    summary: 'Older summary.',
    meta: 'Community · 2 Sept 2026',
  },
];

test('feed features the first record and rows the rest', async () => {
  const onSelect = vi.fn();
  const { container } = render(
    <CardFeed
      cards={cards}
      actionLabel="Read more →"
      emptyLabel="Nothing here."
      onSelect={onSelect}
    />,
  );

  expect(container.querySelector('.featured-card')).toBeInTheDocument();
  expect(container.querySelectorAll('.list-row')).toHaveLength(1);

  fireEvent.tap(await screen.findByText('First record'));
  expect(onSelect).toHaveBeenCalledWith('first');
  fireEvent.tap(screen.getByText('Second record'));
  expect(onSelect).toHaveBeenCalledWith('second');
});

test('feed explains an empty collection', async () => {
  render(
    <CardFeed
      cards={[]}
      actionLabel="Read more →"
      emptyLabel="Nothing here."
      onSelect={() => undefined}
    />,
  );

  expect(await screen.findByText('Nothing here.')).toBeInTheDocument();
});
