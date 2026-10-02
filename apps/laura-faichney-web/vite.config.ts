import { defineConfig } from 'vitest/config';
import { readLauraSnapshot } from './scripts/lauraSnapshot';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  const isStaticSiteBuild = mode === 'static';
  const content = process.env.VITEST ? {} : await readLauraSnapshot();

  return {
    define: {
      __STATIC_SITE_BUILD__: JSON.stringify(isStaticSiteBuild),
    },
    plugins: [
      {
        name: 'laura-build-content',
        resolveId(id: string) {
          return id === 'virtual:laura-content'
            ? '\0virtual:laura-content'
            : undefined;
        },
        load(id: string) {
          return id === '\0virtual:laura-content'
            ? `export default ${JSON.stringify(content)}`
            : undefined;
        },
      },
      ...(process.env.VITEST
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
    test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
  };
});
