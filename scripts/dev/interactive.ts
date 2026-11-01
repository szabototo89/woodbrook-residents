import type { DevController } from './types';

export type InteractiveMountProps = {
  readonly manager: DevController;
  readonly onQuit: () => void;
};

export type InteractiveMount = (
  props: InteractiveMountProps,
) => Promise<{ destroy: () => void }>;

export type InteractiveOptions = {
  readonly mount: InteractiveMount;
  readonly signal?: AbortSignal;
};

function deferred(): {
  promise: Promise<number>;
  resolve: (code: number) => void;
} {
  const holder: { resolve: (code: number) => void } = {
    resolve: () => undefined,
  };
  const promise = new Promise<number>((resolve) => {
    holder.resolve = resolve;
  });
  return { promise, resolve: (code) => holder.resolve(code) };
}

export async function runInteractive(
  controller: DevController,
  options: InteractiveOptions,
): Promise<number> {
  const quit = deferred();
  const mounted = await options
    .mount({
      manager: controller,
      onQuit: () => quit.resolve(0),
    })
    .catch(() => undefined);

  if (mounted === undefined) {
    await controller.stopAll();
    return 1;
  }

  const abort = (): void => quit.resolve(0);
  if (options.signal?.aborted) {
    abort();
  } else {
    options.signal?.addEventListener('abort', abort, { once: true });
  }

  const started = controller.startAll().catch(() => {
    quit.resolve(1);
  });

  try {
    const code = await quit.promise;
    await controller.stopAll();
    await started;
    return code;
  } finally {
    options.signal?.removeEventListener('abort', abort);
    mounted.destroy();
  }
}
