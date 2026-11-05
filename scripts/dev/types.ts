export type ReadinessCheck =
  | { readonly kind: 'http'; readonly url: string }
  | { readonly kind: 'tcp'; readonly port: number };

export type DevProject = {
  readonly id: string;
  readonly label: string;
  /** Directory relative to the repository root. */
  readonly cwd: string;
  /** Command and arguments, run with the project directory as cwd. */
  readonly command: readonly string[];
  readonly env?: Readonly<Record<string, string>>;
  /** Every port owned by this project, including companion servers. */
  readonly ports: readonly number[];
  /** Human-facing URL shown in the project list. */
  readonly url: string;
  readonly readiness: readonly ReadinessCheck[];
  /** How long a server may take to pass its readiness checks. */
  readonly readyTimeoutMs?: number;
};

export type ProjectStatus =
  'stopped' | 'starting' | 'running' | 'stopping' | 'failed';

export type LogStream = 'stdout' | 'stderr' | 'system';

export type LogLine = {
  readonly at: number;
  readonly stream: LogStream;
  readonly text: string;
};

export type ProjectView = {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly ports: readonly number[];
  readonly status: ProjectStatus;
  readonly pid?: number;
  readonly error?: string;
  readonly logs: readonly LogLine[];
};

export type ManagerView = {
  readonly projects: readonly ProjectView[];
  readonly runningCount: number;
  readonly failedCount: number;
};

export interface DevController {
  subscribe(listener: () => void): () => void;
  getView(): ManagerView;
  start(id: string): Promise<void>;
  stop(id: string): Promise<void>;
  restart(id: string): Promise<void>;
  startAll(): Promise<void>;
  stopAll(): Promise<void>;
}

export type DevManagerOptions = {
  readonly repoRoot: string;
  readonly projects: readonly DevProject[];
  readonly maxLogLines?: number;
  readonly stopTimeoutMs?: number;
  readonly probeIntervalMs?: number;
  readonly defaultReadyTimeoutMs?: number;
};
