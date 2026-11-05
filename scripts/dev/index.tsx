import { resolve } from 'node:path';
import { devUsage, parseDevCliOptions } from './cli';
import { runInteractive } from './interactive';
import { mountOpenTui } from './mount';
import { runNonInteractive } from './noninteractive';
import { createDevManager } from './process-manager';
import { DEV_PROJECTS } from './projects';

export async function main(): Promise<number> {
  const options = parseDevCliOptions(Bun.argv.slice(2), {
    stdoutIsTty: process.stdout.isTTY === true,
    env: process.env,
  });
  if (options.help) {
    process.stdout.write(devUsage(DEV_PROJECTS));
    return 0;
  }

  const manager = createDevManager({
    repoRoot: resolve(import.meta.dir, '../..'),
    projects: DEV_PROJECTS,
  });
  const abort = new AbortController();
  const stop = (): void => abort.abort();
  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);

  try {
    return options.interactive
      ? await runInteractive(manager, {
          mount: mountOpenTui,
          signal: abort.signal,
        })
      : await runNonInteractive(manager, { signal: abort.signal });
  } finally {
    process.off('SIGINT', stop);
    process.off('SIGTERM', stop);
    await manager.dispose();
  }
}

if (import.meta.main) {
  main()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : error);
      process.exitCode = 1;
    });
}
