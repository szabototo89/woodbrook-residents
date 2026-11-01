import '@testing-library/jest-dom';
import { render } from '@lynx-js/react/testing-library';
import { afterEach, expect, test, vi } from 'vitest';
import { AppHeader } from '../components/AppHeader.js';

afterEach(() => vi.unstubAllGlobals());

for (const compact of [false, true]) {
  test(`native ${compact ? 'detail' : 'home'} header clears the host status bar`, () => {
    const previous = lynx.__globalProps;
    lynx.__globalProps = { ...previous, safeAreaTop: 61 };
    vi.stubGlobal('SystemInfo', { platform: 'iOS' });
    try {
      const { container } = render(
        <AppHeader navigate={vi.fn()} compact={compact} />,
      );
      expect(container.querySelector('.app-header')).toHaveStyle({
        paddingTop: '61px',
      });
    } finally {
      lynx.__globalProps = previous;
    }
  });
}

test('a host with zero inset does not add a second status-bar allowance', () => {
  const previous = lynx.__globalProps;
  lynx.__globalProps = { ...previous, safeAreaTop: 0 };
  vi.stubGlobal('SystemInfo', { platform: 'iOS' });
  try {
    const { container } = render(<AppHeader navigate={vi.fn()} />);
    expect(container.querySelector('.app-header')).toHaveStyle({
      paddingTop: '0px',
    });
  } finally {
    lynx.__globalProps = previous;
  }
});
