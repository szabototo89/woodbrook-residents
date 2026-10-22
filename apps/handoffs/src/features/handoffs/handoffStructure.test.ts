import { expect, test } from 'vitest';
import { checkHandoffStructure } from './handoffStructure';

const document = `
export const metadata = {title: 'Example'};

## Goal
Explain the change relative to base commit abc123.

## Technical changes
| Area | Before | After | Why | Code |
| --- | --- | --- | --- | --- |
| Documents | Free text | Checked structure | Review changes | HANDOFF.md |

## Architecture changes
| Level | Change | Evidence |
| --- | --- | --- |
| C1 | Unchanged: same people and systems | Documentation only |
| C2 | Unchanged: same applications | Documentation only |
| C3 | Unchanged: same components | Documentation only |

## Verification
| Check | Result | Evidence |
| --- | --- | --- |
| Build | PASS | bun run build exited 0 |
| Device | NOT RUN | No physical phone available |

## Next steps
None.
`;

test('accepts a change-focused handoff with explicit unchanged levels and tabular evidence', () => {
  expect(() => checkHandoffStructure(document, 'example', {})).not.toThrow();
});

test.each([
  [
    'state summary',
    document.replace('## Technical changes', '## Current state'),
    'Technical changes',
  ],
  [
    'missing before/after',
    document.replace('| Before |', '| State |'),
    'Before',
  ],
  [
    'missing code references',
    document.replace('| Code |', '| Notes |'),
    'Code',
  ],
  [
    'missing architecture level',
    document.replace(
      '| C3 | Unchanged: same components | Documentation only |',
      '',
    ),
    'C3',
  ],
  [
    'prose verification',
    document.replace(
      /\| Check \| Result \| Evidence \|[\s\S]*?(?=## Next steps)/,
      '- PASS: build\n\n',
    ),
    'Verification',
  ],
  [
    'unsupported result',
    document.replace('| PASS |', '| DONE |'),
    'PASS, FAIL or NOT RUN',
  ],
  [
    'missing evidence',
    document.replace('bun run build exited 0', ''),
    'Evidence',
  ],
  [
    'no verification outcomes',
    document.replace(/\| Build \|.*\n\| Device \|.*\n/, ''),
    'at least one',
  ],
  [
    'prose mixed into verification',
    document.replace('## Next steps', 'PASS: extra check\n\n## Next steps'),
    'table',
  ],
  [
    'wrong section order',
    document
      .replace('## Goal', '## Next steps')
      .replace('## Next steps\nNone.', '## Goal\nNone.'),
    'order',
  ],
])('rejects %s with an actionable error', (_name, source, message) => {
  expect(() => checkHandoffStructure(source, 'example', {})).toThrow(message);
});

test('new architecture views must show changes or explain why their level is unchanged', () => {
  expect(() =>
    checkHandoffStructure(document, 'example', {
      example: {
        handoff: 'example',
        level: 'C3' as const,
        source: 'docs/handoffs/example/assets/c3.puml',
      },
    }),
  ).toThrow('changes or unchangedReason');
  expect(() =>
    checkHandoffStructure(document, 'example', {
      example: {
        handoff: 'example',
        level: 'C3' as const,
        source: 'docs/handoffs/example/assets/c3.puml',
        unchangedReason: 'Same structure; supporting context only.',
      },
    }),
  ).not.toThrow();
  expect(() =>
    checkHandoffStructure(document, 'example', {
      other: {
        handoff: 'old',
        level: 'C3',
        source: 'docs/handoffs/old/assets/c3.puml',
      },
    }),
  ).not.toThrow();
});

test('changed views must be imported and embedded in their owning handoff', () => {
  const diagrams = {
    example: {
      handoff: 'example',
      level: 'C3' as const,
      source: 'docs/handoffs/example/assets/c3.puml',
      changes: {
        elements: {
          checker: { status: 'added' as const, description: 'New checker' },
        },
      },
    },
  };
  expect(() => checkHandoffStructure(document, 'example', diagrams)).toThrow(
    'embed',
  );
  expect(() =>
    checkHandoffStructure(
      `import source from './assets/c3.puml?raw';\n${document}\n<PlantUmlDiagram source={source} image="diagram.svg" title="Changes" />`,
      'example',
      diagrams,
    ),
  ).not.toThrow();
});

test('an architecture change needs a change-annotated diagram at the same C4 level', () => {
  const changed = document.replace(
    'Unchanged: same components',
    'Added: structure checker',
  );
  expect(() => checkHandoffStructure(changed, 'example', {})).toThrow(
    'C3 change needs',
  );
});

test('rejects the retired state section even when all new sections are present', () => {
  expect(() =>
    checkHandoffStructure(
      `${document}\n## Current state\nOld summary`,
      'example',
      {},
    ),
  ).toThrow('Replace Current state');
});
