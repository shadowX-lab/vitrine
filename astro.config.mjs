// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Deux domaines chez o2switch : le français sur moamind-solutions.fr (public_html), l'anglais
// sur moamind-solutions.com (public_html/en). Voir README, « Hébergement », et src/i18n/routes.ts.
export default defineConfig({
  site: 'https://moamind-solutions.fr',
  trailingSlash: 'ignore',
  // Plan du site du domaine français ; celui de l'anglais est écrit par scripts/preparer-domaines.mjs.
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) && !new URL(page).pathname.startsWith('/en/') })],
  build: { format: 'directory' },
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
