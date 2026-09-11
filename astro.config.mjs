// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Le site est publié par GitHub Pages sur son propre domaine, à la racine. Le domaine
// est déclaré dans les réglages Pages du dépôt (un fichier CNAME serait ignoré par
// un déploiement GitHub Actions).
export default defineConfig({
  site: 'https://moamind-solutions.com',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  build: { format: 'directory' },
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
