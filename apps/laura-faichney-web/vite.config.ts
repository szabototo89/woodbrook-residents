import { defineConfig } from 'vitest/config';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [...(process.env.VITEST ? [] : [tanstackStart()]), viteReact()],
  test: { environment: 'node', include: ['src/**/*.test.{ts,tsx}'] },
});
