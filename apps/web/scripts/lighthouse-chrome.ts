import type { LighthouseCategory } from './lighthouse-config';
import type { LighthouseFormFactor } from './lighthouse-report';

export const LIGHTHOUSE_CATEGORIES: LighthouseCategory[] = [
  'performance',
  'accessibility',
  'best-practices',
  'seo',
];

export interface LighthouseArgsOptions {
  chromePath?: string;
  formFactor: LighthouseFormFactor;
}

export function lighthouseArgs(
  url: string,
  reportPath: string,
  options: LighthouseArgsOptions,
): string[] {
  const args = [
    'lighthouse',
    url,
    '--output=json',
    `--output-path=${reportPath}`,
    `--only-categories=${LIGHTHOUSE_CATEGORIES.join(',')}`,
    '--chrome-flags=--headless --no-sandbox --disable-gpu --disable-dev-shm-usage',
    '--quiet',
  ];
  if (options.chromePath) {
    args.push(`--chrome-path=${options.chromePath}`);
  }
  return options.formFactor === 'desktop'
    ? [...args, '--preset=desktop']
    : [...args, '--form-factor=mobile'];
}

export function resolveChromePath(env: NodeJS.ProcessEnv): string | undefined {
  const raw = env['CHROME_PATH'];
  if (typeof raw !== 'string') {
    return undefined;
  }
  const chromePath = raw.trim();
  return chromePath ? chromePath : undefined;
}
