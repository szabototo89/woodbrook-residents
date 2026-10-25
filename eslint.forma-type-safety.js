export const formaTypeSafetyConfig = {
  files: ['apps/forma-studio-web/**/*.{ts,tsx}'],
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
  linterOptions: { noInlineConfig: true },
  plugins: {
    'forma-type-safety': {
      rules: {
        'no-definite-assignment-assertion': {
          meta: {
            type: 'problem',
            schema: [],
            messages: {
              initialize:
                'Initialize the value or handle its absence instead of asserting definite assignment.',
            },
          },
          create(context) {
            return {
              ':matches(PropertyDefinition, VariableDeclarator)[definite=true]'(
                node,
              ) {
                context.report({ node, messageId: 'initialize' });
              },
            };
          },
        },
      },
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-non-null-assertion': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/ban-ts-comment': [
      'error',
      {
        'ts-ignore': true,
        'ts-nocheck': true,
        'ts-expect-error': true,
        'ts-check': false,
      },
    ],
    'forma-type-safety/no-definite-assignment-assertion': 'error',
  },
};
