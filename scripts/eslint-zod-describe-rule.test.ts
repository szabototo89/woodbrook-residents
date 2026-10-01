import { expect, test } from 'bun:test';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

const root = join(import.meta.dir, '..');

test('zod-describe rule ships as a shared flat config', async () => {
  const shared = await import('../eslint.zod-describe.js');

  expect(shared.zodDescribeConfig.files).toEqual(['**/*.{ts,tsx}']);
  expect(
    shared.zodDescribeConfig.rules?.['woodbrook-zod/require-field-description'],
  ).toEqual('error');
});

test('zod-describe rule requires non-empty describe on object fields', async () => {
  const shared = await import('../eslint.zod-describe.js');
  const { Linter } = await import('eslint');
  const plugin = shared.zodDescribeConfig.plugins?.['woodbrook-zod'];
  const rule = plugin?.rules?.['require-field-description'];

  expect(rule).toBeDefined();

  const linter = new Linter();
  const flatConfig = {
    plugins: {
      'woodbrook-zod': plugin,
    },
    rules: {
      'woodbrook-zod/require-field-description': 'error',
    },
  };
  const verify = (code: string) => linter.verify(code, flatConfig);

  const good = `import { z } from 'zod'; const s = z.object({ name: z.string().describe('Public name.') });`;
  expect(verify(good)).toHaveLength(0);

  const goodChained = `import { z } from 'zod'; const s = z.object({ name: z.string().min(1).describe('Public name.') });`;
  expect(verify(goodChained)).toHaveLength(0);

  const goodOptional = `import { z } from 'zod'; const s = z.object({ nick: z.string().optional().describe('Optional nickname.') });`;
  expect(verify(goodOptional)).toHaveLength(0);

  const goodArray = `import { z } from 'zod'; const s = z.object({ tags: z.array(z.string()).describe('List of tags.') });`;
  expect(verify(goodArray)).toHaveLength(0);

  const goodRef = `import { z } from 'zod'; const s = z.object({ nick: optionalString.describe('Optional nickname.') });`;
  expect(verify(goodRef)).toHaveLength(0);

  const goodNested = `import { z } from 'zod'; const s = z.object({ address: z.object({ street: z.string().describe('Street name.') }).describe('Postal address.') });`;
  expect(verify(goodNested)).toHaveLength(0);

  const goodSpread = `import { z } from 'zod'; const s = z.object({ ...base.shape, name: z.string().describe('Public name.') });`;
  expect(verify(goodSpread)).toHaveLength(0);

  const nonZod = `const s = notZod.object({ name: 'plain' });`;
  expect(verify(nonZod)).toHaveLength(0);

  const bad = `import { z } from 'zod'; const s = z.object({ name: z.string() });`;
  const badMessages = verify(bad);
  expect(badMessages).toHaveLength(1);
  expect(badMessages[0]?.message).toContain('describe');

  const badChained = `import { z } from 'zod'; const s = z.object({ name: z.string().min(1) });`;
  expect(verify(badChained)).toHaveLength(1);

  const badOptional = `import { z } from 'zod'; const s = z.object({ nick: z.string().optional() });`;
  expect(verify(badOptional)).toHaveLength(1);

  const badArray = `import { z } from 'zod'; const s = z.object({ tags: z.array(z.string()) });`;
  expect(verify(badArray)).toHaveLength(1);

  const badRef = `import { z } from 'zod'; const s = z.object({ group: infraGroupSchema });`;
  expect(verify(badRef)).toHaveLength(1);

  const badEmpty = `import { z } from 'zod'; const s = z.object({ name: z.string().describe('') });`;
  expect(verify(badEmpty)).toHaveLength(1);

  const badBlank = `import { z } from 'zod'; const s = z.object({ name: z.string().describe('   ') });`;
  expect(verify(badBlank)).toHaveLength(1);

  const badNested = `import { z } from 'zod'; const s = z.object({ address: z.object({ street: z.string() }).describe('Postal address.') });`;
  expect(verify(badNested)).toHaveLength(1);

  const badTwo = `import { z } from 'zod'; const s = z.object({ a: z.string(), b: z.number() });`;
  expect(verify(badTwo)).toHaveLength(2);
});

test('root flat config reuses the shared zod-describe config', async () => {
  const source = await readFile(join(root, 'eslint.config.js'), 'utf8');

  expect(source).toContain('eslint.zod-describe.js');
  expect(source).toContain('zodDescribeConfig');
});
