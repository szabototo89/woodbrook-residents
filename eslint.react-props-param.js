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

function typeName(node) {
  if (node?.type === 'Identifier') return node.name;
  if (node?.type === 'TSQualifiedName') return node.right.name;
  if (node?.type === 'MemberExpression' && !node.computed) {
    return node.property.name;
  }
  return undefined;
}

function isReactWrapper(node) {
  return (
    node?.type === 'CallExpression' &&
    ['memo', 'forwardRef'].includes(typeName(node.callee))
  );
}

function isComponent(node) {
  if (isComponentName(getComponentName(node, node.parent))) return true;
  if (node.parent?.type === 'ExportDefaultDeclaration') return true;
  if (isReactWrapper(node.parent) && node.parent.arguments[0] === node) {
    return isComponent(node.parent);
  }
  return false;
}

const noInlinePropsType = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require a named type or interface for React component props.',
    },
    messages: {
      namedProps:
        'Use a named type or interface for React component props instead of an inline object type. Extract this object into a type such as `FooProps`.',
    },
    schema: [],
  },
  create(context) {
    function checkType(node) {
      if (!node) return;
      if (node.type === 'TSTypeLiteral') {
        context.report({ node, messageId: 'namedProps' });
        return;
      }
      const keys = context.sourceCode.visitorKeys[node.type] ?? [];
      keys.forEach((key) => {
        const children = node[key];
        if (Array.isArray(children)) children.forEach(checkType);
        else checkType(children);
      });
    }

    function checkFunction(node) {
      if (!isComponent(node)) return;
      const firstParam = node.params[0];
      const param =
        firstParam?.type === 'AssignmentPattern' ? firstParam.left : firstParam;
      checkType(param?.typeAnnotation?.typeAnnotation);
    }

    return {
      FunctionDeclaration: checkFunction,
      FunctionExpression: checkFunction,
      ArrowFunctionExpression: checkFunction,
      CallExpression(node) {
        if (!isReactWrapper(node) || !isComponent(node)) return;
        const propsIndex = typeName(node.callee) === 'forwardRef' ? 1 : 0;
        checkType(node.typeArguments?.params[propsIndex]);
      },
      VariableDeclarator(node) {
        if (!isComponentName(node.id.name)) return;
        const annotation = node.id.typeAnnotation?.typeAnnotation;
        if (
          annotation?.type === 'TSTypeReference' &&
          ['FC', 'FunctionComponent'].includes(typeName(annotation.typeName))
        ) {
          checkType(annotation.typeArguments?.params[0]);
        }
      },
    };
  },
};

const woodbrookPropsPlugin = {
  rules: {
    'no-destructured-props-param': noDestructuredPropsParam,
    'no-inline-props-type': noInlinePropsType,
  },
};

export const reactPropsParamConfig = {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    'woodbrook-props': woodbrookPropsPlugin,
  },
  rules: {
    'woodbrook-props/no-destructured-props-param': 'error',
    'woodbrook-props/no-inline-props-type': 'error',
  },
};

export default reactPropsParamConfig;
