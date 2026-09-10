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
const TOUTES = ['/', '/methode', '/realisations', '/realisations/chargeair', '/realisations/pilpoil', '/realisations/teamago', '/experience', '/contact', '/merci', '/mentions-legales', '/404'];
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
const aller = async (chemin) => { await envoi('Page.navigate', { url: RACINE + chemin }); await attendre(1500); };

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

for (const page of PAGES) {
  for (const w of LARGEURS) {
    await largeur(w); await aller(page);
    const trop = await ev('document.documentElement.scrollWidth - document.documentElement.clientWidth');
    verdict(trop <= 0, `${page} @${w}px : pas de défilement horizontal${trop > 0 ? ` (dépasse de ${trop}px)` : ''}`);
    if (LARGEURS_TEXTE.includes(w)) {
      const fautes = await ev(MOTS_ISOLES);
      verdict(fautes.length === 0, `${page} @${w}px : aucun mot isolé${fautes.length ? ' → ' + fautes.map((f) => `« …${f} »`).join(' ; ') : ''}`);
    }
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
  verdict(logo === '/vitrine' || logo === '/vitrine/', `${page} : le logo mène à l'accueil (${logo})`);
}

// Interactions propres à certaines pages.
await largeur(1440);
if (PAGES.includes('/methode')) {
  await aller('/methode');
  await ev(`document.querySelector('a.marche[href="#valider"]').click()`); await attendre(1200);
  const haut = await ev(`Math.round(document.getElementById('valider').getBoundingClientRect().top)`);
  verdict(haut >= 0 && haut < 120, `/methode : la marche « Valider » amène à l'étape (${haut}px)`);
}
if (PAGES.includes('/experience')) {
  await aller('/experience');
  const ferme = await ev(`!document.querySelectorAll('details.terrain')[1].open`);
  await ev(`document.querySelectorAll('details.terrain summary')[1].click()`);
  const ouvert = await ev(`document.querySelectorAll('details.terrain')[1].open`);
  verdict(ferme && ouvert, '/experience : un terrain se déplie au clic');
}
if (PAGES.includes('/contact')) {
  await aller('/contact');
  await ev(`document.querySelector('input[name=nom]').focus()`);
  await envoi('Input.insertText', { text: 'Camille Martin' });
  const nom = await ev(`document.querySelector('input[name=nom]').value`);
  await ev(`document.querySelector('input[name=profil][value="Un particulier"]').click()`);
  const cache = await ev(`getComputedStyle(document.getElementById('bloc-organisation')).display === 'none'`);
  const piege = await ev(`document.querySelector('input[name=botcheck]').hidden`);
  verdict(nom === 'Camille Martin' && cache && piege, '/contact : saisie, bascule particulier, champ anti-spam masqué');
}
if (PAGES.includes('/mentions-legales')) {
  await aller('/mentions-legales');
  await ev(`document.querySelector('.sommaire a[href="#cookies"]').click()`); await attendre(1200);
  const actif = await ev(`document.querySelector('.sommaire a.actif')?.hash`);
  verdict(actif === '#cookies', `/mentions-legales : le sommaire surligne la section atteinte (${actif})`);
}
if (PAGES.includes('/')) {
  await largeur(390); await aller('/');
  await ev(`document.querySelector('.menu-mobile summary').click()`);
  const visible = await ev(`getComputedStyle(document.querySelector('.menu-mobile ul')).display !== 'none'`);
  verdict(visible, '/ @390px : le menu mobile s’ouvre');
}

ws.close();
chrome.kill();
console.log(echecs ? `\n${echecs} échec(s)` : '\nTout est vert.');
process.exit(echecs ? 1 : 0);
