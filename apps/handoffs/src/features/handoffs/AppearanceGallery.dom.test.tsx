// @vitest-environment happy-dom
import { act } from 'react';
import { expect, test } from 'vitest';
import { click, getButtonByName, renderUi } from '../../test-utils/renderUi';
import { AppearanceGallery } from './AppearanceGallery';

const images = [
  {
    src: '/desktop.png',
    title: 'Desktop',
    alt: 'Desktop layout',
    description: 'Check the document title and spacing.',
  },
  {
    src: '/mobile.png',
    title: 'Mobile',
    alt: 'Mobile layout',
    description: 'Check readable copy and no horizontal overflow.',
  },
];

test('the gallery selects screenshots and keeps their review descriptions together', () => {
  const view = renderUi(<AppearanceGallery images={images} />);
  expect(view.container.querySelector('figure img')?.getAttribute('src')).toBe(
    '/desktop.png',
  );
  expect(view.container.textContent).toContain(
    'Check the document title and spacing.',
  );
  click(getButtonByName(view.container, 'Next image'));
  expect(view.container.querySelector('figure img')?.getAttribute('alt')).toBe(
    'Mobile layout',
  );
  expect(view.container.textContent).toContain(
    'Check readable copy and no horizontal overflow.',
  );
  expect(view.container.querySelector('a')?.getAttribute('href')).toBe(
    '/mobile.png',
  );
  click(getButtonByName(view.container, 'Next image'));
  expect(view.container.textContent).toContain('1 of 2');
  click(getButtonByName(view.container, 'Previous image'));
  expect(view.container.textContent).toContain('2 of 2');
  const thumbnail = view.container.querySelector(
    'button[aria-label="Show Desktop"]',
  )!;
  click(thumbnail);
  expect(thumbnail.getAttribute('aria-pressed')).toBe('true');
  const region = view.container.querySelector('section')!;
  act(() => {
    region.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }),
    );
  });
  expect(view.container.textContent).toContain('2 of 2');
  act(() => {
    region.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
  });
  expect(view.container.textContent).toContain('1 of 2');
  act(() => {
    region.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
  });
  expect(view.container.textContent).toContain('1 of 2');
  view.unmount();
});

test('an empty gallery is omitted and a single screenshot disables cycling', () => {
  const empty = renderUi(<AppearanceGallery images={[]} />);
  expect(empty.container.textContent).toBe('');
  empty.unmount();
  const single = renderUi(<AppearanceGallery images={[images[0]!]} />);
  expect(getButtonByName(single.container, 'Next image').disabled).toBe(true);
  expect(getButtonByName(single.container, 'Previous image').disabled).toBe(
    true,
  );
  single.unmount();
});
