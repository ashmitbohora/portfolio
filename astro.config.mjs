// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ashmitbohora.com',
  compressHTML: true,
  integrations: [sitemap({ lastmod: new Date() })],
  build: {
    inlineStylesheets: 'always',
  },
});
