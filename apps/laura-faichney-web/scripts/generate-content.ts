import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { resolveLauraSanityConfig } from './lauraSanitySource';
import { generateLauraSnapshot } from './lauraSnapshot';

const appRoot = fileURLToPath(new URL('../', import.meta.url));
const mode = process.argv[2] ?? 'production';
const config = resolveLauraSanityConfig({
  ...loadEnv(mode, appRoot, ''),
  ...process.env,
});

await generateLauraSnapshot(config, mode);
console.log(
  mode === 'test' || mode === 'audit'
    ? 'Captured local Laura fixtures without live Sanity requests.'
    : 'Captured published Laura content with four Sanity queries.',
);
