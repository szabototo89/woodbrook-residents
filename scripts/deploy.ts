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

export function buildDeployEnvironment(
  environment: Record<string, string | undefined>,
) {
  const contentSource = environment.CONTENT_SOURCE?.trim() || 'sanity';
  if (contentSource !== 'sanity') {
    throw new Error(
      'CONTENT_SOURCE must be "sanity" or unset before deploying.',
    );
  }

  return {
    ...environment,
    CONTENT_SOURCE: contentSource,
    VITE_PUBLIC_SITE_URL: publicSiteUrl,
  };
}

async function deploy() {
  await runChecked(
    ['bun', 'run', 'build:static'],
    buildDeployEnvironment(process.env),
  );
  await runChecked(['bunx', 'wrangler', 'deploy', ...Bun.argv.slice(2)]);
}

if (import.meta.main) {
  await deploy();
}
