import { pluginQRCode } from '@lynx-js/qrcode-rsbuild-plugin';
import { pluginReactLynx } from '@lynx-js/react-rsbuild-plugin';
import { defineConfig } from '@lynx-js/rspeedy';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
  source: {
    define: {
      __GOOGLE_SHEETS_SPREADSHEET_ID__: JSON.stringify(
        process.env.GOOGLE_SHEETS_SPREADSHEET_ID?.trim() ||
          '1X9N_0s7ZN7W6IC43nVegtottBdMbfz-rRKvClccPqgo',
      ),
      __GOOGLE_SERVICE_ACCOUNT_EMAIL__: JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL?.trim() ?? '',
      ),
      __GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY__: JSON.stringify(
        process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n') ??
          '',
      ),
    },
  },
  output: {
    filename: 'woodbrook.lynx.bundle',
  },
  plugins: [
    pluginQRCode({
      schema: (url) => `${url}?fullscreen=true`,
    }),
    pluginReactLynx(),
    pluginTypeCheck(),
  ],
});
