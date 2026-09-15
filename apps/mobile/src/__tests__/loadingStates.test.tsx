import '@testing-library/jest-dom';
import { act, render, screen } from '@lynx-js/react/testing-library';
import { afterEach, expect, test, vi } from 'vitest';

import { App, LOAD_TIMEOUT_MS } from '../App.js';
import { StatusScreen } from '../components/StatusScreen.js';
import type { ContentSnapshot } from '../features/content/contentTypes.js';

const empty: ContentSnapshot = {
  updates: [],
  projects: [],
  events: [],
  surveys: [],
  resources: [],
};

afterEach(() => {
  vi.useRealTimers();
});

test('loading shows skeleton placeholders while content resolves', async () => {
  const { container } = render(
    <App loadContent={() => Promise.resolve(empty)} />,
  );

  expect(container.querySelector('.skeleton-line')).toBeInTheDocument();
  expect(await screen.findByText('Browse all sections')).toBeInTheDocument();
});

test('slow loading offers a retry after a timeout and recovers', async () => {
  vi.useFakeTimers();
  let resolveLoad!: (snapshot: ContentSnapshot) => void;
  const loadContent = vi.fn(
    () =>
      new Promise<ContentSnapshot>((resolve) => {
        resolveLoad = resolve;
      }),
  );
  render(<App loadContent={loadContent} />);

  expect(screen.queryByText('Try again')).not.toBeInTheDocument();
  act(() => {
    vi.advanceTimersByTime(LOAD_TIMEOUT_MS);
  });
  expect(screen.getByText('Try again')).toBeInTheDocument();

  await act(async () => {
    resolveLoad(empty);
  });
  expect(
    screen.queryByText('Content is temporarily unavailable.'),
  ).not.toBeInTheDocument();
  expect(screen.getByText('Browse all sections')).toBeInTheDocument();
});

test('status screen announces loading with skeleton placeholders', () => {
  const { container } = render(<StatusScreen />);

  expect(container.querySelectorAll('.skeleton-line')).toHaveLength(3);
});
