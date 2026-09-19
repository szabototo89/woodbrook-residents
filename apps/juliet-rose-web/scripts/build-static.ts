import path from 'node:path';
import { fileURLToPath } from 'node:url';

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

async function runChecked(command: string[]) {
  const subprocess = Bun.spawn(command, {
    cwd: appRoot,
    env: process.env,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
  const exitCode = await subprocess.exited;

  if (exitCode !== 0) {
    throw new Error(
      `Command failed with exit code ${exitCode}: ${command.join(' ')}`,
    );
  }
}

try {
  await runChecked(['bunx', 'vite', 'build', '--mode', 'static']);
  await runChecked(['bun', 'scripts/generate-seo-files.ts']);
  await runChecked(['bun', 'run', 'verify:static']);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
