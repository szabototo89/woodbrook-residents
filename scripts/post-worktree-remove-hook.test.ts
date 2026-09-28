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
let cmuxLog = '';
let workspacesJson = '';
let cmuxWorkspacesJson = '';

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

function makeFakeCmux(workspaces: Array<{ id: string; path: string }>): string {
  const fakeBin = join(scratch, 'fakebin');
  mkdirSync(fakeBin, { recursive: true });
  cmuxLog = join(scratch, 'cmux-calls.log');
  cmuxWorkspacesJson = join(scratch, 'cmux-workspaces.json');
  const payload = {
    window_ref: 'window:1',
    workspaces: workspaces.map((w, i) => ({
      id: w.id,
      ref: `workspace:${i + 1}`,
      title: `ws-${w.id}`,
      current_directory: w.path,
    })),
  };
  writeFileSync(cmuxWorkspacesJson, JSON.stringify(payload));
  const fake = join(fakeBin, 'cmux');
  writeFileSync(
    fake,
    `#!/bin/sh\nif [ "$1" = "workspace" ] && [ "$2" = "list" ]; then\ncat "${cmuxWorkspacesJson}"\nelse\necho "$@" >> "${cmuxLog}"\nfi\n`,
    { mode: 0o755 },
  );
  return fake;
}

function noSuchBinary(): string {
  return join(scratch, 'no-such-binary');
}

function runHook(args: Array<string>, env = {}): number {
  try {
    execFileSync('sh', [HOOK_PATH, ...args], {
      env: { ...process.env, ...env },
      stdio: 'pipe',
    });
    return 0;
  } catch (e: unknown) {
    if (
      typeof e === 'object' &&
      e !== null &&
      'status' in e &&
      typeof e.status === 'number'
    ) {
      return e.status;
    }
    return 1;
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
  const code = runHook([wt], { HERDR_BIN: fake, CMUX_BIN: noSuchBinary() });
  expect(code).toBe(0);
  const calls = existsSync(herdrLog) ? readFileSync(herdrLog, 'utf8') : '';
  expect(calls).toContain('workspace close w9');
  expect(calls).not.toContain('workspace close w1');
});

test('does nothing when no workspace matches', () => {
  const fake = makeFakeHerdr([{ id: 'w1', path: join(scratch, 'other') }]);
  const code = runHook([join(scratch, 'wt-gone')], {
    HERDR_BIN: fake,
    CMUX_BIN: noSuchBinary(),
  });
  expect(code).toBe(0);
  expect(existsSync(herdrLog)).toBe(false);
});

test('hook ignores everything when herdr is missing', () => {
  const code = runHook([join(scratch, 'wt-gone')], {
    HERDR_BIN: join(scratch, 'no-such-binary'),
    CMUX_BIN: noSuchBinary(),
  });
  expect(code).toBe(0);
});

test('hook exits zero with no path argument', () => {
  const fake = makeFakeHerdr([{ id: 'w1', path: join(scratch, 'x') }]);
  const code = runHook([], { HERDR_BIN: fake, CMUX_BIN: noSuchBinary() });
  expect(code).toBe(0);
});

test('closes the cmux workspace linked to the removed path', () => {
  const wt = join(scratch, 'wt-gone');
  mkdirSync(wt, { recursive: true });
  const fake = makeFakeCmux([
    { id: 'c9', path: wt },
    { id: 'c1', path: join(scratch, 'wt-keep') },
  ]);
  const code = runHook([wt], {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: fake,
  });
  expect(code).toBe(0);
  const calls = existsSync(cmuxLog) ? readFileSync(cmuxLog, 'utf8') : '';
  expect(calls).toContain('workspace close c9');
  expect(calls).not.toContain('workspace close c1');
});

test('does nothing when no cmux workspace matches', () => {
  const fake = makeFakeCmux([{ id: 'c1', path: join(scratch, 'other') }]);
  const code = runHook([join(scratch, 'wt-gone')], {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: fake,
  });
  expect(code).toBe(0);
  expect(existsSync(cmuxLog)).toBe(false);
});

test('hook ignores everything when cmux is missing', () => {
  const code = runHook([join(scratch, 'wt-gone')], {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: join(scratch, 'no-such-binary'),
  });
  expect(code).toBe(0);
});

test('closes both herdr and cmux workspaces for the removed path', () => {
  const wt = join(scratch, 'wt-both');
  mkdirSync(wt, { recursive: true });
  makeFakeHerdr([{ id: 'w9', path: wt }]);
  makeFakeCmux([{ id: 'c9', path: wt }]);
  const binDir = join(scratch, 'fakebin');
  const code = runHook([wt], {
    HERDR_BIN: join(binDir, 'herdr'),
    CMUX_BIN: join(binDir, 'cmux'),
  });
  expect(code).toBe(0);
  const herdrCalls = existsSync(herdrLog) ? readFileSync(herdrLog, 'utf8') : '';
  const cmuxCalls = existsSync(cmuxLog) ? readFileSync(cmuxLog, 'utf8') : '';
  expect(herdrCalls).toContain('workspace close w9');
  expect(cmuxCalls).toContain('workspace close c9');
});
