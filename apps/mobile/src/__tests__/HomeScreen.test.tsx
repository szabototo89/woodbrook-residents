import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@lynx-js/react/testing-library';
import { expect, test, vi } from 'vitest';

import { App } from '../App.js';
import { HomeScreen } from '../features/home/HomeScreen.js';

test('app renders the Woodbrook home screen', async () => {
  render(
    <App
      loadContent={() =>
        Promise.resolve({
          updates: [],
          projects: [],
          events: [],
          surveys: [],
          resources: [],
        })
      }
    />,
  );

  expect(await screen.findByText('Start here')).toBeInTheDocument();
  expect(screen.getByText('Community hub · Shankill')).toBeInTheDocument();
});

test('home screen preserves Woodbrook identity and purpose', async () => {
  render(<HomeScreen />);

  expect(await screen.findByText('Woodbrook Residents')).toBeInTheDocument();
  expect(
    screen.getByText('Local information and ways to take part.'),
  ).toBeInTheDocument();
  expect(screen.getByText('For Woodbrook residents')).toBeInTheDocument();
});

test('home screen keeps the inform, organise, then act hierarchy', async () => {
  const navigate = vi.fn();
  render(<HomeScreen navigate={navigate} />);

  expect(await screen.findByText('Start here')).toBeInTheDocument();
  expect(screen.getByText('What would you like to do?')).toBeInTheDocument();
  expect(screen.getByText('Browse local information')).toBeInTheDocument();
  expect(screen.getByText('Read local updates')).toBeInTheDocument();
  expect(screen.getByText('Find upcoming events')).toBeInTheDocument();
  expect(screen.getByText('View public consultations')).toBeInTheDocument();
  expect(
    screen.getByText('Help keep local information useful.'),
  ).toBeInTheDocument();

  fireEvent.tap(screen.getByText('Browse local information'));
  fireEvent.tap(screen.getByText('See ways to help →'));
  expect(navigate).toHaveBeenCalledTimes(2);
});

test('home screen remains safe when rendered without a navigator', async () => {
  render(<HomeScreen />);
  fireEvent.tap(await screen.findByText('Read local updates'));
});

test('home screen identifies its source-backed Woodbrook image', async () => {
  const { container } = render(<HomeScreen />);

  expect(
    await screen.findByText('Image: Woodbrook Shankill'),
  ).toBeInTheDocument();
  expect(
    container.querySelector(
      '[accessibility-label="Aerial view across Woodbrook toward the coast, Bray and the Wicklow Mountains"]',
    ),
  ).toBeInTheDocument();
});
