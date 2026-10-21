// @vitest-environment happy-dom
import { expect, test, vi } from 'vitest';
import { click, getButtonByName, renderUi } from '../../test-utils/renderUi';
import { HandoffOutline } from './HandoffOutline';

test('section navigation scrolls to the chosen heading without changing the document route', () => {
  const article = document.createElement('article');
  article.className = 'handoff-document';
  article.innerHTML = '<h2>Goal</h2><h2>Appearance</h2>';
  document.body.append(article);
  const target = article.querySelectorAll('h2')[1]!;
  const scroll = vi.fn();
  target.scrollIntoView = scroll;
  const hash = window.location.hash;
  const view = renderUi(<HandoffOutline slug="sample" />);
  click(getButtonByName(view.container, 'Appearance'));
  expect(scroll).toHaveBeenCalledWith({ block: 'start' });
  expect(window.location.hash).toBe(hash);
  expect(view.container.querySelector('nav')?.getAttribute('aria-label')).toBe(
    'On this page',
  );
  view.unmount();
  article.remove();
});
