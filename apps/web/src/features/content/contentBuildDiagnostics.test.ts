import { expect, test } from 'vitest';

import { formatErrorChain } from './contentBuildDiagnostics';

test('formatErrorChain reports each distinct message in a nested error chain', () => {
  const sourceError = new Error(
    'Local_Info row 25 field "emergency_only": is required.',
  );
  const buildError = new Error(
    'Static site build could not load required content.',
    { cause: sourceError },
  );

  expect(formatErrorChain(buildError)).toEqual([
    'Static site build could not load required content.',
    'Local_Info row 25 field "emergency_only": is required.',
  ]);
});

test('formatErrorChain reports thrown values that are not Error instances', () => {
  expect(formatErrorChain('content unavailable')).toEqual([
    'content unavailable',
  ]);
});

test('formatErrorChain lists each distinct message only once', () => {
  const error = new Error('Same message.', {
    cause: new Error('Same message.'),
  });

  expect(formatErrorChain(error)).toEqual(['Same message.']);
});

test('formatErrorChain falls back when no error information is available', () => {
  expect(formatErrorChain(null)).toEqual(['Unknown build error.']);
  expect(formatErrorChain(undefined)).toEqual(['Unknown build error.']);
});
