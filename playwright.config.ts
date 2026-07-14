import { defineConfig } from '@playwright/test';

const nodeProcess = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
const port = Number(nodeProcess?.env?.E2E_PORT ?? 4321);
// Bind and poll the same IPv4 host. Using `localhost` here resolves to ::1
// (IPv6) first while `astro preview --host 127.0.0.1` only listens on IPv4,
// which makes the readiness check flaky/slow.
const host = '127.0.0.1';
const origin = `http://${host}:${port}`;
const basePath = nodeProcess?.env?.GITHUB_ACTIONS === 'true' ? '/motion-recipes/' : '/';

export default defineConfig({
  testDir: './e2e',
  webServer: {
    command: `pnpm build && pnpm preview --host ${host} --port ${port}`,
    url: `${origin}${basePath}`,
    reuseExistingServer: true,
  },
  use: {
    baseURL: `${origin}${basePath}`,
  },
});
