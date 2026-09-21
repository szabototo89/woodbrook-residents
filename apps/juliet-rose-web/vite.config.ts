import { defineConfig } from 'vitest/config';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';

const config = defineConfig(({ mode }) => {
  const isStaticSiteBuild = mode === 'static';
  // React Cosmos boots its own Vite dev server from this config. The
  // TanStack Start plugin takes over routing and the HTML pipeline, which
  // breaks the Cosmos renderer, so it stays out of Cosmos runs. Match on
  // the invoked binary name only: the checkout path itself may contain
  // "cosmos" (e.g. a session worktree), so full-path matching misfires.
  const isCosmosRun =
    (process.env.npm_lifecycle_event ?? '').startsWith('cosmos') ||
    process.argv.some((arg) => {
      const binary = arg.split(/[\\/]/).pop() ?? '';
      return (
        binary === 'cosmos' ||
        binary.startsWith('cosmos.') ||
        binary.startsWith('cosmos-')
      );
    });

  return {
    define: {
      __STATIC_SITE_BUILD__: JSON.stringify(isStaticSiteBuild),
    },
    resolve: { tsconfigPaths: true },
    plugins: [
      ...(isCosmosRun
        ? []
        : [
            tanstackStart(
              isStaticSiteBuild
                ? {
                    prerender: {
                      enabled: true,
                      autoStaticPathsDiscovery: true,
                      crawlLinks: true,
                      failOnError: true,
                    },
                  }
                : {},
            ),
          ]),
      viteReact(),
    ],
    test: {
      environment: 'node',
      include: ['src/**/*.test.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/**/*.fixture.{ts,tsx}',
          'src/cosmos.decorator.tsx',
          'src/cosmosRouter.tsx',
          'src/test-utils/**',
          'src/routeTree.gen.ts',
          'src/build.d.ts',
        ],
        thresholds: {
          statements: 90,
          branches: 90,
          functions: 90,
          lines: 90,
          perFile: true,
        },
      },
    },
  };
});

export default config;
