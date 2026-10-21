import { z } from 'zod';

const stableId = z.string().regex(/^[a-z][a-z0-9_]*$/, 'Use a stable C4 ID.');
const elementSchema = z.object({
  kind: z
    .enum(['person', 'system', 'container', 'database', 'component'])
    .describe('C4 abstraction represented by this element.'),
  name: z
    .string()
    .trim()
    .min(1)
    .describe('Canonical name reused across all views.'),
  description: z
    .string()
    .trim()
    .min(1)
    .describe('Responsibility explained for an engineer new to the product.'),
  technology: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      'Implementation technology or communication mechanism when applicable.',
    ),
  parent: stableId
    .optional()
    .describe('Stable ID of the owning system or container.'),
});
const relationshipSchema = z.object({
  from: stableId.describe('Stable ID of the relationship source.'),
  to: stableId.describe('Stable ID of the relationship target.'),
  label: z
    .string()
    .trim()
    .min(1)
    .describe('Intent of the interaction, read in the arrow direction.'),
  technology: z
    .string()
    .trim()
    .min(1)
    .optional()
    .describe(
      'Implementation technology or communication mechanism when applicable.',
    ),
});
const diagramSchema = z.object({
  level: z.enum(['C1', 'C2', 'C3']).describe('C4 level shown by this view.'),
  scope: stableId.describe('System or container whose architecture is shown.'),
  title: z
    .string()
    .trim()
    .min(1)
    .describe('Human-readable subject and level of the view.'),
  handoff: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .describe('Slug of the handoff that owns the generated assets.'),
  source: z
    .string()
    .describe(
      'Repository-relative output path for the generated PlantUML source.',
    ),
  elements: z
    .array(stableId)
    .min(1)
    .refine(
      (items) => new Set(items).size === items.length,
      'Repeated element references.',
    )
    .describe('Unique element IDs included in this diagram.'),
  relationships: z
    .array(stableId)
    .refine(
      (items) => new Set(items).size === items.length,
      'Repeated relationship references.',
    )
    .describe('Unique relationship IDs shown in this diagram.'),
});

export const c4ModelSchema = z
  .object({
    audience: z
      .string()
      .trim()
      .min(1, 'Specify the diagram audience.')
      .describe(
        'Reader assumptions; always an engineer unfamiliar with the product.',
      ),
    elements: z
      .record(stableId, elementSchema)
      .describe('Canonical architecture elements keyed by stable ID.'),
    relationships: z
      .record(stableId, relationshipSchema)
      .describe('Canonical directed interactions keyed by stable ID.'),
    diagrams: z
      .record(stableId, diagramSchema)
      .describe('Views selecting canonical element and relationship IDs.'),
  })
  .check((context) => {
    const model = context.value;
    const reportWhen = (
      condition: boolean,
      path: string[],
      message: string,
    ): Array<{
      code: 'custom';
      path: string[];
      message: string;
      input: unknown;
    }> => (condition ? [{ code: 'custom', path, message, input: model }] : []);
    const elementIssues = Object.entries(model.elements).flatMap(
      ([id, element]) => {
        if (!['container', 'database', 'component'].includes(element.kind)) {
          return reportWhen(
            Boolean(element.parent || element.technology),
            ['elements', id],
            `Element ${id} is a person/system and must not declare a container parent or implementation technology.`,
          );
        }
        const parentKind =
          element.kind === 'component' ? 'container' : 'system';
        return [
          ...reportWhen(
            !element.technology,
            ['elements', id, 'technology'],
            `Element ${id} needs technology.`,
          ),
          ...reportWhen(
            !element.parent ||
              model.elements[element.parent]?.kind !== parentKind,
            ['elements', id, 'parent'],
            `Element ${id} needs a ${parentKind} parent.`,
          ),
        ];
      },
    );
    const relationshipIssues = Object.entries(model.relationships).flatMap(
      ([id, relationship]) =>
        reportWhen(
          !model.elements[relationship.from] ||
            !model.elements[relationship.to],
          ['relationships', id],
          `Relationship ${id} needs known endpoints.`,
        ),
    );
    const diagramIssues = Object.entries(model.diagrams).flatMap(
      ([id, diagram]) => {
        const scopeKind = diagram.level === 'C3' ? 'container' : 'system';
        const prefix = `docs/handoffs/${diagram.handoff}/assets/`;
        const elements = diagram.elements.flatMap((elementId) => {
          const element = model.elements[elementId];
          if (!element)
            return reportWhen(
              true,
              ['diagrams', id, 'elements'],
              `Unknown element ${elementId} in diagram ${id}.`,
            );
          return [
            ...reportWhen(
              (diagram.level === 'C1' &&
                !['person', 'system'].includes(element.kind)) ||
                (diagram.level === 'C2' && element.kind === 'component'),
              ['diagrams', id, 'elements'],
              `Element ${elementId} is not valid at level ${diagram.level}.`,
            ),
            ...reportWhen(
              element.kind === 'component' && element.parent !== diagram.scope,
              ['diagrams', id, 'scope'],
              `Component ${elementId} belongs to another scope.`,
            ),
            ...reportWhen(
              diagram.level === 'C2' &&
                ['container', 'database'].includes(element.kind) &&
                element.parent !== diagram.scope,
              ['diagrams', id, 'scope'],
              `Container ${elementId} belongs to another scope.`,
            ),
          ];
        });
        const relationships = diagram.relationships.flatMap((relationId) => {
          const relation = model.relationships[relationId];
          if (!relation)
            return reportWhen(
              true,
              ['diagrams', id, 'relationships'],
              `Unknown relationship ${relationId} in diagram ${id}.`,
            );
          return reportWhen(
            !diagram.elements.includes(relation.from) ||
              !diagram.elements.includes(relation.to),
            ['diagrams', id, 'relationships'],
            `Relationship ${relationId} has endpoints outside diagram ${id}.`,
          );
        });
        return [
          ...reportWhen(
            model.elements[diagram.scope]?.kind !== scopeKind,
            ['diagrams', id, 'scope'],
            `Diagram ${id} needs a ${scopeKind} scope.`,
          ),
          ...reportWhen(
            (diagram.level === 'C1') !==
              diagram.elements.includes(diagram.scope),
            ['diagrams', id, 'scope'],
            `Diagram ${id} must show its C1 scope as a system, or its C2/C3 scope as a boundary.`,
          ),
          ...reportWhen(
            !diagram.source.startsWith(prefix) ||
              !/^[a-z0-9-]+\.puml$/.test(diagram.source.slice(prefix.length)),
            ['diagrams', id, 'source'],
            `Diagram ${id} must own its source in its handoff assets folder.`,
          ),
          ...elements,
          ...relationships,
        ];
      },
    );
    context.issues.push(
      ...elementIssues,
      ...relationshipIssues,
      ...diagramIssues,
    );
  });

