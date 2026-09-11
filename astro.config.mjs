// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Le site est servi par o2switch à la racine de son domaine (voir README, « Hébergement »).
export default defineConfig({
  site: 'https://moamind-solutions.com',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  build: { format: 'directory' },
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
