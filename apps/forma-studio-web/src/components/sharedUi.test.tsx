import { test, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Leaf } from 'lucide-react';
import { SiteLayout } from './SiteLayout';
import { ActionLink } from './ActionLink';
import { SectionHeading } from './SectionHeading';
import { IconBadge } from './IconBadge';
import { Disclosure } from './Disclosure';

test.each(['home', 'blog'] as const)(
  'shared %s chrome has one main target, navigation and the page footer',
  (page) => {
    render(
      <SiteLayout page={page}>
        <h1>Page title</h1>
      </SiteLayout>,
    );
    expect(
      screen.getByRole('link', { name: 'Skip to content' }),
    ).toHaveAttribute('href', '#main-content');
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content');
    expect(screen.getByRole('main')).toHaveAttribute('tabindex', '-1');
    expect(
      within(screen.getByRole('main')).getByRole('heading', { level: 1 }),
    ).toHaveTextContent('Page title');
    const footer = screen.getByRole('contentinfo');
    expect(
      within(footer).queryByText(
        'Forma Studio · Websites for local businesses',
      ),
    ).not.toBeInTheDocument();
    if (page === 'blog') {
      expect(
        within(footer).getByRole('link', { name: 'Back to Forma Studio home' }),
      ).toHaveAttribute('href', '/');
      expect(
        within(screen.getByRole('navigation')).getByRole('link', {
          name: 'Services',
        }),
      ).toHaveAttribute('href', '/#services');
    } else {
      expect(
        within(footer).getByText('Web design · Local SEO · Ongoing support'),
      ).toBeVisible();
      expect(within(footer).queryByRole('link')).not.toBeInTheDocument();
    }
  },
);

test('shared chrome defaults to the homepage', () => {
  render(
    <SiteLayout>
      <h1>Home</h1>
    </SiteLayout>,
  );
  expect(
    screen.getByRole('link', { name: 'Forma Studio home' }),
  ).toHaveAttribute('href', '#main-content');
});

test('action variants stay native links with one accessible name and the supplied destination', async () => {
  const user = userEvent.setup();
  render(
    <>
      <ActionLink href="#contact">Discuss your project</ActionLink>
      <ActionLink
        variant="text"
        arrow="up-right"
        iconSize={17}
        href="https://example.com"
      >
        Visit the website
      </ActionLink>
      <ActionLink
        variant="text"
        arrow="left"
        iconSize={15}
        className="back-link"
        href="/"
      >
        Back to home
      </ActionLink>
    </>,
  );
  const action = screen.getByRole('link', { name: 'Discuss your project' });
  expect(action).toHaveAttribute('href', '#contact');
  expect(action).not.toHaveAttribute('role');
  await user.tab();
  expect(action).toHaveFocus();
  expect(
    screen.getByRole('link', { name: 'Visit the website' }),
  ).toHaveAttribute('href', 'https://example.com');
  expect(screen.getByRole('link', { name: 'Back to home' })).toHaveAttribute(
    'href',
    '/',
  );
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
});

test('section headings preserve h2 hierarchy and optional supporting copy', () => {
  const { rerender } = render(
    <SectionHeading
      id="services-title"
      title="Services"
      description="What we offer"
      descriptionArrow
    />,
  );
  expect(
    screen.getByRole('heading', { level: 2, name: 'Services' }),
  ).toHaveAttribute('id', 'services-title');
  expect(screen.getByText('What we offer')).toBeVisible();
  rerender(
    <SectionHeading
      id="work-title"
      title="Selected work"
      eyebrow="Our work"
      description="A real project"
    />,
  );
  expect(screen.getByText('Our work')).toBeVisible();
  expect(
    screen.getByRole('heading', { level: 2, name: 'Selected work' }),
  ).toHaveAttribute('id', 'work-title');
});

test.each(['service', 'guide'] as const)(
  '%s icon treatment is decorative',
  (variant) => {
    const { container } = render(<IconBadge variant={variant} icon={Leaf} />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  },
);

test.each(['service', 'guide'] as const)(
  '%s disclosure uses a native summary and independently reveals its content',
  async (variant) => {
    const user = userEvent.setup();
    render(
      <>
        <Disclosure variant={variant} summary="Read details">
          <p>First answer</p>
        </Disclosure>
        <Disclosure variant={variant} summary="More details">
          <p>Second answer</p>
        </Disclosure>
      </>,
    );
    expect(screen.getByText('First answer')).not.toBeVisible();
    await user.click(screen.getByText('Read details', { selector: 'summary' }));
    expect(screen.getByText('First answer')).toBeVisible();
    expect(screen.getByText('Second answer')).not.toBeVisible();
    await user.click(screen.getByText('Read details', { selector: 'summary' }));
    expect(screen.getByText('First answer')).not.toBeVisible();
  },
);
