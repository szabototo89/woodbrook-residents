import react from '@vitejs/plugin-react'
import {defineConfig} from 'vitest/config'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    include: ['schemaTypes/**/*.test.{ts,tsx}', '*.test.{ts,tsx}'],
    exclude: ['node_modules/**', 'dist/**', '.sanity/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      include: ['schemaTypes/**/*.ts', 'sanity.config.ts', 'sanity.cli.ts'],
      exclude: ['**/*.test.{ts,tsx}', '**/test-helpers.*', 'vitest.config.ts'],
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
