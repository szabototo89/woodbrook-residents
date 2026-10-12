import { expect, test } from 'bun:test';

import {
  buildRemoveCommand,
  isOlderThan,
  parseArgs,
  parseWorktreePorcelain,
  planTargetAction,
  selectCleanTargets,
  selectOldWorktrees,
} from './list-old-worktrees';

test('parses porcelain worktree list with branch and prunable flags', () => {
  const output = [
    'worktree /repo',
    'HEAD abc123',
    'branch refs/heads/main',
    '',
    'worktree /tmp/wt-old',
    'HEAD def456',
    'branch refs/heads/session/old',
    '',
    'worktree /tmp/wt-broken',
    'HEAD 000000',
    'detached',
    'prunable gitdir file points to non-existent location',
    '',
  ].join('\n');

  expect(parseWorktreePorcelain(output)).toEqual([
    { path: '/repo', head: 'abc123', branch: 'refs/heads/main' },
    { path: '/tmp/wt-old', head: 'def456', branch: 'refs/heads/session/old' },
    {
      path: '/tmp/wt-broken',
      head: '000000',
      detached: true,
      prunable: 'gitdir file points to non-existent location',
    },
  ]);
});

test('parses bare worktrees', () => {
  const output = ['worktree /repo.git', 'bare', ''].join('\n');

  expect(parseWorktreePorcelain(output)).toEqual([
    { path: '/repo.git', bare: true },
  ]);
});

test('defaults to 7 days and parses --days forms', () => {
  expect(parseArgs([]).days).toBe(7);
  expect(parseArgs(['--days', '14']).days).toBe(14);
  expect(parseArgs(['--days=30']).days).toBe(30);
});

test('rejects non-positive day counts', () => {
  expect(() => parseArgs(['--days', '0'])).toThrow('--days');
  expect(() => parseArgs(['--days=abc'])).toThrow('--days');
  expect(() => parseArgs(['--days'])).toThrow('--days');
});

test('rejects unknown flags', () => {
  expect(() => parseArgs(['--since'])).toThrow('Unknown argument');
});

test('detects age strictly older than the cutoff', () => {
  const now = Date.UTC(2026, 9, 12);
  const day = 86_400_000;

  expect(isOlderThan(now - 7 * day - 1, now, 7)).toBe(true);
  expect(isOlderThan(now - 7 * day, now, 7)).toBe(false);
  expect(isOlderThan(now - 6 * day, now, 7)).toBe(false);
  expect(isOlderThan(Number.NaN, now, 7)).toBe(false);
});

test('selects only old worktrees, oldest first, flagging stale entries', () => {
  const now = Date.UTC(2026, 9, 12);
  const day = 86_400_000;

  const selected = selectOldWorktrees(
    [
      { path: '/repo', birthMs: now - 90 * day, exists: true },
      {
        path: '/tmp/wt-recent',
        branch: 'refs/heads/session/recent',
        birthMs: now - 1 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-old',
        branch: 'refs/heads/session/old',
        birthMs: now - 10 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-broken',
        detached: true,
        prunable: 'gitdir file points to non-existent location',
        birthMs: now - 9 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-gone',
        branch: 'refs/heads/session/gone',
        birthMs: now - 20 * day,
        exists: false,
      },
    ],
    { days: 7, nowMs: now, mainPath: '/repo' },
  );

  expect(selected.map((entry) => entry.path)).toEqual([
    '/tmp/wt-gone',
    '/tmp/wt-old',
    '/tmp/wt-broken',
  ]);
  expect(selected[0]?.stale).toBe(true);
  expect(selected[0]?.staleReason).toBe('path does not exist');
  expect(selected[1]?.stale).toBe(false);
  expect(selected[2]?.staleReason).toBe(
    'gitdir file points to non-existent location',
  );
});

