import { expect, test } from 'bun:test';
import { resolve } from 'node:path';

import {
  appsWithTask,
  buildAppCommand,
  getAppScripts,
  listApps,
  parseAppArgs,
} from './app';

const repoRoot = resolve(import.meta.dir, '..');

test('lists workspace apps by folder name', () => {
  const apps = listApps(repoRoot);

  expect(apps).toContain('web');
  expect(apps).toContain('cms');
  expect(apps).toContain('mobile');
  expect(apps).toEqual([...apps].sort());
});

test('reads scripts for a known app and null for unknown', () => {
  expect(getAppScripts(repoRoot, 'web')?.['dev']).toBeDefined();
  expect(getAppScripts(repoRoot, 'no-such-app')).toBeNull();
});

test('parses task plus app plus passthrough args', () => {
  expect(parseAppArgs(['dev', 'web'])).toEqual({
    task: 'dev',
    app: 'web',
    extraArgs: [],
    ifPresent: false,
    envFile: undefined,
    exclude: [],
  });
  expect(parseAppArgs(['test:unit'])).toMatchObject({
    task: 'test:unit',
    app: undefined,
  });
});

test('parses --if-present and --env-file flags', () => {
  const parsed = parseAppArgs([
    'dev:sheets',
    'web',
    '--env-file=../../.env',
    '--if-present',
    '--port',
    '3000',
  ]);

  expect(parsed.task).toBe('dev:sheets');
  expect(parsed.app).toBe('web');
  expect(parsed.envFile).toBe('../../.env');
  expect(parsed.ifPresent).toBe(true);
  expect(parsed.extraArgs).toEqual(['--port', '3000']);
});

test('rejects missing task', () => {
  expect(() => parseAppArgs([])).toThrow('task');
  expect(() => parseAppArgs(['--if-present'])).toThrow('task');
});

test('builds inner bun command with env-file in the right position', () => {
  expect(buildAppCommand(repoRoot, 'web', 'dev', [])).toEqual([
    'bun',
    'run',
    '--cwd',
    'apps/web',
    'dev',
  ]);
  expect(
    buildAppCommand(repoRoot, 'web', 'dev:sheets', [], '../../.env'),
  ).toEqual([
    'bun',
    'run',
    '--cwd',
    'apps/web',
    '--env-file=../../.env',
    'dev:sheets',
  ]);
});

test('finds apps that implement a task', () => {
  const apps = appsWithTask(repoRoot, 'typecheck');

  expect(apps).toContain('web');
  expect(apps).toContain('cms');
  expect(apps).not.toContain('design-proposals');
});

test('parses repeatable --exclude flags', () => {
  expect(
    parseAppArgs(['build', '--exclude', 'juliet-rose-app']).exclude,
  ).toEqual(['juliet-rose-app']);
  expect(
    parseAppArgs(['build', '--exclude=juliet-rose-app,web']).exclude,
  ).toEqual(['juliet-rose-app', 'web']);
});

test('excludes apps from fan-out targets', () => {
  const apps = appsWithTask(repoRoot, 'build', ['juliet-rose-app']);

  expect(apps).toContain('web');
  expect(apps).not.toContain('juliet-rose-app');
});
