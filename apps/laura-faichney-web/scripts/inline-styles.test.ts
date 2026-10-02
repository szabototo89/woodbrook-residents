import { expect, test } from 'bun:test';
import { inlineStyles } from './inline-styles';

test('minifies inline styles while preserving public asset URLs and cascade order', () => {
  const result = inlineStyles([
    '/* services */ .hero { color: red; background: url("/decoration/brush.webp"); }',
    '@import "./services.css"; .hero { color: navy; }',
  ]);
  expect(result).toContain('/decoration/brush.webp');
  expect(result).not.toContain('/*');
  expect(result).not.toContain('@import');
  expect(result.indexOf('red')).toBeLessThan(result.indexOf('navy'));
  expect(result.length).toBeLessThan(110);
});
