import { defineConfig } from 'vitest/config';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';

const config = defineConfig(({ mode }) => {
  const isStaticSiteBuild = mode === 'static';

  return {
    define: {
      __STATIC_SITE_BUILD__: JSON.stringify(isStaticSiteBuild),
    },
    resolve: { tsconfigPaths: true },
    plugins: [
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
