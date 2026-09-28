import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['schemaTypes/**/*.test.{ts,tsx}', 'components/**/*.test.{ts,tsx}', '*.test.{ts,tsx}'],
    exclude: ['**/*.browser.test.{ts,tsx}', 'node_modules/**', 'dist/**', '.sanity/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['schemaTypes/**/*.ts', 'components/**/*.tsx', 'sanity.config.ts', 'sanity.cli.ts'],
      exclude: [
        '**/*.test.{ts,tsx}',
        '**/test-helpers.*',
        '**/test-utils/**',
        'vitest.config.ts',
        'vitest.browser.config.ts',
        'playwright.config.ts',
      ],
      thresholds: {
        statements: 90,
        branches: 90,
        functions: 90,
        lines: 90,
        perFile: true,
      },
    },
  },
})
