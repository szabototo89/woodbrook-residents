import { expect, test } from 'vitest';

import {
  HOME_CONTENT_DEFAULTS,
  mergeText,
  resolveHomeContent,
  resolveText,
} from './homeContent';
import { queryHomeContent } from './homeContentServices';

test('resolveText falls back for missing values', () => {
  expect(resolveText(undefined, 'Default')).toBe('Default');
  expect(resolveText(null, 'Default')).toBe('Default');
});

test('resolveText falls back for empty or blank strings', () => {
  expect(resolveText('', 'Default')).toBe('Default');
  expect(resolveText('   ', 'Default')).toBe('Default');
});

test('resolveText keeps non-empty values', () => {
  expect(resolveText('Hello', 'Default')).toBe('Hello');
});

test('mergeText prefers the explicit prop, then CMS, then default', () => {
  expect(mergeText('Explicit', 'CMS', 'Default')).toBe('Explicit');
  expect(mergeText('', 'CMS', 'Default')).toBe('CMS');
  expect(mergeText(undefined, 'CMS', 'Default')).toBe('CMS');
  expect(mergeText(undefined, '', 'Default')).toBe('Default');
  expect(mergeText('', '   ', 'Default')).toBe('Default');
});

test('resolveHomeContent resolves empty input to defaults', () => {
  const resolved = resolveHomeContent(null);
  expect(resolved.heroTitle).toBe(HOME_CONTENT_DEFAULTS.heroTitle);
  expect(resolved.visitTitle).toBe(HOME_CONTENT_DEFAULTS.visitTitle);
});

test('resolveHomeContent reads values from grouped object sections', () => {
  const resolved = resolveHomeContent({
    hero: { title: 'Custom title', eyebrow: '' },
    gift: { buttonLabel: '  ' },
  });
  expect(resolved.heroTitle).toBe('Custom title');
  expect(resolved.heroEyebrow).toBe(HOME_CONTENT_DEFAULTS.heroEyebrow);
  expect(resolved.giftButtonLabel).toBe(HOME_CONTENT_DEFAULTS.giftButtonLabel);
});

test('resolveHomeContent falls back to legacy flat fields', () => {
  const resolved = resolveHomeContent({
    heroTitle: 'Legacy title',
    heroEyebrow: '',
  });
  expect(resolved.heroTitle).toBe('Legacy title');
  expect(resolved.heroEyebrow).toBe(HOME_CONTENT_DEFAULTS.heroEyebrow);
});

test('resolveHomeContent prefers section values over flat fields', () => {
  const resolved = resolveHomeContent({
    hero: { title: 'Section title' },
    heroTitle: 'Legacy title',
  });
  expect(resolved.heroTitle).toBe('Section title');
});

test('queryHomeContent returns an empty object when fetch fails', async () => {
  const result = await queryHomeContent(async () => {
    throw new Error('boom');
  });
  expect(result).toEqual({});
});

test('queryHomeContent returns fetched item data', async () => {
  const result = await queryHomeContent(async () => ({
    heroTitle: 'CMS title',
  }));
  expect(result.heroTitle).toBe('CMS title');
});
