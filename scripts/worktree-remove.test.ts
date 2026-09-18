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
const WRAPPER_PATH = join(REPO_ROOT, 'scripts', 'worktree-remove.sh');

let scratch = '';

function git(args: Array<string>, cwd: string, env = {}) {
  execFileSync('git', args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'pipe',
  });
}

function makeRepoWithHookStub(): { repo: string; hookLog: string } {
  const repo = join(scratch, 'main');
  mkdirSync(repo, { recursive: true });
  git(['init', '-q'], repo);
  const author = {
    GIT_AUTHOR_NAME: 't',
    GIT_AUTHOR_EMAIL: 't@t',
    GIT_COMMITTER_NAME: 't@t',
    GIT_COMMITTER_EMAIL: 't@t',
  };
  git(['commit', '-q', '--allow-empty', '-m', 'init'], repo, author);
  const hooksDir = join(repo, '.githooks');
  mkdirSync(hooksDir, { recursive: true });
  git(['config', 'core.hooksPath', join(REPO_ROOT, '.githooks')], repo);
  // Point repo at a stub hooks dir by copying the real remove hook logic?
  // Instead: install a stub post-worktree-remove that logs its arg.
  const stubDir = join(scratch, 'stubhooks');
  mkdirSync(stubDir, { recursive: true });
  const hookLog = join(scratch, 'remove-hook.log');
  writeFileSync(
    join(stubDir, 'post-worktree-remove'),
    `#!/bin/sh\necho "$1" >> "${hookLog}"\n`,
    { mode: 0o755 },
  );
  git(['config', 'core.hooksPath', stubDir], repo);
  return { repo, hookLog };
}

beforeEach(() => {
  scratch = realpathSync(mkdtempSync(join(tmpdir(), 'wraptest-')));
});

afterEach(() => {
  rmSync(scratch, { recursive: true, force: true });
});

test('worktree-remove wrapper exists and is executable', () => {
  expect(existsSync(WRAPPER_PATH)).toBe(true);
});

test('wrapper removes the worktree and fires post-worktree-remove', () => {
  const { repo, hookLog } = makeRepoWithHookStub();
  const wt = join(scratch, 'wt1');
  git(['worktree', 'add', wt, '-b', 'feature/x'], repo);
  expect(existsSync(join(wt, '.git'))).toBe(true);
  execFileSync('sh', [WRAPPER_PATH, wt], {
    cwd: repo,
    env: { ...process.env },
    stdio: 'pipe',
  });
  expect(existsSync(join(wt, '.git'))).toBe(false);
  expect(readFileSync(hookLog, 'utf8').trim()).toBe(wt);
});

test('wrapper supports --force passthrough', () => {
  const { repo, hookLog } = makeRepoWithHookStub();
  const wt = join(scratch, 'wt-force');
  git(['worktree', 'add', wt, '-b', 'feature/f'], repo);
  execFileSync('sh', [WRAPPER_PATH, '--force', wt], {
    cwd: repo,
    env: { ...process.env },
    stdio: 'pipe',
  });
  expect(existsSync(join(wt, '.git'))).toBe(false);
  expect(readFileSync(hookLog, 'utf8').trim()).toBe(wt);
});
