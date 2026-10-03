import { test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from './HomePage';

test('homepage presents the reference services, packages, and process', () => {
  render(<HomePage />);
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Simple digital services for local businesses.',
    }),
  ).toBeVisible();
  [
    'Website Design',
    'Local SEO',
    'Booking & Enquiries',
    'Content Updates',
    'Ongoing Support',
    'Essentials',
    'Growth',
    'Complete',
    'How it works',
  ].map((name) => expect(screen.getByRole('heading', { name })).toBeVisible());
  [
    'From £995',
    'From £1,495',
    'From £1,995',
    'Chat about your goals',
    'Design & build',
    'Grow together',
  ].map((copy) => expect(screen.getByText(copy)).toBeVisible());
  expect(screen.getByText('Most Popular')).toBeVisible();
  expect(
    screen.getByRole('img', { name: /laptop displaying/i }),
  ).toHaveAttribute('fetchpriority', 'high');
});

test('homepage links lead to in-page sections and contact has a useful next step', () => {
  render(<HomePage />);
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });
  ['Services', 'Work', 'About', 'Contact'].map((name) => {
    const link = within(nav).getByRole('link', { name });
    const href = link.getAttribute('href');
    expect(href).toMatch(/^#/);
    expect(document.querySelector(href!)).toBeInTheDocument();
  });
  screen
    .getAllByRole('link', { name: /get started/i })
    .map((link) => expect(link).toHaveAttribute('href', '#contact'));
  expect(screen.getByRole('link', { name: 'See Our Work' })).toHaveAttribute(
    'href',
    '#work',
  );
  expect(screen.getAllByRole('link', { name: /learn more/i })).toHaveLength(5);
  expect(screen.getByRole('link', { name: /email us/i })).toHaveAttribute(
    'href',
    'mailto:hello@locale.example',
  );
  expect(screen.getByText(/illustrative testimonial/i)).toBeVisible();
});

test('FAQ buttons disclose answers and can close again with keyboard', async () => {
  const user = userEvent.setup();
  render(<HomePage />);
  const first = screen.getByRole('button', {
    name: 'How long does a website take?',
  });
  expect(first).toHaveAttribute('aria-expanded', 'false');
  await user.click(first);
  expect(first).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByText(/Most small websites take/)).toBeVisible();
  await user.keyboard('{Enter}');
  expect(first).toHaveAttribute('aria-expanded', 'false');
  expect(screen.getByText(/Most small websites take/)).not.toBeVisible();
  await user.click(
    screen.getByRole('button', {
      name: 'Can you help with my existing website?',
    }),
  );
  expect(screen.getByText(/We can review your current website/)).toBeVisible();
  await user.click(
    screen.getByRole('button', { name: 'Do you offer ongoing support?' }),
  );
  expect(screen.getByText(/Choose the support/)).toBeVisible();
});

test('mobile menu is labelled, opens, and closes when a section is selected', async () => {
  const user = userEvent.setup();
  render(<HomePage />);
  const toggle = screen.getByRole('button', { name: 'Open navigation' });
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await user.click(toggle);
  expect(
    screen.getByRole('button', { name: 'Close navigation' }),
  ).toHaveAttribute('aria-expanded', 'true');
  await user.click(
    within(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).getByRole('link', { name: 'Services' }),
  );
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await user.click(toggle);
  await user.click(screen.getByRole('button', { name: 'Close navigation' }));
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('testimonial stars have an accessible role and the illustrative portrait is decorative', () => {
  render(<HomePage />);
  expect(
    screen.getByRole('img', { name: 'Illustrative five-star rating' }),
  ).toBeVisible();
  const testimonial = screen.getByRole('region', {
    name: 'Illustrative testimonial',
  });
  const portrait = testimonial.querySelector('img');
  expect(portrait).toHaveAttribute('alt', '');
  expect(portrait).toHaveAttribute('loading', 'lazy');
});

test('collapsed FAQs retain a valid controlled panel and answers stay hidden', async () => {
  const user = userEvent.setup();
  render(<HomePage />);
  const first = screen.getByRole('button', {
    name: 'How long does a website take?',
  });
  const panel = document.getElementById(first.getAttribute('aria-controls')!);
  expect(panel).toBeInTheDocument();
  expect(panel).not.toBeVisible();
  await user.click(first);
  expect(panel).toBeVisible();
  await user.click(
    screen.getByRole('button', { name: 'Do you offer ongoing support?' }),
  );
  expect(panel).not.toBeVisible();
});

test('homepage uses the generated logo and handwritten hero annotation as image assets', () => {
  render(<HomePage />);
  const brand = screen.getByRole('link', { name: 'Locale home' });
  expect(brand.querySelector('img')).toHaveAttribute(
    'src',
    '/images/locale-logo.webp',
  );
  expect(brand.querySelector('img')).toHaveAttribute('alt', 'Locale');
  expect(
    screen.getByRole('img', {
      name: 'Websites that work for real businesses.',
    }),
  ).toHaveAttribute('src', '/images/handwritten-hero-note.webp');
});

test('hero showcases Laura Faichney’s homepage with truthful project credit', () => {
  render(<HomePage />);
  const hero = screen.getByRole('img', {
    name: /laptop displaying Laura Faichney/i,
  });
  expect(hero).toHaveAttribute('src', '/images/laura-website-1200.webp');
  expect(hero).toHaveAttribute(
    'srcset',
    expect.stringContaining('/images/laura-website-640.webp 640w'),
  );
  expect(screen.getByText('Laura Faichney · All Things Art')).toBeVisible();
  expect(
    screen.queryByText('Illustrative website concept · The Gathered Table'),
  ).not.toBeInTheDocument();
});

test('homepage main navigation includes the blog subpage', () => {
  render(<HomePage />);
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });
  expect(within(nav).getByRole('link', { name: 'Blog' })).toHaveAttribute(
    'href',
    '/blog',
  );
});
