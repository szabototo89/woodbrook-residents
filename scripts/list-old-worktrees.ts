import { existsSync, statSync } from 'node:fs';
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
};

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

type ArgsState = CliArgs & { pendingDays: boolean };

function applyCliArg(state: ArgsState, arg: string): ArgsState {
  if (state.pendingDays)
    return { ...state, pendingDays: false, days: readDays(arg) };
  if (arg === '--include-main') return { ...state, includeMain: true };
  if (arg === '--json') return { ...state, json: true };
  if (arg === '--help' || arg === '-h') return { ...state, help: true };
  if (arg === '--days') return { ...state, pendingDays: true };
  if (arg.startsWith('--days='))
    return { ...state, days: readDays(arg.slice('--days='.length)) };
  throw new Error(`Unknown argument: "${arg}". Use --help for usage.`);
}

export function parseArgs(argv: string[]): CliArgs {
  const initial: ArgsState = {
    days: 7,
    includeMain: false,
    json: false,
    help: false,
    pendingDays: false,
  };
  const state = argv.reduce(applyCliArg, initial);
  if (state.pendingDays) throw new Error('--days needs a value.');
  return {
    days: state.days,
    includeMain: state.includeMain,
    json: state.json,
    help: state.help,
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
  total: number,
  days: number,
  cutoffMs: number,
): void {
  console.log(
    `Worktrees older than ${days} days (cutoff ${formatDate(cutoffMs)}, ${selected.length} of ${total}):`,
  );
  if (selected.length === 0) {
    console.log('  none');
  } else {
    selected.map((entry) => {
      const branch =
        entry.branch ?? (entry.detached === true ? '(detached)' : '');
      const flags = [
        `${entry.ageDays}d old`,
        `created ${formatDate(entry.birthMs)}`,
        entry.isMain ? 'main' : '',
        entry.stale ? `STALE: ${entry.staleReason}` : '',
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
    console.log(
      'Clean up with: git worktree prune --dry-run -v, then scripts/worktree-remove.sh <path>',
    );
  }
}

function printHelp(): void {
  console.log(`Usage: bun scripts/list-old-worktrees.ts [options]

Lists linked git worktrees older than N days and flags stale ones
(prunable git metadata or missing path).

Options:
  --days <n>       Age threshold in days (default: 7). Also --days=<n>.
  --include-main   Include the main checkout (excluded by default).
  --json           Print machine-readable JSON instead of the table.
  --help, -h       Show this help.

Exit code is 0 when the report succeeds (even with old worktrees found),
so it is safe to run from a preinstall hook.`);
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
  if (args.json) {
    console.log(JSON.stringify(selected, null, 2));
    return;
  }
  printHuman(selected, entries.length, args.days, nowMs - args.days * DAY_MS);
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
