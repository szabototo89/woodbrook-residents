import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import { fileURLToPath } from 'node:url';
import { watchHandoffDocuments } from './src/features/handoffs/watchHandoffDocuments.ts';

export default defineConfig({
  resolve: { dedupe: ['react', 'react-dom'] },
  plugins: [
    { enforce: 'pre', ...mdx({ remarkPlugins: [remarkGfm] }) },
    react(),
    watchHandoffDocuments(
      fileURLToPath(new URL('../../docs/handoffs', import.meta.url)),
    ),
  ],
  test: {
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/test-utils/**', 'src/main.tsx'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
        perFile: true,
      },
    },
  },
});
