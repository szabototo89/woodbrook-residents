import { resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const publicSiteUrl = 'https://woodbrook.shankill.workers.dev';

function run(
  command: string[],
  environment: Record<string, string | undefined> = process.env,
) {
  return Bun.spawn(command, {
    cwd: repositoryRoot,
    env: environment,
    stdin: 'inherit',
    stdout: 'inherit',
    stderr: 'inherit',
  });
}

async function runChecked(
  command: string[],
  environment?: Record<string, string | undefined>,
) {
  const subprocess = run(command, environment);
  const exitCode = await subprocess.exited;

  if (exitCode !== 0) {
    throw new Error(
      `Command failed with exit code ${exitCode}: ${command.join(' ')}`,
    );
  }
}

async function deploy() {
  const contentSource = process.env.CONTENT_SOURCE?.trim() || 'google-sheets';
  if (contentSource !== 'sanity' && contentSource !== 'google-sheets') {
    throw new Error(
      'CONTENT_SOURCE must be set to "google-sheets" or "sanity" before deploying.',
    );
  }

  await runChecked(['bun', 'run', 'build:static'], {
    ...process.env,
    CONTENT_SOURCE: contentSource,
    VITE_PUBLIC_SITE_URL: publicSiteUrl,
  });
  await runChecked(['bunx', 'wrangler', 'deploy', ...Bun.argv.slice(2)]);
}

await deploy();
