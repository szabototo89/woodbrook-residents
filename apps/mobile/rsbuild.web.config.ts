import { defineConfig } from '@rsbuild/core';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

const shouldCopyLynxBundle = process.env.MOBILE_WEB_COPY_BUNDLE === 'true';

export default defineConfig({
  source: {
    entry: {
      index: './web/index.ts',
    },
  },
  html: {
    template: './web/index.html',
  },
  output: {
    copy: shouldCopyLynxBundle
      ? [
          {
            from: './dist/web-lynx',
            to: './lynx',
          },
          // The web bundle references image assets relative to the page
          // (e.g. /static/image/…), so the emitted bundle assets must also
          // exist at the host root.
          {
            from: './dist/web-lynx/static',
            to: './static',
          },
        ]
      : undefined,
    distPath: {
      root: 'dist/web',
    },
    overrideBrowserslist: ['Chrome >= 92', 'Safari >= 16.4'],
  },
  server: {
    port: 3203,
    proxy: {
      '/lynx': {
        target: 'http://127.0.0.1:3202',
        pathRewrite: { '^/lynx': '' },
      },
    },
  },
  plugins: [pluginTypeCheck()],
});
