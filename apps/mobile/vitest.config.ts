import { vitestTestingLibraryPlugin } from '@lynx-js/react/testing-library/plugins';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vitestTestingLibraryPlugin()],
  test: {
    include: ['src/__tests__/**/*.{test,spec}.{ts,tsx}'],
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}', 'web/**/*.ts'],
      exclude: ['src/index.tsx', 'src/lynx-env.d.ts', 'web/index.ts'],
      reporter: ['text', 'json-summary'],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
      },
    },
  },
});
