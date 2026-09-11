#!/usr/bin/env node
/**
 * Contrôles du site construit, dans Chrome headless (protocole DevTools) :
 * débordement horizontal, mots isolés en fin de ligne, liens internes, interactions.
 * Prérequis : `npm run build && npm run preview` dans un autre terminal.
 * Usage : npm run verifier [-- page1 page2 …]
 */
import { spawn } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const RACINE = process.env.RACINE ?? 'http://localhost:4321/vitrine';
const TOUTES = [
  '/', '/methode', '/realisations', '/realisations/chargeair', '/realisations/pilpoil', '/realisations/teamago', '/experience', '/contact', '/merci', '/mentions-legales', '/404',
  '/en/', '/en/method', '/en/work', '/en/work/chargeair', '/en/work/pilpoil', '/en/work/teamago', '/en/experience', '/en/contact', '/en/thank-you', '/en/legal-notice', '/en/404',
];
const anglaise = (page) => page.startsWith('/en/');
const PAGES = process.argv.slice(2).length ? process.argv.slice(2) : TOUTES;
const LARGEURS = [320, 375, 390, 768, 1024, 1440];
const LARGEURS_TEXTE = [390, 1440];

const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
  '--headless=new', '--remote-debugging-port=9333', '--no-first-run', '--hide-scrollbars',
  `--user-data-dir=${mkdtempSync(join(tmpdir(), 'verif-'))}`, 'about:blank',
], { stdio: 'ignore' });
const attendre = (ms) => new Promise((r) => setTimeout(r, ms));
let cible;
for (let i = 0; i < 40 && !cible; i++) {
  await attendre(250);
  try { cible = (await (await fetch('http://127.0.0.1:9333/json')).json()).find((t) => t.type === 'page'); } catch {}
}
const ws = new WebSocket(cible.webSocketDebuggerUrl);
await new Promise((r) => ws.addEventListener('open', r, { once: true }));
let id = 0;
const attente = new Map();
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && attente.has(m.id)) { attente.get(m.id)(m.result ?? m.error); attente.delete(m.id); }
});
const envoi = (method, params = {}) => new Promise((r) => { const n = ++id; attente.set(n, r); ws.send(JSON.stringify({ id: n, method, params })); });
const ev = async (expression) => (await envoi('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true })).result?.value;
const largeur = (w) => envoi('Emulation.setDeviceMetricsOverride', { width: w, height: 900, deviceScaleFactor: 1, mobile: w < 700 });
const aller = async (chemin) => {
  await envoi('Page.navigate', { url: RACINE + chemin });
  const objectif = new URL(RACINE + chemin).pathname;
  // Une machine chargée (autres processus Chrome en parallèle) peut mettre plus de 1500 ms à naviguer :
  // on attend que l'URL et le chargement soient effectifs plutôt qu'un délai fixe, avec un filet de sécurité.
  for (let i = 0; i < 60; i++) {
    const [ici, pret] = await Promise.all([ev('location.pathname'), ev('document.readyState')]);
    if (ici === objectif && pret === 'complete') break;
    await attendre(200);
  }
  await attendre(300);
};

let echecs = 0;
const verdict = (ok, message) => { if (!ok) echecs++; console.log(`${ok ? '✓' : '✗'} ${message}`); };

// Mot isolé : dans chaque segment d'un bloc (un <br> ou un enfant en display:block ouvre un segment),
// dernière ligne à 1 mot, ou à 2 mots et moins de la moitié de la plus longue ligne du segment.
const MOTS_ISOLES = `(() => {
  const r = document.createRange(), fautes = [];
  document.querySelectorAll('p, h1, h2, h3, li, dd, blockquote, .liv').forEach((el) => {
    if (el.closest('[aria-hidden="true"], .iphone, .chip, .puces') || el.querySelector('p, li, h1, h2, h3, ul, ol, div')) return;
    if (!el.offsetParent) return;
    const segments = [[]];
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    while (w.nextNode()) {
      const n = w.currentNode;
      if (n.nodeType === 1) {
        if (n.tagName === 'BR' || getComputedStyle(n).display === 'block') segments.push([]);
        continue;
      }
      const re = /[^\\s\\u00a0\\u202f]+/g; let m;
      while ((m = re.exec(n.nodeValue))) {
        r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        const b = r.getClientRects()[0];
        if (b && /[\\p{L}\\d]/u.test(m[0])) segments.at(-1).push({ y: Math.round(b.top / 6), g: b.left, d: b.right });
      }
    }
    for (const mots of segments) {
      const lignes = [...new Set(mots.map((m) => m.y))];
      // Un titre de deux mots sur deux lignes n'est pas un mot isolé.
      if (lignes.length < 2 || mots.length < 3) continue;
      const largeurLigne = (y) => { const l = mots.filter((m) => m.y === y); return Math.max(...l.map((m) => m.d)) - Math.min(...l.map((m) => m.g)); };
      const derniere = mots.filter((m) => m.y === lignes.at(-1));
      const ratio = largeurLigne(lignes.at(-1)) / Math.max(...lignes.map(largeurLigne));
      if (derniere.length === 1 || (derniere.length === 2 && ratio < 0.5)) { fautes.push(el.textContent.trim().replace(/\\s+/g, ' ').slice(-50)); break; }
    }
  });
  return fautes;
})()`;

// Titre ajusté (data-ajuste) : chaque segment (entre <br> ou groupe en bloc) tient sur une seule ligne.
const TITRE_AJUSTE = `(() => {
  const h = document.querySelector('h1[data-ajuste]'); if (!h) return [];
  const r = document.createRange(), segments = [[]], fautes = [];
  const w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
  while (w.nextNode()) {
    const n = w.currentNode;
    if (n.nodeType === 1) { if (n.tagName === 'BR' || getComputedStyle(n).display === 'block') segments.push([]); continue; }
    if (!n.nodeValue.trim()) continue;
    r.selectNodeContents(n);
    // Deux lignes d'un titre sont séparées de toute une hauteur de ligne : un seau de 20 px absorbe les écarts de graisse.
    for (const b of r.getClientRects()) segments.at(-1).push(Math.round(b.top / 20));
  }
  segments.filter((s) => new Set(s).size > 1).forEach(() => fautes.push(h.textContent.trim()));
  return fautes;
})()`;

for (const page of PAGES) {
  for (const w of LARGEURS) {
    await largeur(w); await aller(page);
    const trop = await ev('document.documentElement.scrollWidth - document.documentElement.clientWidth');
    verdict(trop <= 0, `${page} @${w}px : pas de défilement horizontal${trop > 0 ? ` (dépasse de ${trop}px)` : ''}`);
    if (LARGEURS_TEXTE.includes(w)) {
      const fautes = await ev(MOTS_ISOLES);
      verdict(fautes.length === 0, `${page} @${w}px : aucun mot isolé${fautes.length ? ' → ' + fautes.map((f) => `« …${f} »`).join(' ; ') : ''}`);
    }
    const coupes = await ev(TITRE_AJUSTE);
    verdict(coupes.length === 0, `${page} @${w}px : titre sans coupure imprévue${coupes.length ? ' → ' + coupes[0] : ''}`);
  }
  await largeur(1440); await aller(page);
  const liens = await ev(`[...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => h.startsWith('/'))`);
  const morts = [];
  for (const h of new Set(liens)) {
    const s = await ev(`fetch(${JSON.stringify(h)}).then((r) => r.status)`);
    if (s !== 200) morts.push(`${h} (${s})`);
  }
  verdict(morts.length === 0, `${page} : liens internes${morts.length ? ' morts → ' + morts.join(', ') : ''}`);
  const logo = await ev(`document.querySelector('.entete .logo')?.getAttribute('href')`);
  const attendu = anglaise(page) ? ['/vitrine/en/'] : ['/vitrine', '/vitrine/'];
  verdict(attendu.includes(logo), `${page} : le logo mène à l'accueil de sa langue (${logo})`);
  const langue = await ev(`document.documentElement.lang`);
  const autreLangue = langue === 'fr' ? 'en' : 'fr';
  const cibleEntete = await ev(`document.querySelector('.entete .langues a[hreflang="${autreLangue}"]')?.getAttribute('href')`);
  const ciblePied = await ev(`document.querySelector('.pied .langues-pied a[hreflang="${autreLangue}"]')?.getAttribute('href')`);
  const alternative = await ev(`document.querySelector('link[rel=alternate][hreflang="${autreLangue}"]')?.getAttribute('href') ?? null`);
  const statut = cibleEntete ? await ev(`fetch(${JSON.stringify(cibleEntete)}).then((r) => r.status)`) : 0;
  const coherent = cibleEntete === ciblePied && (alternative === null || new URL(alternative).pathname === cibleEntete);
  verdict(langue === (anglaise(page) ? 'en' : 'fr') && statut === 200 && coherent, `${page} : sélecteur vers ${cibleEntete} (${statut})`);
}

// Interactions propres à certaines pages, indépendantes de la langue.
await largeur(1440);
for (const [methode, experience, contact, mentions, accueil] of [['/methode', '/experience', '/contact', '/mentions-legales', '/'], ['/en/method', '/en/experience', '/en/contact', '/en/legal-notice', '/en/']]) {
  if (PAGES.includes(methode)) {
    await aller(methode);
    const ancre = await ev(`document.querySelectorAll('a.marche')[2].hash`);
    await ev(`document.querySelectorAll('a.marche')[2].click()`); await attendre(1200);
    const haut = await ev(`Math.round(document.querySelector(${JSON.stringify(ancre)}).getBoundingClientRect().top)`);
    verdict(haut >= 0 && haut < 120, `${methode} : la troisième marche amène à son étape (${haut}px)`);
  }
  if (PAGES.includes(experience)) {
    await aller(experience);
    const ferme = await ev(`!document.querySelectorAll('details.terrain')[1].open`);
    await ev(`document.querySelectorAll('details.terrain summary')[1].click()`);
    const ouvert = await ev(`document.querySelectorAll('details.terrain')[1].open`);
    verdict(ferme && ouvert, `${experience} : un terrain se déplie au clic`);
  }
  if (PAGES.includes(contact)) {
    await aller(contact);
    await ev(`document.querySelector('input[name=nom]').focus()`);
    await envoi('Input.insertText', { text: 'Camille Martin' });
    const nom = await ev(`document.querySelector('input[name=nom]').value`);
    await ev(`document.querySelector('input[name=profil][data-profil=particulier]').click()`);
    const cache = await ev(`getComputedStyle(document.getElementById('bloc-organisation')).display === 'none'`);
    const piege = await ev(`document.querySelector('input[name=botcheck]').hidden`);
    verdict(nom === 'Camille Martin' && cache && piege, `${contact} : saisie, bascule particulier, champ anti-spam masqué`);
  }
  if (PAGES.includes(mentions)) {
    await aller(mentions);
    const derniere = await ev(`[...document.querySelectorAll('.sommaire a')].at(-1).hash`);
    await ev(`[...document.querySelectorAll('.sommaire a')].at(-1).click()`); await attendre(1200);
    const actif = await ev(`document.querySelector('.sommaire a.actif')?.hash`);
    verdict(actif === derniere, `${mentions} : le sommaire surligne la section atteinte (${actif})`);
  }
  if (PAGES.includes(accueil)) {
    await largeur(390); await aller(accueil);
    await ev(`document.querySelector('.menu-mobile summary').click()`);
    const menu = await ev(`getComputedStyle(document.querySelector('.menu-mobile ul')).display !== 'none'`);
    await ev(`document.querySelector('.menu-mobile summary').click(); document.querySelector('.langues summary').click()`);
    const langues = await ev(`(() => { const b = document.querySelector('.langues ul').getBoundingClientRect(); return b.width > 0 && b.left >= 0 && b.right <= innerWidth; })()`);
    verdict(menu && langues, `${accueil} @390px : menu mobile et mappemonde s’ouvrent dans l’écran`);
    await largeur(1440);
  }
}

ws.close();
chrome.kill();
console.log(echecs ? `\n${echecs} échec(s)` : '\nTout est vert.');
process.exit(echecs ? 1 : 0);