export type C4Model = z.infer<typeof c4ModelSchema>;

export function validateC4Model(input: unknown): C4Model {
  return c4ModelSchema.parse(input);
}

export function renderC4Diagram(input: C4Model, diagramId: string) {
  const model = validateC4Model(input);
  const diagram = model.diagrams[diagramId];
  if (!diagram) throw new Error(`Unknown diagram ${diagramId}.`);
  const library = { C1: 'Context', C2: 'Container', C3: 'Component' }[
    diagram.level
  ];
  const quote = (value: string) => JSON.stringify(value);
  const renderElement = (id: string) => {
    const element = model.elements[id]!;
    const macros = {
      person: 'Person',
      system: id === diagram.scope ? 'System' : 'System_Ext',
      container: 'Container',
      database: 'ContainerDb',
      component: 'Component',
    };
    const values = [quote(element.name)];
    if (element.technology) values.push(quote(element.technology));
    values.push(quote(element.description));
    return `${macros[element.kind]}(${id}, ${values.join(', ')})`;
  };
  const inside =
    diagram.level === 'C1'
      ? []
      : diagram.elements.filter(
          (id) => model.elements[id]!.parent === diagram.scope,
        );
  const outside = diagram.elements.filter((id) => !inside.includes(id));
  const declarations = outside.map(renderElement);
  if (inside.length > 0) {
    const boundary =
      diagram.level === 'C2' ? 'System_Boundary' : 'Container_Boundary';
    declarations.push(
      `${boundary}(${diagram.scope}, ${quote(model.elements[diagram.scope]!.name)}) {`,
      ...inside.map((id) => `  ${renderElement(id)}`),
      '}',
    );
  }
  const relations = diagram.relationships.map((id) => {
    const relation = model.relationships[id]!;
    const values = [relation.from, relation.to, quote(relation.label)];
    if (relation.technology) values.push(quote(relation.technology));
    return `Rel(${values.join(', ')})`;
  });
  return [
    "' Generated from docs/architecture/c4-model.json. Run bun run --cwd apps/handoffs c4:generate.",
    '@startuml',
    '!pragma layout smetana',
    `!include <C4/C4_${library}>`,
    'LAYOUT_TOP_DOWN()',
    'skinparam defaultFontName SansSerif',
    'skinparam nodesep 45',
    'skinparam ranksep 45',
    `title ${diagram.title}`,
    '',
    ...declarations,
    '',
    ...relations,
    'SHOW_LEGEND()',
    '@enduml',
    '',
  ].join('\n');
}
