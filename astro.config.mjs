// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ashmitbohora.com',
  compressHTML: true,
  integrations: [
    sitemap({
      lastmod: new Date(),
      // personalized pitch pages are noindex and stay out of the sitemap
      filter: (page) => !page.includes('/bohobites/euless-bakes'),
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
});
