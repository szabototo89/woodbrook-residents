import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  LIGHTHOUSE_MIN_SCORES,
  LIGHTHOUSE_PREVIEW_PORT,
  LIGHTHOUSE_REPORT_DIR,
  LIGHTHOUSE_ROUTES,
  type LighthouseCategory,
} from './lighthouse-config';
import { lighthouseArgs, resolveChromePath } from './lighthouse-chrome';
import {
  evaluateLighthouseScores,
  failedCombinations,
  mergeRetriedResults,
  routeReportFilename,
  toLighthouseScores,
  type LighthouseFormFactor,
  type LighthouseRunCombination,
  type LighthouseRunResult,
  type LighthouseScores,
} from './lighthouse-report';

const appRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);
const reportDir = path.join(appRoot, LIGHTHOUSE_REPORT_DIR);

const DEFAULT_RETRIES = 1;

const CATEGORY_KEYS: LighthouseCategory[] = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
];

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`;
  return process.argv
    .find((arg) => arg.startsWith(prefix))
    ?.slice(prefix.length);
}

function hasFlag(name: string): boolean {
  return process.argv.includes(`--${name}`);
}

async function runChecked(command: string[], options?: { cwd?: string }) {
  const subprocess = Bun.spawn(command, {
    cwd: options?.cwd ?? appRoot,
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

async function waitForServer(
  baseUrl: string,
  attemptsLeft = 120,
): Promise<void> {
  try {
    const response = await fetch(baseUrl);
    if (response.ok || response.status < 500) {
      return;
    }
  } catch {
    // The preview server is not up yet; fall through to retry.
  }
  if (attemptsLeft <= 0) {
    throw new Error(`Timed out waiting for ${baseUrl}`);
  }
  await new Promise((resolve) => setTimeout(resolve, 500));
  return waitForServer(baseUrl, attemptsLeft - 1);
}

async function runLighthouseForRoute(
  baseUrl: string,
  route: string,
  formFactor: LighthouseFormFactor,
): Promise<LighthouseRunResult> {
  const reportPath = path.join(
    reportDir,
    routeReportFilename(route, formFactor),
  );
  await runChecked([
    'bunx',
    ...lighthouseArgs(`${baseUrl}${route}`, reportPath, {
      chromePath: resolveChromePath(process.env),
      formFactor,
    }),
  ]);
  const report = await Bun.file(reportPath).json();
  const scoreFor = (category: LighthouseCategory): number => {
    const rawScore = report.categories[category]?.score;
    return typeof rawScore === 'number' ? Math.round(rawScore * 100) : 0;
  };
  return { route, formFactor, scores: toLighthouseScores(scoreFor) };
}

function resolveFormFactors(
  filter: string | undefined,
): LighthouseFormFactor[] {
  if (filter === 'mobile' || filter === 'desktop') {
    return [filter];
  }
  return ['mobile', 'desktop'];
}

function scoreText(scores: LighthouseScores): string {
  return CATEGORY_KEYS.map(
    (category) => `${category}=${scores[category]}`,
  ).join(' ');
}

function parseRetries(raw: string | undefined): number {
  if (raw === undefined) {
    return DEFAULT_RETRIES;
  }
  const retries = Number.parseInt(raw, 10);
  if (!Number.isInteger(retries) || retries < 0) {
    throw new Error(
      `Invalid --retries value "${raw}". Use a whole number of 0 or more.`,
    );
  }
  return retries;
}

async function runAllCombinations(
  baseUrl: string,
  combinations: LighthouseRunCombination[],
): Promise<LighthouseRunResult[]> {
  return combinations.reduce<Promise<LighthouseRunResult[]>>(
    (previous, combination) =>
      previous.then((collected) => {
        console.log(
          `Running Lighthouse (${combination.formFactor}) for ${combination.route}...`,
        );
        return runLighthouseForRoute(
          baseUrl,
          combination.route,
          combination.formFactor,
        ).then((result) => [...collected, result]);
      }),
    Promise.resolve([]),
  );
}

async function runWithRetries(
  baseUrl: string,
  combinations: LighthouseRunCombination[],
  retriesLeft: number,
): Promise<LighthouseRunResult[]> {
  const results = await runAllCombinations(baseUrl, combinations);
  const failed = failedCombinations(results, LIGHTHOUSE_MIN_SCORES);
  if (failed.length === 0 || retriesLeft <= 0) {
    return results;
  }
  console.log(
    `Retrying ${failed.length} failed check(s) (${retriesLeft} attempt(s) left)...`,
  );
  const retried = await runWithRetries(baseUrl, failed, retriesLeft - 1);
  return mergeRetriedResults(results, retried);
}

async function runLighthouse() {
  const skipBuild = hasFlag('skip-build');
  const routeFilter = parseArg('route');
  const retries = parseRetries(parseArg('retries'));
  const port = Number.parseInt(
    parseArg('port') ?? String(LIGHTHOUSE_PREVIEW_PORT),
    10,
  );
  const baseUrl = parseArg('base-url') ?? `http://127.0.0.1:${port}`;

  const formFactors = resolveFormFactors(parseArg('form-factor'));
  const routes = routeFilter
    ? LIGHTHOUSE_ROUTES.filter((route) => route === routeFilter)
    : LIGHTHOUSE_ROUTES;
  if (routes.length === 0) {
    throw new Error(`No Lighthouse routes match "${routeFilter}".`);
  }

  await Bun.$`mkdir -p ${reportDir}`.quiet();

  if (!skipBuild) {
    console.log('Building the web app for Lighthouse...');
    await runChecked(['bun', 'run', 'build']);
  }

  console.log(`Starting preview server at ${baseUrl}...`);
  const preview = Bun.spawn(
    [
      'bun',
      'run',
      'preview',
      '--',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
    ],
    {
      cwd: appRoot,
      env: process.env,
      stdin: 'ignore',
      stdout: 'ignore',
      stderr: 'inherit',
    },
  );

  try {
    await waitForServer(baseUrl);

    const combinations = routes.flatMap((route) =>
      formFactors.map((formFactor) => ({ route, formFactor })),
    );
    const results = await runWithRetries(baseUrl, combinations, retries);

    const summaryLines = results.map((result) => {
      const evaluation = evaluateLighthouseScores(
        result.scores,
        LIGHTHOUSE_MIN_SCORES,
      );
      const line = evaluation.passed
        ? `PASS ${result.formFactor} ${result.route}`
        : `FAIL ${result.formFactor} ${result.route}: ${evaluation.failures.join('; ')}`;
      console.log(`${line}: ${scoreText(result.scores)}`);
      return `- ${line}: ${scoreText(result.scores)}`;
    });
    const failed = results.some(
      (result) =>
        !evaluateLighthouseScores(result.scores, LIGHTHOUSE_MIN_SCORES).passed,
    );

    const summary = {
      baseUrl,
      minimums: LIGHTHOUSE_MIN_SCORES,
      results,
    };
    await Bun.write(
      path.join(reportDir, 'lighthouse-summary.json'),
      `${JSON.stringify(summary, null, 2)}\n`,
    );
    await Bun.write(
      path.join(reportDir, 'lighthouse-summary.md'),
      `# Lighthouse summary\n\n${summaryLines.join('\n')}\n`,
    );

    if (failed) {
      throw new Error(
        'Lighthouse checks failed. See lighthouse-reports/lighthouse-summary.md for details.',
      );
    }
    console.log('All Lighthouse checks passed.');
  } finally {
    preview.kill();
    await preview.exited.catch(() => undefined);
  }
}

try {
  await runLighthouse();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
