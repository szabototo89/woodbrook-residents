import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { validateC4Model } from '../src/features/handoffs/c4Model';
import { checkHandoffStructure } from '../src/features/handoffs/handoffStructure';

const root = resolve(import.meta.dirname, '../../..');
// Frozen historical records predating the change-focused contract. Never add new slugs.
const historical = new Set([
  'agent-handoffs',
  'clerk-authentication',
  'clerk-removal',
  'firebase-authentication',
  'handoff-agent-metadata',
  'news-publication-order',
]);
const model = validateC4Model(
  JSON.parse(
    readFileSync(resolve(root, 'docs/architecture/c4-model.json'), 'utf8'),
  ),
);
const checked = readdirSync(resolve(root, 'docs/handoffs'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory() && !historical.has(entry.name))
  .map((entry) => {
    checkHandoffStructure(
      readFileSync(
        resolve(root, 'docs/handoffs', entry.name, 'index.mdx'),
        'utf8',
      ),
      entry.name,
      model.diagrams,
    );
    return entry.name;
  });
process.stdout.write(
  `Validated ${checked.length} change-focused handoffs; ${historical.size} historical records preserved.\n`,
);
