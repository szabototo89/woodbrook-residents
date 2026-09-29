import { resolve } from 'node:path';

export interface LauraDeployConfig {
  projectName: string;
  siteUrl: string;
  branch: string;
  appDir: string;
  distClientDir: string;
}

type Env = Record<string, string | undefined>;

const repositoryRoot = resolve(import.meta.dir, '..');

export function getLauraDeployConfig(
  env: Env = process.env,
): LauraDeployConfig {
  return {
    projectName:
      env.LAURA_PAGES_PROJECT?.trim() || 'laura-faichney-all-things-art',
    // Never inherit VITE_PUBLIC_SITE_URL here: Bun auto-loads the repo-root
    // .env, which points it at http://localhost:3000 for local development.
    // Production is the default; previews opt in via LAURA_SITE_URL.
    siteUrl:
      env.LAURA_SITE_URL?.trim() ||
      'https://laura-faichney-all-things-art.pages.dev',
    branch: env.LAURA_DEPLOY_BRANCH?.trim() || 'main',
    appDir: 'apps/laura-faichney-web',
    distClientDir: 'apps/laura-faichney-web/dist/client',
  };
}

export function buildStaticDeployEnv(
  config: LauraDeployConfig,
  env: Env = process.env,
): Env {
  return { ...env, VITE_PUBLIC_SITE_URL: config.siteUrl };
}

export function pagesDeployArgs(
  config: LauraDeployConfig,
  commitHash: string,
): string[] {
  return [
    'pages',
    'deploy',
    config.distClientDir,
    `--project-name=${config.projectName}`,
    `--branch=${config.branch}`,
    `--commit-hash=${commitHash}`,
  ];
}

async function runChecked(command: string[], env: Env = process.env) {
  const subprocess = Bun.spawn(command, {
    cwd: repositoryRoot,
    env,
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

async function resolveCommitHash(): Promise<string> {
  const fromEnv =
    process.env.GITHUB_SHA?.trim() ||
    process.env.CLOUDFLARE_COMMIT_HASH?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  const proc = Bun.spawnSync(['git', 'rev-parse', 'HEAD'], {
    cwd: repositoryRoot,
  });
  const hash = proc.stdout.toString().trim();

  if (proc.exitCode !== 0 || !hash) {
    throw new Error('Unable to resolve a commit hash for the deploy.');
  }

  return hash;
}

async function deploy() {
  const config = getLauraDeployConfig();

  await runChecked(['bun', 'run', '--cwd', config.appDir, 'build:static'], {
    ...buildStaticDeployEnv(config),
    BUN_VERSION: process.env.BUN_VERSION ?? '1.4.0',
  });

  const commitHash = await resolveCommitHash();
  await runChecked([
    'bunx',
    'wrangler',
    ...pagesDeployArgs(config, commitHash),
    ...Bun.argv.slice(2),
  ]);
}

if (import.meta.main) {
  deploy().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
