import { connect } from 'node:net';
import type {
  DevManagerOptions,
  DevProject,
  LogLine,
  LogStream,
  ManagerView,
  ProjectStatus,
  ProjectView,
  ReadinessCheck,
} from './types';

const ANSI_PATTERN = new RegExp(
  `${String.fromCharCode(27)}\\[[0-?]*[ -/]*[@-~]`,
  'g',
);

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const stripAnsi = (value: string): string =>
  value.replace(ANSI_PATTERN, '');

type OwnedProcess = {
  readonly pid: number;
  readonly exited: Promise<number>;
  readonly stdout: ReadableStream<Uint8Array> | undefined;
  readonly stderr: ReadableStream<Uint8Array> | undefined;
};

type Runtime = {
  readonly spec: DevProject;
  status: ProjectStatus;
  url: string;
  logs: LogLine[];
  pid: number | undefined;
  error: string | undefined;
  generation: number;
  process: OwnedProcess | undefined;
};

const isActive = (status: ProjectStatus): boolean =>
  status === 'starting' || status === 'running' || status === 'stopping';

const LOCAL_HOSTS = ['127.0.0.1', '::1'] as const;

function canConnect(host: string, port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = connect({ host, port });
    socket.setTimeout(500);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
  });
}

async function isPortInUse(port: number): Promise<boolean> {
  const results = await Promise.all(
    LOCAL_HOSTS.map((host) => canConnect(host, port)),
  );
  return results.some((result) => result);
}

async function isHttpReady(url: string): Promise<boolean> {
  const response = await fetch(url, {
    signal: AbortSignal.timeout(1000),
    redirect: 'manual',
  }).catch(() => undefined);
  if (response === undefined) return false;
  await response.body?.cancel();
  return response.status < 500;
}

function httpCandidates(url: string): string[] {
  const candidates = [url];
  LOCAL_HOSTS.map((host) =>
    url.replace(
      /(?:127\.0\.0\.1|\[::1\]|localhost)/,
      host === '::1' ? '[::1]' : host,
    ),
  ).map((candidate) => {
    if (!candidates.includes(candidate)) candidates.push(candidate);
  });
  return candidates;
}

async function probe(check: ReadinessCheck): Promise<boolean> {
  if (check.kind === 'tcp') return isPortInUse(check.port);
  const results = await Promise.all(
    httpCandidates(check.url).map((url) => isHttpReady(url)),
  );
  return results.some((result) => result);
}

function describeReadiness(checks: readonly ReadinessCheck[]): string {
  return checks
    .map((check) => (check.kind === 'tcp' ? `tcp:${check.port}` : check.url))
    .join(', ');
}

async function waitForReadiness(
  checks: readonly ReadinessCheck[],
  deadline: number,
  intervalMs: number,
  shouldContinue: () => boolean,
): Promise<boolean> {
  if (!shouldContinue()) return false;
  const results = await Promise.all(checks.map((check) => probe(check)));
  if (results.every((result) => result)) return true;
  if (Date.now() >= deadline || !shouldContinue()) return false;
  await sleep(intervalMs);
  return waitForReadiness(checks, deadline, intervalMs, shouldContinue);
}

function killProcessGroup(pid: number, signal: NodeJS.Signals): void {
  try {
    process.kill(-pid, signal);
    return;
  } catch {
    /* The process group may already be gone; fall back to the process itself. */
  }
  try {
    process.kill(pid, signal);
  } catch {
    /* The owned process has already exited. */
  }
}

function consumeLines(
  pending: string,
  chunk: Uint8Array,
  decoder: TextDecoder,
  onLine: (line: string) => void,
): string {
  const parts = (pending + decoder.decode(chunk, { stream: true })).split(
    /\r?\n/,
  );
  const remainder = parts.pop() ?? '';
  parts.filter((line) => line.length > 0).map(onLine);
  return remainder;
}

async function readStream(
  stream: ReadableStream<Uint8Array>,
  onLine: (line: string) => void,
): Promise<void> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  const pump = async (pending: string): Promise<void> => {
    const result = await reader.read();
    if (result.done) {
      if (pending.length > 0) onLine(pending);
      return;
    }
    return pump(consumeLines(pending, result.value, decoder, onLine));
  };
  return pump('');
}

export class DevManager {
  private readonly repoRoot: string;
  private readonly specs: readonly DevProject[];
  private readonly maxLogLines: number;
  private readonly stopTimeoutMs: number;
  private readonly probeIntervalMs: number;
  private readonly defaultReadyTimeoutMs: number;
  private readonly runtimes = new Map<string, Runtime>();
  private readonly listeners: (() => void)[] = [];
  private cachedView: ManagerView;
  private disposed = false;

