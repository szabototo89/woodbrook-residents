import { defineConfig } from 'vitest/config';

import { tanstackStart } from '@tanstack/react-start/plugin/vite';

import viteReact from '@vitejs/plugin-react';

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [tanstackStart(), viteReact()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});

export default config;
