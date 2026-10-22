import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { expect, test } from 'vitest';
import {
  c4ModelSchema,
  renderC4Diagram,
  validateC4Model,
  type C4Model,
} from './c4Model';

const model: C4Model = {
  audience: 'A new engineer who does not know the product',
  elements: {
    engineer: {
      kind: 'person',
      name: 'Engineer',
      description: 'Reviews implementation notes',
    },
    tooling: {
      kind: 'system',
      name: 'Handoff tooling',
      description: 'Shares engineering context',
    },
    reader: {
      kind: 'container',
      name: 'Browser reader',
      description: 'Displays implementation notes',
      technology: 'React',
      parent: 'tooling',
    },
    notes: {
      kind: 'database',
      name: 'Feature notes',
      description: 'Stores handoff documents',
      technology: 'MDX and SVG',
      parent: 'tooling',
    },
    navigation: {
      kind: 'component',
      name: 'Document navigation',
      description: 'Opens a feature handoff',
      technology: 'React',
      parent: 'reader',
    },
    repository: {
      kind: 'system',
      name: 'Git repository',
      description: 'Versions engineering documents',
    },
  },
  relationships: {
    review: {
      from: 'engineer',
      to: 'tooling',
      label: 'Reviews feature notes using',
    },
    read: {
      from: 'reader',
      to: 'notes',
      label: 'Loads compiled notes from',
      technology: 'Bundled assets',
    },
  },
  diagrams: {
    context: {
      level: 'C1',
      scope: 'tooling',
      title: 'Handoff tooling — system context',
      handoff: 'example',
      source: 'docs/handoffs/example/assets/c1-context.puml',
      elements: ['engineer', 'tooling', 'repository'],
      relationships: ['review'],
    },
    containers: {
      level: 'C2',
      scope: 'tooling',
      title: 'Handoff tooling — containers',
      handoff: 'example',
      source: 'docs/handoffs/example/assets/c2-containers.puml',
      elements: ['reader', 'notes'],
      relationships: ['read'],
    },
    components: {
      level: 'C3',
      scope: 'reader',
      title: 'Browser reader — components',
      handoff: 'example',
      source: 'docs/handoffs/example/assets/c3-components.puml',
      elements: ['navigation', 'repository'],
      relationships: [],
    },
  },
};

test('one canonical element supplies the same name and responsibility to every view', () => {
  const changed = structuredClone(model);
  changed.elements.tooling!.name = 'Engineering handoff tool';
  expect(renderC4Diagram(changed, 'context')).toContain(
    'System(tooling, "Engineering handoff tool", "Shares engineering context")',
  );
  expect(renderC4Diagram(changed, 'containers')).toContain(
    'System_Boundary(tooling, "Engineering handoff tool")',
  );
  expect(renderC4Diagram(model, 'containers')).toContain(
    'ContainerDb(notes, "Feature notes", "MDX and SVG", "Stores handoff documents")',
  );
  expect(renderC4Diagram(model, 'components')).toContain(
    'Container_Boundary(reader, "Browser reader")',
  );
  expect(renderC4Diagram(model, 'components')).toContain(
    'System_Ext(repository',
  );
});

test('generated PlantUML includes local libraries, a legend, explicit relationships and escaped labels', () => {
  const changed = structuredClone(model);
  changed.elements.reader!.description =
    'Reads "published" notes\nand evidence';
  const source = renderC4Diagram(changed, 'containers');
  expect(source).toContain('!include <C4/C4_Container>');
  expect(source).toContain('!pragma layout smetana');
  expect(source).toContain('Reads \\"published\\" notes\\nand evidence');
  expect(source).toContain(
    'Rel(reader, notes, "Loads compiled notes from", "Bundled assets")',
  );
  expect(source).toContain('SHOW_LEGEND()\n@enduml');
  expect(renderC4Diagram(model, 'context')).toContain(
    'Rel(engineer, tooling, "Reviews feature notes using")',
  );
});

