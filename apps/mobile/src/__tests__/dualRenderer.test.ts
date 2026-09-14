import '@testing-library/jest-dom';
import { readFileSync } from 'node:fs';

import { expect, test } from 'vitest';

import { mountMobileWebRenderer } from '../../web/mountMobileWebRenderer.js';

type MobilePackage = {
  scripts: Record<string, string>;
};

const mobilePackage: MobilePackage = JSON.parse(
  readFileSync('package.json', 'utf8'),
);

test('mobile package exposes explicit iOS, web, and combined renderer commands', () => {
  expect(mobilePackage.scripts['dev:ios']).toBe(
    'rspeedy dev --environment lynx',
  );
  expect(mobilePackage.scripts['dev:web']).toContain('concurrently');
  expect(mobilePackage.scripts['dev:all']).toContain('concurrently');
  expect(mobilePackage.scripts['build:ios']).toBe(
    'rspeedy build --environment lynx',
  );
  expect(mobilePackage.scripts['build:web:bundle']).toBe(
    'rspeedy build --environment web',
  );
  expect(mobilePackage.scripts['build:web']).toContain('build:web:bundle');
  expect(mobilePackage.scripts['build:all']).toContain('build:ios');
  expect(mobilePackage.scripts.build).toBe('bun run build:all');
});

test('web renderer mounts the shared Lynx bundle in an accessible full-page host', () => {
  const lynxView = mountMobileWebRenderer(document, '/lynx/test.bundle');

  expect(document.title).toBe('Woodbrook Residents mobile');
  expect(lynxView.tagName.toLowerCase()).toBe('lynx-view');
  expect(lynxView).toHaveAttribute('url', '/lynx/test.bundle');
  expect(lynxView).toHaveAttribute(
    'aria-label',
    'Woodbrook Residents mobile application',
  );
  expect(document.querySelector('main')).toContainElement(lynxView);
});
