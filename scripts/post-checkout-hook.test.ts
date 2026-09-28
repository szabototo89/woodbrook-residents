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
const HOOK_PATH = join(REPO_ROOT, '.githooks', 'post-checkout');
const ZERO_SHA = '0000000000000000000000000000000000000000';

let scratch = '';
let herdrLog = '';
let cmuxLog = '';

function git(args: Array<string>, cwd: string, env = {}) {
  execFileSync('git', args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
}

function noSuchBinary(): string {
  return join(scratch, 'no-such-binary');
}

function makeFakeHerdr(): string {
  const fakeBin = join(scratch, 'fakebin');
  mkdirSync(fakeBin, { recursive: true });
  herdrLog = join(scratch, 'herdr-calls.log');
  const fake = join(fakeBin, 'herdr');
  writeFileSync(fake, `#!/bin/sh\necho "$@" >> "${herdrLog}"\n`, {
    mode: 0o755,
  });
  return fake;
}

function makeFakeCmux(): string {
  const fakeBin = join(scratch, 'fakebin');
  mkdirSync(fakeBin, { recursive: true });
  cmuxLog = join(scratch, 'cmux-calls.log');
  const fake = join(fakeBin, 'cmux');
  writeFileSync(fake, `#!/bin/sh\necho "$@" >> "${cmuxLog}"\n`, {
    mode: 0o755,
  });
  return fake;
}

function makeFakeCmuxWithCreate(createdId: string): string {
  const fakeBin = join(scratch, 'fakebin');
  mkdirSync(fakeBin, { recursive: true });
  cmuxLog = join(scratch, 'cmux-calls.log');
  const response = join(scratch, 'cmux-create.json');
  writeFileSync(
    response,
    JSON.stringify({
      workspace_id: createdId,
      window_id: 'window-id',
      surface_id: 'surface-id',
      group_id: null,
    }),
  );
  const fake = join(fakeBin, 'cmux');
  writeFileSync(
    fake,
    `#!/bin/sh\necho "$@" >> "${cmuxLog}"\nif [ "$1" = "workspace" ] && [ "$2" = "create" ]; then\ncat "${response}"\nfi\n`,
    { mode: 0o755 },
  );
  return fake;
}

function gitWithoutSurface(
  args: Array<string>,
  cwd: string,
  extra: Record<string, string>,
): void {
  const env: Record<string, string> = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value !== undefined && key !== 'CMUX_SURFACE_ID') {
      env[key] = value;
    }
  }
  for (const [key, value] of Object.entries(extra)) {
    env[key] = value;
  }
  execFileSync('git', args, { cwd, env, stdio: 'pipe' });
}

function makeRepo(): string {
  const repo = join(scratch, 'main');
  mkdirSync(repo, { recursive: true });
  git(['init', '-q'], repo);
  const author = {
    GIT_AUTHOR_NAME: 't',
    GIT_AUTHOR_EMAIL: 't@t',
    GIT_COMMITTER_NAME: 't',
    GIT_COMMITTER_EMAIL: 't@t',
  };
  git(['commit', '-q', '--allow-empty', '-m', 'init'], repo, author);
  git(['config', 'core.hooksPath', join(REPO_ROOT, '.githooks')], repo);
  return repo;
}

async function waitForLog(): Promise<string> {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (existsSync(herdrLog)) {
      return readFileSync(herdrLog, 'utf8');
    }
    await Bun.sleep(100);
  }
  return '';
}

async function waitForCmuxLog(): Promise<string> {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (existsSync(cmuxLog)) {
      return readFileSync(cmuxLog, 'utf8');
    }
    await Bun.sleep(100);
  }
  return '';
}

async function waitForCmuxCall(fragment: string): Promise<string> {
  const deadline = Date.now() + 5000;
  while (Date.now() < deadline) {
    if (existsSync(cmuxLog)) {
      const calls = readFileSync(cmuxLog, 'utf8');
      if (calls.includes(fragment)) {
        return calls;
      }
    }
    await Bun.sleep(100);
  }
  return existsSync(cmuxLog) ? readFileSync(cmuxLog, 'utf8') : '';
}

beforeEach(() => {
  scratch = realpathSync(mkdtempSync(join(tmpdir(), 'hooktest-')));
});

afterEach(() => {
  rmSync(scratch, { recursive: true, force: true });
});

test('post-checkout hook exists and is executable', () => {
  expect(existsSync(HOOK_PATH)).toBe(true);
});

test('worktree add registers the new checkout with herdr', async () => {
  const fake = makeFakeHerdr();
  const repo = makeRepo();
  const wt = join(scratch, 'wt1');
  git(['worktree', 'add', wt, '-b', 'feature/x'], repo, {
    HERDR_BIN: fake,
    CMUX_BIN: noSuchBinary(),
  });
  const calls = await waitForLog();
  expect(calls).toContain(`worktree open --path ${wt} --no-focus`);
});

test('plain branch checkout does not call herdr', async () => {
  const fake = makeFakeHerdr();
  const repo = makeRepo();
  git(['checkout', '-q', '-b', 'feature/y'], repo, {
    HERDR_BIN: fake,
    CMUX_BIN: noSuchBinary(),
  });
  await Bun.sleep(500);
  expect(existsSync(herdrLog)).toBe(false);
});

