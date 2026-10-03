const playwrightModules = new Set([
  '@playwright/test',
  'playwright',
  'playwright-core',
]);

const offlineBrowser = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Keep Laura browser checks on offline Sanity fixtures.',
    },
    schema: [],
    messages: {
      fixture:
        'Import test from ../fixtures/gallery-test so Sanity requests use local fixtures.',
      context:
        'Use createOfflinePage from ../fixtures/gallery-test instead of creating an unprotected browser session.',
      fetch:
        'Use route.fulfill for local fixtures or route.fallback to preserve offline interception; live route fetching/continuation is forbidden.',
    },
  },
  create(context) {
    const isBrowserTest = context.filename
      .replaceAll('\\', '/')
      .includes('/tests/e2e/');
    function checkImport(node) {
      if (!isBrowserTest) return;
      if (
        !playwrightModules.has(node.source?.value) ||
        node.importKind === 'type' ||
        node.exportKind === 'type'
      )
        return;
      if (
        node.type === 'ExportAllDeclaration' ||
        node.specifiers.some(
          (specifier) =>
            specifier.importKind !== 'type' &&
            ((specifier.type !== 'ImportSpecifier' &&
              specifier.type !== 'ExportSpecifier') ||
              (specifier.imported?.name ?? specifier.local?.name) === 'test'),
        )
      )
        context.report({ node, messageId: 'fixture' });
    }
    return {
      ImportDeclaration: checkImport,
      ExportNamedDeclaration: checkImport,
      ExportAllDeclaration: checkImport,
      ImportExpression(node) {
        if (isBrowserTest && playwrightModules.has(node.source.value)) {
          context.report({ node, messageId: 'fixture' });
        }
      },
      CallExpression(node) {
        if (node.callee.type !== 'MemberExpression') return;
        const method = node.callee.computed
          ? node.callee.property.value
          : node.callee.property.name;
        if (
          isBrowserTest &&
          (method === 'newContext' || method === 'newPage')
        ) {
          context.report({ node, messageId: 'context' });
        }
        if (method === 'fetch' || method === 'continue')
          context.report({ node, messageId: 'fetch' });
      },
    };
  },
};

export const lauraOfflineTestsConfig = {
  files: ['apps/laura-faichney-web/tests/**/*.{ts,tsx}'],
  plugins: { 'laura-tests': { rules: { 'offline-browser': offlineBrowser } } },
  rules: { 'laura-tests/offline-browser': 'error' },
};
