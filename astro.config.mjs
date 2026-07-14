// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Deployed to Cloudflare Pages, which serves at the domain root — base is '/'.
// https://astro.build/config
export default defineConfig({
  site: 'https://motion-recipes.pages.dev',
  compressHTML: true,
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
