// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = Reflect.get(globalThis, 'process')?.env?.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: 'https://andersseen.github.io',
  base: isGitHubPages ? '/motion-recipes/' : '/',
  compressHTML: true,
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
