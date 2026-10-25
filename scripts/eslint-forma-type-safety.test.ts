import { expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import ts from 'typescript';

const app = resolve('apps/forma-studio-web');
const eslint = resolve('node_modules/eslint/bin/eslint.js');
const tsc = join(app, 'node_modules/typescript/bin/tsc');

function lint(code: string, file = 'src/router.tsx') {
  return spawnSync(
    process.execPath,
    [
      eslint,
      '--stdin',
      '--stdin-filename',
      join(app, file),
      '--format',
      'json',
      '--max-warnings',
      '0',
    ],
    { encoding: 'utf8', input: code },
  );
}

const rejectedLint = [
  [
    'explicit any',
    'export type Input = any;',
    '@typescript-eslint/no-explicit-any',
  ],
  [
    'as any',
    'export const input = 1 as any;',
    '@typescript-eslint/no-explicit-any',
  ],
  [
    'any array',
    'export type Inputs = any[];',
    '@typescript-eslint/no-explicit-any',
  ],
  [
    'generic any',
    'export type Input = Promise<any>;',
    '@typescript-eslint/no-explicit-any',
  ],
  [
    'unsafe assignment',
    'export const input = JSON.parse("{}");',
    '@typescript-eslint/no-unsafe-assignment',
  ],
  [
    'unsafe argument',
    'export const input = Object.keys(JSON.parse("{}"));',
    '@typescript-eslint/no-unsafe-argument',
  ],
  [
    'unsafe return',
    'export function input(): string { return JSON.parse("null"); }',
    '@typescript-eslint/no-unsafe-return',
  ],
  [
    'unsafe call',
    'export const input: unknown = JSON.parse("{}").run();',
    '@typescript-eslint/no-unsafe-call',
  ],
  [
    'unsafe member',
    'export const input: unknown = JSON.parse("{}").name;',
    '@typescript-eslint/no-unsafe-member-access',
  ],
  [
    'postfix assertion',
    'export function input(value?: string) { return value!.length; }',
    '@typescript-eslint/no-non-null-assertion',
  ],
  [
    'optional-chain assertion',
    'export function input(value?: {name?: string}) { return value?.name!; }',
    '@typescript-eslint/no-non-null-assertion',
  ],
  [
    'property assignment assertion',
    'export class Input { value!: string; }',
    'forma-type-safety/no-definite-assignment-assertion',
  ],
  [
    'variable assignment assertion',
    'let value!: string; export { value };',
    'forma-type-safety/no-definite-assignment-assertion',
  ],
  [
    'compiler suppression',
    '// @ts-ignore\nexport const value: string = 1;',
    '@typescript-eslint/ban-ts-comment',
  ],
  [
    'file suppression',
    '// @ts-nocheck\nexport const value: string = 1;',
    '@typescript-eslint/ban-ts-comment',
  ],
  [
    'expected-error bypass',
    '// @ts-expect-error: bypass\nexport const value: string = 1;',
    '@typescript-eslint/ban-ts-comment',
  ],
  [
    'type assertion bypass',
    'export const value = "x" as unknown as number;',
    '@typescript-eslint/consistent-type-assertions',
  ],
] as const;

rejectedLint.map(([name, code, rule]) => {
  test(`Forma lint exits nonzero for ${name}`, () => {
    const result = lint(code);
    expect(result.stderr).toBe('');
    expect(result.status).toBe(1);
    expect(result.stdout).toContain(`"ruleId":"${rule}"`);
  }, 20_000);
});

test('Forma lint cannot be disabled with an inline suppression', () => {
  const result = lint(
    '/* eslint-disable */\nexport const input = JSON.parse("{}");',
  );
  expect(result.status).toBe(1);
  expect(result.stdout).toContain('@typescript-eslint/no-unsafe-assignment');
});

const valid = `
  export function readName(raw: string): string {
    const value: unknown = JSON.parse(raw);
    if (typeof value !== 'object' || value === null || !('name' in value) || typeof value.name !== 'string') {
      throw new Error('Expected a name');
    }
    return value.name;
  }
  export function first(values: string[]): string {
    const value = values[0];
    if (value === undefined) throw new Error('Expected a value');
    return value;
  }
  export function present(value?: string): boolean { return !!value && !value.startsWith(' '); }
  export class Input { value: string; constructor(value: string) { this.value = value; } }
`;

[
  'src/router.tsx',
  'src/features/home/HomePage.test.tsx',
  'tests/config.test.ts',
  'tests/e2e/home.spec.ts',
  'scripts/lighthouse-config.ts',
  'vite.config.ts',
  'vitest.config.ts',
  'playwright.config.ts',
].map((file) => {
  test(`Forma lint accepts validation, guards and logical negation in ${file}`, () => {
    const result = lint(valid, file);
    expect(result.stderr).toBe('');
    expect(result.stdout).not.toContain('"severity":2');
    expect(result.status).toBe(0);
    const unsafe = lint('export const input = JSON.parse("{}");', file);
    expect(unsafe.status).toBe(1);
    expect(unsafe.stdout).toContain('@typescript-eslint/no-unsafe-assignment');
  }, 20_000);
});

function compile(code: string) {
  const directory = mkdtempSync(join(tmpdir(), 'forma-type-safety-'));
  try {
    writeFileSync(join(directory, 'input.ts'), code);
    writeFileSync(
      join(directory, 'tsconfig.json'),
      JSON.stringify({
        extends: join(app, 'tsconfig.json'),
        compilerOptions: { types: [] },
        include: ['./input.ts'],
        exclude: [],
      }),
    );
    return spawnSync(
      process.execPath,
      [tsc, '--project', join(directory, 'tsconfig.json')],
      { encoding: 'utf8' },
    );
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

[
  ['implicit any', 'export function input(value) { return value; }', 'TS7006'],
  [
    'nullable access',
    'export function input(value: string | null) { return value.length; }',
    'TS18047',
  ],
  [
    'unchecked index',
    'export function input(values: string[]) { return values[0].length; }',
    'TS2532',
  ],
].map(([name, code, diagnostic]) => {
  test(`Forma compiler exits nonzero for ${name}`, () => {
    if (code === undefined || diagnostic === undefined)
      throw new Error('Missing compiler fixture');
    const result = compile(code);
    expect(result.status).toBe(2);
    expect(result.stdout).toContain(diagnostic);
  }, 20_000);
});

test('Forma compiler accepts the same validated and narrowed values', () => {
  const result = compile(valid);
  expect(result.stdout).toBe('');
  expect(result.status).toBe(0);
}, 20_000);

test('effective strict compiler options cover every maintained TypeScript file', () => {
  const config = ts.getParsedCommandLineOfConfigFile(
    join(app, 'tsconfig.json'),
    {},
    {
      ...ts.sys,
      onUnRecoverableConfigFileDiagnostic(diagnostic) {
        throw new Error(
          ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
        );
      },
    },
  );
  if (config === undefined)
    throw new Error('Missing Forma compiler configuration');
  expect(config.errors).toEqual([]);
  expect(config.options.strict).toBe(true);
  expect(config.options.noImplicitAny ?? config.options.strict).toBe(true);
  expect(config.options.strictNullChecks ?? config.options.strict).toBe(true);
  expect(config.options.noUncheckedIndexedAccess).toBe(true);
  const files = spawnSync(
    'git',
    [
      'ls-files',
      '--cached',
      '--others',
      '--exclude-standard',
      'apps/forma-studio-web',
    ],
    { encoding: 'utf8' },
  );
  expect(files.status).toBe(0);
  files.stdout
    .trim()
    .split('\n')
    .filter(
      (file) => /\.tsx?$/.test(file) && !file.endsWith('/routeTree.gen.ts'),
    )
    .map((file) => expect(config.fileNames).toContain(resolve(file)));
  expect(config.fileNames).not.toContain(join(app, 'src/routeTree.gen.ts'));
});

test('generated routes are ignored while the handwritten router remains linted', () => {
  expect(
    lint('export type Input = any;', 'src/routeTree.gen.ts').stdout,
  ).toContain('File ignored');
  expect(lint('export type Input = any;').status).toBe(1);
});

test('Forma-only type-aware rules do not change another app policy', () => {
  const result = spawnSync(
    process.execPath,
    [
      eslint,
      '--stdin',
      '--stdin-filename',
      'apps/web/src/router.tsx',
      '--format',
      'json',
    ],
    {
      encoding: 'utf8',
      input: 'export const input = JSON.parse("{}");',
    },
  );
  expect(result.status).toBe(0);
});

test('Forma builds run both quality checks before Vite', () => {
  const manifest = readFileSync(join(app, 'package.json'), 'utf8');
  expect(manifest).toContain(
    '"build": "bun run typecheck && bun run lint && vite build"',
  );
  expect(manifest).toContain('"lint": "eslint . --max-warnings 0"');
});

test('repository lint includes the complete Forma lint gate', () => {
  const manifest = readFileSync('package.json', 'utf8');
  expect(manifest).toContain('bun run --cwd apps/forma-studio-web lint');
  expect(manifest).toContain('scripts/eslint-forma-type-safety.test.ts');
});

[
  ['implicit any', 'export function input(value) { return value; }', 'TS7006'],
  [
    'unsafe API flow',
    'export const input = JSON.parse("{}");',
    '@typescript-eslint/no-unsafe-assignment',
  ],
].map(([name, code, diagnostic]) => {
  test(`Forma production build stops before Vite for ${name}`, () => {
    if (code === undefined || diagnostic === undefined)
      throw new Error('Missing build fixture');
    const directory = mkdtempSync(join(app, 'src/type-safety-probe-'));
    try {
      writeFileSync(join(directory, 'input.ts'), code);
      const result = spawnSync(process.execPath, ['run', 'build'], {
        cwd: app,
        encoding: 'utf8',
      });
      expect(result.status).toBe(name === 'implicit any' ? 2 : 1);
      expect(result.stdout + result.stderr).toContain(diagnostic);
      expect(result.stdout).not.toContain('building client environment');
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  }, 20_000);
});
