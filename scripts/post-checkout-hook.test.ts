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

beforeEach(() => {
  scratch = realpathSync(mkdtempSync(join(tmpdir(), 'hooktest-')));
});

afterEach(() => {
  rmSync(scratch, { recursive: true, force: true });
});

test('post-checkout hook exists and is executable', () => {
  expect(existsSync(HOOK_PATH)).toBe(true);
});

test('post-checkout hook contains no cmux logic', () => {
  const hook = readFileSync(HOOK_PATH, 'utf8');
  expect(hook).not.toContain('cmux');
  expect(hook).not.toContain('CMUX');
  expect(hook).not.toContain('move-surface');
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

test('worktree add never calls cmux', async () => {
  const cmux = makeFakeCmux();
  const repo = makeRepo();
  const wt = join(scratch, 'wt-no-cmux');
  git(['worktree', 'add', wt, '-b', 'feature/no-cmux'], repo, {
    HERDR_BIN: noSuchBinary(),
    CMUX_BIN: cmux,
    CMUX_SURFACE_ID: 'surface:9',
  });
  await Bun.sleep(800);
  expect(existsSync(cmuxLog)).toBe(false);
});
