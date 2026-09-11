import { resolve } from 'node:path';

const repositoryRoot = resolve(import.meta.dir, '..');
const localStrapiPort =
  process.env.WOODBROOK_LOCAL_STRAPI_PORT?.trim() || '1337';
const localStrapiUrl = `http://127.0.0.1:${localStrapiPort}`;
const publicSiteUrl = 'https://woodbrook.shankill.workers.dev';
const strapiReadyTimeoutMs = 90_000;

const localStrapiEnvironment = {
  APP_KEYS:
    process.env.APP_KEYS ??
    'local-deploy-key-1,local-deploy-key-2,local-deploy-key-3,local-deploy-key-4',
  API_TOKEN_SALT: process.env.API_TOKEN_SALT ?? 'local-deploy-token-salt',
  ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET ?? 'local-deploy-admin-secret',
  TRANSFER_TOKEN_SALT:
    process.env.TRANSFER_TOKEN_SALT ?? 'local-deploy-transfer-salt',
  JWT_SECRET: process.env.JWT_SECRET ?? 'local-deploy-jwt-secret',
  ENCRYPTION_KEY: process.env.ENCRYPTION_KEY ?? 'local-deploy-encryption-key',
  HOST: '127.0.0.1',
  PORT: localStrapiPort,
};

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

async function isStrapiReady() {
  try {
    const response = await fetch(`${localStrapiUrl}/api/site-setting`, {
      signal: AbortSignal.timeout(1_000),
    });

    return response.ok;
  } catch {
    return false;
  }
}

async function waitForStrapi(process: Bun.Subprocess) {
  const deadline = Date.now() + strapiReadyTimeoutMs;

  const poll = async (): Promise<void> => {
    if (process.exitCode !== null) {
      throw new Error(`Local Strapi exited with code ${process.exitCode}.`);
    }

    if (await isStrapiReady()) {
      console.log(`Local Strapi is ready at ${localStrapiUrl}.`);
      return;
    }

    if (Date.now() >= deadline) {
      throw new Error(
        `Local Strapi did not become ready within ${strapiReadyTimeoutMs / 1_000} seconds.`,
      );
    }

    await Bun.sleep(250);
    return poll();
  };

  return poll();
}

async function stopStrapi(process: Bun.Subprocess) {
  if (process.exitCode !== null) {
    return;
  }

  process.kill('SIGTERM');
  await Promise.race([process.exited, Bun.sleep(5_000)]);

  if (process.exitCode === null) {
    process.kill('SIGKILL');
    await process.exited;
  }
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
  const contentSource = process.env.CONTENT_SOURCE?.trim();
  if (contentSource !== 'strapi' && contentSource !== 'google-sheets') {
    throw new Error(
      'CONTENT_SOURCE must be set to "strapi" or "google-sheets" before deploying.',
    );
  }

  const configuredStrapiUrl = process.env.STRAPI_URL?.trim();
  const strapiUrl = configuredStrapiUrl || localStrapiUrl;
  const localStrapiHolder: { current?: Bun.Subprocess } = {};

  try {
    if (contentSource === 'strapi' && !configuredStrapiUrl) {
      if (await isStrapiReady()) {
        console.log(
          `Using the local Strapi already running at ${localStrapiUrl}.`,
        );
      } else {
        console.log(
          `STRAPI_URL is not set. Starting a temporary local Strapi at ${localStrapiUrl}.`,
        );
        const environment = { ...process.env, ...localStrapiEnvironment };
        await runChecked(['bun', 'run', 'build:cms'], environment);
        localStrapiHolder.current = run(
          ['bun', 'run', '--cwd', 'apps/cms', 'start'],
          environment,
        );
        await waitForStrapi(localStrapiHolder.current);
      }
    }

    await runChecked(['bun', 'run', 'build:static'], {
      ...process.env,
      CONTENT_SOURCE: contentSource,
      STRAPI_URL: strapiUrl,
      VITE_PUBLIC_SITE_URL: publicSiteUrl,
    });
    await runChecked(['bunx', 'wrangler', 'deploy', ...Bun.argv.slice(2)]);
  } finally {
    if (localStrapiHolder.current) {
      console.log('Stopping temporary local Strapi.');
      await stopStrapi(localStrapiHolder.current);
    }
  }
}

await deploy();
