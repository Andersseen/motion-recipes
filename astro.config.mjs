// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://andersseen.github.io',
  base: '/motion-recipes/',
  compressHTML: true,
  build: {
    format: 'directory'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
