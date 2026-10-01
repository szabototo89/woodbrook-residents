const OBJECT_METHODS = new Set(['object', 'strictObject', 'looseObject']);

const MESSAGE =
  'Zod field "{{name}}" must include a non-empty .describe(\'...\') for readability.';

function getPropertyName(property) {
  const key = property.key;
  if (!key) return 'field';
  if (key.type === 'Identifier') return key.name;
  if (key.type === 'Literal' && typeof key.value === 'string') return key.value;
  if (key.type === 'TemplateLiteral' && key.quasis.length === 1) {
    return key.quasis[0]?.value.cooked ?? 'field';
  }
  return 'field';
}

function getMemberName(member) {
  if (member.computed) {
    if (member.property?.type === 'Literal') return member.property.value;
    return undefined;
  }
  if (member.property?.type === 'Identifier') return member.property.name;
  return undefined;
}

function unwrapTs(node) {
  let current = node;
  while (
    current &&
    (current.type === 'TSAsExpression' ||
      current.type === 'TSSatisfiesExpression' ||
      current.type === 'TSNonNullExpression')
  ) {
    current = current.expression;
  }
  return current;
}

function isNonEmptyDescribeArg(arg) {
  if (!arg) return false;
  if (arg.type === 'Literal' && typeof arg.value === 'string') {
    return arg.value.trim().length > 0;
  }
  if (
    arg.type === 'TemplateLiteral' &&
    arg.expressions.length === 0 &&
    arg.quasis.length === 1
  ) {
    const cooked = arg.quasis[0]?.value.cooked ?? '';
    return cooked.trim().length > 0;
  }
  return false;
}

function hasOuterDescribe(value) {
  const unwrapped = unwrapTs(value);
  if (!unwrapped || unwrapped.type !== 'CallExpression') return false;
  const callee = unwrapped.callee;
  if (callee?.type !== 'MemberExpression') return false;
  if (getMemberName(callee) !== 'describe') return false;
  return isNonEmptyDescribeArg(unwrapped.arguments?.[0]);
}

const requireFieldDescription = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Require every z.object field to include a non-empty .describe() for readability.',
    },
    messages: {
      missingDescribe: MESSAGE,
    },
    schema: [],
  },
  create(context) {
    const zodNamespaces = new Set();
    const zodObjectFactories = new Set();

    function collectFromZodImport(node) {
      for (const specifier of node.specifiers ?? []) {
        if (specifier.type === 'ImportNamespaceSpecifier') {
          zodNamespaces.add(specifier.local.name);
        } else if (specifier.type === 'ImportDefaultSpecifier') {
          zodNamespaces.add(specifier.local.name);
        } else if (specifier.type === 'ImportSpecifier') {
          const imported =
            specifier.imported?.type === 'Identifier'
              ? specifier.imported.name
              : specifier.imported?.value;
          if (imported === 'z') {
            zodNamespaces.add(specifier.local.name);
          } else if (OBJECT_METHODS.has(imported)) {
            zodObjectFactories.add(specifier.local.name);
          }
        }
      }
    }

    function isZodObjectCall(node) {
      if (node.type !== 'CallExpression') return false;
      const callee = node.callee;
      if (callee?.type === 'MemberExpression') {
        if (!OBJECT_METHODS.has(getMemberName(callee))) return false;
        const target = callee.object;
        return target?.type === 'Identifier' && zodNamespaces.has(target.name);
      }
      if (callee?.type === 'Identifier') {
        return zodObjectFactories.has(callee.name);
      }
      return false;
    }

    function checkObjectCall(node) {
      const firstArg = node.arguments?.[0];
      if (!firstArg || firstArg.type !== 'ObjectExpression') return;
      for (const property of firstArg.properties ?? []) {
        if (property.type !== 'Property') continue;
        if (property.computed) continue;
        if (!hasOuterDescribe(property.value)) {
          context.report({
            node: property.value,
            messageId: 'missingDescribe',
            data: { name: getPropertyName(property) },
          });
        }
      }
    }

    return {
      ImportDeclaration(node) {
        if (node.source?.value === 'zod') collectFromZodImport(node);
      },
      CallExpression(node) {
        if (isZodObjectCall(node)) checkObjectCall(node);
      },
    };
  },
};

const woodbrookZodPlugin = {
  rules: {
    'require-field-description': requireFieldDescription,
  },
};

export const zodDescribeConfig = {
  files: ['**/*.{ts,tsx}'],
  plugins: {
    'woodbrook-zod': woodbrookZodPlugin,
  },
  rules: {
    'woodbrook-zod/require-field-description': 'error',
  },
};

export default zodDescribeConfig;
