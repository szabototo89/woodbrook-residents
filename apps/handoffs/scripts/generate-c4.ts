import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  renderC4Diagram,
  validateC4Model,
} from '../src/features/handoffs/c4Model';

const root = resolve(import.meta.dirname, '../../..');
const model = validateC4Model(
  JSON.parse(
    readFileSync(resolve(root, 'docs/architecture/c4-model.json'), 'utf8'),
  ),
);
const check = process.argv.includes('--check');
for (const [id, diagram] of Object.entries(model.diagrams)) {
  const expected = renderC4Diagram(model, id);
  const path = resolve(root, diagram.source);
  if (check) {
    if (readFileSync(path, 'utf8') !== expected)
      throw new Error(
        `Stale C4 source: ${diagram.source}. Run c4:generate and render the SVG again.`,
      );
  } else {
    writeFileSync(path, expected);
  }
}
process.stdout.write(
  check
    ? 'C4 model and generated sources agree.\n'
    : `Generated ${Object.keys(model.diagrams).length} PlantUML sources. Render their SVGs before committing.\n`,
);
