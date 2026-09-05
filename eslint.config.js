import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.output/**',
      '**/coverage/**',
      '**/routeTree.gen.ts',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['apps/web/**/*.{ts,tsx}'],
    rules: {
      'prefer-const': 'error',
      'no-param-reassign': ['error', { props: true }],
    },
  },
);
