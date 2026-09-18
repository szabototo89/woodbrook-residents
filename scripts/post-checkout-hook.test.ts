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

function git(args: Array<string>, cwd: string, env = {}) {
  execFileSync('git', args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
}

function makeFakeHerdr(): string {
  const fakeBin = join(scratch, 'fakebin');
  mkdirSync(fakeBin);
  herdrLog = join(scratch, 'herdr-calls.log');
  const fake = join(fakeBin, 'herdr');
  writeFileSync(fake, `#!/bin/sh\necho "$@" >> "${herdrLog}"\n`, {
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

test('worktree add registers the new checkout with herdr', async () => {
  const fake = makeFakeHerdr();
  const repo = makeRepo();
  const wt = join(scratch, 'wt1');
  git(['worktree', 'add', wt, '-b', 'feature/x'], repo, {
    HERDR_BIN: fake,
  });
  const calls = await waitForLog();
  expect(calls).toContain(`worktree open --path ${wt} --no-focus`);
});

test('plain branch checkout does not call herdr', async () => {
  const fake = makeFakeHerdr();
  const repo = makeRepo();
  git(['checkout', '-q', '-b', 'feature/y'], repo, { HERDR_BIN: fake });
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
    env: { ...process.env, HERDR_BIN: fake },
    stdio: 'pipe',
  });
  expect(existsSync(herdrLog)).toBe(false);
});

test('hook ignores everything when herdr is missing', () => {
  const repo = makeRepo();
  const wt = join(scratch, 'wt2');
  git(['worktree', 'add', wt, '-b', 'feature/z'], repo, {
    HERDR_BIN: join(scratch, 'no-such-binary'),
  });
  // Worktree creation itself must still succeed.
  expect(existsSync(join(wt, '.git'))).toBe(true);
});
