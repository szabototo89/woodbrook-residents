import { describe, expect, it } from 'vitest';

import { formatErrorChain } from './contentBuildDiagnostics';

describe('formatErrorChain', () => {
  it('reports each distinct message in a nested error chain', () => {
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

  it('reports thrown values that are not Error instances', () => {
    expect(formatErrorChain('content unavailable')).toEqual([
      'content unavailable',
    ]);
  });
});
