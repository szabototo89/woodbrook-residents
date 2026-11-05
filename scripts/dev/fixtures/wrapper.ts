import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const childPort = process.env.CHILD_PORT;
const name = process.env.NAME ?? 'wrapper';
const pidFile = process.env.PID_FILE;

if (childPort === undefined) throw new Error('CHILD_PORT is required');

const child = Bun.spawn({
  cmd: ['bun', join(import.meta.dir, 'http-server.ts')],
  cwd: process.cwd(),
  env: {
    ...Object.fromEntries(
      Object.entries(process.env).filter(([key]) => key !== 'PID_FILE'),
    ),
    PORT: childPort,
    NAME: `${name}-child`,
  },
  stdin: 'ignore',
  stdout: 'inherit',
  stderr: 'inherit',
});

if (pidFile !== undefined) {
  writeFileSync(pidFile, `${process.pid} ${child.pid}`);
}

console.log(`${name}: started child ${child.pid} on port ${childPort}`);
await child.exited;
console.log(`${name}: child exited`);
