import { test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HomePage } from './HomePage';

test('homepage presents the reference services, packages, and process', () => {
  render(<HomePage />);
  expect(
    screen.getByRole('heading', {
      level: 1,
      name: 'Websites that help local businesses grow.',
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
    'Plan your website',
    'Design, build & review',
    'Launch & hand over',
  ].map((copy) => expect(screen.getByText(copy)).toBeVisible());
  expect(screen.getByText('Website + local SEO')).toBeVisible();
  expect(
    screen.getByRole('img', { name: /laptop displaying/i }),
  ).toHaveAttribute('fetchpriority', 'high');
});

test('homepage links lead to in-page sections and contact has a useful next step', () => {
  render(<HomePage />);
  const nav = screen.getByRole('navigation', { name: 'Main navigation' });
  ['Services', 'Work', 'How we work', 'Contact'].map((name) => {
    const link = within(nav).getByRole('link', { name });
    const href = link.getAttribute('href');
    expect(href).toMatch(/^#/);
    expect(document.querySelector(href!)).toBeInTheDocument();
  });
  screen
    .getAllByRole('link', { name: /discuss your project/i })
    .map((link) => expect(link).toHaveAttribute('href', '#contact'));
  expect(screen.getByRole('link', { name: 'See Our Work' })).toHaveAttribute(
    'href',
    '#work',
  );
  expect(
    screen.getAllByText('What’s included', { selector: 'summary' }),
  ).toHaveLength(5);
  const enquiry = new URL(
    screen.getByRole('link', { name: /email us/i }).getAttribute('href')!,
  );
  expect(enquiry.protocol).toBe('mailto:');
  expect(enquiry.pathname).toBe('szabototo89@gmail.com');
  expect(enquiry.searchParams.get('subject')).toBe('Website project enquiry');
  expect(enquiry.searchParams.get('body')).toContain('What you need:');
  expect(
    screen.getByRole('link', { name: 'szabototo89@gmail.com' }),
  ).toHaveAttribute('href', enquiry.href);
  expect(
    screen.getByText(/your business, what you need and your ideal timing/i),
  ).toBeVisible();
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

test('prospects can inspect real work without fictional social proof', () => {
  render(<HomePage />);
  const work = screen.getByRole('region', { name: 'A website in the wild' });
  expect(
    within(work).getByRole('img', { name: /Laura Faichney’s live website/i }),
  ).toHaveAttribute(
    'src',
    'https://cdn.sanity.io/images/ms27me7o/production/laura-project.jpg',
  );
  expect(work).toHaveAttribute('id', 'work');
  expect(
    within(work).getByRole('heading', {
      name: 'Laura Faichney · All Things Art',
    }),
  ).toBeVisible();
  expect(
    within(work).getByRole('link', { name: /visit the website/i }),
  ).toHaveAttribute('href', 'https://laura-faichney-all-things-art.pages.dev');
  expect(
    within(work).getByText(
      /gallery, clear service details and an easy way to enquire/i,
    ),
  ).toBeVisible();
  expect(
    screen.queryByRole('region', { name: 'Illustrative testimonial' }),
  ).not.toBeInTheDocument();
  expect(
    screen.getByRole('heading', {
      name: 'What to bring to our first conversation',
    }),
  ).toBeVisible();
});

test('service details explain deliverables and packages have a next step', async () => {
  const user = userEvent.setup();
  render(<HomePage />);
  const card = screen
    .getByRole('heading', { name: 'Local SEO' })
    .closest('article')!;
  const details = within(card).getByText('What’s included', {
    selector: 'summary',
  });
  expect(
    within(card).getByText('Page titles and descriptions'),
  ).not.toBeVisible();
  await user.click(details);
  expect(within(card).getByText('Page titles and descriptions')).toBeVisible();
  await user.click(details);
  expect(
    within(card).getByText('Page titles and descriptions'),
  ).not.toBeVisible();
  ['Essentials', 'Growth', 'Complete'].map((name) => {
    expect(
      screen.getByRole('link', { name: `Discuss ${name}` }),
    ).toHaveAttribute('href', '#contact');
  });
  expect(
    screen.getByText(
      /final quote confirms scope, hosting and any ongoing costs/i,
    ),
  ).toBeVisible();
  expect(
    screen.queryByRole('link', { name: /view all faqs/i }),
  ).not.toBeInTheDocument();
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

test('homepage uses its logo and a readable text annotation over the hero', () => {
  render(<HomePage />);
  const brand = screen.getByRole('link', { name: 'Forma Studio home' });
  expect(brand.querySelector('img')).toHaveAttribute(
    'src',
    'https://cdn.sanity.io/images/ms27me7o/production/forma-studio-logo.webp',
  );
  expect(brand.querySelector('img')).toHaveAttribute('alt', 'Forma Studio');
  expect(
    screen.getByText('Forma Studio · Websites for local businesses'),
  ).toBeVisible();
  expect(
    screen.getByText('Websites that work for real businesses.'),
  ).toBeVisible();
});

test('hero showcases Laura Faichney’s homepage with truthful project credit', () => {
  render(<HomePage />);
  const hero = screen.getByRole('img', {
    name: /laptop displaying Laura Faichney/i,
  });
  expect(hero).toHaveAttribute(
    'src',
    'https://cdn.sanity.io/images/ms27me7o/production/laura-website-1200.webp',
  );
  expect(hero).toHaveAttribute(
    'srcset',
    expect.stringContaining('w=640&auto=format 640w'),
  );
  expect(
    screen.getByRole('heading', { name: 'Laura Faichney · All Things Art' }),
  ).toBeVisible();
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

test('Escape dismisses mobile navigation and returns focus to its control', async () => {
  const user = userEvent.setup();
  render(<HomePage />);
  const toggle = screen.getByRole('button', { name: 'Open navigation' });
  await user.click(toggle);
  await user.tab();
  await user.keyboard('{Escape}');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});

test('Escape dismisses an open menu when focus is outside the header', async () => {
  const user = userEvent.setup();
  render(<HomePage />);
  const toggle = screen.getByRole('button', { name: 'Open navigation' });
  await user.click(toggle);
  await user.click(screen.getByRole('heading', { level: 1 }));
  expect(toggle).not.toHaveFocus();
  await user.keyboard('{Escape}');
  expect(toggle).toHaveAttribute('aria-expanded', 'false');
  expect(toggle).toHaveFocus();
});

test('the project preview itself opens the live website', () => {
  render(<HomePage />);
  const preview = screen.getByRole('link', {
    name: 'Preview Laura Faichney’s live website',
  });
  expect(preview).toHaveAttribute(
    'href',
    'https://laura-faichney-all-things-art.pages.dev',
  );
  expect(
    within(preview).getByRole('img', {
      name: /Laura Faichney’s live website/i,
    }),
  ).toBeVisible();
});

test('published CMS changes supply homepage copy and contact settings without editing UI code', async () => {
  const { content } = await import('../content/content');
  const previous = content.home.hero.title;
  const email = content.settings.enquiryEmail;
  content.home.hero.title = ['A published CMS heading'];
  content.settings.enquiryEmail = 'editor@example.com';
  try {
    render(<HomePage />);
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'A published CMS heading',
      }),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: /email us/i })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:editor@example.com'),
    );
  } finally {
    content.home.hero.title = previous;
    content.settings.enquiryEmail = email;
  }
});
