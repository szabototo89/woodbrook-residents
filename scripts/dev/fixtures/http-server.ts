import { writeFileSync } from 'node:fs';

const port = Number(process.env.PORT ?? '0');
const host = process.env.HOST ?? '127.0.0.1';
const name = process.env.NAME ?? 'fixture';
const readyDelayMs = Number(process.env.READY_DELAY_MS ?? '0');
const exitAfterMs = Number(process.env.EXIT_AFTER_MS ?? '0');
const exitCode = Number(process.env.EXIT_CODE ?? '1');
const ignoreSigterm = process.env.IGNORE_SIGTERM === '1';
const pidFile = process.env.PID_FILE;
const burstLines = Number(process.env.BURST_LINES ?? '0');
const announcedPort = process.env.ANNOUNCED_PORT;

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const announce = (): void => {
  if (announcedPort === undefined) return;
  console.log(`Local: http://localhost:${announcedPort}/`);
};

async function main(): Promise<void> {
  if (pidFile !== undefined) writeFileSync(pidFile, String(process.pid));
  console.log(`${name}: booting`);
  Array.from({ length: burstLines }).map((_, index) =>
    console.log(`${name}: burst line ${index + 1}`),
  );
  await sleep(readyDelayMs);
  const server = Bun.serve({
    hostname: host,
    port,
    fetch(request) {
      return new Response(`ok ${name} ${new URL(request.url).pathname}`);
    },
  });
  announce();
  console.log(`${name}: listening at http://${host}:${server.port}`);

  const shutdown = (): void => {
    console.log(`${name}: shutting down`);
    server.stop(true);
    process.exit(0);
  };

  process.on('SIGTERM', () => {
    if (ignoreSigterm) {
      console.log(`${name}: ignoring SIGTERM`);
      return;
    }
    shutdown();
  });

  process.on('SIGINT', shutdown);

  if (exitAfterMs > 0) {
    await sleep(exitAfterMs);
    console.log(
      `${name}: exiting after ${exitAfterMs}ms with code ${exitCode}`,
    );
    server.stop(true);
    process.exit(exitCode);
  }

  await new Promise<never>(() => undefined);
}

if (import.meta.main) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  });
}
