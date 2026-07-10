import { defineConfig } from '@playwright/test';

const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
const port = Number(nodeProcess?.env?.E2E_PORT ?? 4321);
const origin = `http://localhost:${port}`;
const basePath = nodeProcess?.env?.GITHUB_ACTIONS === 'true' ? '/motion-recipes/' : '/';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: `pnpm build && pnpm preview --host 127.0.0.1 --port ${port}`,
    url: `${origin}${basePath}`,
    reuseExistingServer: true,
  },
  use: {
    baseURL: `${origin}${basePath}`,
  },
});
