const DEFAULT_SITE_URL = 'https://www.julietrosebeauty.com/';
const CLI_PACKAGE = 'google-search-console-cli';

export type GscSitemapEntry = {
  path: string;
  lastSubmitted: string;
  isPending: boolean;
  isSitemapsIndex: boolean;
  warnings: string;
  errors: string;
};

export type GscInspection = {
  inspectionResult?: {
    indexStatusResult?: {
      verdict?: string;
      coverageState?: string;
    };
  };
};

export type CheckConfig = {
  siteUrl: string;
  credentialsFile: string | undefined;
  inspectUrls: string[];
};

export function hasSitemapErrors(entries: GscSitemapEntry[]): boolean {
  return entries.some((entry) => entry.errors !== '0');
}

export function formatSitemapSummary(entries: GscSitemapEntry[]): string[] {
  return entries.map(
    (entry) =>
      `sitemap ${entry.path}: ${entry.isPending ? 'pending' : 'processed'}, ${entry.errors} errors, ${entry.warnings} warnings`,
  );
}

export function formatInspectionSummary(
  url: string,
  inspection: GscInspection,
): string[] {
  const status = inspection.inspectionResult?.indexStatusResult;
  if (!status) {
    return [`inspect ${url}: no status`];
  }
  return [
    `inspect ${url}: ${status.coverageState ?? 'unknown'} (${status.verdict ?? 'unknown'})`,
  ];
}

export function resolveCheckConfig(
  argv: string[],
  env: Record<string, string | undefined>,
): CheckConfig {
  let credentialsFile = env['GSC_CLI_CREDENTIALS_FILE'];
  const positionals: string[] = [];
  const remaining = [...argv];
  let next = remaining.shift();
  while (next !== undefined) {
    if (next === '--credentials-file') {
      credentialsFile = remaining.shift();
    } else if (!next.startsWith('-')) {
      positionals.push(next);
    }
    next = remaining.shift();
  }
  const siteUrl = positionals[0] ?? env['GSC_CLI_SITE_URL'] ?? DEFAULT_SITE_URL;
  return {
    siteUrl,
    credentialsFile,
    inspectUrls: [siteUrl, ...positionals.slice(1)],
  };
}

type CliResult = { stdout: string; stderr: string; exitCode: number };

async function runCli(
  args: string[],
  env: Record<string, string | undefined>,
): Promise<CliResult> {
  const subprocess = Bun.spawn(
    ['bunx', '--package', CLI_PACKAGE, CLI_PACKAGE, ...args],
    { stdout: 'pipe', stderr: 'pipe', env: { ...process.env, ...env } },
  );
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(subprocess.stdout).text(),
    new Response(subprocess.stderr).text(),
    subprocess.exited,
  ]);
  return { stdout, stderr, exitCode };
}

function credentialArgs(config: CheckConfig): string[] {
  return config.credentialsFile
    ? ['--credentials', config.credentialsFile]
    : [];
}

async function checkSearchConsole(
  config: CheckConfig,
  env: Record<string, string | undefined>,
): Promise<number> {
  const failures: string[] = [];

  const sitemaps = await runCli(
    ['sitemaps', config.siteUrl, ...credentialArgs(config)],
    env,
  );
  if (sitemaps.exitCode !== 0) {
    failures.push(`sitemaps command failed: ${sitemaps.stderr.trim()}`);
  } else {
    try {
      const entries = JSON.parse(sitemaps.stdout) as GscSitemapEntry[];
      if (entries.length === 0) {
        failures.push('no sitemaps submitted');
      }
      for (const line of formatSitemapSummary(entries)) {
        console.log(line);
      }
      if (hasSitemapErrors(entries)) {
        failures.push('sitemap has errors');
      }
    } catch {
      failures.push('sitemaps output was not valid JSON');
    }
  }

  for (const url of config.inspectUrls) {
    const inspected = await runCli(
      ['inspect', config.siteUrl, url, ...credentialArgs(config)],
      env,
    );
    if (inspected.exitCode !== 0) {
      failures.push(`inspect ${url} failed: ${inspected.stderr.trim()}`);
      continue;
    }
    try {
      const result = JSON.parse(inspected.stdout) as GscInspection;
      for (const line of formatInspectionSummary(url, result)) {
        console.log(line);
      }
    } catch {
      failures.push(`inspect ${url} output was not valid JSON`);
    }
  }

  for (const failure of failures) {
    console.error(`FAIL ${failure}`);
  }
  return failures.length === 0 ? 0 : 1;
}

if (import.meta.main) {
  const config = resolveCheckConfig(Bun.argv.slice(2), process.env);
  process.exitCode = await checkSearchConsole(config, process.env);
}
