const MESSAGE =
  'Do not destructure React props in the parameter list. Use `props: <Props>` and access values as `props.<name>` so prop reads stay distinguishable from derived locals.';

function isComponentName(name) {
  return typeof name === 'string' && /^[A-Z]/.test(name);
}

function getComponentName(node, parent) {
  if (node.type === 'FunctionDeclaration') {
    return node.id?.name;
  }
  if (
    parent?.type === 'VariableDeclarator' &&
    parent.id?.type === 'Identifier'
  ) {
    return parent.id.name;
  }
  if (
    parent?.type === 'Property' &&
    parent.key?.type === 'Identifier' &&
    isComponentName(parent.key.name)
  ) {
    return parent.key.name;
  }
  return undefined;
}

const noDestructuredPropsParam = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Disallow destructuring React props in the component parameter list; use a single `props` parameter instead.',
    },
    messages: {
      noDestructure: MESSAGE,
    },
    schema: [],
  },
  create(context) {
    function check(node) {
      const firstParam = node.params?.[0];
      if (!firstParam || firstParam.type !== 'ObjectPattern') {
        return;
      }
      const name = getComponentName(node, node.parent);
      if (!isComponentName(name)) {
        return;
      }
      context.report({ node: firstParam, messageId: 'noDestructure' });
    }

    return {
      FunctionDeclaration: check,
      FunctionExpression: check,
      ArrowFunctionExpression: check,
    };
  },
};

const woodbrookPropsPlugin = {
  rules: {
    'no-destructured-props-param': noDestructuredPropsParam,
  },
};

export const reactPropsParamConfig = {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    'woodbrook-props': woodbrookPropsPlugin,
  },
  rules: {
    'woodbrook-props/no-destructured-props-param': 'error',
  },
};

export default reactPropsParamConfig;