test('initial checkout in a plain repo does not call herdr', () => {
  const fake = makeFakeHerdr();
  const repo = makeRepo();
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repo,
    encoding: 'utf8',
  }).trim();
  execFileSync('sh', [HOOK_PATH, ZERO_SHA, head, '1'], {
    cwd: repo,
    env: {
      ...process.env,
      HERDR_BIN: fake,
      CMUX_BIN: noSuchBinary(),
    },
    stdio: 'pipe',
  });
  expect(existsSync(herdrLog)).toBe(false);
});

test('hook ignores everything when herdr is missing', () => {
  const repo = makeRepo();
  const wt = join(scratch, 'wt2');
  git(['worktree', 'add', wt, '-b', 'feature/z'], repo, {
    HERDR_BIN: join(scratch, 'no-such-binary'),
    CMUX_BIN: noSuchBinary(),
  });
  // Worktree creation itself must still succeed.
  expect(existsSync(join(wt, '.git'))).toBe(true);
});

test('worktree add creates a cmux workspace for the new checkout', async () => {
  const cmux = makeFakeCmux();
  const repo = makeRepo();
  const wt = join(scratch, 'wt-cmux');
  git(['worktree', 'add', wt, '-b', 'feature/cmux'], repo, {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: cmux,
  });
  const calls = await waitForCmuxLog();
  expect(calls).toContain('workspace create');
  expect(calls).toContain(`--cwd ${wt}`);
  expect(calls).toContain('--focus false');
});

test('plain branch checkout does not call cmux', async () => {
  const cmux = makeFakeCmux();
  const repo = makeRepo();
  git(['checkout', '-q', '-b', 'feature/cmux-plain'], repo, {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: cmux,
  });
  await Bun.sleep(500);
  expect(existsSync(cmuxLog)).toBe(false);
});

test('initial checkout in a plain repo does not call cmux', () => {
  const cmux = makeFakeCmux();
  const repo = makeRepo();
  const head = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repo,
    encoding: 'utf8',
  }).trim();
  execFileSync('sh', [HOOK_PATH, ZERO_SHA, head, '1'], {
    cwd: repo,
    env: { ...process.env, HERDR_BIN: noSuchBinary(), CMUX_BIN: cmux },
    stdio: 'pipe',
  });
  expect(existsSync(cmuxLog)).toBe(false);
});

test('hook still creates cmux workspace when herdr is missing', async () => {
  const cmux = makeFakeCmux();
  const repo = makeRepo();
  const wt = join(scratch, 'wt-cmux-noherdr');
  git(['worktree', 'add', wt, '-b', 'feature/cmux-noherdr'], repo, {
    HERDR_BIN: join(scratch, 'no-such-binary'),
    CMUX_BIN: cmux,
  });
  const calls = await waitForCmuxLog();
  expect(calls).toContain('workspace create');
  expect(existsSync(join(wt, '.git'))).toBe(true);
});

test('hook still registers herdr when cmux is missing', async () => {
  const fake = makeFakeHerdr();
  const repo = makeRepo();
  const wt = join(scratch, 'wt-herdr-nocmux');
  git(['worktree', 'add', wt, '-b', 'feature/herdr-nocmux'], repo, {
    HERDR_BIN: fake,
    CMUX_BIN: join(scratch, 'no-such-binary'),
  });
  const calls = await waitForLog();
  expect(calls).toContain(`worktree open --path ${wt} --no-focus`);
});

test('hook ignores everything when cmux is missing', () => {
  const repo = makeRepo();
  const wt = join(scratch, 'wt-cmux-missing');
  git(['worktree', 'add', wt, '-b', 'feature/cmux-missing'], repo, {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: join(scratch, 'no-such-binary'),
  });
  // Worktree creation itself must still succeed.
  expect(existsSync(join(wt, '.git'))).toBe(true);
});

test('worktree add moves the invoking tab into the new cmux workspace', async () => {
  const cmux = makeFakeCmuxWithCreate('c-new-id');
  const repo = makeRepo();
  const wt = join(scratch, 'wt-movetab');
  git(['worktree', 'add', wt, '-b', 'feature/movetab'], repo, {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: cmux,
    CMUX_SURFACE_ID: 'surface:9',
  });
  const calls = await waitForCmuxCall('move-surface');
  expect(calls).toContain(
    'move-surface --surface surface:9 --workspace c-new-id --focus true',
  );
});

test('worktree add without a cmux surface moves no tab', async () => {
  const cmux = makeFakeCmuxWithCreate('c-new-id');
  const repo = makeRepo();
  const wt = join(scratch, 'wt-nomove');
  gitWithoutSurface(['worktree', 'add', wt, '-b', 'feature/nomove'], repo, {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: cmux,
  });
  const calls = await waitForCmuxCall('workspace create');
  expect(calls).toContain('workspace create');
  await Bun.sleep(500);
  expect(readFileSync(cmuxLog, 'utf8')).not.toContain('move-surface');
});
