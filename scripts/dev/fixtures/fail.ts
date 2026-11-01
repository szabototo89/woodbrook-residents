import { existsSync } from 'node:fs';

const name = process.env.NAME ?? 'failing-fixture';
const failFile = process.env.FAIL_FILE;
const exitCode = Number(process.env.EXIT_CODE ?? '9');
const port = Number(process.env.PORT ?? '0');

if (failFile !== undefined && !existsSync(failFile)) {
  const server = Bun.serve({
    hostname: '127.0.0.1',
    port,
    fetch() {
      return new Response(`ok ${name}`);
    },
  });
  console.log(`${name}: listening at http://127.0.0.1:${server.port}`);
  await new Promise<never>(() => undefined);
}

console.error(`${name}: intentional failure with code ${exitCode}`);
process.exit(exitCode);
