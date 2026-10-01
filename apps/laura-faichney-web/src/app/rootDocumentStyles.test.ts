import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'vitest';

const appDir = dirname(fileURLToPath(import.meta.url));
const rootSource = readFileSync(
  join(appDir, '..', 'routes', '__root.tsx'),
  'utf8',
);

test('root document wires global styles through the Vite CSS pipeline', () => {
  // A `?url` import resolves to `/src/styles.css` in dev, which Vite serves
  // as JavaScript (HMR runtime) instead of CSS, so the browser ignores the
  // manual <link> and the page renders unstyled. A side-effect import lets
  // TanStack Start inject compiled CSS in dev and bundle it in production.
  expect(rootSource).toContain("'../styles.css'");
  expect(rootSource).not.toContain('styles.css?url');
  expect(rootSource).not.toContain('href={styles}');
});
