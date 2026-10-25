import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import { loadBuildContent } from './scripts/buildContent';

export default defineConfig(async ({ mode }) => {
  // A fresh, validated snapshot is mandatory for every build and dev-server start.
  // Only this parsed value enters the client/server module graph; never the config/token.
  const content = await loadBuildContent({
    ...loadEnv(mode, process.cwd(), 'FORMA_'),
    ...process.env,
  });
  return {
    plugins: [
      {
        name: 'forma-published-content',
        resolveId(id: string) {
          return id === 'virtual:forma-content'
            ? '\0virtual:forma-content'
            : undefined;
        },
        load(id: string) {
          return id === '\0virtual:forma-content'
            ? `export default ${JSON.stringify(content)}`
            : undefined;
        },
      },
      tanstackStart({
        prerender: {
          enabled: true,
          autoStaticPathsDiscovery: true,
          crawlLinks: false,
          failOnError: true,
        },
      }),
      viteReact(),
    ],
  };
});
