import { defineConfig } from 'vitest/config';
export default defineConfig({
  resolve: {
    alias: {
      'virtual:forma-content': new URL(
        './tests/fixtureContent.ts',
        import.meta.url,
      ).pathname,
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}', 'tests/*.test.ts', 'scripts/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/features/**/*.tsx',
        'src/features/**/*.ts',
        'src/components/**/*.tsx',
      ],
      reporter: ['text', 'json-summary', 'html'],
      thresholds: { statements: 90, branches: 90, functions: 90, lines: 90 },
    },
  },
});