test('excludes the main checkout unless requested', () => {
  const now = Date.UTC(2026, 9, 12);
  const day = 86_400_000;
  const infos = [{ path: '/repo', birthMs: now - 90 * day, exists: true }];

  expect(
    selectOldWorktrees(infos, { days: 7, nowMs: now, mainPath: '/repo' }),
  ).toEqual([]);
  expect(
    selectOldWorktrees(infos, {
      days: 7,
      nowMs: now,
      mainPath: '/repo',
      includeMain: true,
    }),
  ).toHaveLength(1);
});

test('parses cleanup flags', () => {
  expect(parseArgs([])).toMatchObject({
    clean: false,
    staleOnly: false,
    force: false,
    exclude: [],
  });
  expect(parseArgs(['--clean', '--stale-only', '--force'])).toMatchObject({
    clean: true,
    staleOnly: true,
    force: true,
  });
});

test('parses repeatable --exclude paths', () => {
  expect(parseArgs(['--exclude', '/tmp/a']).exclude).toEqual(['/tmp/a']);
  expect(
    parseArgs(['--exclude=/tmp/a', '--exclude', '/tmp/b']).exclude,
  ).toEqual(['/tmp/a', '/tmp/b']);
  expect(() => parseArgs(['--exclude'])).toThrow('--exclude');
});

test('clean targets never include main, cwd, or excluded paths', () => {
  const now = Date.UTC(2026, 9, 12);
  const day = 86_400_000;
  const old = selectOldWorktrees(
    [
      { path: '/repo', birthMs: now - 90 * day, exists: true },
      {
        path: '/tmp/wt-self',
        birthMs: now - 10 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-old',
        branch: 'refs/heads/session/old',
        birthMs: now - 10 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-skip',
        birthMs: now - 10 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-broken',
        prunable: 'gitdir file points to non-existent location',
        birthMs: now - 9 * day,
        exists: true,
      },
    ],
    { days: 7, nowMs: now, mainPath: '/repo', includeMain: true },
  );

  const targets = selectCleanTargets(old, {
    exclude: ['/tmp/wt-skip'],
    currentPath: '/tmp/wt-self',
  });
  expect(targets.map((entry) => entry.path)).toEqual([
    '/tmp/wt-old',
    '/tmp/wt-broken',
  ]);
});

test('stale-only cleanup keeps just stale targets', () => {
  const now = Date.UTC(2026, 9, 12);
  const day = 86_400_000;
  const old = selectOldWorktrees(
    [
      {
        path: '/tmp/wt-old',
        birthMs: now - 10 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-broken',
        prunable: 'gitdir file points to non-existent location',
        birthMs: now - 9 * day,
        exists: true,
      },
    ],
    { days: 7, nowMs: now },
  );

  expect(
    selectCleanTargets(old, { staleOnly: true }).map((entry) => entry.path),
  ).toEqual(['/tmp/wt-broken']);
});

test('plans prune+delete for stale targets and remove for healthy ones', () => {
  const now = Date.UTC(2026, 9, 12);
  const day = 86_400_000;
  const old = selectOldWorktrees(
    [
      {
        path: '/tmp/wt-old',
        birthMs: now - 10 * day,
        exists: true,
      },
      {
        path: '/tmp/wt-broken',
        prunable: 'gitdir file points to non-existent location',
        birthMs: now - 9 * day,
        exists: true,
      },
    ],
    { days: 7, nowMs: now },
  );

  expect(planTargetAction(old[0]!)).toBe('remove');
  expect(planTargetAction(old[1]!)).toBe('prune+delete');
});

test('builds the wrapper remove command with optional force', () => {
  expect(
    buildRemoveCommand(
      '/repo/scripts/worktree-remove.sh',
      '/tmp/wt-old',
      false,
    ),
  ).toEqual(['sh', '/repo/scripts/worktree-remove.sh', '/tmp/wt-old']);
  expect(
    buildRemoveCommand('/repo/scripts/worktree-remove.sh', '/tmp/wt-old', true),
  ).toEqual([
    'sh',
    '/repo/scripts/worktree-remove.sh',
    '--force',
    '/tmp/wt-old',
  ]);
});
