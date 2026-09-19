// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import type { ReactNode } from 'react';

import { renderUi } from '../test-utils/renderUi';
import { SectionHeading } from './SectionHeading';

function FakeLink(props: {
  to: string;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <a href={props.to} className={props.className}>
      {props.children}
    </a>
  );
}

vi.mock('@tanstack/react-router', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('@tanstack/react-router')>();
  return {
    ...actual,
    Link: FakeLink,
  };
});

test('section heading shows eyebrow and title without a link', () => {
  const { container, unmount } = renderUi(
    <SectionHeading eyebrow="Latest" title="Things to know" />,
  );

  expect(container.querySelector('.eyebrow')?.textContent).toBe('Latest');
  expect(container.querySelector('h2')?.textContent).toBe('Things to know');
  expect(container.querySelector('a')).toBeNull();
  unmount();
});

test('section heading links to the full listing when given one', () => {
  const { container, unmount } = renderUi(
    <SectionHeading
      eyebrow="Latest"
      title="Things to know"
      linkLabel="See every update"
      linkTo="/updates"
    />,
  );

  expect(container.querySelector('a')?.getAttribute('href')).toBe('/updates');
  expect(container.querySelector('a')?.textContent).toContain(
    'See every update',
  );
  unmount();
});
