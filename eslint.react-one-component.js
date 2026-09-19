import reactPlugin from 'eslint-plugin-react';

export const reactOneComponentConfig = {
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
    'react/no-multi-comp': ['error', { ignoreStateless: false }],
  },
};

export default reactOneComponentConfig;
