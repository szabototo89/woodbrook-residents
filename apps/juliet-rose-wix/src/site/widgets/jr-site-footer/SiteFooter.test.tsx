import { readFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { expect, test } from 'vitest';

import { blanketRootAnchorColor } from '../../../test-utils/cssCascade';
import { renderUi } from '../../../test-utils/renderUi';
import { SiteFooter } from './SiteFooter';

const workingDirectory = process.cwd();
const cssPath = resolve(
  basename(workingDirectory) === 'juliet-rose-wix'
    ? workingDirectory
    : resolve(workingDirectory, 'apps/juliet-rose-wix'),
  'src/site/widgets/jr-site-footer/jr-site-footer.module.css',
);
const footerCss = readFileSync(cssPath, 'utf8');

test('site footer renders the brand, navigation, social, and legal line', () => {
  const view = renderUi(<SiteFooter />);

  expect(view.container.textContent).toContain('Juliet Rose');
  expect(view.container.textContent).toContain('Beauty Studio');
  expect(
    view.container.querySelector('nav[aria-label="Footer navigation"]'),
  ).not.toBeNull();
  for (const label of ['Home', 'Treatments', 'Gift Cards', 'Contact']) {
    expect(view.container.textContent).toContain(label);
  }
  expect(
    view.container.querySelector('a[aria-label="Instagram"]'),
  ).not.toBeNull();
  expect(view.container.textContent).toContain('Relax and Revitalize');
  expect(view.container.textContent).toContain(
    '© 2026 Juliet Rose beauty studio. All rights reserved.',
  );
  view.unmount();
});

test('site footer honours widget properties for links and copy', () => {
  const view = renderUi(
    <SiteFooter
      treatmentsUrl="/custom-treatments"
      instagramUrl="https://example.com/studio"
      tagline="Custom tagline"
      copyright="Custom copyright"
    />,
  );

  expect(
    view.container.querySelector('a[href="/custom-treatments"]'),
  ).not.toBeNull();
  expect(
    view.container.querySelector('a[href="https://example.com/studio"]'),
  ).not.toBeNull();
  expect(view.container.textContent).toContain('Custom tagline');
  expect(view.container.textContent).toContain('Custom copyright');
  view.unmount();
});

test('footer brand keeps the rose studio color over the anchor reset', () => {
  // Same root cause as the header button text: a blanket `.root a`
  // color rule (0,1,1) would beat `.brand` (0,1,0) and turn the studio
  // name dark. The reset must stay scoped to plain navigation links.
  expect(footerCss).toMatch(/\.brand\s*\{[^}]*color:\s*var\(--jr-rose\)/);
  expect(blanketRootAnchorColor(footerCss)).toBeNull();
});
