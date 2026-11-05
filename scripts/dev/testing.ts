import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type {
  DevProject,
  ManagerView,
  ProjectStatus,
  ProjectView,
} from './types';

export const repoRoot = join(import.meta.dir, '..', '..');
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function freePort(): Promise<number> {
  const server = Bun.serve({
    hostname: '127.0.0.1',
    port: 0,
    fetch() {
      return new Response('reserved');
    },
  });
  const port = server.port;
  server.stop(true);
  if (port === undefined) throw new Error('Bun did not assign a free port.');
  return port;
}

export async function isListening(port: number): Promise<boolean> {
  const response = await fetch(`http://127.0.0.1:${port}/`).catch(
    () => undefined,
  );
  return response !== undefined;
}

export async function waitFor(
  predicate: () => boolean,
  timeoutMs = 5000,
  intervalMs = 20,
): Promise<void> {
  const deadline = Date.now() + timeoutMs;
  const poll = async (): Promise<void> => {
    if (predicate()) return;
    if (Date.now() > deadline) {
      throw new Error(`Timed out after ${timeoutMs}ms waiting for condition`);
    }
    await sleep(intervalMs);
    return poll();
  };
  return poll();
}

export function projectStatus(
  view: ManagerView,
  id: string,
): ProjectStatus | undefined {
  return view.projects.find((project) => project.id === id)?.status;
}

export function tempDir(): string {
  return mkdtempSync(join(tmpdir(), 'woodbrook-dev-manager-'));
}

export function readPids(path: string): number[] {
  return readFileSync(path, 'utf8')
    .trim()
    .split(/\s+/)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value));
}

export function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

type ServerProjectOverrides = Partial<DevProject> & {
  readonly env?: Readonly<Record<string, string>>;
};

export function serverProject(
  id: string,
  port: number,
  overrides: ServerProjectOverrides = {},
): DevProject {
  return {
    id,
    label: id,
    cwd: '.',
    command: ['bun', 'scripts/dev/fixtures/http-server.ts'],
    ports: [port],
    url: `http://localhost:${port}`,
    readiness: [{ kind: 'http', url: `http://127.0.0.1:${port}/` }],
    ...overrides,
    env: { PORT: String(port), NAME: id, ...overrides.env },
  };
}

export type FakeProject = {
  readonly id: string;
  readonly label?: string;
  readonly status?: ProjectStatus;
  readonly url?: string;
  readonly ports?: readonly number[];
  readonly error?: string;
  readonly logs?: ProjectView['logs'];
};

export function projectView(project: FakeProject): ProjectView {
  return {
    id: project.id,
    label: project.label ?? project.id,
    url: project.url ?? 'http://localhost:3000',
    ports: project.ports ?? [3000],
    status: project.status ?? 'stopped',
    error: project.error,
    logs: project.logs ?? [],
    pid: undefined,
  };
}

export function viewOf(projects: readonly ProjectView[]): ManagerView {
  return {
    projects,
    runningCount: projects.filter((project) => project.status === 'running')
      .length,
    failedCount: projects.filter((project) => project.status === 'failed')
      .length,
  };
}

export class FakeDevController {
  readonly started: string[] = [];
  readonly stopping: string[] = [];
  readonly restarted: string[] = [];
  startAllCalls = 0;
  stopAllCalls = 0;
  private current: ManagerView;
  private readonly listeners: (() => void)[] = [];

  constructor(view: ManagerView) {
    this.current = view;
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) this.listeners.splice(index, 1);
    };
  };

  getView = (): ManagerView => this.current;

  setView = (view: ManagerView): void => {
    this.current = view;
    this.listeners.map((listener) => listener());
  };

  start = async (id: string): Promise<void> => {
    this.started.push(id);
  };

  stop = async (id: string): Promise<void> => {
    this.stopping.push(id);
  };

  restart = async (id: string): Promise<void> => {
    this.restarted.push(id);
  };

  startAll = async (): Promise<void> => {
    this.startAllCalls += 1;
  };

  stopAll = async (): Promise<void> => {
    this.stopAllCalls += 1;
  };
}
