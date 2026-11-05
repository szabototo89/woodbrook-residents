import { expect, test } from 'bun:test';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { DEV_PROJECTS } from './projects';
import { repoRoot } from './testing';

type Manifest = { scripts?: Record<string, string> };

const readManifest = (cwd: string): Manifest =>
  JSON.parse(readFileSync(join(repoRoot, cwd, 'package.json'), 'utf8'));

test('inventories every browser project from the issue with a unique id and port', () => {
  const ids = DEV_PROJECTS.map((project) => project.id);
  expect(ids).toEqual([
    'web',
    'dashboard',
    'design-proposal',
    'design-proposals',
    'forma-studio-web',
    'forma-studio',
    'laura-faichney-web',
    'laura-studio',
    'sanity-studio',
    'handoffs',
    'mobile',
  ]);

  const ports = DEV_PROJECTS.flatMap((project) => project.ports);
  expect(new Set(ports).size).toBe(ports.length);
  expect(new Set(ids).size).toBe(ids.length);
});

test('points every project at its own app directory and dev script', () => {
  DEV_PROJECTS.map((project) => {
    const manifestPath = join(repoRoot, project.cwd, 'package.json');
    expect(existsSync(manifestPath)).toBe(true);
    const manifest = readManifest(project.cwd);
    expect(manifest.scripts?.dev).toBeDefined();
    expect(project.command).toContain('dev');
    expect(project.command).toContain('bun');
  });
});

test('checks readiness on every owned port', () => {
  DEV_PROJECTS.map((project) => {
    const readinessPorts = project.readiness.map((check) =>
      check.kind === 'tcp' ? check.port : Number(new URL(check.url).port),
    );
    expect(readinessPorts.sort()).toEqual([...project.ports].sort());
    expect(project.url).toBe(`http://localhost:${project.ports.at(-1)}`);
  });
});
