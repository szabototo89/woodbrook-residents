import { expect, test } from 'bun:test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

import {
  DESIGN_PROPOSAL_SITES,
  type DesignProposalSite,
} from './design-proposal-sites';

const repositoryRoot = resolve(import.meta.dir, '..');

function readWorkflow(): string {
  const workflowPath = join(
    repositoryRoot,
    '.github/workflows/deploy-design-proposals.yml',
  );
  return readFileSync(workflowPath, 'utf8');
}

test('defines four Cloudflare sites for the gallery and each proposal', () => {
  const keys = DESIGN_PROPOSAL_SITES.map(
    (site: DesignProposalSite) => site.key,
  );

  expect(keys).toEqual([
    'gallery',
    'the-dog-salon',
    'spotless-dog-grooming',
    'spotless-dog-grooming-warm',
  ]);
});

test('maps each site to its Cloudflare project and deploy directory', () => {
  expect(DESIGN_PROPOSAL_SITES).toMatchObject([
    {
      projectName: 'woodbrook-design-gallery',
      directory: 'apps/design-proposals',
      url: 'https://woodbrook-design-gallery.pages.dev/',
    },
    {
      projectName: 'woodbrook-dog-salon-concept',
      directory: 'apps/design-proposals/projects/the-dog-salon',
      url: 'https://woodbrook-dog-salon-concept.pages.dev/',
    },
    {
      projectName: 'woodbrook-spotless-concept',
      directory: 'apps/design-proposals/projects/spotless-dog-grooming',
      url: 'https://woodbrook-spotless-concept.pages.dev/',
    },
    {
      projectName: 'woodbrook-spotless-warm-concept',
      directory: 'apps/design-proposals/projects/spotless-dog-grooming-warm',
      url: 'https://woodbrook-spotless-warm-concept.pages.dev/',
    },
  ]);
});

test('every deploy directory exists and contains an index.html entry', () => {
  for (const site of DESIGN_PROPOSAL_SITES) {
    const directory = join(repositoryRoot, site.directory);
    const entries = readdirSync(directory);

    expect(existsSync(join(directory, 'index.html'))).toBe(true);
    expect(entries).toContain('index.html');
  }
});

test('proposal pages use relative same-project asset paths for standalone hosting', () => {
  const proposals = DESIGN_PROPOSAL_SITES.filter(
    (site: DesignProposalSite) => site.key !== 'gallery',
  );

  for (const site of proposals) {
    const htmlPath = join(repositoryRoot, site.directory, 'index.html');
    const html = readFileSync(htmlPath, 'utf8');

    expect(html).not.toContain(`/projects/${site.key}/styles.css`);
    expect(html).not.toContain(`/projects/${site.key}/site.js`);
    expect(html).not.toContain(`/projects/${site.key}/assets/`);
  }
});

test('auto-deploys all four sites on merge to main', () => {
  const workflow = readWorkflow();

  expect(workflow).toContain('branches: [main]');
  expect(workflow).toContain('push:');

  for (const site of DESIGN_PROPOSAL_SITES) {
    expect(workflow).toContain(site.projectName);
    expect(workflow).toContain(site.directory);
  }
});
