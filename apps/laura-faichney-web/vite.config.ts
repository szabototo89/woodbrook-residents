import { defineConfig } from 'vitest/config';
import { readFile } from 'node:fs/promises';
import { inlineStyles } from './scripts/inline-styles';
import { readLauraSnapshot } from './scripts/lauraSnapshot';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig(async ({ mode }) => {
  const isStaticSiteBuild = mode === 'static';
  const content = process.env.VITEST ? {} : await readLauraSnapshot();

  const styles = inlineStyles(
    await Promise.all(
      ['services-design.css', 'contact-design.css', 'styles.css'].map((file) =>
        readFile(new URL(`./src/${file}`, import.meta.url), 'utf8'),
      ),
    ),
  );

  return {
    define: {
      __STATIC_SITE_BUILD__: JSON.stringify(isStaticSiteBuild),
    },
    plugins: [
      {
        name: 'laura-inline-styles',
        resolveId(id: string) {
          return id === 'virtual:laura-styles'
            ? '\0virtual:laura-styles'
            : undefined;
        },
        load(id: string) {
          return id === '\0virtual:laura-styles'
            ? `export default ${JSON.stringify(styles)}`
            : undefined;
        },
      },
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
