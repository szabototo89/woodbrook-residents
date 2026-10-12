import { existsSync, realpathSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';

const DAY_MS = 86_400_000;

export type WorktreeEntry = {
  path: string;
  head?: string;
  branch?: string;
  bare?: boolean;
  detached?: boolean;
  prunable?: string;
};

export type WorktreeInfo = WorktreeEntry & {
  birthMs: number;
  exists: boolean;
};

export type OldWorktree = WorktreeInfo & {
  ageDays: number;
  stale: boolean;
  staleReason?: string;
  isMain: boolean;
};

export type SelectOptions = {
  days: number;
  nowMs: number;
  mainPath?: string;
  includeMain?: boolean;
};

export type CliArgs = {
  days: number;
  includeMain: boolean;
  json: boolean;
  help: boolean;
  clean: boolean;
  staleOnly: boolean;
  force: boolean;
  exclude: string[];
};

export type CleanOptions = {
  staleOnly?: boolean;
  exclude?: string[];
  currentPath?: string;
};

export type TargetAction = 'remove' | 'prune+delete';

type PorcelainState = {
  entries: WorktreeEntry[];
  current?: WorktreeEntry;
};

function applyPorcelainLine(
  state: PorcelainState,
  line: string,
): PorcelainState {
  if (line.startsWith('worktree ')) {
    return {
      entries:
        state.current === undefined
          ? state.entries
          : [...state.entries, state.current],
      current: { path: line.slice('worktree '.length).trim() },
    };
  }
  if (state.current === undefined) return state;
  if (line.startsWith('HEAD '))
    return {
      ...state,
      current: { ...state.current, head: line.slice(5).trim() },
    };
  if (line.startsWith('branch '))
    return {
      ...state,
      current: { ...state.current, branch: line.slice(7).trim() },
    };
  if (line === 'bare')
    return { ...state, current: { ...state.current, bare: true } };
  if (line === 'detached')
    return { ...state, current: { ...state.current, detached: true } };
  if (line.startsWith('prunable'))
    return {
      ...state,
      current: {
        ...state.current,
        prunable: line.slice('prunable'.length).trim(),
      },
    };
  return state;
}

export function parseWorktreePorcelain(output: string): WorktreeEntry[] {
  const initial: PorcelainState = { entries: [] };
  const state = output.split('\n').reduce(applyPorcelainLine, initial);
  const all =
    state.current === undefined
      ? state.entries
      : [...state.entries, state.current];
  return all.filter((entry) => entry.path.length > 0);
}

function readDays(candidate: string | undefined): number {
  const parsed = Number(candidate);
  if (candidate === undefined || !Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(
      `--days needs a positive number of days (got "${candidate ?? ''}").`,
    );
  }
  return parsed;
}

type ArgsState = CliArgs & { pendingDays: boolean; pendingExclude: boolean };

function applyCliArg(state: ArgsState, arg: string): ArgsState {
  if (state.pendingDays)
    return { ...state, pendingDays: false, days: readDays(arg) };
  if (state.pendingExclude)
    return {
      ...state,
      pendingExclude: false,
      exclude: [...state.exclude, arg],
    };
  if (arg === '--include-main') return { ...state, includeMain: true };
  if (arg === '--json') return { ...state, json: true };
  if (arg === '--help' || arg === '-h') return { ...state, help: true };
  if (arg === '--clean') return { ...state, clean: true };
  if (arg === '--stale-only') return { ...state, staleOnly: true };
  if (arg === '--force') return { ...state, force: true };
  if (arg === '--days') return { ...state, pendingDays: true };
  if (arg === '--exclude') return { ...state, pendingExclude: true };
  if (arg.startsWith('--days='))
    return { ...state, days: readDays(arg.slice('--days='.length)) };
  if (arg.startsWith('--exclude='))
    return {
      ...state,
      exclude: [...state.exclude, arg.slice('--exclude='.length)],
    };
  throw new Error(`Unknown argument: "${arg}". Use --help for usage.`);
}

export function parseArgs(argv: string[]): CliArgs {
  const initial: ArgsState = {
    days: 7,
    includeMain: false,
    json: false,
    help: false,
    clean: false,
    staleOnly: false,
    force: false,
    exclude: [],
    pendingDays: false,
    pendingExclude: false,
  };
  const state = argv.reduce(applyCliArg, initial);
  if (state.pendingDays) throw new Error('--days needs a value.');
  if (state.pendingExclude) throw new Error('--exclude needs a value.');
  return {
    days: state.days,
    includeMain: state.includeMain,
    json: state.json,
    help: state.help,
    clean: state.clean,
    staleOnly: state.staleOnly,
    force: state.force,
    exclude: state.exclude,
  };
}

export function isOlderThan(
  birthMs: number,
  nowMs: number,
  days: number,
): boolean {
  if (!Number.isFinite(birthMs) || !Number.isFinite(nowMs)) return false;
  return nowMs - birthMs > days * DAY_MS;
}

function normalizePath(candidate: string): string {
  return candidate.length > 1 && candidate.endsWith('/')
    ? candidate.slice(0, -1)
    : candidate;
}

export function selectOldWorktrees(
  infos: WorktreeInfo[],
  options: SelectOptions,
): OldWorktree[] {
  const mainPath =
    options.mainPath === undefined
      ? undefined
      : normalizePath(options.mainPath);
  return infos
    .filter((info) => isOlderThan(info.birthMs, options.nowMs, options.days))
    .map((info) => {
      const isMain =
        mainPath !== undefined && normalizePath(info.path) === mainPath;
      const stale = info.prunable !== undefined || !info.exists;
      const staleReason =
        info.prunable ?? (info.exists ? undefined : 'path does not exist');
      const result: OldWorktree = {
        ...info,
        ageDays: Math.floor((options.nowMs - info.birthMs) / DAY_MS),
        stale,
        isMain,
      };
      if (staleReason !== undefined) result.staleReason = staleReason;
      return result;
    })
    .filter((info) => options.includeMain === true || !info.isMain)
    .sort((left, right) => left.birthMs - right.birthMs);
}

export function selectCleanTargets(
  old: OldWorktree[],
  options: CleanOptions,
): OldWorktree[] {
  const excluded = (options.exclude ?? []).map(normalizePath);
  const current =
    options.currentPath === undefined
      ? undefined
      : normalizePath(options.currentPath);
  return old
    .filter((entry) => !entry.isMain)
    .filter((entry) => options.staleOnly !== true || entry.stale)
    .filter(
      (entry) => current === undefined || normalizePath(entry.path) !== current,
    )
    .filter((entry) => !excluded.includes(normalizePath(entry.path)));
}

export function planTargetAction(target: OldWorktree): TargetAction {
  return target.stale ? 'prune+delete' : 'remove';
}

export function buildRemoveCommand(
  wrapperPath: string,
  targetPath: string,
  force: boolean,
): string[] {
  return force
    ? ['sh', wrapperPath, '--force', targetPath]
    : ['sh', wrapperPath, targetPath];
}

type CleanFailure = { path: string; reason: string };

type CleanResult = {
  removed: string[];
  failed: CleanFailure[];
  pruned: boolean;
};

async function removeHealthyTarget(
  command: string[],
  repoRoot: string,
  target: OldWorktree,
): Promise<string | undefined> {
  console.log(`Removing ${target.path} ...`);
  const child = Bun.spawn(command, {
    cwd: repoRoot,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  const code = await child.exited;
  return code === 0 ? undefined : `remove exited with code ${code}`;
}

function runGitPrune(repoRoot: string): void {
  const proc = Bun.spawnSync(['git', 'worktree', 'prune'], { cwd: repoRoot });
  if (proc.exitCode !== 0) {
    throw new Error(
      `git worktree prune failed: ${proc.stderr.toString().trim() || `exit ${proc.exitCode}`}`,
    );
  }
}

async function runClean(
  repoRoot: string,
  wrapperPath: string,
  targets: OldWorktree[],
  force: boolean,
): Promise<CleanResult> {
  const initial: CleanResult = { removed: [], failed: [], pruned: false };
  const healthy = targets.filter(
    (target) => planTargetAction(target) === 'remove',
  );
  const stale = targets.filter(
    (target) => planTargetAction(target) === 'prune+delete',
  );
  const afterHealthy = await healthy.reduce(async (previous, target) => {
    const result = await previous;
    const reason = await removeHealthyTarget(
      buildRemoveCommand(wrapperPath, target.path, force),
      repoRoot,
      target,
    );
    return reason === undefined
      ? { ...result, removed: [...result.removed, target.path] }
      : {
          ...result,
          failed: [...result.failed, { path: target.path, reason }],
        };
  }, Promise.resolve(initial));
  if (stale.length === 0) return afterHealthy;
  console.log(
    `Pruning ${stale.length} stale worktree record(s), then deleting leftover paths ...`,
  );
  runGitPrune(repoRoot);
  return stale.reduce((result: CleanResult, target) => {
    try {
      if (existsSync(target.path)) {
        rmSync(target.path, { recursive: true, force: true });
      }
      return { ...result, removed: [...result.removed, target.path] };
    } catch (error) {
      return {
        ...result,
        failed: [
          ...result.failed,
          {
            path: target.path,
            reason: error instanceof Error ? error.message : String(error),
          },
        ],
      };
    }
  }, afterHealthy);
}

function runGitWorktreeList(repoRoot: string): string {
  // Bun.spawnSync like scripts/deploy-laura.ts: no shell, no extra deps.
  const proc = Bun.spawnSync(['git', 'worktree', 'list', '--porcelain'], {
    cwd: repoRoot,
  });
  const stdout = proc.stdout.toString();
  if (proc.exitCode !== 0) {
    throw new Error(
      `git worktree list failed: ${proc.stderr.toString().trim() || `exit ${proc.exitCode}`}`,
    );
  }
  return stdout;
}

function readBirthMs(path: string): { birthMs: number; exists: boolean } {
  // No subprocess: Node stat birthtime is cheaper than shelling to `stat`
  // and portable across macOS/Linux (falls back to mtime when unset).
  if (!existsSync(path)) return { birthMs: 0, exists: false };
  try {
    const stats = statSync(path);
    const birth =
      stats.birthtimeMs > 0 && Number.isFinite(stats.birthtimeMs)
        ? stats.birthtimeMs
        : stats.mtimeMs;
    return { birthMs: birth, exists: true };
  } catch {
    return { birthMs: 0, exists: false };
  }
}

function isMainCheckout(path: string): boolean {
  try {
    return statSync(join(path, '.git')).isDirectory();
  } catch {
    return false;
  }
}

function formatDate(ms: number): string {
  if (!Number.isFinite(ms) || ms <= 0) return 'unknown';
  return new Date(ms).toISOString().slice(0, 10);
}

function printHuman(
  selected: OldWorktree[],
  targets: OldWorktree[],
  total: number,
  days: number,
  cutoffMs: number,
  clean: boolean,
): void {
  console.log(
    `Worktrees older than ${days} days (cutoff ${formatDate(cutoffMs)}, ${selected.length} of ${total}):`,
  );
  if (selected.length === 0) {
    console.log('  none');
  } else {
    const targetPaths = targets.map((target) => target.path);
    selected.map((entry) => {
      const branch =
        entry.branch ?? (entry.detached === true ? '(detached)' : '');
      const action = targetPaths.includes(entry.path)
        ? `would ${planTargetAction(entry)}`
        : 'skipped (protected)';
      const flags = [
        `${entry.ageDays}d old`,
        `created ${formatDate(entry.birthMs)}`,
        entry.isMain ? 'main' : '',
        entry.stale ? `STALE: ${entry.staleReason}` : '',
        clean ? '' : action,
      ]
        .filter((part) => part.length > 0)
        .join(' | ');
      console.log(`  ${entry.path} ${branch} [${flags}]`);
    });
  }
  const stale = selected.filter((entry) => entry.stale);
  if (stale.length > 0) {
    console.log(`\nStale worktrees (${stale.length}):`);
    stale.map((entry) => console.log(`  ${entry.path} (${entry.staleReason})`));
  }
  if (!clean) {
    console.log(
      `\nDry run: ${targets.length} would be cleaned with --clean` +
        ' (healthy via scripts/worktree-remove.sh, stale via git worktree prune + path delete).' +
        ' Main checkout, current checkout, and --exclude paths are never touched.',
    );
  }
}

function printCleanSummary(result: CleanResult): void {
  console.log(
    `\nCleaned ${result.removed.length} worktree(s)${result.pruned ? ' (including git worktree prune)' : ''}.`,
  );
  result.removed.map((path) => console.log(`  removed ${path}`));
  if (result.failed.length > 0) {
    console.log(`Failed ${result.failed.length}:`);
    result.failed.map((failure) =>
      console.log(`  ${failure.path}: ${failure.reason}`),
    );
  }
}

function printHelp(): void {
  console.log(`Usage: bun scripts/list-old-worktrees.ts [options]

Lists linked git worktrees older than N days and flags stale ones
(prunable git metadata or missing path). Dry run by default.

Options:
  --days <n>       Age threshold in days (default: 7). Also --days=<n>.
  --include-main   Include the main checkout in the report (never cleaned).
  --exclude <p>    Never clean this path (repeatable, also --exclude=<p>).
  --stale-only     With --clean, only clean stale worktrees.
  --clean          Actually remove old worktrees (default is dry run).
  --force          Pass --force to worktree removal (removes dirty trees).
  --json           Print machine-readable JSON instead of the table.
  --help, -h       Show this help.

Healthy trees are removed with scripts/worktree-remove.sh so hooks fire;
stale records go through git worktree prune plus leftover path delete.
Branches are never deleted. Without --force, dirty worktrees are skipped.

Exit code is 0 when the report succeeds (even with old worktrees found),
so the default dry run is safe from a preinstall hook.`);
}

async function main(): Promise<void> {
  const repoRoot = resolve(import.meta.dir, '..');
  const args = parseArgs(Bun.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }
  const entries = parseWorktreePorcelain(runGitWorktreeList(repoRoot));
  const mainEntry = entries.find((entry) => isMainCheckout(entry.path));
  const infos: WorktreeInfo[] = entries.map((entry) => ({
    ...entry,
    ...readBirthMs(entry.path),
  }));
  const nowMs = Date.now();
  const selected = selectOldWorktrees(infos, {
    days: args.days,
    nowMs,
    mainPath: mainEntry?.path ?? entries[0]?.path,
    includeMain: args.includeMain,
  });
  // Never clean the main checkout, the checkout running this script, or
  // the current working directory.
  const targets = selectCleanTargets(selected, {
    staleOnly: args.staleOnly,
    exclude: [...args.exclude, repoRoot, realpathSync(process.cwd())],
  });
  if (!args.clean) {
    if (args.json) {
      console.log(JSON.stringify(selected, null, 2));
    } else {
      printHuman(
        selected,
        targets,
        entries.length,
        args.days,
        nowMs - args.days * DAY_MS,
        false,
      );
    }
    return;
  }
  if (!args.json) {
    printHuman(
      selected,
      targets,
      entries.length,
      args.days,
      nowMs - args.days * DAY_MS,
      true,
    );
  }
  const result = await runClean(
    repoRoot,
    join(repoRoot, 'scripts', 'worktree-remove.sh'),
    targets,
    args.force,
  );
  if (args.json) {
    console.log(JSON.stringify({ selected, targets, result }, null, 2));
  } else {
    printCleanSummary(result);
  }
  if (result.failed.length > 0) process.exitCode = 1;
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