  constructor(options: DevManagerOptions) {
    this.repoRoot = options.repoRoot;
    this.specs = options.projects;
    this.maxLogLines = options.maxLogLines ?? 300;
    this.stopTimeoutMs = options.stopTimeoutMs ?? 5000;
    this.probeIntervalMs = options.probeIntervalMs ?? 250;
    this.defaultReadyTimeoutMs = options.defaultReadyTimeoutMs ?? 120_000;

    const duplicate = options.projects.find(
      (project, index) =>
        options.projects.findIndex((other) => other.id === project.id) !==
        index,
    );
    if (duplicate !== undefined) {
      throw new Error(`Duplicate project id: ${duplicate.id}`);
    }

    options.projects.map((spec) =>
      this.runtimes.set(spec.id, {
        spec,
        status: 'stopped',
        url: spec.url,
        logs: [],
        pid: undefined,
        error: undefined,
        generation: 0,
        process: undefined,
      }),
    );
    this.cachedView = this.buildView();
  }

  subscribe = (listener: () => void): (() => void) => {
    this.listeners.push(listener);
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index >= 0) this.listeners.splice(index, 1);
    };
  };

  getView = (): ManagerView => this.cachedView;

  startAll = async (): Promise<void> => {
    await Promise.all(this.specs.map((spec) => this.start(spec.id)));
  };

  stopAll = async (): Promise<void> => {
    await Promise.all(this.specs.map((spec) => this.stop(spec.id)));
  };

  restart = async (id: string): Promise<void> => {
    await this.stop(id);
    await this.start(id);
  };

  dispose = async (): Promise<void> => {
    if (this.disposed) return;
    this.disposed = true;
    await this.stopAll();
    this.listeners.splice(0, this.listeners.length);
  };

  async start(id: string): Promise<void> {
    const runtime = this.requireRuntime(id);
    if (this.disposed || isActive(runtime.status)) return;

    const generation = runtime.generation + 1;
    runtime.generation = generation;
    this.update(runtime, {
      status: 'starting',
      error: undefined,
      pid: undefined,
    });
    this.appendLog(runtime, 'system', `Starting ${runtime.spec.label}`);

    const busyPorts = await this.findBusyPorts(runtime.spec);
    if (!this.isCurrent(runtime, generation)) return;

    const firstBusyPort = busyPorts.at(0);
    if (firstBusyPort !== undefined) {
      this.fail(
        runtime,
        `Port ${firstBusyPort} is already in use. Stop the other process or change the project port.`,
      );
      return;
    }

    const child = this.spawn(runtime);
    if (child === undefined) return;

    runtime.process = child;
    this.update(runtime, { pid: child.pid });
    this.appendLog(runtime, 'system', `Process ${child.pid} started`);
    if (child.stdout !== undefined) {
      void readStream(child.stdout, (line) =>
        this.receiveLine(runtime, 'stdout', line),
      ).catch(() => undefined);
    }
    if (child.stderr !== undefined) {
      void readStream(child.stderr, (line) =>
        this.receiveLine(runtime, 'stderr', line),
      ).catch(() => undefined);
    }
    void child.exited
      .then((code) => this.handleExit(runtime, generation, child.pid, code))
      .catch((error: unknown) =>
        this.handleExit(
          runtime,
          generation,
          child.pid,
          -1,
          error instanceof Error ? error.message : undefined,
        ),
      );

    await this.awaitReadiness(runtime, generation);
  }

  async stop(id: string): Promise<void> {
    const runtime = this.requireRuntime(id);
    if (runtime.status === 'stopped' || runtime.status === 'stopping') return;

    runtime.generation += 1;
    this.update(runtime, { status: 'stopping', error: undefined });
    this.appendLog(runtime, 'system', `Stopping ${runtime.spec.label}`);
    await this.terminate(runtime);
    this.update(runtime, { status: 'stopped', pid: undefined });
    this.appendLog(runtime, 'system', `Stopped ${runtime.spec.label}`);
  }

  private requireRuntime(id: string): Runtime {
    const runtime = this.runtimes.get(id);
    if (runtime === undefined) throw new Error(`Unknown project: ${id}`);
    return runtime;
  }

  private isCurrent(runtime: Runtime, generation: number): boolean {
    return (
      !this.disposed &&
      runtime.generation === generation &&
      runtime.status === 'starting'
    );
  }

  private async findBusyPorts(spec: DevProject): Promise<number[]> {
    const results = await Promise.all(
      spec.ports.map((port) => isPortInUse(port)),
    );
    return spec.ports.filter((_, index) => results.at(index) === true);
  }

  private spawn(runtime: Runtime): OwnedProcess | undefined {
    try {
      const child = Bun.spawn({
        cmd: [...runtime.spec.command],
        cwd: `${this.repoRoot}/${runtime.spec.cwd}`,
        env: { ...process.env, ...runtime.spec.env },
        stdin: 'ignore',
        stdout: 'pipe',
        stderr: 'pipe',
        detached: true,
      });
      return {
        pid: child.pid,
        exited: child.exited,
        stdout: child.stdout,
        stderr: child.stderr,
      };
    } catch (error) {
      this.fail(
        runtime,
        `Failed to start: ${error instanceof Error ? error.message : String(error)}`,
      );
      return undefined;
    }
  }

  private async awaitReadiness(
    runtime: Runtime,
    generation: number,
  ): Promise<void> {
    const timeoutMs = runtime.spec.readyTimeoutMs ?? this.defaultReadyTimeoutMs;
    const deadline = Date.now() + timeoutMs;
    const ready = await waitForReadiness(
      runtime.spec.readiness,
      deadline,
      this.probeIntervalMs,
      () => this.isCurrent(runtime, generation),
    );
    if (!this.isCurrent(runtime, generation)) return;

    if (ready) {
      this.update(runtime, { status: 'running' });
      this.appendLog(runtime, 'system', `Ready at ${runtime.url}`);
      return;
    }

    this.fail(
      runtime,
      `Readiness check failed after ${timeoutMs}ms: ${describeReadiness(runtime.spec.readiness)}.`,
    );
    await this.terminate(runtime);
    this.update(runtime, { pid: undefined });
  }

  private async terminate(runtime: Runtime): Promise<void> {
    const target = this.runtimeFor(runtime);
    const child = target.process;
    target.process = undefined;
    if (child === undefined) return;

    killProcessGroup(child.pid, 'SIGTERM');
    const exited = await Promise.race([
      child.exited.then(() => true),
      sleep(this.stopTimeoutMs).then(() => false),
    ]);
    if (!exited) {
      this.appendLog(
        runtime,
        'system',
        `Process ${child.pid} ignored SIGTERM; sending SIGKILL`,
      );
      killProcessGroup(child.pid, 'SIGKILL');
      await Promise.race([child.exited, sleep(1000)]);
    }
    this.update(runtime, { pid: undefined });
  }

  private handleExit(
    runtime: Runtime,
    generation: number,
    pid: number,
    code: number,
    message?: string,
  ): void {
    const target = this.runtimeFor(runtime);
    if (target.generation !== generation || target.process?.pid !== pid) {
      this.update(target, { pid: undefined });
      return;
    }
    target.process = undefined;
    this.update(runtime, { pid: undefined });

    if (target.status === 'stopping') {
      this.update(target, { status: 'stopped' });
      return;
    }
    if (target.status === 'starting' || target.status === 'running') {
      this.fail(
        runtime,
        `${runtime.spec.label} exited unexpectedly with code ${code}${message === undefined ? '' : `: ${message}`}.`,
      );
      return;
    }
    this.publish();
  }

  private receiveLine(runtime: Runtime, stream: LogStream, line: string): void {
    this.appendLog(runtime, stream, line);
    this.detectServedUrl(runtime, line);
  }

  private detectServedUrl(runtime: Runtime, line: string): void {
    const match = /https?:\/\/(?:localhost|127\.0\.0\.1):(\d+)/.exec(line);
    const port = Number(match?.[1]);
    if (!Number.isFinite(port) || runtime.spec.ports.includes(port)) return;
    this.runtimeFor(runtime).url = `http://localhost:${port}`;
  }

  private appendLog(runtime: Runtime, stream: LogStream, text: string): void {
    const lines = stripAnsi(text)
      .split(/\r?\n/)
      .map((line) => line.trimEnd())
      .filter((line) => line.length > 0);
    if (lines.length === 0) return;
    const at = Date.now();
    const target = this.runtimeFor(runtime);
    target.logs = [
      ...target.logs,
      ...lines.map((line) => ({ at, stream, text: line })),
    ].slice(-this.maxLogLines);
    this.publish();
  }

  private fail(runtime: Runtime, error: string): void {
    this.update(runtime, { status: 'failed', error });
    this.appendLog(runtime, 'system', error);
  }

  private update(runtime: Runtime, patch: Partial<ProjectView>): void {
    const target = this.runtimeFor(runtime);
    if (patch.status !== undefined) target.status = patch.status;
    if (Object.hasOwn(patch, 'error')) target.error = patch.error;
    if (patch.url !== undefined) target.url = patch.url;
    if (Object.hasOwn(patch, 'pid')) target.pid = patch.pid;
    this.publish();
  }

  private runtimeFor(runtime: Runtime): Runtime {
    return this.requireRuntime(runtime.spec.id);
  }

  private buildView(): ManagerView {
    const projects = this.specs.map((spec) => {
      const runtime = this.requireRuntime(spec.id);
      return {
        id: spec.id,
        label: spec.label,
        url: runtime.url,
        ports: spec.ports,
        status: runtime.status,
        pid: runtime.pid,
        error: runtime.error,
        logs: runtime.logs,
      };
    });
    return {
      projects,
      runningCount: projects.filter((project) => project.status === 'running')
        .length,
      failedCount: projects.filter((project) => project.status === 'failed')
        .length,
    };
  }

  private publish(): void {
    this.cachedView = this.buildView();
    this.listeners.map((listener) => listener());
  }
}

export function createDevManager(options: DevManagerOptions): DevManager {
  return new DevManager(options);
}