test.each([
  [
    'an absent audience',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.audience = '';
      return changed;
    },
    'audience',
  ],
  [
    'a missing parent',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.elements.reader!.parent = 'missing';
      return changed;
    },
    'parent',
  ],
  [
    'a wrong parent kind',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.elements.navigation!.parent = 'tooling';
      return changed;
    },
    'parent',
  ],
  [
    'missing technology',
    (input: C4Model) => {
      const changed = structuredClone(input);
      delete changed.elements.reader!.technology;
      return changed;
    },
    'technology',
  ],
  [
    'an unknown element',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.elements.push('missing');
      return changed;
    },
    'Unknown element',
  ],
  [
    'an unknown relationship',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.relationships.push('missing');
      return changed;
    },
    'Unknown relationship',
  ],
  [
    'an absent endpoint',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.relationships.review!.to = 'missing';
      return changed;
    },
    'endpoint',
  ],
  [
    'a relationship outside its view',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.containers!.relationships.push('review');
      return changed;
    },
    'outside',
  ],
  [
    'a mixed abstraction',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.elements.push('reader');
      return changed;
    },
    'level',
  ],
  [
    'a wrong scope',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.components!.scope = 'tooling';
      return changed;
    },
    'scope',
  ],
  [
    'a shared asset folder',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.source = 'docs/handoffs/other/assets/c1.puml';
      return changed;
    },
    'assets',
  ],
  [
    'a component from another container',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.components!.scope = 'notes';
      return changed;
    },
    'scope',
  ],
  [
    'a duplicate element reference',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.elements.push('tooling');
      return changed;
    },
    'Repeated element',
  ],
  [
    'a duplicate relationship reference',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.relationships.push('review');
      return changed;
    },
    'Repeated relationship',
  ],
  [
    'a component at container level',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.containers!.elements.push('navigation');
      return changed;
    },
    'level',
  ],
  [
    'a missing relationship source',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.relationships.review!.from = 'missing';
      return changed;
    },
    'endpoint',
  ],
  [
    'a missing parent declaration',
    (input: C4Model) => {
      const changed = structuredClone(input);
      delete changed.elements.reader!.parent;
      return changed;
    },
    'parent',
  ],
  [
    'a component in another scope',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.elements.other_reader = { ...changed.elements.reader! };
      changed.elements.navigation!.parent = 'other_reader';
      return changed;
    },
    'another scope',
  ],
  [
    'an invalid source filename',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.source =
        'docs/handoffs/example/assets/../outside.puml';
      return changed;
    },
    'assets',
  ],
  [
    'a parent on a system',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.elements.tooling!.parent = 'repository';
      return changed;
    },
    'person/system',
  ],
  [
    'implementation technology on a person',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.elements.engineer!.technology = 'React';
      return changed;
    },
    'person/system',
  ],
  [
    'a context missing its subject',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.context!.elements = ['engineer', 'repository'];
      return changed;
    },
    'scope',
  ],
  [
    'a container boundary repeated as a node',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.diagrams.containers!.elements.push('tooling');
      return changed;
    },
    'scope',
  ],
  [
    'a container from another system',
    (input: C4Model) => {
      const changed = structuredClone(input);
      changed.elements.reader!.parent = 'repository';
      return changed;
    },
    'another scope',
  ],
])(
  'rejects %s before generating inconsistent diagrams',
  (_name, change, message) => {
    const changed = change(model);
    expect(() => validateC4Model(changed)).toThrow(message);
  },
);

test('Zod reports the failing field path for malformed registry data', () => {
  const result = c4ModelSchema.safeParse({ ...model, audience: 123 });
  expect(result.success).toBe(false);
  if (result.success) throw new Error('Expected a Zod validation failure.');
  expect(result.error.issues[0]!.path).toEqual(['audience']);
});

test('an unknown view has an actionable error', () => {
  expect(() => renderC4Diagram(model, 'missing')).toThrow('Unknown diagram');
});

test('change annotations appear on elements, boundaries and relationships without changing historical views', () => {
  const changed = structuredClone(model);
  changed.diagrams.containers!.changes = {
    elements: {
      tooling: {
        status: 'changed',
        description: 'Free text becomes validated handoffs.',
      },
      reader: { status: 'added', description: 'Adds a browser reader.' },
      notes: {
        status: 'removed',
        description: 'Replaced by bundled documents.',
      },
    },
    relationships: {
      read: {
        status: 'changed',
        description: 'Raw files become compiled assets.',
      },
    },
  };
  const source = renderC4Diagram(changed, 'containers');
  expect(source).toContain('[CHANGED] Handoff tooling');
  expect(source).toContain('Change: Free text becomes validated handoffs.');
  expect(source).toContain('[ADDED] Browser reader');
  expect(source).toContain('[REMOVED] Feature notes');
  expect(source).toContain('Change: Adds a browser reader.');
  expect(source).toContain('[CHANGED] Loads compiled notes from');
  expect(source).toContain('Raw files become compiled assets.');
  expect(source).toContain('Unmarked = unchanged context');
  expect(renderC4Diagram(changed, 'context')).toBe(
    renderC4Diagram(model, 'context'),
  );
});

test.each(['elements', 'relationships'] as const)(
  'change annotations must refer to %s in that view',
  (kind) => {
    const changed = structuredClone(model);
    changed.diagrams.containers!.changes = {
      [kind]: { missing: { status: 'added', description: 'Not in view' } },
    };
    expect(() => validateC4Model(changed)).toThrow('outside diagram');
  },
);

test('unchanged views disclose their reason without claiming changes', () => {
  const changed = structuredClone(model);
  changed.diagrams.context!.unchangedReason =
    'Same actors and system boundary.';
  expect(renderC4Diagram(changed, 'context')).toContain(
    'Unchanged: Same actors and system boundary.',
  );
});

test('a view cannot claim changes and also claim it is unchanged', () => {
  const changed = structuredClone(model);
  changed.diagrams.context!.unchangedReason = 'No change';
  changed.diagrams.context!.changes = {
    elements: {
      tooling: { status: 'changed', description: 'New responsibility' },
    },
  };
  expect(() => validateC4Model(changed)).toThrow('changes or unchangedReason');
});

test('every registered diagram has an up-to-date source in its own handoff folder', () => {
  const root = resolve(import.meta.dirname, '../../../../..');
  const registry = validateC4Model(
    JSON.parse(
      readFileSync(resolve(root, 'docs/architecture/c4-model.json'), 'utf8'),
    ),
  );
  expect(Object.keys(registry.diagrams).length).toBeGreaterThan(0);
  for (const [id, diagram] of Object.entries(registry.diagrams)) {
    expect(readFileSync(resolve(root, diagram.source), 'utf8')).toBe(
      renderC4Diagram(registry, id),
    );
    expect(
      readFileSync(
        resolve(root, diagram.source.replace(/\.puml$/, '.svg')),
        'utf8',
      ),
    ).toContain('<svg');
  }
});
