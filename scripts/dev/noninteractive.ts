import type { DevController, ProjectStatus } from './types';

export type TextSink = { write: (text: string) => void };

export type NonInteractiveOptions = {
  readonly signal?: AbortSignal;
  readonly stdout?: TextSink;
  readonly stderr?: TextSink;
};

const isInactive = (status: ProjectStatus): boolean =>
  status === 'stopped' || status === 'failed';

function settled(controller: DevController): boolean {
  return controller
    .getView()
    .projects.every((project) => isInactive(project.status));
}

function aborted(signal: AbortSignal | undefined): Promise<string> {
  return new Promise<string>((resolve) => {
    if (signal === undefined) return;
    if (signal.aborted) {
      resolve('aborted');
      return;
    }
    signal.addEventListener('abort', () => resolve('aborted'), { once: true });
  });
}

function waitForInactive(controller: DevController): Promise<void> {
  return new Promise<void>((resolve) => {
    const subscription: { unsubscribe: () => void } = {
      unsubscribe: () => undefined,
    };
    const check = (): void => {
      if (!settled(controller)) return;
      subscription.unsubscribe();
      resolve();
    };
    subscription.unsubscribe = controller.subscribe(check);
    check();
  });
}

export async function runNonInteractive(
  controller: DevController,
  options: NonInteractiveOptions = {},
): Promise<number> {
  const stdout = options.stdout ?? {
    write: (text) => process.stdout.write(text),
  };
  const stderr = options.stderr ?? {
    write: (text) => process.stderr.write(text),
  };
  const initial = controller.getView();
  const states: Record<string, ProjectStatus> = Object.fromEntries(
    initial.projects.map((project) => [project.id, project.status]),
  );
  const printed: Record<string, number> = Object.fromEntries(
    initial.projects.map((project) => [project.id, project.logs.length]),
  );

  stdout.write(
    `Starting ${initial.projects.length} projects: ${initial.projects
      .map((project) => project.id)
      .join(', ')}.\n`,
  );

  const unsubscribe = controller.subscribe(() => {
    controller.getView().projects.map((project) => {
      const previous = states[project.id];
      if (previous !== project.status) {
        states[project.id] = project.status;
        const line =
          project.status === 'running'
            ? `[${project.id}] ready at ${project.url}\n`
            : project.status === 'failed'
              ? `[${project.id}] failed: ${project.error ?? 'unknown error'}\n`
              : `[${project.id}] ${project.status}\n`;
        stdout.write(line);
      }

      const seen = printed[project.id] ?? 0;
      project.logs.slice(seen).map((line) => {
        if (line.stream === 'system') return;
        const sink = line.stream === 'stderr' ? stderr : stdout;
        sink.write(`[${project.id}] ${line.text}\n`);
      });
      printed[project.id] = project.logs.length;
    });
  });

  const stopped = aborted(options.signal);
  const started = controller.startAll();
  const outcome = await Promise.race([started.then(() => 'started'), stopped]);

  if (outcome === 'aborted') {
    stdout.write('Stopping all projects.\n');
    await controller.stopAll();
    await started;
    unsubscribe();
    return 0;
  }

  if (settled(controller)) {
    const code = controller.getView().failedCount > 0 ? 1 : 0;
    unsubscribe();
    return code;
  }

  stdout.write('All projects started. Press Ctrl+C to stop them.\n');
  const finished = await Promise.race([waitForInactive(controller), stopped]);
  unsubscribe();

  if (finished === 'aborted') {
    stdout.write('Stopping all projects.\n');
    await controller.stopAll();
    return 0;
  }

  return controller.getView().failedCount > 0 ? 1 : 0;
}
