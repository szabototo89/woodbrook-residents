import { expect, test } from 'bun:test';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const configPath = join(import.meta.dir, '..', 'opencode.json');

interface ClarityMcpConfig {
  type?: unknown;
  enabled?: unknown;
  command?: unknown;
  environment?: Record<string, unknown>;
}

function readConfig(): { mcp?: Record<string, ClarityMcpConfig> } {
  return JSON.parse(readFileSync(configPath, 'utf8'));
}

test('opencode.json declares the Clarity MCP server via npx', () => {
  const config = readConfig();
  const clarity = config?.mcp?.clarity;

  expect(clarity).toBeDefined();
  expect(clarity.type).toBe('local');
  expect(clarity.enabled).toBe(true);
  expect(clarity.command).toEqual([
    'npx',
    '-y',
    '@microsoft/clarity-mcp-server',
  ]);
});

test('Clarity MCP token comes from the environment, never hardcoded', () => {
  const raw = readFileSync(configPath, 'utf8');
  const config = JSON.parse(raw);
  const clarity = config?.mcp?.clarity;

  expect(clarity.environment?.CLARITY_API_TOKEN).toBe(
    '{env:CLARITY_API_TOKEN}',
  );
  expect(raw).not.toMatch(/--clarity_api_token=/);
});
