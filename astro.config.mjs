// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Le site est publié sur GitHub Pages sous /vitrine. Pour brancher un domaine
// propre plus tard : passer `base` à '/' et `site` au domaine.
export default defineConfig({
  site: 'https://shadowx-lab.github.io',
  base: '/vitrine',
  trailingSlash: 'ignore',
  integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],
  build: { format: 'directory' },
  image: { responsiveStyles: true },
  devToolbar: { enabled: false },
});
