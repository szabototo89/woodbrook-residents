import type { DevProject } from './types';

export type DevCliOptions = {
  readonly help: boolean;
  readonly interactive: boolean;
};

export type DevCliRuntime = {
  readonly stdoutIsTty: boolean;
  readonly env: Readonly<Record<string, string | undefined>>;
};

type ParserState = {
  readonly help: boolean;
  readonly force?: boolean;
  readonly error?: string;
};

function parseArg(state: ParserState, arg: string): ParserState {
  if (arg === '--help' || arg === '-h') return { ...state, help: true };
  if (arg === '--interactive') return { ...state, force: true };
  if (arg === '--no-interactive') return { ...state, force: false };
  return { ...state, error: `Unknown option: ${arg}` };
}

const isCi = (env: DevCliRuntime['env']): boolean =>
  env.CI === '1' || env.CI === 'true';

export function parseDevCliOptions(
  argv: readonly string[],
  runtime: DevCliRuntime,
): DevCliOptions {
  const state = argv.reduce(parseArg, { help: false });
  if (state.error !== undefined) throw new Error(state.error);
  if (state.help) return { help: true, interactive: false };
  const interactive =
    state.force ??
    (runtime.stdoutIsTty && !isCi(runtime.env) && runtime.env.TERM !== 'dumb');
  return { help: false, interactive };
}

export function devUsage(projects: readonly DevProject[]): string {
  const rows = projects.map(
    (project) => `  ${project.id.padEnd(20)} ${project.url}`,
  );
  return [
    'Usage: bun run dev:all [--interactive | --no-interactive] [--help]',
    '',
    'Starts every browser-based project concurrently. Without a flag, the',
    'OpenTUI React project list opens only when stdout is an interactive',
    'terminal and CI/TERM=dumb are not set.',
    '',
    'Options:',
    '  --interactive      Force the OpenTUI project list.',
    '  --no-interactive   Stream prefixed logs until Ctrl+C; no TUI.',
    '  -h, --help         Show this help.',
    '',
    'Controls (interactive): Up/Down or j/k select, s or Enter start,',
    'x stop, r restart, q or Ctrl+C quit. Ctrl+C stops all owned projects.',
    '',
    'Projects:',
    ...rows,
    '',
  ].join('\n');
}
