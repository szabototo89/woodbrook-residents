import { test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BlogPage } from './BlogPage';

test('blog presents useful guides and a menu that returns to homepage sections', () => {
  render(<BlogPage />);
  expect(
    screen.getByRole('link', { name: 'Forma Studio home' }),
  ).toHaveAttribute('href', '/');
  expect(screen.getByRole('img', { name: 'Forma Studio' })).toHaveAttribute(
    'src',
    '/images/forma-studio-logo.webp',
  );
  expect(screen.getByText('The Forma Studio journal')).toBeVisible();
  expect(
    screen.getByText('Forma Studio · Websites for local businesses'),
  ).toBeVisible();
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Small ideas. A stronger online presence.',
    }),
  ).toBeVisible();
  [
    'A website that feels like your business',
    'Help local customers find you',
    'Keep your website feeling fresh',
  ].map((name) => expect(screen.getByRole('heading', { name })).toBeVisible());
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
    'href',
    '/blog',
  );
  expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
    'aria-current',
    'page',
  );
  expect(within(nav).getByRole('link', { name: 'Services' })).toHaveAttribute(
    'href',
    '/#services',
  );
  expect(within(nav).getByRole('link', { name: 'Contact' })).toHaveAttribute(
    'href',
    '/#contact',
  );
  expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
    'href',
    '/',
  );
});

test('blog guides expand and collapse in place', async () => {
  const user = userEvent.setup();
  render(<BlogPage />);
  const guide = screen.getByText('Read guide', {
    selector: 'summary',
    exact: false,
  });
  expect(
    screen.getByText(/Start with the questions your customers/),
  ).not.toBeVisible();
  await user.click(guide);
  expect(
    screen.getByText(/Start with the questions your customers/),
  ).toBeVisible();
  await user.click(guide);
  expect(
    screen.getByText(/Start with the questions your customers/),
  ).not.toBeVisible();
});
