import viteReact from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [viteReact()],
  // Serve the original site imagery in Cosmos only. Widget builds never
  // bundle these paths; Wix Media URLs replace them at install time.
  publicDir: '../juliet-rose-web/public',
  test: {
    environment: 'happy-dom',
    include: ['src/**/*.test.{ts,tsx}'],
  },
});
