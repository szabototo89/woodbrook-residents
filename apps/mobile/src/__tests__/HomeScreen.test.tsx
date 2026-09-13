import '@testing-library/jest-dom';
import { render, screen } from '@lynx-js/react/testing-library';
import { expect, test } from '@rstest/core';

import { App } from '../App.js';
import { HomeScreen } from '../features/home/HomeScreen.js';

test('app renders the Woodbrook home screen', async () => {
  render(<App />);

  expect(await screen.findByText('Start here')).toBeInTheDocument();
});

test('home screen preserves Woodbrook identity and purpose', async () => {
  render(<HomeScreen />);

  expect(await screen.findAllByText('Woodbrook Residents')).toHaveLength(2);
  expect(screen.getByText('Community hub · Shankill')).toBeInTheDocument();
  expect(
    screen.getByText('Local information and ways to take part.'),
  ).toBeInTheDocument();
  expect(screen.getByText('For Woodbrook residents')).toBeInTheDocument();
});

test('home screen keeps the inform, organise, then act hierarchy', async () => {
  render(<HomeScreen />);

  expect(await screen.findByText('Start here')).toBeInTheDocument();
  expect(screen.getByText('What would you like to do?')).toBeInTheDocument();
  expect(screen.getByText('Browse local information')).toBeInTheDocument();
  expect(screen.getByText('Read local updates')).toBeInTheDocument();
  expect(screen.getByText('Find upcoming events')).toBeInTheDocument();
  expect(screen.getByText('View public consultations')).toBeInTheDocument();
  expect(
    screen.getByText('Help keep local information useful.'),
  ).toBeInTheDocument();
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
