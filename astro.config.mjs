// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

const SITE_URL = 'https://damipeng.com';

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  build: { format: 'file' },
  integrations: [mdx(), react(), sitemap({ filter: (page) => !page.includes('/og/') })],
  markdown: {
    shikiConfig: {
      theme: 'github-light-high-contrast',
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // The lazily loaded three.js room chunk is ~620 KB (155 KB gzipped); nothing else comes close.
    build: { chunkSizeWarningLimit: 700 },
  },
});
