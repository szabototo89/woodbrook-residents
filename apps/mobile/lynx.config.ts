import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  environments: {
    lynx: {
      output: {
        distPath: {
          root: 'dist/ios',
        },
      },
    },
    web: {
      output: {
        distPath: {
          root: 'dist/web-lynx',
        },
      },
    },
  },
  source: {
    define: {
      __WOODBROOK_API_URL__: JSON.stringify(
        process.env.WOODBROOK_API_URL ??
          'https://woodbrook.shankill.workers.dev',
      ),
    },
  },
  output: {
    filename: {
      bundle: 'woodbrook.[platform].bundle',
    },
  },
  server: {
    port: 3202,
  },
  plugins: [
    pluginQRCode({
      schema: (url) => `${url}?fullscreen=true`,
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
  ],
});
