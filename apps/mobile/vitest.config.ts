import { vitestTestingLibraryPlugin } from '@lynx-js/react/testing-library/plugins';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vitestTestingLibraryPlugin()],
  test: {
    coverage: {
      enabled: true,
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/index.tsx', 'src/lynx-env.d.ts'],
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
