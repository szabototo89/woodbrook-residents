import { createProcessor } from '@mdx-js/mdx';
import remarkGfm from 'remark-gfm';
import type { C4Model } from './c4Model';

type Node = {
  type: string;
  depth?: number;
  value?: string;
  name?: string | null;
  children?: Node[];
};
type Diagram = Pick<
  C4Model['diagrams'][string],
  'handoff' | 'source' | 'level' | 'changes' | 'unchangedReason'
>;

const text = (node: Node): string =>
  node.value ?? node.children?.map(text).join('') ?? '';

export function checkHandoffStructure(
  source: string,
  slug: string,
  diagrams: Record<string, Diagram>,
) {
  const fail = (message: string): never => {
    throw new Error(`${slug}: ${message} See HANDOFF.md.`);
  };
  const tree: Node = createProcessor({ remarkPlugins: [remarkGfm] }).parse(
    source,
  );
  const nodes = tree.children!;
  const headings = nodes.filter(
    (node) => node.type === 'heading' && node.depth === 2,
  );
  const required = [
    'Goal',
    'Technical changes',
    'Architecture changes',
    'Verification',
    'Next steps',
  ];
  const names = headings.map(text);
  const ownedDiagrams = Object.values(diagrams).filter(
    (item) => item.handoff === slug,
  );
  const hasChanges = (diagram: Diagram) =>
    Object.values(diagram.changes ?? {}).some(
      (items) => Object.keys(items).length > 0,
    );
  required.every(
    (name) =>
      names.filter((heading) => heading === name).length === 1 ||
      fail(`Include exactly one ## ${name} section.`),
  );
  if (names.includes('Current state'))
    fail('Replace Current state with Technical changes.');
  const positions = required.map((name) => names.indexOf(name));
  if (
    positions.some(
      (position, index) => index > 0 && position < positions[index - 1]!,
    )
  )
    fail('Put required sections in template order.');

  const section = (name: string) => {
    const start = nodes.indexOf(headings[names.indexOf(name)]!);
    const end = nodes.findIndex(
      (node, index) =>
        index > start && node.type === 'heading' && node.depth === 2,
    );
    return nodes.slice(start + 1, end === -1 ? undefined : end);
  };
  const table = (name: string, columns: string[]) => {
    const content = section(name);
    const tables = content.filter((node) => node.type === 'table');
    if (tables.length !== 1) fail(`${name} requires one Markdown table.`);
    const rows = tables[0]!.children!;
    const header = rows[0]!.children!.map(text);
    if (columns.join('|') !== header.join('|'))
      fail(`${name} table columns must be ${columns.join(', ')}.`);
    if (rows.length < 2)
      fail(`${name} table needs at least one recorded outcome.`);
    rows
      .slice(1)
      .every((row) =>
        row.children!.every(
          (cell, index) =>
            text(cell).trim() ||
            fail(`${name}: ${columns[index]} must not be empty.`),
        ),
      );
    return { content, rows: rows.slice(1) };
  };
  table('Technical changes', ['Area', 'Before', 'After', 'Why', 'Code']);
  const architecture = table('Architecture changes', [
    'Level',
    'Change',
    'Evidence',
  ]);
  ['C1', 'C2', 'C3'].every((level) => {
    if (!architecture.rows.some((row) => text(row.children![0]!) === level))
      fail(
        `Architecture changes must account for ${level}, including unchanged levels.`,
      );
    const row = architecture.rows.find(
      (item) => text(item.children![0]!) === level,
    )!;
    if (
      !/^Unchanged\b/i.test(text(row.children![1]!)) &&
      !ownedDiagrams.some(
        (diagram) => diagram.level === level && hasChanges(diagram),
      )
    )
      fail(`${level} change needs a change-annotated diagram at that level.`);
    return true;
  });
  const verification = table('Verification', ['Check', 'Result', 'Evidence']);
  if (verification.content.some((node) => node.type !== 'table'))
    fail('Keep all Verification outcomes and caveats in the table.');
  verification.rows.every(
    (row) =>
      ['PASS', 'FAIL', 'NOT RUN'].includes(text(row.children![1]!)) ||
      fail('Verification results must be PASS, FAIL or NOT RUN.'),
  );
  ownedDiagrams.every((diagram) => {
    if (!hasChanges(diagram) && !diagram.unchangedReason)
      fail(`${diagram.source} needs changes or unchangedReason.`);
    if (
      hasChanges(diagram) &&
      (!source.includes(`./assets/${diagram.source.split('/').at(-1)}?raw`) ||
        !nodes.some((node) => node.name === 'PlantUmlDiagram'))
    )
      fail(
        `Import and embed changed diagram ${diagram.source} with PlantUmlDiagram.`,
      );
    return true;
  });
}
