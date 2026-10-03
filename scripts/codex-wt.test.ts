import { afterEach, beforeEach, expect, test } from 'bun:test';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdtempSync,
  mkdirSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const launcher = join(import.meta.dir, 'codex-wt.zsh');
// Git hooks export repository-local variables; never let fixture commands use
// the real repository's Git directory, worktree or index.
const isolatedEnv = Object.fromEntries(
  Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')),
);
let scratch: string;
let repo: string;
let bin: string;
let log: string;
let cwdLog: string;

function git(args: string[], cwd = repo) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    env: {
      ...isolatedEnv,
      GIT_AUTHOR_NAME: 'Launcher test',
      GIT_AUTHOR_EMAIL: 'launcher@example.test',
      GIT_COMMITTER_NAME: 'Launcher test',
      GIT_COMMITTER_EMAIL: 'launcher@example.test',
    },
  }).trim();
}

function launch(args: string[] = [], cwd = repo, exitCode = 0) {
  return spawnSync(
    'zsh',
    [
      '-f',
      '-c',
      'source "$1" || exit; codex-wt "${@:2}"; result=$?; print -r -- "$PWD" > "$CODEX_WT_CWD_LOG"; exit "$result"',
      'test',
      launcher,
      ...args,
    ],
    {
      cwd,
      encoding: 'utf8',
      env: {
        ...isolatedEnv,
        PATH: `${bin}:${process.env.PATH}`,
        CODEX_WT_TEST_LOG: log,
        CODEX_WT_CWD_LOG: cwdLog,
        CODEX_WT_EXIT_CODE: String(exitCode),
      },
    },
  );
}

function invocation() {
  return readFileSync(log, 'utf8').split('\0').slice(0, -1);
}

beforeEach(() => {
  scratch = realpathSync(mkdtempSync(join(tmpdir(), 'codex-wt-test-')));
  repo = join(scratch, 'repo with spaces');
  bin = join(scratch, 'bin');
  log = join(scratch, 'codex.log');
  cwdLog = join(scratch, 'cwd.log');
  mkdirSync(repo);
  mkdirSync(bin);
  git(['init', '-q', '-b', 'main']);
  git(['commit', '-q', '--allow-empty', '-m', 'Initial main']);
  writeFileSync(
    join(bin, 'codex'),
    '#!/bin/sh\nprintf "%s\\0" "$PWD" "$@" > "$CODEX_WT_TEST_LOG"\nexit "$CODEX_WT_EXIT_CODE"\n',
    { mode: 0o755 },
  );
});

afterEach(() => rmSync(scratch, { recursive: true, force: true }));

test('creates a branch from main, launches there and leaves the shell there', () => {
  const mainHead = git(['rev-parse', 'main']);
  git(['switch', '-q', '-c', 'existing-feature']);
  git(['commit', '-q', '--allow-empty', '-m', 'Existing feature']);
  writeFileSync(join(repo, 'private-notes.txt'), 'Keep these notes');
  const subdirectory = join(repo, 'nested folder');
  mkdirSync(subdirectory);
  const args = [
    '--model',
    'example-model',
    'Fix "quotes" and $variables; `code`',
  ];

  const result = launch(args, subdirectory);

  expect(result.status).toBe(0);
  const [worktree, ...forwardedArgs] = invocation();
  expect(worktree).toStartWith(join(scratch, '.worktrees', 'repo with spaces'));
  expect(forwardedArgs).toEqual(args);
  expect(readFileSync(cwdLog, 'utf8').trim()).toBe(worktree);
  expect(git(['rev-parse', 'HEAD'], worktree)).toBe(mainHead);
  expect(git(['branch', '--show-current'], worktree)).toStartWith('codex/');
  expect(git(['branch', '--show-current'])).toBe('existing-feature');
  expect(readFileSync(join(repo, 'private-notes.txt'), 'utf8')).toBe(
    'Keep these notes',
  );
});

test('creates a fresh sibling worktree when called from a linked worktree', () => {
  expect(launch().status).toBe(0);
  const first = invocation()[0]!;
  expect(launch([], first).status).toBe(0);
  const second = invocation()[0]!;
  expect(second).not.toBe(first);
  expect(second).toStartWith(join(scratch, '.worktrees', 'repo with spaces'));
  expect(
    git(['worktree', 'list', '--porcelain']).match(/^worktree /gm),
  ).toHaveLength(3);
});

test('reports a non-Git directory without changing the shell directory', () => {
  const result = launch([], scratch);
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('Run codex-wt inside a Git working tree.');
  expect(readFileSync(cwdLog, 'utf8').trim()).toBe(scratch);
});

test('reports a missing main branch without creating a worktree', () => {
  git(['branch', '-m', 'master']);
  const result = launch();
  expect(result.status).toBe(1);
  expect(result.stderr).toContain('A local main branch is required.');
  expect(
    git(['worktree', 'list', '--porcelain']).match(/^worktree /gm),
  ).toHaveLength(1);
  expect(readFileSync(cwdLog, 'utf8').trim()).toBe(repo);
});

test('keeps the worktree and Codex exit status when Codex fails', () => {
  expect(launch([], repo, 7).status).toBe(7);
  const worktree = invocation()[0]!;
  expect(readFileSync(cwdLog, 'utf8').trim()).toBe(worktree);
  expect(git(['rev-parse', '--is-inside-work-tree'], worktree)).toBe('true');
});

test('does not change directory or launch Codex if worktree creation fails', () => {
  // A file blocks the directory where the launcher would create worktrees.
  writeFileSync(join(scratch, '.worktrees'), 'Keep this file');
  const result = launch();
  expect(result.status).not.toBe(0);
  expect(readFileSync(cwdLog, 'utf8').trim()).toBe(repo);
  expect(
    git(['worktree', 'list', '--porcelain']).match(/^worktree /gm),
  ).toHaveLength(1);
});
