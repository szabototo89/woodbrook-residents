import { expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';

function readWorkflow() {
  return Bun.YAML.parse(
    readFileSync(
      new URL('../.github/workflows/deploy-forma-studio.yml', import.meta.url),
      'utf8',
    ),
  );
}

test('deploys Forma changes and shared dependency updates from main, with manual reruns', () => {
  expect(readWorkflow()).toMatchObject({
    on: {
      push: {
        branches: ['main'],
        paths: expect.arrayContaining([
          'apps/forma-studio-web/**',
          'package.json',
          'bun.lock',
          'eslint*.js',
          'scripts/app.ts',
          'scripts/eslint-forma-type-safety.test.ts',
          '.github/workflows/deploy-forma-studio.yml',
        ]),
      },
      workflow_dispatch: null,
    },
    permissions: { contents: 'read' },
    concurrency: { group: 'forma-studio-pages', 'cancel-in-progress': false },
    jobs: { deploy: { if: "github.ref == 'refs/heads/main'" } },
  });
});

test('checks and builds Forma before publishing only its static output to the existing project', () => {
  expect(readWorkflow()).toMatchObject({
    jobs: {
      deploy: {
        steps: [
          { uses: 'actions/checkout@v4' },
          { uses: 'oven-sh/setup-bun@v2', with: { 'bun-version': '1.4.0' } },
          { run: 'bun install --frozen-lockfile' },
          { run: 'bun run --cwd apps/forma-studio-web typecheck' },
          { run: 'bun run --cwd apps/forma-studio-web lint' },
          { run: 'bun test scripts/eslint-forma-type-safety.test.ts' },
          { run: 'bun run --cwd apps/forma-studio-web test:unit' },
          { run: 'bun run --cwd apps/forma-studio-web build' },
          {
            'working-directory': 'apps/forma-studio-web',
            run: 'bunx wrangler pages deploy dist/client --project-name=forma-studio-web --branch=main --commit-hash=${{ github.sha }}',
            env: {
              CLOUDFLARE_API_TOKEN: '${{ secrets.CLOUDFLARE_API_TOKEN }}',
              CLOUDFLARE_ACCOUNT_ID: '${{ secrets.CLOUDFLARE_ACCOUNT_ID }}',
            },
          },
        ],
      },
    },
  });
});

test('published Forma content can trigger an isolated rebuild without triggering Laura', () => {
  expect(readWorkflow()).toMatchObject({
    on: { repository_dispatch: { types: ['forma-sanity-update'] } },
  });
});
