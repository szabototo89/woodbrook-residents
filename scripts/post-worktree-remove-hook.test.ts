import { afterEach, beforeEach, expect, test } from 'bun:test';

import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO_ROOT = join(import.meta.dir, '..');
const HOOK_PATH = join(REPO_ROOT, '.githooks', 'post-worktree-remove');

let scratch = '';
let herdrLog = '';
let workspacesJson = '';

function makeFakeHerdr(
  workspaces: Array<{ id: string; path: string }>,
): string {
  const fakeBin = join(scratch, 'fakebin');
  mkdirSync(fakeBin, { recursive: true });
  herdrLog = join(scratch, 'herdr-calls.log');
  workspacesJson = join(scratch, 'workspaces.json');
  const payload = {
    id: 'cli:workspace:list',
    result: {
      type: 'workspace_list',
      workspaces: workspaces.map((w, i) => ({
        active_tab_id: `w${i}:t1`,
        label: `ws-${w.id}`,
        workspace_id: w.id,
        worktree: { checkout_path: w.path },
      })),
    },
  };
  writeFileSync(workspacesJson, JSON.stringify(payload));
  const fake = join(fakeBin, 'herdr');
  writeFileSync(
    fake,
    `#!/bin/sh\nif [ "$1" = "workspace" ] && [ "$2" = "list" ]; then\ncat "${workspacesJson}"\nelse\necho "$@" >> "${herdrLog}"\nfi\n`,
    { mode: 0o755 },
  );
  return fake;
}

function runHook(args: Array<string>, env = {}): number {
  try {
    execFileSync('sh', [HOOK_PATH, ...args], {
      env: { ...process.env, ...env },
      stdio: 'pipe',
    });
    return 0;
  } catch (e: unknown) {
    return (e as { status?: number }).status ?? 1;
  }
}

beforeEach(() => {
  scratch = realpathSync(mkdtempSync(join(tmpdir(), 'rmhooktest-')));
});

afterEach(() => {
  rmSync(scratch, { recursive: true, force: true });
});

test('post-worktree-remove hook exists and is executable', () => {
  expect(existsSync(HOOK_PATH)).toBe(true);
});

test('closes the workspace linked to the removed path', () => {
  const wt = join(scratch, 'wt-gone');
  mkdirSync(wt, { recursive: true });
  const fake = makeFakeHerdr([
    { id: 'w9', path: wt },
    { id: 'w1', path: join(scratch, 'wt-keep') },
  ]);
  const code = runHook([wt], { HERDR_BIN: fake });
  expect(code).toBe(0);
  const calls = existsSync(herdrLog) ? readFileSync(herdrLog, 'utf8') : '';
  expect(calls).toContain('workspace close w9');
  expect(calls).not.toContain('workspace close w1');
});

test('does nothing when no workspace matches', () => {
  const fake = makeFakeHerdr([{ id: 'w1', path: join(scratch, 'other') }]);
  const code = runHook([join(scratch, 'wt-gone')], { HERDR_BIN: fake });
  expect(code).toBe(0);
  expect(existsSync(herdrLog)).toBe(false);
});

test('hook ignores everything when herdr is missing', () => {
  const code = runHook([join(scratch, 'wt-gone')], {
    HERDR_BIN: join(scratch, 'no-such-binary'),
  });
  expect(code).toBe(0);
});

test('hook exits zero with no path argument', () => {
  const fake = makeFakeHerdr([{ id: 'w1', path: join(scratch, 'x') }]);
  const code = runHook([], { HERDR_BIN: fake });
  expect(code).toBe(0);
});
