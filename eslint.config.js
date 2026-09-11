import eslint from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
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
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: reactPlugin,
    },
    settings: {
      react: {
        version: '19.2.0',
      },
    },
    rules: {
      'no-var': 'error',
      'prefer-const': 'error',
      'no-param-reassign': ['error', { props: true }],
      'no-restricted-syntax': [
        'error',
        {
          selector: 'VariableDeclaration[kind="let"]',
          message:
            'Use const instead of let. Model changing state with a new binding, .map/.filter/.reduce, or a { current } holder.',
        },
        {
          selector: 'ForStatement',
          message:
            'Use immutable array methods (.map, .filter, .reduce, .find, .some, .every, .flatMap) instead of for loops.',
        },
        {
          selector: 'ForInStatement',
          message:
            'Use immutable array methods (.map, .filter, .reduce, Object.keys/Object.entries) instead of for-in loops.',
        },
        {
          selector: 'ForOfStatement',
          message:
            'Use immutable array methods (.map, .filter, .reduce, .find, .some, .every, .flatMap) instead of for-of loops.',
        },
        {
          selector: 'WhileStatement',
          message:
            'Use immutable array methods or recursion instead of while loops.',
        },
        {
          selector: 'DoWhileStatement',
          message:
            'Use immutable array methods or recursion instead of do-while loops.',
        },
        {
          selector: 'CallExpression[callee.property.name="forEach"]',
          message:
            'Use immutable array methods (.map, .filter, .reduce, .find, .some, .every, .flatMap) instead of .forEach.',
        },
      ],
      '@typescript-eslint/consistent-type-assertions': [
        'error',
        { assertionStyle: 'never' },
      ],
      'react/no-multi-comp': ['error', { ignoreStateless: false }],
    },
  },
  {
    files: [
      '**/*.test.{ts,tsx}',
      '**/*.spec.{ts,tsx}',
      'apps/web/tests/**/*.{ts,tsx}',
      'scripts/**/*.test.ts',
    ],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'CallExpression[callee.name="describe"]',
          message:
            'Use test(...) instead of describe(...). Flatten the suite name into each test name.',
        },
        {
          selector: 'CallExpression[callee.object.name="describe"]',
          message:
            'Use test(...) instead of describe(...). Flatten the suite name into each test name.',
        },
        {
          selector: 'CallExpression[callee.name="it"]',
          message: 'Use test(...) instead of it(...).',
        },
        {
          selector: 'CallExpression[callee.object.name="it"]',
          message: 'Use test(...) instead of it(...).',
        },
      ],
    },
  },
);
