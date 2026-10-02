import { readdirSync, existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export type ParsedAppArgs = {
  task: string;
  app?: string;
  extraArgs: string[];
  ifPresent: boolean;
  envFile?: string;
  exclude: string[];
};

type ParserState = {
  task?: string;
  app?: string;
  extraArgs: string[];
  ifPresent: boolean;
  envFile?: string;
  exclude: string[];
  passthrough: boolean;
  pendingFlag?: 'env-file' | 'exclude';
};

const initialParserState: ParserState = {
  extraArgs: [],
  ifPresent: false,
  exclude: [],
  passthrough: false,
};

const splitList = (value: string): string[] =>
  value.split(',').filter((part) => part.length > 0);

function applyArg(state: ParserState, arg: string): ParserState {
  if (state.pendingFlag === 'env-file') {
    return { ...state, pendingFlag: undefined, envFile: arg };
  }
  if (state.pendingFlag === 'exclude') {
    return {
      ...state,
      pendingFlag: undefined,
      exclude: [...state.exclude, ...splitList(arg)],
    };
  }
  if (state.passthrough) {
    return { ...state, extraArgs: [...state.extraArgs, arg] };
  }
  if (arg === '--') return { ...state, passthrough: true };
  if (arg === '--if-present') return { ...state, ifPresent: true };
  if (arg.startsWith('--env-file=')) {
    return { ...state, envFile: arg.slice('--env-file='.length) };
  }
  if (arg === '--env-file') return { ...state, pendingFlag: 'env-file' };
  if (arg.startsWith('--exclude=')) {
    return {
      ...state,
      exclude: [...state.exclude, ...splitList(arg.slice('--exclude='.length))],
    };
  }
  if (arg === '--exclude') return { ...state, pendingFlag: 'exclude' };
  if (state.task === undefined && !arg.startsWith('-')) {
    return { ...state, task: arg };
  }
  if (
    state.task !== undefined &&
    state.app === undefined &&
    !arg.startsWith('-')
  ) {
    return { ...state, app: arg };
  }
  return { ...state, extraArgs: [...state.extraArgs, arg] };
}

export function listApps(repoRoot: string): string[] {
  const appsDir = join(repoRoot, 'apps');
  return readdirSync(appsDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((name) => existsSync(join(appsDir, name, 'package.json')))
    .sort();
}

export function getAppScripts(
  repoRoot: string,
  app: string,
): Record<string, string> | null {
  const manifestPath = join(repoRoot, 'apps', app, 'package.json');
  if (!existsSync(manifestPath)) return null;
  const manifest: { scripts?: Record<string, string> } = JSON.parse(
    readFileSync(manifestPath, 'utf8'),
  );
  return manifest.scripts ?? {};
}

export function parseAppArgs(argv: string[]): ParsedAppArgs {
  const state = argv.reduce(applyArg, initialParserState);
  if (state.pendingFlag !== undefined) {
    throw new Error(`--${state.pendingFlag} requires a value`);
  }
  if (state.task === undefined) {
    throw new Error(
      'Usage: app.ts <task> [app] [...args] [--if-present] [--env-file <file>] [--exclude <app>]',
    );
  }
  return {
    task: state.task,
    app: state.app,
    extraArgs: state.extraArgs,
    ifPresent: state.ifPresent,
    envFile: state.envFile,
    exclude: state.exclude,
  };
}

export function buildAppCommand(
  repoRoot: string,
  app: string,
  task: string,
  extraArgs: string[],
  envFile?: string,
): string[] {
  void repoRoot;
  return [
    'bun',
    'run',
    '--cwd',
    `apps/${app}`,
    ...(envFile === undefined ? [] : [`--env-file=${envFile}`]),
    task,
    ...extraArgs,
  ];
}

export function appsWithTask(
  repoRoot: string,
  task: string,
  exclude: string[] = [],
): string[] {
  return listApps(repoRoot).filter((app) => {
    if (exclude.includes(app)) return false;
    const scripts = getAppScripts(repoRoot, app);
    return scripts !== null && task in scripts;
  });
}

async function runCommand(command: string[], cwd: string): Promise<number> {
  const child = Bun.spawn(command, {
    cwd,
    env: process.env,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  return child.exited;
}

async function runTargets(
  repoRoot: string,
  task: string,
  targets: string[],
  extraArgs: string[],
  envFile?: string,
): Promise<void> {
  const [head, ...tail] = targets;
  if (head === undefined) return;
  console.log(`▶ ${head}: ${task}`);
  const command = buildAppCommand(repoRoot, head, task, extraArgs, envFile);
  const code = await runCommand(command, repoRoot);
  if (code !== 0) {
    throw new Error(
      `Command failed in ${head} with exit code ${code}: ${command.join(' ')}`,
    );
  }
  return runTargets(repoRoot, task, tail, extraArgs, envFile);
}

async function main(): Promise<void> {
  const repoRoot = resolve(import.meta.dir, '..');
  const parsed = parseAppArgs(Bun.argv.slice(2));

  if (parsed.app) {
    const apps = listApps(repoRoot);
    if (!apps.includes(parsed.app)) {
      throw new Error(
        `Unknown app "${parsed.app}". Available: ${apps.join(', ')}`,
      );
    }
    const scripts = getAppScripts(repoRoot, parsed.app) ?? {};
    if (!(parsed.task in scripts)) {
      if (parsed.ifPresent) {
        console.log(`Skipping ${parsed.app}: no "${parsed.task}" script.`);
        return;
      }
      throw new Error(`App "${parsed.app}" has no "${parsed.task}" script.`);
    }
    const command = buildAppCommand(
      repoRoot,
      parsed.app,
      parsed.task,
      parsed.extraArgs,
      parsed.envFile,
    );
    const code = await runCommand(command, repoRoot);
    if (code !== 0) process.exitCode = code;
    return;
  }

  const targets = appsWithTask(repoRoot, parsed.task, parsed.exclude);
  if (targets.length === 0) {
    throw new Error(`No app implements "${parsed.task}".`);
  }
  return runTargets(
    repoRoot,
    parsed.task,
    targets,
    parsed.extraArgs,
    parsed.envFile,
  );
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
