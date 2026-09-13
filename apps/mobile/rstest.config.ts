import { withLynxConfig } from '@lynx-js/react/testing-library/rstest-config';
import { defineConfig } from '@rstest/core';

export default defineConfig({
  extends: withLynxConfig(),
  coverage: {
    enabled: true,
    provider: 'istanbul',
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['src/index.tsx', 'src/lynx-env.d.ts'],
    reporters: ['text', 'json-summary'],
    thresholds: {
      statements: 90,
      branches: 90,
      functions: 90,
      lines: 90,
    },
  },
});
