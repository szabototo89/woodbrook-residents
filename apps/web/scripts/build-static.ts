import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { formatErrorChain } from '../src/features/content/contentBuildDiagnostics';
import { loadContentSnapshot } from '../src/features/content/contentSnapshot';
import { createContentSource } from '../src/features/content/contentSourceFactory';

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

async function verifyContentSource() {
  console.log('Checking build-time content...');

  try {
    await loadContentSnapshot(createContentSource());
  } catch (error) {
    const details = formatErrorChain(error)
      .map((message) => `  - ${message}`)
      .join('\n');
    throw new Error(`Build-time content is invalid:\n${details}`, {
      cause: error,
    });
  }

  console.log('Build-time content is valid.');
}

async function buildStaticSite() {
  await verifyContentSource();
  await runChecked(['bunx', 'vite', 'build', '--mode', 'static']);
  await runChecked(['bun', 'run', 'verify:static']);
}

try {
  await buildStaticSite();
} catch (error) {
  console.error(formatErrorChain(error)[0]);
  process.exitCode = 1;
}
