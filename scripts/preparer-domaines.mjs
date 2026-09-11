#!/usr/bin/env node
/**
 * Après `astro build`, prépare dist/ pour ses deux domaines : dist/ devient public_html
 * (moamind-solutions.fr) et dist/en/ public_html/en (moamind-solutions.com). Le domaine anglais
 * ne voit que dist/en/ : il y reçoit sa copie des ressources, sa 404, son plan du site.
 */
import { copyFileSync, cpSync, existsSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { DOMAINES } from '../src/i18n/routes.ts';
import { htaccess } from './htaccess.mjs';

const DIST = resolve(import.meta.dirname, '../dist');
const EN = join(DIST, 'en');

// Styles, polices, images et fichiers de public/ : les pages anglaises les demandent à la racine de leur domaine.
cpSync(join(DIST, '_astro'), join(EN, '_astro'), { recursive: true });
for (const fichier of ['favicon.svg', 'og.png']) copyFileSync(join(DIST, fichier), join(EN, fichier));

// Apache cherche la page d'erreur à /404.html, à la racine de chaque domaine.
copyFileSync(join(EN, '404', 'index.html'), join(EN, '404.html'));
rmSync(join(EN, '404'), { recursive: true });

/** Dossiers de pages (un index.html chacun) sous `racine`, hors ressources. */
function pages(racine, dossier = racine) {
  return readdirSync(dossier, { withFileTypes: true }).flatMap((entree) => {
    if (!entree.isDirectory() || entree.name === '_astro') return [];
    const chemin = join(dossier, entree.name);
    return [...(existsSync(join(chemin, 'index.html')) ? [relative(racine, chemin)] : []), ...pages(racine, chemin)];
  });
}

const adresses = ['', ...pages(EN)].map((p) => `${DOMAINES.en}/${p ? `${p}/` : ''}`);
writeFileSync(join(EN, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${adresses.map((a) => `  <url><loc>${a}</loc></url>`).join('\n')}
</urlset>
`);
writeFileSync(join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${DOMAINES.fr}/sitemap-index.xml\n`);
writeFileSync(join(EN, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${DOMAINES.en}/sitemap.xml\n`);

writeFileSync(join(DIST, '.htaccess'), htaccess('fr'));
writeFileSync(join(EN, '.htaccess'), htaccess('en'));

console.log(`Domaines prêts : ${adresses.length} pages anglaises, .htaccess générés.`);
