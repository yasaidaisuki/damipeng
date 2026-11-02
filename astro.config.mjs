// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// TODO: replace with the production domain once it's set up on Cloudflare Pages.
const SITE_URL = 'https://damipeng.pages.dev';

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
