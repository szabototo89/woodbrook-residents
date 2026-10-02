import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';
import { readFile } from 'node:fs/promises';
import { inlineStyles } from './scripts/inline-styles';
import { readLauraSnapshot } from './scripts/lauraSnapshot';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig(async ({ mode, command }) => {
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
        load(id: string): string | undefined {
          if (id !== '\0virtual:laura-styles') return undefined;
          if (command === 'serve') {
            // Raw imports retain Vite's CSS dependency watching in development.
            return `import services from '/src/services-design.css?raw';
              import contact from '/src/contact-design.css?raw';
              import base from '/src/styles.css?raw';
              export default [services, contact, base.replace(/^@import .+;$/gm, '')].join('\\n');`;
          }
          // Hydration reuses the CSS already delivered in the document.
          return this.environment.config.consumer === 'server'
            ? `export default ${JSON.stringify(styles)}`
            : `export default document.getElementById('site-styles')?.textContent ?? '';`;
        },
      } satisfies Plugin,
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
