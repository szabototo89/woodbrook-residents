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
      include: ['src/**/*.test.ts'],
    },
  };
});

export default config;
