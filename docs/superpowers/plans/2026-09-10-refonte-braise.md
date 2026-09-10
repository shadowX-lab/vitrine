# Refonte « Braise » — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** transformer le site Astro de Moamind Solutions selon la direction « Braise » validée sur maquettes, avec les nouveaux textes, en restant statique, rapide et accessible.

**Architecture:** un système de design en jetons CSS (`src/styles/global.css`) et une poignée de composants Astro (bandeau en biais, iPhone 3D, cartes, appel final) composent les onze pages. La typographie française (mots liés, espaces insécables, ponctuation des grands titres) est appliquée au HTML rendu par un middleware Astro, donc sans JavaScript client. Un script Chrome headless vérifie débordements, mots isolés, liens et interactions sur le build.

**Tech Stack:** Astro 5.18, TypeScript strict, CSS natif, `@fontsource-variable/plus-jakarta-sans` + `@fontsource-variable/geist`, `astro:assets` (sharp), `node:test` (Node 24, types retirés nativement), Chrome headless via le protocole DevTools.

**Spec:** `docs/superpowers/specs/2026-09-10-refonte-braise-design.md`
**Maquettes de référence (source exacte du HTML/CSS) :** `.superpowers/brainstorm/34998-1789049536/content/` — `braise.css`, `accueil.html`, `methode.html`, `realisations.html`, `etude-pilpoil.html` (+ `etude-chargeair.html`, `etude-teamago.html`), `experience.html`, `contact.html`, `merci.html`, `404.html`, `mentions-legales.html`.

## Global Constraints

- Site statique Astro sous `base: '/vitrine'` ; tout lien interne passe par `lien()` de `src/config.ts`.
- Aucun JavaScript client sauf : formulaire de contact (bascule particulier/professionnel, état « Envoi… ») et surlignage du sommaire des mentions légales. Les terrains dépliables et le menu mobile utilisent `<details>`.
- Couleurs : `--f1 #6E2213`, `--f2 #C24A26`, `--f3 #F08A45`, `--encre #15121F`, `--encre-2 #4B4453`, `--gris #6E6674`, `--trait #EDE6E1`, `--creme #FBF6F2`, `--voile #FBEDE6`, `--voile2 #FFF1E3`.
- Polices : Plus Jakarta Sans (titres 800, seconde ligne des grands titres 400), Geist (petits éléments d'interface). Newsreader retirée.
- Aucune ligne dont le dernier mot est seul, ni de fin de paragraphe à un ou deux mots courts (vérifié à 390 et 1440 px).
- Voix : aucune première personne du studio sur Accueil, Réalisations, études de cas, Contact, Message reçu ; « nous » jamais employé. Méthode et Expérience gardent leur « je ». Les réalisations ne sont jamais présentées comme projets personnels ou « produits maison ».
- Aucune personne réelle sur les écrans : anonymisation Teamago (9 personnes, « Les Cabots » → « Les Hérons »).
- Sur l'accueil, aucun nom d'application ; écrans interdits sur l'accueil : `chargeair/Main`, `chargeair/Reservation`, `pilpoil/Main`, `pilpoil/Profil`.
- Pas de défilement horizontal à 320, 375, 390, 768, 1024, 1440 px.
- Textes : ceux des maquettes, mot pour mot.
- Commits sur la branche `refonte-braise`, messages en français, terminés par les lignes d'attribution de la session.

---

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `src/lib/typo.ts` (créé) | Règles typographiques sur texte et sur HTML |
| `src/middleware.ts` (créé) | Applique `typographierHtml` à chaque page rendue |
| `tests/typo.test.mjs` (créé) | Tests de `typo.ts` |
| `scripts/anonymiser.mjs` (créé) | Remplacement des personnes réelles et du club |
| `tests/anonymiser.test.mjs` (créé) | Tests de l'anonymisation |
| `scripts/render-ecrans.mjs` (modifié) | Anonymise Teamago, accepte un filtre de projet |
| `scripts/verifier-site.mjs` (créé) | Contrôles Chrome headless sur le build |
| `src/lib/ecrans.ts` (créé) | `ecran(projet, fichier)` : résolution des PNG (sort de `produits.ts`) |
| `src/data/produits.ts` (réécrit) | Données pures des trois produits, sans `import.meta` |
| `tests/produits.test.mjs` (créé) | Cohérence et règles de contenu des données |
| `src/styles/global.css` (réécrit) | Jetons, socle, utilitaires |
| `src/layouts/Base.astro` (modifié) | Polices préchargées, `og:image`, en-tête superposé |
| `src/components/Entete.astro` (réécrit) | Navigation sur le bandeau, menu mobile |
| `src/components/PiedDePage.astro` (réécrit) | Pied sombre, nouvelle phrase |
| `src/components/Bande.astro` (créé) | Bandeau en biais |
| `src/components/Iphone3D.astro` (créé, remplace `Telephone.astro`) | iPhone 3D |
| `src/components/CarteFlottante.astro` (créé) | Carte d'interface flottante |
| `src/components/Chiffres.astro` (créé) | Trois cartes de chiffres |
| `src/components/AppelFinal.astro` (créé, remplace `AppelAction.astro`) | Appel final en biais |
| `src/components/Icone.astro` (créé) | Icônes au trait des bénéfices et services |
| `src/pages/*.astro`, `src/pages/realisations/*.astro` (réécrits) | Les onze pages |
| `public/og.png` (créé) | Image de partage |
| `context/CONTEXT-MOAMIND.md`, `README.md`, `.gitignore` (modifiés) | Documentation et hygiène |

---

### Task 0: Branche de travail

**Files:** aucun fichier modifié.

Le dépôt a 26 modifications non commitées (renommage Cadran → Moamind, travail antérieur). Elles sont la base de la refonte : on les commite telles quelles sur une nouvelle branche avant de commencer. **À faire seulement avec l'accord de l'utilisateur.**

- [ ] **Step 1: Créer la branche et commiter l'état de départ**

```bash
git switch -c refonte-braise
printf '\n.superpowers/\n' >> .gitignore
git add -A
git commit -m "État de départ de la refonte : site Moamind, direction éditoriale"
```

- [ ] **Step 2: Vérifier**

Run: `git status --short | wc -l && git log --oneline -1`
Expected: `0` puis le commit « État de départ… ». `.superpowers/` n'apparaît pas dans le commit (`git show --stat HEAD | grep -c superpowers` → `0`).

---

### Task 1: Typographie française au rendu

**Files:**
- Create: `src/lib/typo.ts`, `src/middleware.ts`, `tests/typo.test.mjs`
- Modify: `package.json` (script `test`)

**Interfaces:**
- Produces: `NBSP`, `FINE`, `lierFin(texte: string): string`, `ponctuationFrancaise(texte: string): string`, `typographierHtml(html: string): string` ; classe CSS `.ponct` (définie en Task 4).

- [ ] **Step 1: Écrire les tests**

`tests/typo.test.mjs` :

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lierFin, ponctuationFrancaise, typographierHtml, NBSP, FINE } from '../src/lib/typo.ts';

test('lierFin lie les trois derniers mots d’un texte d’au moins six mots', () => {
  assert.equal(lierFin('La suivante commence seulement après votre accord.'), `La suivante commence seulement après${NBSP}votre${NBSP}accord.`);
});

test('lierFin laisse intacts les textes de moins de six mots', () => {
  assert.equal(lierFin('Cette page n’existe pas'), 'Cette page n’existe pas');
});

test('lierFin est idempotent', () => {
  const une = lierFin('On commence toujours par écouter votre métier avant tout.');
  assert.equal(lierFin(une), une);
});

test('ponctuationFrancaise insère les espaces insécables', () => {
  assert.equal(ponctuationFrancaise('« Ça boucle » : oui ? non !'), `«${NBSP}Ça boucle${NBSP}»${NBSP}: oui${FINE}? non${FINE}!`);
});

test('typographierHtml lie la fin d’un paragraphe à travers les balises en ligne', () => {
  const html = '<p>Rien ne se construit qui <strong>n’ait été validé par vous.</strong></p>';
  assert.equal(typographierHtml(html), `<p>Rien ne se construit qui <strong>n’ait été validé${NBSP}par${NBSP}vous.</strong></p>`);
});

test('typographierHtml remplace une suite d’espaces et de retours à la ligne par une seule insécable', () => {
  const html = '<p>Les écrans sont dessinés, vous les\n        corrigez, et rien ne se construit.</p>';
  assert.equal(typographierHtml(html), `<p>Les écrans sont dessinés, vous les\n        corrigez, et rien ne se${NBSP}construit.</p>`.replace(`ne se${NBSP}`, `ne${NBSP}se${NBSP}`));
});

test('typographierHtml ignore les blocs qui contiennent d’autres blocs', () => {
  const html = '<li><h3>Opérateur cloud européen</h3><ul><li>Passage à l’échelle</li></ul></li>';
  assert.equal(typographierHtml(html), html);
});

test('typographierHtml ne touche ni scripts, ni styles, ni attributs', () => {
  const html = '<script>const a = "x : y ?";</script><style>a:hover{}</style><img alt="a : b ?">';
  assert.equal(typographierHtml(html), html);
});

test('typographierHtml resserre virgule et point des h1/h2, pas des décimales', () => {
  assert.equal(typographierHtml('<h1>Ça donne, et pourquoi</h1>'), '<h1>Ça donne<span class="ponct">,</span> et pourquoi</h1>');
  assert.equal(typographierHtml('<h2>0,00 €</h2>'), '<h2>0,00 €</h2>');
  assert.equal(typographierHtml('<h3>Fin.</h3>'), '<h3>Fin.</h3>');
});

test('typographierHtml traite les entités &nbsp; comme des espaces déjà liées', () => {
  const html = '<p>Un deux trois quatre cinq six&nbsp;sept huit</p>';
  assert.equal(typographierHtml(html), `<p>Un deux trois quatre cinq six&nbsp;sept${NBSP}huit</p>`);
});
```

- [ ] **Step 2: Ajouter le script de test et vérifier l'échec**

Dans `package.json`, `scripts` : `"test": "node --test \"tests/*.test.mjs\""`.

Run: `npm test`
Expected: FAIL (`Cannot find module '../src/lib/typo.ts'`).

- [ ] **Step 3: Implémenter `src/lib/typo.ts`**

```ts
/**
 * Typographie française appliquée au HTML rendu (voir src/middleware.ts).
 * 1. Les trois derniers mots d'un bloc d'au moins six mots restent ensemble.
 * 2. Espaces insécables autour de « », avant : ; fine insécable avant ; ! ?
 * 3. Dans les h1 et h2, virgule et point sont resserrés contre la lettre.
 */
export const NBSP = '\u00a0';
export const FINE = '\u202f';

const MOTS_MIN = 6;
/** Une séparation entre deux mots : suite d'espaces, retours à la ligne, insécables ou `&nbsp;`. */
const SEPARATION = /(?:[ \t\n\r\u00a0\u202f]|&nbsp;)+/g;
/** Une séparation déjà insécable ne contient aucune espace ordinaire ni retour à la ligne. */
const DEJA_LIEE = /^(?:[\u00a0\u202f]|&nbsp;)+$/;

function compterMots(texte: string): number {
  return texte.replace(/&nbsp;/g, ' ').split(/[\s\u00a0\u202f]+/).filter(Boolean).length;
}

/**
 * Lie les `restant` dernières séparations du texte réparti dans `morceaux`
 * (les nœuds texte d'un bloc, dans l'ordre). Les espaces finales sont ignorées ;
 * une séparation déjà insécable compte comme liée, ce qui rend l'opération idempotente.
 */
function lierMorceaux(morceaux: string[], restant = 2): string[] {
  const sortie = [...morceaux];
  let finAtteinte = false;
  for (let i = sortie.length - 1; i >= 0 && restant > 0; i--) {
    let s = sortie[i]!;
    let limite = s.length;
    if (!finAtteinte) {
      limite = s.replace(/[\s\u00a0\u202f]+$/, '').length;
      if (limite === 0) continue;
      finAtteinte = true;
    }
    const separations = [...s.slice(0, limite).matchAll(SEPARATION)];
    for (let k = separations.length - 1; k >= 0 && restant > 0; k--) {
      const sep = separations[k]!;
      if (!DEJA_LIEE.test(sep[0])) s = s.slice(0, sep.index) + NBSP + s.slice(sep.index! + sep[0].length);
      restant--;
    }
    sortie[i] = s;
  }
  return sortie;
}

export function lierFin(texte: string): string {
  if (compterMots(texte) < MOTS_MIN) return texte;
  return lierMorceaux([texte])[0]!;
}

export function ponctuationFrancaise(texte: string): string {
  return texte
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/ :/g, `${NBSP}:`)
    .replace(/ ([;!?])/g, `${FINE}$1`);
}

const IGNORES = new Set(['script', 'style', 'textarea', 'pre', 'code', 'svg']);
const BLOCS_LIES = new Set(['p', 'h1', 'h2', 'h3', 'li', 'dd', 'small', 'figcaption', 'blockquote']);
const BLOCS = new Set([...BLOCS_LIES, 'div', 'ul', 'ol', 'section', 'article', 'details', 'summary', 'h4', 'h5', 'h6', 'table', 'form', 'fieldset', 'nav', 'header', 'footer', 'main']);
const VIDES = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'track']);
const TITRES_RESSERRES = new Set(['h1', 'h2']);

type Ouvert = { nom: string; debut: number; aUnBloc: boolean };

export function typographierHtml(html: string): string {
  const jetons = html.split(/(<[^>]+>)/);
  const pile: Ouvert[] = [];
  let ignore = 0;

  jetons.forEach((jeton, i) => {
    if (jeton.startsWith('<')) {
      const m = jeton.match(/^<\s*(\/)?\s*([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!m) return;
      const fermeture = Boolean(m[1]);
      const nom = m[2]!.toLowerCase();
      const vide = VIDES.has(nom) || jeton.endsWith('/>');
      if (IGNORES.has(nom)) {
        if (!vide) ignore += fermeture ? -1 : 1;
        return;
      }
      if (vide || ignore > 0) return;
      if (!fermeture) {
        if (BLOCS.has(nom)) pile.forEach((o) => { o.aUnBloc = true; });
        pile.push({ nom, debut: i, aUnBloc: false });
        return;
      }
      for (let k = pile.length - 1; k >= 0; k--) {
        if (pile[k]!.nom !== nom) continue;
        const ouvert = pile.splice(k)[0]!;
        if (BLOCS_LIES.has(nom) && !ouvert.aUnBloc) {
          const indices: number[] = [];
          for (let t = ouvert.debut + 1; t < i; t++) if (!jetons[t]!.startsWith('<')) indices.push(t);
          if (compterMots(indices.map((t) => jetons[t]).join('')) >= MOTS_MIN) {
            const lies = lierMorceaux(indices.map((t) => jetons[t]!));
            indices.forEach((t, n) => { jetons[t] = lies[n]!; });
          }
        }
        break;
      }
      return;
    }
    if (ignore > 0 || !jeton) return;
    let texte = ponctuationFrancaise(jeton);
    if (pile.some((o) => TITRES_RESSERRES.has(o.nom))) {
      texte = texte.replace(/(?<=[\p{L}\d])([.,])(?!\d)/gu, '<span class="ponct">$1</span>');
    }
    jetons[i] = texte;
  });
  return jetons.join('');
}
```

Correction faite à l'exécution : la ponctuation des titres est d'abord marquée par des caractères à usage privé (`\ue000`, `\ue001`), remplacés par `<span class="ponct">` en toute fin ; sinon la liaison des mots remplaçait l'espace de `<span class=…>`. Le fichier `src/lib/typo.ts` fait foi.

- [ ] **Step 4: Lancer les tests**

Run: `npm test`
Expected: PASS (10 tests).

- [ ] **Step 5: Middleware**

`src/middleware.ts` :

```ts
import { defineMiddleware } from 'astro:middleware';
import { typographierHtml } from './lib/typo';

/** Typographie française sur chaque page HTML, au build comme en développement. */
export const onRequest = defineMiddleware(async (_, next) => {
  const reponse = await next();
  const type = reponse.headers.get('content-type') ?? '';
  const html = await reponse.text();
  if (!type.includes('text/html') && !/^\s*<!doctype html/i.test(html)) {
    return new Response(html, reponse);
  }
  return new Response(typographierHtml(html), { status: reponse.status, headers: reponse.headers });
});
```

- [ ] **Step 6: Vérifier sur le build**

Run: `npm run build && grep -c $'\xc2\xa0' dist/methode/index.html`
Expected: build sans erreur ; un nombre > 0 d'espaces insécables dans la page.

- [ ] **Step 7: Commit**

```bash
git add src/lib/typo.ts src/middleware.ts tests/typo.test.mjs package.json
git commit -m "Typographie française appliquée au rendu : mots liés, espaces insécables, ponctuation des titres"
```

---

### Task 2: Script de vérification du site

**Files:**
- Create: `scripts/verifier-site.mjs`
- Modify: `package.json` (script `verifier`)

**Interfaces:**
- Produces: `npm run verifier -- [pages…]` ; contrôle le serveur `npm run preview` (http://localhost:4321/vitrine). Sort en code 1 au moindre échec. Pages par défaut : les onze.

- [ ] **Step 1: Écrire le script**

`scripts/verifier-site.mjs` :

```js
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

// Mot isolé : dernière ligne à 1 mot, ou à 2 mots et moins de la moitié de la plus longue ligne.
const MOTS_ISOLES = `(() => {
  const r = document.createRange(), fautes = [];
  document.querySelectorAll('p, h1, h2, h3, li, dd, blockquote, .liv').forEach((el) => {
    if (el.closest('[aria-hidden="true"], .iphone, .chip, .puces') || el.querySelector('p, li, h1, h2, h3, ul, ol, div')) return;
    if (!el.offsetParent) return;
    const mots = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    while (w.nextNode()) {
      const n = w.currentNode, re = /[^\\s\\u00a0\\u202f]+/g; let m;
      while ((m = re.exec(n.nodeValue))) {
        r.setStart(n, m.index); r.setEnd(n, m.index + m[0].length);
        const b = r.getClientRects()[0];
        if (b && /[\\p{L}\\d]/u.test(m[0])) mots.push({ y: Math.round(b.top / 6), g: b.left, d: b.right });
      }
    }
    const lignes = [...new Set(mots.map((m) => m.y))];
    if (lignes.length < 2) return;
    const largeurLigne = (y) => { const l = mots.filter((m) => m.y === y); return Math.max(...l.map((m) => m.d)) - Math.min(...l.map((m) => m.g)); };
    const derniere = mots.filter((m) => m.y === lignes.at(-1));
    const ratio = largeurLigne(lignes.at(-1)) / Math.max(...lignes.map(largeurLigne));
    if (derniere.length === 1 || (derniere.length === 2 && ratio < 0.5)) fautes.push(el.textContent.trim().replace(/\\s+/g, ' ').slice(-50));
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
```

- [ ] **Step 2: Script npm**

`package.json`, `scripts` : `"verifier": "node scripts/verifier-site.mjs"`.

- [ ] **Step 3: Constater l'état actuel (le script doit détecter le défaut connu)**

Run (terminal 1) : `npm run build && npm run preview` ; (terminal 2) : `npm run verifier -- /`
Expected: au moins un ✗ « / @320px : pas de défilement horizontal (dépasse de 49px) » (défaut de l'en-tête relevé à l'audit) et le ✗ du menu mobile, qui n'existe pas encore. Le script fonctionne s'il signale ces échecs.

- [ ] **Step 4: Commit**

```bash
git add scripts/verifier-site.mjs package.json
git commit -m "Script de vérification Chrome : débordements, mots isolés, liens, interactions"
```

---

### Task 3: Écrans Teamago anonymisés

**Files:**
- Create: `scripts/anonymiser.mjs`, `tests/anonymiser.test.mjs`
- Modify: `scripts/render-ecrans.mjs`
- Regenerate: `src/assets/ecrans/teamago/*.png`

**Interfaces:**
- Produces: `anonymiser(html: string): string`, `PERSONNES`, `CLUB` ; `npm run ecrans -- teamago` ne rend que Teamago.

- [ ] **Step 1: Tests**

`tests/anonymiser.test.mjs` :

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { anonymiser, PERSONNES } from '../scripts/anonymiser.mjs';

test('remplace nom complet, initiales, prénom seul et e-mail', () => {
  const html = '<b>Defer Xavier</b><span>DX</span><p>Xavier — trésorier</p><i>hugo.barret@example.fr</i><p>Bonjour Hugo,</p>';
  assert.equal(anonymiser(html), '<b>Martin Julien</b><span>MJ</span><p>Julien — trésorier</p><i>louis.fontaine@example.fr</i><p>Bonjour Louis,</p>');
});

test('remplace le club', () => {
  assert.equal(anonymiser('<p>Association Les Cabots</p>'), '<p>Association Les Hérons</p>');
});

test('ne laisse aucune des neuf personnes', () => {
  const tout = PERSONNES.map(([n, p]) => `${n} ${p} ${p}`).join(' | ');
  const sortie = anonymiser(tout);
  for (const [n, p] of PERSONNES) {
    assert.ok(!new RegExp(`\\b(${n}|${p})\\b`).test(sortie), `${n} ${p} subsiste`);
  }
});

test('ne touche pas aux initiales hors pastille', () => {
  assert.equal(anonymiser('<p>LA ROCHELLE</p>'), '<p>LA ROCHELLE</p>');
});
```

- [ ] **Step 2: Vérifier l'échec**

Run: `npm test`
Expected: FAIL (`Cannot find module '../scripts/anonymiser.mjs'`).

- [ ] **Step 3: Implémenter**

`scripts/anonymiser.mjs` :

```js
/**
 * Les maquettes Teamago reprennent un vrai fichier de club : on remplace, au rendu
 * seulement, les personnes et le club par des équivalents fictifs.
 * Ordre de l'application : nom puis prénom.
 */
export const PERSONNES = [
  ['Pont', 'Alexis', 'Petit', 'Lucas'],
  ['Barbion', 'William', 'Bernard', 'Nathan'],
  ['Chambre', 'Samuel', 'Moreau', 'Théo'],
  ['Chambre', 'Véronique', 'Moreau', 'Claire'],
  ['Roque', 'Olivier', 'Girard', 'Enzo'],
  ['Defer', 'Xavier', 'Martin', 'Julien'],
  ['Barret', 'Hugo', 'Fontaine', 'Louis'],
  ['Michaely', 'Gabriel', 'Rousseau', 'Adam'],
  ['Lachartre', 'Aymeric', 'Garnier', 'Paul'],
];
export const CLUB = ['Les Cabots', 'Les Hérons'];

export function anonymiser(html) {
  let sortie = html.replaceAll(CLUB[0], CLUB[1]);
  for (const [nom, prenom, nouveauNom, nouveauPrenom] of PERSONNES) {
    sortie = sortie
      .replaceAll(`${nom} ${prenom}`, `${nouveauNom} ${nouveauPrenom}`)
      .replaceAll(`>${nom[0]}${prenom[0]}<`, `>${nouveauNom[0]}${nouveauPrenom[0]}<`)
      .replaceAll(`${prenom.toLowerCase()}.${nom.toLowerCase()}@`, `${nouveauPrenom.toLowerCase()}.${nouveauNom.toLowerCase()}@`)
      .replace(new RegExp(`\\b${prenom}\\b`, 'g'), nouveauPrenom);
  }
  return sortie;
}
```

- [ ] **Step 4: Tests verts**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Brancher dans `scripts/render-ecrans.mjs`**

Ajouter l'import en tête : `import { anonymiser } from './anonymiser.mjs';`

Remplacer la signature et la première ligne de `documentAutonome` :

```js
function documentAutonome(source, projet) {
  const lu = readFileSync(source, 'utf8');
  const brut = projet === 'teamago' ? anonymiser(lu) : lu;
```

Dans `photographier(source, destination)`, ajouter le paramètre `projet` et passer `documentAutonome(source, projet)`. Dans la boucle, appeler `photographier(join(dossier, artboard.file), destination, projet)`.

Remplacer `for (const [projet, dossier] of Object.entries(SOURCES)) {` par :

```js
const filtre = process.argv.slice(2);
for (const [projet, dossier] of Object.entries(SOURCES)) {
  if (filtre.length && !filtre.includes(projet)) continue;
```

Ajout fait à l'exécution : option Chrome `--blink-settings=preferredColorScheme=1` dans `photographier`, sinon le rendu suit l'apparence du Mac (écrans sombres le soir).

- [ ] **Step 6: Régénérer et contrôler**

Run: `npm run ecrans -- teamago`
Expected: « 14 écrans rendus ».

Contrôle visuel : ouvrir `src/assets/ecrans/teamago/Participants.png` → Petit Lucas, Bernard Nathan, Moreau Théo, Girard Enzo, Martin Julien, Fontaine Louis, Rousseau Adam, Garnier Paul ; pastilles PL, BN, MT, GE, MJ, FL, RA, GP.

- [ ] **Step 7: Commit**

```bash
git add scripts/anonymiser.mjs tests/anonymiser.test.mjs scripts/render-ecrans.mjs src/assets/ecrans/teamago
git commit -m "Écrans Teamago : personnes et club remplacés par des équivalents fictifs au rendu"
```

---

### Task 4: Données produits, polices et socle CSS

**Files:**
- Create: `src/lib/ecrans.ts`, `tests/produits.test.mjs`
- Rewrite: `src/data/produits.ts`, `src/styles/global.css`
- Modify: `package.json` (dépendance `@fontsource-variable/plus-jakarta-sans`, retrait de `@fontsource-variable/newsreader`)

**Interfaces:**
- Produces:
  - `src/lib/ecrans.ts` : `ecran(projet: string, fichier: string): ImageMetadata`
  - `src/data/produits.ts` : `type Icone`, `type Ecran = { projet: string; fichier: string; haut: string; statut?: string }`, `type Etape = { fichier: string; haut: string; statut?: string; titre: string; texte: string; suite?: string }`, `type Benefice = { icone: Icone; titre: string; texte: string }`, `type Produit`, `produits: Produit[]`, `parSlug(slug)`, `eventail: [Ecran, Ecran]` (derrière, devant), `rangee: Ecran[]`
  - classes CSS globales : `.w`, `.sec`, `.creme`, `.sombre`, `.t2`, `.lead`, `.tete`, `.lien`, `.btn`, `.btn--plein`, `.btn--contour`, `.etiq`, `.carte`, `.carte--bord`, `.ico`, `.grille-2`, `.grille-3`, `.pastille`, `.puces`, `.leger`, `.ponct`, `.saut-contenu`, `.invisible`

- [ ] **Step 1: Test des données**

`tests/produits.test.mjs` :

```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { produits, eventail, rangee } from '../src/data/produits.ts';

const HEX = /^#[0-9A-Fa-f]{6}$/;
const INTERDITS_ACCUEIL = ['chargeair/Main', 'chargeair/Reservation', 'pilpoil/Main', 'pilpoil/Profil'];

test('trois produits complets', () => {
  assert.equal(produits.length, 3);
  for (const p of produits) {
    assert.equal(p.benefices.length, 3, p.slug);
    assert.equal(p.parcours.length, 4, p.slug);
    assert.equal(p.parcours.at(-1).suite, undefined, p.slug);
    assert.equal(p.heros.length, 2, p.slug);
    assert.equal(p.chiffres.length, 3, p.slug);
    for (const c of ['p1', 'p2', 'p3', 'accent', 'voile', 'contraste', 'clair', 'fonce']) assert.match(p.palette[c], HEX, `${p.slug}.${c}`);
  }
});

test('les études s’enchaînent en boucle', () => {
  const vus = new Set();
  let p = produits[0];
  for (let i = 0; i < 3; i++) { vus.add(p.slug); p = produits.find((x) => x.slug === p.suivant); }
  assert.equal(vus.size, 3);
  assert.equal(p.slug, produits[0].slug);
});

test('aucun texte ne parle de produit maison, de « je » ni de fonctionnement plutôt que de bénéfice', () => {
  const textes = JSON.stringify(produits);
  for (const motif of [/maison/i, /\bje\b/i, /\bj'/i, /références clients/i, /on vend/i, /par les gens/i]) {
    assert.ok(!motif.test(textes), `motif ${motif} trouvé`);
  }
});

test('l’accueil ne montre aucun écran portant un nom d’application', () => {
  for (const e of [...eventail, ...rangee]) assert.ok(!INTERDITS_ACCUEIL.includes(`${e.projet}/${e.fichier}`), `${e.projet}/${e.fichier}`);
});
```

Run: `npm test` → FAIL (les champs `benefices`, `heros`… n'existent pas).

- [ ] **Step 2: `src/lib/ecrans.ts`**

```ts
import type { ImageMetadata } from 'astro';

const fichiers = import.meta.glob<{ default: ImageMetadata }>('../assets/ecrans/**/*.png', { eager: true });

/** Récupère un écran rendu par `npm run ecrans`. */
export function ecran(projet: string, nom: string): ImageMetadata {
  const cle = `../assets/ecrans/${projet}/${nom}.png`;
  const module = fichiers[cle];
  if (!module) throw new Error(`Écran introuvable : ${cle}`);
  return module.default;
}
```

- [ ] **Step 3: Réécrire `src/data/produits.ts`**

Données pures (aucun `import.meta`, aucun import de valeur) :

```ts
/** Les trois réalisations. Textes validés sur maquettes le 10 septembre 2026. */

export type Icone = 'prix' | 'horloge' | 'feuille' | 'eclair' | 'cloche' | 'coeur' | 'check' | 'calc' | 'suivi';
export type Ecran = { projet: string; fichier: string; haut: string; statut?: string };
export type Etape = { fichier: string; haut: string; statut?: string; titre: string; texte: string; suite?: string };
export type Benefice = { icone: Icone; titre: string; texte: string };

export type Produit = {
  slug: string;
  nom: string;
  baseline: string;
  resume: string;
  domaine: string;
  plateforme: string;
  annee: string;
  depot?: string;
  palette: { p1: string; p2: string; p3: string; accent: string; voile: string; contraste: string; clair: string; fonce: string; lueur: string };
  /** Écrans du bandeau : derrière, puis devant. */
  heros: [Omit<Ecran, 'projet'>, Omit<Ecran, 'projet'>];
  chiffres: { valeur: string; libelle: string }[];
  probleme: string[];
  citation: string;
  parcoursIntro: string;
  parcours: Etape[];
  benefices: Benefice[];
  livre: string[];
  suivant: string;
};

export const produits: Produit[] = [
  {
    slug: 'chargeair',
    nom: 'ChargeAir',
    baseline: 'La recharge électrique entre voisins',
    resume: "Réserver un créneau sur la borne d'un particulier du quartier, quand on roule à l'électrique sans prise chez soi.",
    domaine: 'Mobilité électrique',
    plateforme: 'iOS et Android',
    annee: '2026',
    depot: 'https://github.com/shadowX-lab/ChargeAir',
    palette: { p1: '#4A1B0F', p2: '#8E3A22', p3: '#D9794F', accent: '#AF5236', voile: '#F7E7E0', contraste: '#7A3822', clair: '#FFD9C4', fonce: '#4A1B0F', lueur: 'rgba(255,200,150,.35)' },
    heros: [{ fichier: 'Reservation', haut: '#F7F1EA' }, { fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6' }],
    chiffres: [
      { valeur: '12,40 €', libelle: 'la même charge, contre 21 € sur une borne rapide' },
      { valeur: '3 à 6 h', libelle: "le temps réel d'une charge à domicile : tout part de là" },
      { valeur: 'Aucun', libelle: 'matériel à installer, à scanner ou à coller sur la borne' },
    ],
    probleme: [
      "Vous roulez à l'électrique, vous n'avez pas de prise chez vous, et chaque recharge vous coûte presque le double de ce qu'elle devrait. Pendant ce temps, la borne du voisin de palier dort vingt-deux heures sur vingt-quatre. Entre les deux, il n'y a rien.",
      "Le piège de ce sujet, c'est de le traiter comme une location de courte durée ordinaire : une annonce, un calendrier, un paiement. En creusant, on tombe très vite sur trois murs : le droit de l'électricité, la physique de la charge lente, et l'économie réelle d'un hôte.",
    ],
    citation: 'Aucun des trois ne se voit depuis un cahier des charges. Tous les trois ont changé le produit.',
    parcoursIntro: "De la borne repérée dans le quartier à la voiture rechargée, prix connu d'avance.",
    parcours: [
      { fichier: 'Main', haut: '#F7F1EA', titre: 'Trouver, près de chez soi', texte: "Les bornes du quartier, leur prix à l'heure, et celles qui acceptent votre voiture.", suite: 'On choisit un créneau' },
      { fichier: 'Reservation', haut: '#F7F1EA', titre: 'Réserver, prix connu', texte: "Le total s'affiche avant de confirmer. Il ne changera plus, quoi qu'il arrive ensuite.", suite: 'Le soir venu, on branche' },
      { fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6', titre: 'Charger tranquille', texte: "Le décompte tourne, la fin est annoncée à l'avance. Rien à surveiller.", suite: 'Et on repart' },
      { fichier: 'FinSession', haut: '#F7F1EA', titre: 'Repartir, et revenir', texte: "L'économie réalisée est chiffrée, et le prochain créneau se reprogramme en un geste." },
    ],
    benefices: [
      { icone: 'prix', titre: "Jusqu'à 40 % moins cher qu'une borne rapide", texte: "Une charge chez un voisin coûte 12,40 € là où une borne rapide en demande 21. Le conducteur sans prise chez lui paie enfin le juste prix, et l'hôte rentabilise une borne qui dormait vingt-deux heures sur vingt-quatre." },
      { icone: 'horloge', titre: "Un prix connu d'avance, sans surprise", texte: "Le montant s'affiche au moment de réserver et ne bouge plus. Pas de relevé, pas de compteur, pas de litige : on sait ce qu'on paie avant de brancher, et la fin de charge est annoncée à l'avance." },
      { icone: 'feuille', titre: "L'électrique accessible, et plus écologique", texte: "Les bornes existent déjà, dans les garages du quartier. Les partager évite d'en installer de nouvelles et ouvre la voiture électrique à ceux qui n'ont pas de prise chez eux, sans rien changer à leurs habitudes." },
    ],
    livre: ['Analyse du domaine et note de cadrage', 'Les décisions fondatrices, écrites et argumentées', 'Parcours conducteur et espace hôte maquettés', 'Modèle de domaine et spécification de conception'],
    suivant: 'pilpoil',
  },
  {
    slug: 'pilpoil',
    nom: 'Pil’Poil',
    baseline: 'Le réseau des animaux perdus et retrouvés',
    resume: 'Signaler un animal trouvé en trente secondes, retrouver le sien, et échanger sans exposer ses coordonnées.',
    domaine: 'Entraide de voisinage',
    plateforme: 'Application iOS',
    annee: '2026',
    depot: 'https://github.com/shadowX-lab/pilpoil',
    palette: { p1: '#043B33', p2: '#0A5D50', p3: '#1FA488', accent: '#0E7C6B', voile: '#E7F3F0', contraste: '#0A5D50', clair: '#B8F2DF', fonce: '#043B33', lueur: 'rgba(170,255,220,.28)' },
    heros: [{ fichier: 'Correspondances', haut: '#F5F6F4' }, { fichier: 'Main', haut: '#F5F6F4' }],
    chiffres: [
      { valeur: '30 s', libelle: 'pour signaler un animal trouvé, sans créer de compte' },
      { valeur: 'Jamais', libelle: "de coordonnées partagées sans l'accord des deux personnes" },
      { valeur: '1', libelle: 'seul formulaire pour les pertes et pour les découvertes' },
    ],
    probleme: [
      "Quand un chien disparaît, son propriétaire a peu de temps et peu de lucidité. Les chances de le retrouver baissent d'heure en heure, et chaque formulaire en trop coûte des minutes.",
      'Les services existants partagent le même défaut : il faut créer un compte avant de signaler quoi que ce soit. Or la personne qui croise un chien errant rend service, elle est pressée, et elle abandonne au premier formulaire.',
    ],
    citation: "Lui demander de s'inscrire, c'est perdre le signalement. Tout le produit part de ce constat.",
    parcoursIntro: "De la découverte d'un animal à la mise en relation avec son propriétaire.",
    parcours: [
      { fichier: 'Main', haut: '#F5F6F4', titre: 'Vous venez de trouver un animal', texte: "C'est le premier geste proposé, en grand, sans connexion.", suite: 'On le décrit' },
      { fichier: 'SignalementCouleurs', haut: '#F5F6F4', titre: 'Le décrire, vite', texte: 'Espèce, couleurs, lieu. On touche des choix au lieu de taper du texte.', suite: 'Rapprochement automatique' },
      { fichier: 'Correspondances', haut: '#F5F6F4', titre: 'Les rapprochements arrivent', texte: 'Le propriétaire voit les animaux qui pourraient être le sien.', suite: 'Reste à se parler' },
      { fichier: 'MiseEnRelation', haut: '#F5F6F4', titre: 'Se parler, en confiance', texte: "Chacun voit ce qu'il partage avant de le partager." },
    ],
    benefices: [
      { icone: 'eclair', titre: 'Un animal signalé en 30 secondes', texte: "La personne qui trouve un animal le signale en quelques gestes, photo comprise, sans créer de compte. Chaque signalement compte : c'est souvent lui qui ramène l'animal chez lui." },
      { icone: 'cloche', titre: 'Les propriétaires prévenus sans chercher', texte: "Dès qu'un animal trouvé ressemble au leur, les propriétaires reçoivent une alerte. Plus besoin de parcourir des dizaines d'annonces dans l'angoisse : les rapprochements arrivent d'eux-mêmes." },
      { icone: 'coeur', titre: 'Des retrouvailles en toute confiance', texte: "Chacun voit ce qu'il partage avant de l'envoyer, et les coordonnées ne circulent qu'avec l'accord des deux personnes. On aide sans s'exposer, et on retrouve son animal sereinement." },
    ],
    livre: ['Étude du terrain et des usages existants', 'Règles de gestion et modèle de données', 'Parcours complets maquettés, du signalement à la clôture', 'Application iOS et interface de vérification des fiches'],
    suivant: 'teamago',
  },
  {
    slug: 'teamago',
    nom: 'Teamago',
    baseline: 'L’argent et la logistique autour du match',
    resume: 'Organiser un déplacement de club amateur et faire tomber les comptes juste, au centime, sans y passer ses dimanches.',
    domaine: 'Sport amateur',
    plateforme: 'Application iOS',
    annee: '2026',
    palette: { p1: '#171C0B', p2: '#3A4A10', p3: '#6D8A1E', accent: '#4C6116', voile: '#EFF6D9', contraste: '#3A4A10', clair: '#D4FF4F', fonce: '#1E2410', lueur: 'rgba(212,255,79,.25)' },
    heros: [{ fichier: 'Participants', haut: '#F1F1EA' }, { fichier: 'Decompte', haut: '#F1F1EA' }],
    chiffres: [
      { valeur: '0,00 €', libelle: 'le solde du club : la preuve que tout est juste' },
      { valeur: '581 €', libelle: 'du déplacement de référence, répartis au centime' },
      { valeur: 'Zéro', libelle: 'dimanche perdu à refaire les comptes à la main' },
    ],
    probleme: [
      "Ce projet commence par une pièce à conviction : le tableur d'un dirigeant de club, construit à la main pour organiser les déplacements de son équipe. Sept onglets, cinq contrôles de cohérence, un reçu imprimable par conducteur. Un outil qui a tourné pendant des saisons.",
      "Et sur le déplacement de référence, sept cents kilomètres, huit payeurs, 581 € à répartir, le contrôle final affiche : incohérence du montant des remboursements. Quelqu'un de méthodique, qui a fabriqué son propre outil, n'arrive toujours pas à faire tomber les comptes juste.",
    ],
    citation: "C'est là qu'il y avait un produit, et il était visible avant qu'on dessine le moindre écran.",
    parcoursIntro: 'De la création du déplacement aux comptes qui bouclent, au centime près.',
    parcours: [
      { fichier: 'Infos', haut: '#F1F1EA', titre: 'Créer le déplacement', texte: 'Destination, date, heure de départ. La distance et le péage se remplissent seuls.', suite: 'On dit qui vient' },
      { fichier: 'Participants', haut: '#F1F1EA', titre: 'Qui vient, qui conduit', texte: 'Joueurs, accompagnants, conducteurs. Chacun a sa part, calculée au fur et à mesure.', suite: 'Le calcul tombe juste' },
      { fichier: 'Decompte', haut: '#F1F1EA', titre: 'Ça boucle', texte: 'Les participations couvrent exactement les frais. Le club ne gagne ni ne perd un centime.', suite: 'Reste à encaisser' },
      { fichier: 'Reglement', haut: '#F1F1EA', titre: 'Suivre les règlements', texte: 'Qui a payé, qui doit être remboursé, et le récapitulatif prêt à envoyer.' },
    ],
    benefices: [
      { icone: 'check', titre: 'Des comptes justes, en toute simplicité', texte: "Frais kilométriques, péages, minibus, hôtel : tout est réparti automatiquement entre les participants. Le solde du club tombe à 0,00 €, et l'écran affiche « Ça boucle » pour le prouver." },
      { icone: 'calc', titre: 'Fini les calculs à la main et les erreurs', texte: "Plus de tableur à tenir ni de formule à vérifier le dimanche soir. Les montants se calculent au centime près, même quand un conducteur ou un péage s'ajoute en route." },
      { icone: 'suivi', titre: "Chaque règlement suivi d'un coup d'œil", texte: 'Qui a payé, qui doit être remboursé, ce qui reste à encaisser : tout est visible au même endroit, et le récapitulatif part en un geste.' },
    ],
    livre: ['Reprise du tableur existant comme spécification de référence', 'Règles de répartition et contrôles de cohérence', 'Parcours organisateur maquetté, en clair et en sombre', 'Modèle de domaine et périmètre de première version arbitré'],
    suivant: 'chargeair',
  },
];

export const parSlug = (slug: string): Produit => {
  const produit = produits.find((p) => p.slug === slug);
  if (!produit) throw new Error(`Produit inconnu : ${slug}`);
  return produit;
};

/** Hero de l'accueil : derrière, puis devant. Aucun de ces écrans ne porte le nom de son application. */
export const eventail: [Ecran, Ecran] = [
  { projet: 'pilpoil', fichier: 'Carte', haut: '#F4F5F4' },
  { projet: 'chargeair', fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6' },
];

/** Section sombre de l'accueil, téléphones resserrés et coupés à mi-hauteur. */
export const rangee: Ecran[] = [
  { projet: 'chargeair', fichier: 'Borne', haut: '#F7F1EA' },
  { projet: 'teamago', fichier: 'Participants', haut: '#F1F1EA' },
  { projet: 'pilpoil', fichier: 'MiseEnRelation', haut: '#F4F5F4' },
  { projet: 'chargeair', fichier: 'Hote', haut: '#F7F1EA' },
];
```

Run: `npm test` → PASS.

- [ ] **Step 4: Polices**

```bash
npm install @fontsource-variable/plus-jakarta-sans@^5.3.0
npm uninstall @fontsource-variable/newsreader
```

- [ ] **Step 5: Réécrire `src/styles/global.css`**

Point de départ : `braise.css` des maquettes. Contenu exact :

```css
@import '@fontsource-variable/plus-jakarta-sans/index.css';
@import '@fontsource-variable/geist/index.css';

/* Moamind Solutions — système « Braise » (validé le 10 septembre 2026). */
:root {
  --f1: #6E2213; --f2: #C24A26; --f3: #F08A45; --lueur: rgba(255, 200, 120, .4);
  --encre: #15121F; --encre-2: #4B4453; --gris: #6E6674; --trait: #EDE6E1;
  --creme: #FBF6F2; --voile: #FBEDE6; --voile2: #FFF1E3;
  --titre: 'Plus Jakarta Sans Variable', system-ui, -apple-system, sans-serif;
  --ui: 'Geist Variable', system-ui, -apple-system, sans-serif;
  --gouttiere: 72px;
  --entete: 88px;
}
@media (max-width: 1100px) { :root { --gouttiere: 40px; } }
@media (max-width: 700px) { :root { --gouttiere: 20px; --entete: 72px; } }

*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; scroll-behavior: smooth; scroll-padding-top: 24px; }
body { margin: 0; background: #fff; color: var(--encre); font-family: var(--titre); font-size: 16px; line-height: 1.6; -webkit-font-smoothing: antialiased; }
img, svg { display: block; max-width: 100%; }
a { color: inherit; text-decoration: none; }
a, button, summary, label { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }
button, input, textarea, select { font: inherit; color: inherit; }
[hidden] { display: none !important; }
:focus-visible { outline: 2px solid var(--f2); outline-offset: 3px; border-radius: 4px; }
@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; }
}

/* Aucun mot seul en fin de ligne : textes courts équilibrés, paragraphes longs soignés.
   Les trois derniers mots sont liés au rendu (src/lib/typo.ts). */
h1, h2, h3, h4 { margin: 0; text-wrap: balance; }
p, li, dd, small, label, figcaption { text-wrap: balance; }
.long, .long p { text-wrap: pretty; }
p { margin: 0; }
.ponct { margin-left: -0.09em; }
.leger { font-weight: 400; }

.w { padding-inline: var(--gouttiere); }
.sec { padding-block: clamp(72px, 10vw, 120px); }
.creme { background: var(--creme); }
.t2 { font-size: clamp(2rem, 4vw, 2.875rem); line-height: 1.06; letter-spacing: -.035em; font-weight: 800; }
.lead { font-size: clamp(1.0625rem, 1.4vw, 1.125rem); line-height: 1.6; color: var(--encre-2); max-width: 620px; margin-top: 18px; }
.tete { display: flex; justify-content: space-between; align-items: end; gap: 40px; margin-bottom: clamp(36px, 5vw, 56px); flex-wrap: wrap; }
.lien { font-weight: 700; font-size: 15px; color: var(--f2); white-space: nowrap; }
.lien:hover { text-decoration: underline; text-underline-offset: 4px; }

.btn { display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 15px; padding: 15px 24px; border-radius: 14px; transition: transform .2s ease, box-shadow .2s ease, background .2s ease; }
.btn:hover { transform: translateY(-2px); }
.btn--plein { background: #fff; color: var(--f1); box-shadow: 0 18px 40px -18px rgba(0, 0, 0, .5); }
.btn--contour { color: #fff; border: 1.5px solid rgba(255, 255, 255, .42); }
.btn--contour:hover { background: rgba(255, 255, 255, .1); }
.boutons { display: flex; flex-wrap: wrap; gap: 10px; }

.etiq { display: inline-block; font-size: 13px; font-weight: 700; padding: 8px 13px; border-radius: 99px; background: rgba(255, 255, 255, .14); border: 1px solid rgba(255, 255, 255, .24); margin-bottom: 22px; }
.carte { border-radius: 26px; padding: 28px; background: var(--creme); }
.carte--bord { background: #fff; border: 1px solid var(--trait); }
.carte h3 { font-size: 22px; letter-spacing: -.025em; font-weight: 800; margin-bottom: 10px; }
.carte p { font-size: 15.5px; line-height: 1.6; color: var(--encre-2); }
.ico { width: 48px; height: 48px; border-radius: 14px; background: var(--voile); color: var(--f2); display: grid; place-items: center; margin-bottom: 20px; }
.grille-2 { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
.grille-3 { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
@media (max-width: 1100px) { .grille-3 { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (max-width: 700px) { .grille-2, .grille-3 { grid-template-columns: 1fr; } }
.pastille { display: inline-block; font-size: 13px; font-weight: 700; padding: 7px 12px; border-radius: 99px; background: var(--voile); color: var(--f1); }
.puces { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: 8px; }
.puces li { font-size: 13.5px; font-weight: 600; padding: 8px 13px; border-radius: 99px; background: #fff; border: 1px solid var(--trait); }

.sombre { background: var(--encre); color: #fff; }
.sombre .lead { color: #B9B2BF; }
.sombre .carte { background: #1E1A2A; }
.sombre .carte p { color: #B9B2BF; }
.sombre .lien { color: var(--f3); }

.saut-contenu { position: absolute; left: -9999px; top: 0; z-index: 100; background: var(--encre); color: #fff; padding: 12px 18px; border-radius: 0 0 10px 0; }
.saut-contenu:focus { left: 0; }
.invisible { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
```

- [ ] **Step 6: Build (les pages cassent encore, c'est attendu) et commit**

Run: `npm test && npx astro check 2>&1 | tail -3`
Expected: tests verts ; `astro check` signale les pages qui importent encore `ecran`/`decisions` depuis `produits.ts` (corrigées aux tâches 6 à 9).

```bash
git add src/lib/ecrans.ts src/data/produits.ts tests/produits.test.mjs src/styles/global.css package.json package-lock.json
git commit -m "Données des réalisations recentrées sur les bénéfices, polices et socle CSS Braise"
```

---

### Task 5: Composants du système

**Files:**
- Create: `src/components/Bande.astro`, `Iphone3D.astro`, `CarteFlottante.astro`, `Chiffres.astro`, `AppelFinal.astro`, `Icone.astro`
- Rewrite: `src/components/Entete.astro`, `src/components/PiedDePage.astro`, `src/layouts/Base.astro`
- Delete: `src/components/Telephone.astro`, `src/components/AppelAction.astro`
- Create: `public/og.png`

**Interfaces:**
- Consumes: `ecran()` (Task 4), classes globales (Task 4).
- Produces (props exacts) :
  - `<Bande couleurs?={{ f1, f2, f3, lueur }} hauteur="780px" biais="58%" reserve?="220px" classe?="">` avec créneaux par défaut ; fond en calque `::before`, `padding-top: var(--entete)`.
  - `<Iphone3D ecran={ImageMetadata} largeur={number} haut="#hex" statut?="#hex" alt?="" priorite?={boolean} style?="" />` → `<div class="iphone">…</div>` positionnable par `style`.
  - `<CarteFlottante style="" >…</CarteFlottante>` → `<div class="chip" aria-hidden="true">`.
  - `<Chiffres elements={{ valeur, libelle }[]} largeur?="62%" />` (couleurs par variables `--c1`, `--c2`, `--c3` du parent).
  - `<AppelFinal titre="" texte="" />` ; bouton « Décrire mon projet » + « Réserver 30 minutes » si `LIEN_RDV`.
  - `<Icone nom={Icone} taille?={22} />`.
  - `Base` : props `titre`, `description`, `suffixe?` (inchangées) ; rend `<Entete actif?>` en superposition.

- [ ] **Step 1: `src/components/Bande.astro`**

```astro
---
/** Bandeau en biais : fond en calque (rien de ce qui déborde n'est rogné), texte blanc. */
interface Props {
  couleurs?: { f1: string; f2: string; f3: string; lueur: string };
  /** Hauteur du fond sur ordinateur (la valeur de la maquette de la page). */
  hauteur: string;
  /** Hauteur du bord droit, en pourcentage de la hauteur du fond. */
  biais: string;
  /** Sous 1100 px, place laissée sous le fond pour les visuels qui débordent. */
  reserve?: string;
  classe?: string;
}
const { couleurs, hauteur, biais, reserve = '160px', classe = '' } = Astro.props;
const vars = [
  `--h:${hauteur}`, `--biais:${biais}`, `--reserve:${reserve}`,
  couleurs && `--f1:${couleurs.f1};--f2:${couleurs.f2};--f3:${couleurs.f3};--lueur:${couleurs.lueur}`,
].filter(Boolean).join(';');
---
<header class:list={['bande', classe]} style={vars}>
  <slot />
</header>

<style>
  .bande { position: relative; color: #fff; padding-top: var(--entete); }
  .bande::before {
    content: ''; position: absolute; inset: 0 0 auto 0; height: var(--h);
    clip-path: polygon(0 0, 100% 0, 100% var(--biais), 0 100%);
    background:
      linear-gradient(118deg, transparent 49.9%, rgba(255,255,255,.14) 50%, transparent 50.15%),
      radial-gradient(60% 90% at 90% 8%, var(--lueur), transparent 60%),
      linear-gradient(118deg, var(--f1) 0%, var(--f2) 55%, var(--f3) 100%);
  }
  .bande > :global(*) { position: relative; }
  @media (max-width: 1100px) {
    .bande::before { height: auto; bottom: var(--reserve); clip-path: polygon(0 0, 100% 0, 100% calc(100% - 70px), 0 100%); }
  }
</style>
```

- [ ] **Step 2: `src/components/Iphone3D.astro`**

```astro
---
import { Image } from 'astro:assets';
import type { ImageMetadata } from 'astro';

/** iPhone en 3D, en CSS : épaisseur par couches, cadre métal, Dynamic Island, barre d'état, reflet. */
interface Props {
  ecran: ImageMetadata;
  largeur: number;
  haut: string;
  statut?: string;
  alt?: string;
  priorite?: boolean;
  style?: string;
}
const { ecran, largeur, haut, statut = '#111', alt = '', priorite = false, style = '' } = Astro.props;
---
<div class="iphone" style={`--w:${largeur}px;${style}`}>
  <div class="couche" style="transform:translateZ(-12px)"></div>
  <div class="couche" style="transform:translateZ(-8px)"></div>
  <div class="couche" style="transform:translateZ(-4px);background:#34343a"></div>
  <span class="bt" style="top:22%;height:7%"></span><span class="bt" style="top:31%;height:11%"></span><span class="bt" style="top:44%;height:11%"></span>
  <div class="cadre">
    <div class="verre">
      <div class="statut" style={`--haut:${haut};--statut:${statut}`} aria-hidden="true"><span>9:41</span><i>●●● ▮</i></div>
      <Image src={ecran} alt={alt} width={largeur} densities={[1, 2]} loading={priorite ? 'eager' : 'lazy'} fetchpriority={priorite ? 'high' : 'auto'} />
      <span class="ile"></span><span class="reflet"></span>
    </div>
  </div>
</div>

<style>
  .iphone { position: absolute; width: var(--w); aspect-ratio: 9 / 19.4; transform-style: preserve-3d; }
  .couche { position: absolute; inset: 0; border-radius: calc(var(--w) * .17); background: #1b1b1e; }
  .cadre { position: absolute; inset: 0; border-radius: calc(var(--w) * .17); padding: 3px; background: linear-gradient(145deg, #8d8d94 0%, #3a3a3f 18%, #1d1d21 50%, #4b4b52 82%, #a3a3aa 100%); }
  .verre { position: relative; display: flex; flex-direction: column; width: 100%; height: 100%; border-radius: calc(var(--w) * .16); background: #000; padding: calc(var(--w) * .032); overflow: hidden; }
  .statut { flex: none; height: calc(var(--w) * .135); background: var(--haut); border-radius: calc(var(--w) * .13) calc(var(--w) * .13) 0 0; display: flex; justify-content: space-between; align-items: center; padding: calc(var(--w) * .02) calc(var(--w) * .085) 0; font: 600 calc(var(--w) * .05)/1 var(--ui); color: var(--statut); }
  .statut i { font-style: normal; letter-spacing: .08em; }
  .verre :global(img) { flex: 1; min-height: 0; width: 100%; height: auto; object-fit: cover; object-position: top; border-radius: 0 0 calc(var(--w) * .13) calc(var(--w) * .13); }
  .ile { position: absolute; top: calc(var(--w) * .052); left: 50%; width: 30%; height: calc(var(--w) * .09); transform: translateX(-50%); background: #000; border-radius: 99px; }
  .reflet { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; background: linear-gradient(112deg, rgba(255,255,255,.22) 0%, rgba(255,255,255,.05) 28%, transparent 42%); }
  .bt { position: absolute; left: -3px; width: 4px; border-radius: 2px; background: linear-gradient(90deg, #2a2a2e, #6b6b72); transform: translateZ(-6px); }
</style>
```

- [ ] **Step 3: `CarteFlottante.astro`, `Chiffres.astro`, `Icone.astro`**

`src/components/CarteFlottante.astro` :

```astro
---
/** Carte d'interface flottante, reprise d'une vraie app. Décorative : l'information est dans l'écran. */
interface Props { style?: string }
const { style = '' } = Astro.props;
---
<div class="chip" style={style} aria-hidden="true"><slot /></div>

<style>
  .chip { position: absolute; z-index: 6; border-radius: 18px; padding: 14px 16px; background: #fff; color: var(--encre); font-family: var(--ui); box-shadow: 0 26px 50px -20px rgba(30,10,4,.45); display: flex; gap: 14px; align-items: center; }
</style>
```

`src/components/Chiffres.astro` :

```astro
---
interface Props { elements: { valeur: string; libelle: string }[]; largeur?: string }
const { elements, largeur = '62%' } = Astro.props;
---
<ul class="chiffres w" style={`--largeur:${largeur}`}>
  {elements.map((e) => <li><span class="gros">{e.valeur}</span><p>{e.libelle}.</p></li>)}
</ul>

<style>
  .chiffres { position: relative; z-index: 1; list-style: none; margin: 0 0 clamp(64px, 8vw, 100px); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; width: var(--largeur); }
  li { border-radius: 26px; padding: 26px; min-height: 160px; background: var(--c1, var(--voile)); }
  li:nth-child(2) { background: var(--encre); color: #fff; }
  li:nth-child(3) { background: var(--c3, var(--voile2)); }
  .gros { display: block; font-size: clamp(2.25rem, 4vw, 3.125rem); line-height: 1; letter-spacing: -.045em; font-weight: 800; margin-bottom: 12px; color: var(--c-texte, var(--f1)); }
  li:nth-child(2) .gros { color: #fff; }
  li:nth-child(3) .gros { color: var(--c-texte3, var(--f2)); }
  p { font-size: 14.5px; line-height: 1.5; }
  @media (max-width: 1100px) { .chiffres { width: auto; } }
  @media (max-width: 700px) { .chiffres { grid-template-columns: 1fr; } li { min-height: 0; } }
</style>
```

`src/components/Icone.astro` (tracés validés sur maquettes) :

```astro
---
import type { Icone as Nom } from '../data/produits';
type Service = 'cadrage' | 'interface' | 'mobile' | 'web' | 'donnees' | 'suite' | 'code' | 'risque' | 'budget' | 'audit';
interface Props { nom: Nom | Service; taille?: number }
const { nom, taille = 22 } = Astro.props;
const traces: Record<Nom | Service, string> = {
  prix: '<path d="M12 2v20M17 6H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>',
  horloge: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  feuille: '<path d="M5 19c0-8 6-14 15-14 0 9-6 15-14 15"/><path d="M5 19l7-7"/>',
  eclair: '<path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/>',
  cloche: '<path d="M6 8a6 6 0 1112 0c0 7 3 8 3 8H3s3-1 3-8"/><path d="M10 20a2 2 0 004 0"/>',
  coeur: '<path d="M12 21s-8-5-8-11a5 5 0 019-3 5 5 0 019 3c0 6-8 11-10 11z"/>',
  check: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 12h2M14 12h2M8 16h2M14 16h2"/>',
  suivi: '<path d="M4 19V5M4 19h16M8 15l4-4 3 3 5-6"/>',
  cadrage: '<path d="M9 3h6l1 3H8l1-3z"/><rect x="5" y="6" width="14" height="15" rx="2"/><path d="M9 11h6M9 15h4"/>',
  interface: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/>',
  mobile: '<rect x="6" y="2" width="12" height="20" rx="3"/><path d="M11 18h2"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18"/>',
  donnees: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  suite: '<path d="M5 19l4-1 10-10a2.1 2.1 0 00-3-3L6 15l-1 4z"/><path d="M14 7l3 3"/>',
  code: '<path d="M8 9l-4 3 4 3M16 9l4 3-4 3M13 6l-2 12"/>',
  risque: '<path d="M12 3l9 16H3L12 3z"/><path d="M12 10v4M12 17h.01"/>',
  budget: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>',
  audit: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/><path d="M9 12l2 2 4-4"/>',
};
---
<svg width={taille} height={taille} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" set:html={traces[nom]} />
```

- [ ] **Step 4: `AppelFinal.astro`, `PiedDePage.astro`, `Entete.astro`, `Base.astro`**

`src/components/AppelFinal.astro` :

```astro
---
import { lien, LIEN_RDV } from '../config';
interface Props { titre: string; texte: string }
const { titre, texte } = Astro.props;
---
<section class="appel">
  <h2>{titre}</h2>
  <p>{texte}</p>
  <div class="boutons">
    <a class="btn btn--plein" href={lien('/contact')}>Décrire mon projet</a>
    {LIEN_RDV && <a class="btn btn--contour" href={LIEN_RDV} target="_blank" rel="noopener">Réserver 30 minutes</a>}
  </div>
</section>

<style>
  .appel { position: relative; padding: clamp(110px, 12vw, 150px) var(--gouttiere) clamp(90px, 10vw, 130px); color: #fff; text-align: center; }
  .appel::before { content: ''; position: absolute; inset: 0; clip-path: polygon(0 18%, 100% 0, 100% 100%, 0 100%); background: radial-gradient(50% 80% at 20% 90%, var(--lueur), transparent 60%), linear-gradient(118deg, var(--f1), var(--f2) 55%, var(--f3)); }
  .appel > * { position: relative; }
  h2 { font-size: clamp(2.25rem, 5vw, 3.375rem); letter-spacing: -.04em; line-height: 1.04; font-weight: 800; margin: 0 auto 18px; max-width: 780px; }
  p { font-size: 18px; line-height: 1.6; color: rgba(255,255,255,.88); max-width: 580px; margin: 0 auto 34px; }
  .boutons { justify-content: center; }
</style>
```

`src/components/PiedDePage.astro` :

```astro
---
import { lien, STUDIO } from '../config';
---
<footer class="pied">
  <div>
    <a class="logo" href={lien('/')} translate="no">{STUDIO.nom}</a>
    <p>Votre produit est étudié, cadré et validé avant la première ligne de code.</p>
  </div>
  <nav aria-label="Navigation de pied de page" class="colonnes">
    <div><h2>Le travail</h2><ul><li><a href={lien('/methode')}>Méthode</a></li><li><a href={lien('/realisations')}>Réalisations</a></li></ul></div>
    <div><h2>Le studio</h2><ul><li><a href={lien('/experience')}>Expérience</a></li><li><a href={lien('/contact')}>Contact</a></li></ul></div>
  </nav>
  <div class="bas">
    <span>© {new Date().getFullYear()} {STUDIO.nom} · Basé à {STUDIO.ville}, au travail partout</span>
    <a href={lien('/mentions-legales')}>Mentions légales</a>
  </div>
</footer>

<style>
  .pied { background: var(--encre); color: #fff; padding: 64px var(--gouttiere) 36px; display: grid; grid-template-columns: 1.4fr 2fr; gap: 40px; font-size: 14.5px; }
  .logo { display: block; font-weight: 800; font-size: 24px; letter-spacing: -.035em; margin-bottom: 10px; }
  p { color: #B9B2BF; max-width: 36ch; line-height: 1.6; }
  .colonnes { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
  h2 { font-size: 13px; color: var(--f3); margin-bottom: 14px; font-weight: 700; }
  ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 9px; color: #DCD6E0; }
  a:hover { color: #fff; text-decoration: underline; text-underline-offset: 4px; }
  .bas { grid-column: 1 / -1; border-top: 1px solid rgba(255,255,255,.1); padding-top: 22px; display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; color: #8F8896; font-size: 13px; }
  @media (max-width: 700px) { .pied { grid-template-columns: 1fr; } }
</style>
```

`src/components/Entete.astro` (superposé au bandeau ; menu `<details>` sous 760 px) :

```astro
---
import { lien, STUDIO } from '../config';
const base = import.meta.env.BASE_URL.replace(/\/$/, '');
const actuel = (Astro.url.pathname.replace(/\/$/, '') || '/').replace(base, '') || '/';
const liens = [
  { href: '/methode', texte: 'Méthode' },
  { href: '/realisations', texte: 'Réalisations' },
  { href: '/experience', texte: 'Expérience' },
];
const courant = (href: string) => (actuel.startsWith(href) ? 'page' : undefined);
---
<header class="entete">
  <a class="logo" href={lien('/')} aria-label={`${STUDIO.nom}, accueil`} translate="no">{STUDIO.nomCourt}<span>{STUDIO.nomSuffixe}</span></a>
  <nav aria-label="Navigation principale" class="principale">
    <ul>{liens.map((l) => <li><a href={lien(l.href)} aria-current={courant(l.href)}>{l.texte}</a></li>)}</ul>
  </nav>
  <a class="cta" href={lien('/contact')}>Décrire mon projet</a>
  <details class="menu-mobile">
    <summary aria-label="Ouvrir le menu"><span></span></summary>
    <ul>
      {liens.map((l) => <li><a href={lien(l.href)} aria-current={courant(l.href)}>{l.texte}</a></li>)}
      <li><a href={lien('/contact')}>Décrire mon projet</a></li>
    </ul>
  </details>
</header>

<style>
  .entete { position: absolute; inset: 0 0 auto 0; z-index: 20; height: var(--entete); display: flex; align-items: center; gap: 2.2rem; padding-inline: var(--gouttiere); color: #fff; font-size: 14.5px; }
  .logo { font-weight: 800; font-size: 21px; letter-spacing: -.035em; margin-right: auto; }
  .logo span { font-weight: 500; opacity: .6; margin-left: 5px; }
  .principale ul { display: flex; gap: 2.2rem; list-style: none; margin: 0; padding: 0; }
  .principale a { opacity: .88; padding-block: 6px; }
  .principale a:hover { opacity: 1; }
  .principale a[aria-current='page'] { opacity: 1; box-shadow: 0 2px 0 #fff; }
  .cta { padding: 11px 18px; font-weight: 700; background: #fff; color: var(--f1); border-radius: 12px; }
  .menu-mobile { display: none; position: relative; }
  .menu-mobile summary { list-style: none; cursor: pointer; width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,.16); display: grid; place-items: center; }
  .menu-mobile summary::-webkit-details-marker { display: none; }
  .menu-mobile summary span, .menu-mobile summary span::before, .menu-mobile summary span::after { display: block; width: 18px; height: 2px; background: #fff; border-radius: 2px; position: relative; content: ''; }
  .menu-mobile summary span::before { position: absolute; top: -6px; }
  .menu-mobile summary span::after { position: absolute; top: 6px; }
  .menu-mobile ul { position: absolute; right: 0; top: 54px; min-width: 220px; list-style: none; margin: 0; padding: 10px; background: #fff; color: var(--encre); border-radius: 18px; box-shadow: 0 30px 60px -24px rgba(21,18,31,.45); }
  .menu-mobile li a { display: block; padding: 12px 14px; border-radius: 10px; font-weight: 600; }
  .menu-mobile li a:hover, .menu-mobile a[aria-current='page'] { background: var(--voile); color: var(--f1); }
  @media (max-width: 760px) {
    .principale, .cta { display: none; }
    .menu-mobile { display: block; }
  }
</style>
```

`src/layouts/Base.astro` : garder la tête actuelle (titre, description, canonique, Open Graph) avec ces changements :
- `<meta name="theme-color" content="#6E2213" />`
- ajouter, avant `<slot name="tete" />` :

```astro
<link rel="preload" href={jakarta} as="font" type="font/woff2" crossorigin />
<meta property="og:image" content={new URL(lien('/og.png'), Astro.site)} />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

avec en frontmatter `import jakarta from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url';` (vérifier le nom exact avec `ls node_modules/@fontsource-variable/plus-jakarta-sans/files | grep latin-wght-normal`) et `import { lien, STUDIO } from '../config';`.
- corps :

```astro
<body>
  <a class="saut-contenu" href="#contenu">Aller au contenu</a>
  <Entete />
  <main id="contenu"><slot /></main>
  <PiedDePage />
</body>
```

- [ ] **Step 5: Image de partage `public/og.png`**

Générer une image 1200×630 aux couleurs Braise avec Chrome headless :

```bash
cat > /tmp/og.html <<'EOF'
<!doctype html><html><head><meta charset="utf-8"><style>
body{margin:0;width:1200px;height:630px;display:grid;align-content:center;padding:0 90px;box-sizing:border-box;color:#fff;font-family:'Plus Jakarta Sans',system-ui,sans-serif;
background:radial-gradient(60% 90% at 90% 8%,rgba(255,200,120,.4),transparent 60%),linear-gradient(118deg,#6E2213,#C24A26 55%,#F08A45)}
b{font-size:30px;letter-spacing:-.03em}h1{margin:28px 0 0;font-size:96px;line-height:1;letter-spacing:-.05em}span{font-weight:400}
</style></head><body><b>Moamind Solutions</b><h1>Le produit<br><span>avant le code.</span></h1></body></html>
EOF
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=1200,630 --screenshot=public/og.png file:///tmp/og.html
```

- [ ] **Step 6: Supprimer les anciens composants et vérifier**

```bash
git rm src/components/Telephone.astro src/components/AppelAction.astro
```

Run: `npx astro check 2>&1 | grep -E "error" | grep -v "src/pages" | wc -l`
Expected: `0` (seules les pages, réécrites ensuite, gardent des erreurs).

- [ ] **Step 7: Commit**

```bash
git add src/components src/layouts/Base.astro public/og.png
git commit -m "Composants Braise : bandeau en biais, iPhone 3D, chiffres, appel final, en-tête avec menu mobile, pied de page"
```

---

### Task 6: Page d'accueil

**Files:**
- Rewrite: `src/pages/index.astro`

**Interfaces:**
- Consumes: `Bande`, `Iphone3D`, `CarteFlottante`, `Chiffres`, `AppelFinal`, `Icone`, `ecran`, `eventail`, `rangee`, `lien`, `STUDIO`.

La maquette `accueil.html` est la source exacte : textes, structure et CSS.

- [ ] **Step 1: Écrire la page**

`src/pages/index.astro` :

```astro
---
import Base from '../layouts/Base.astro';
import Bande from '../components/Bande.astro';
import Iphone3D from '../components/Iphone3D.astro';
import CarteFlottante from '../components/CarteFlottante.astro';
import Chiffres from '../components/Chiffres.astro';
import AppelFinal from '../components/AppelFinal.astro';
import Icone from '../components/Icone.astro';
import { lien, STUDIO } from '../config';
import { ecran } from '../lib/ecrans';
import { eventail, rangee } from '../data/produits';

const [derriere, devant] = eventail;
const couts = ['Son développement', '+ son retrait', "+ la confiance de ceux qui s'en servaient"];
const services = [
  { icone: 'cadrage', titre: 'Cadrage produit', texte: "Entretiens, analyse de votre métier et de l'existant, choix du périmètre. Vous gardez le document, quoi qu'il arrive." },
  { icone: 'interface', titre: "Design d'interface", texte: "Parcours et écrans dessinés au pixel, en clair et en sombre, pour le téléphone comme pour l'ordinateur." },
  { icone: 'mobile', titre: 'Applications mobiles', texte: "iOS et Android, avec la finition d'une app native : gestes, animations, accessibilité." },
  { icone: 'web', titre: 'Sites et applications web', texte: 'Rapides, accessibles, bien référencés. Ce site en est un exemple.' },
  { icone: 'donnees', titre: 'Back-end et données', texte: 'API claires, modèle de données lisible, migrations propres, tests sur les règles métier.' },
  { icone: 'suite', titre: 'Mise en ligne et suivi', texte: "Publication sur les stores, mesure, corrections. L'application continue d'évoluer après la livraison." },
] as const;
const motsCles = [['Sécurité auditée', true], ["Passage à l'échelle", false], ['Règles métier', false], ['Budget et arbitrages', true], ['Architecture distribuée', false], ['Tests de bout en bout', false], ["Contrats d'API", false], ['Feuille de route', true], ['Migration sans interruption', false], ['Parcours utilisateur', false], ["Critères d'acceptation", false], ['Formation et support', false]] as const;
const inclinaisons = [
  { w: 210, left: '15%', t: 'rotateY(18deg) rotateZ(-5deg) translateY(30px)' },
  { w: 230, left: '32%', t: 'rotateY(8deg) rotateZ(-2deg)' },
  { w: 230, left: '49%', t: 'rotateY(-8deg) rotateZ(2deg)' },
  { w: 210, left: '66%', t: 'rotateY(-18deg) rotateZ(5deg) translateY(30px)' },
];
---
<Base titre={`${STUDIO.nom} — ${STUDIO.accroche}`} description={STUDIO.description} suffixe={false}>
  <Bande hauteur="780px" biais="58%" reserve="260px">
    <div class="hero w">
      <div class="hero__texte">
        <span class="etiq">Conception et développement · web et mobile</span>
        <h1>Le produit<br /><span class="leger">avant le code.</span></h1>
        <p class="sous">La plupart des applications qui échouent ont été très bien développées. Elles répondaient simplement aux mauvaises questions. On commence par celles-là.</p>
        <div class="boutons">
          <a class="btn btn--plein" href={lien('/contact')}>Décrire mon projet</a>
          <a class="btn btn--contour" href={lien('/realisations')}>Voir les réalisations</a>
        </div>
        <ul class="preuve"><li>Réponse sous 2 jours ouvrés</li><li>Premier entretien offert</li></ul>
      </div>
      <div class="scene" aria-hidden="true">
        <div class="ombre" style="width:360px;height:60px;left:150px;top:720px"></div>
        <Iphone3D ecran={ecran(derriere.projet, derriere.fichier)} largeur={236} haut={derriere.haut} priorite style="left:40px;top:10px;transform:rotateY(24deg) rotateX(8deg) rotateZ(-9deg)" />
        <Iphone3D ecran={ecran(devant.projet, devant.fichier)} largeur={278} haut={devant.haut} statut={devant.statut} priorite style="left:230px;top:70px;transform:rotateY(-20deg) rotateX(10deg) rotateZ(6deg);z-index:3" />
        <CarteFlottante style="left:-40px;top:420px">
          <span class="rond" style="background:#0E7C6B">●</span>
          <span><b>6 chiens trouvés</b><small>à moins de 5 km</small></span>
        </CarteFlottante>
        <CarteFlottante style="left:470px;top:250px;gap:18px">
          <span class="valeur"><small>ESTIMÉ</small><b>12,6</b><small>kWh ajoutés</small></span>
          <span class="valeur"><small>À PAYER</small><b>12,40</b><small>€ au total</small></span>
        </CarteFlottante>
      </div>
    </div>
  </Bande>

  <Chiffres elements={[
    { valeur: '15 ans', libelle: "d'expérience, du développement au pilotage produit" },
    { valeur: '0', libelle: 'ligne de code avant un écran que vous avez validé' },
    { valeur: '1', libelle: 'seul interlocuteur, du premier entretien à la mise en ligne' },
  ]} />

  <section class="sec w creme conviction">
    <h2 class="conv-titre">Le code n'est pas le sujet.<br /><span>Il est la conséquence.</span></h2>
    <div class="conv">
      <div>
        <ul class="couts">{couts.map((c, i) => <li class={`c${i + 1}`}>{c}</li>)}</ul>
        <p class="legende">Ce que coûte vraiment une fonctionnalité mal cadrée.</p>
      </div>
      <div class="conv-texte long">
        <p>Une fonctionnalité mal cadrée ne coûte pas seulement son développement. Elle coûte son développement, puis son retrait, puis la confiance de ceux qui s'en servaient. <strong>C'est le poste de dépense le plus lourd d'un projet, et personne ne le facture.</strong></p>
        <p>Alors on prend le temps au début, là où il est bon marché. On cherche d'abord à comprendre votre métier, avant de vous proposer quoi que ce soit. On tranche ensemble ce qui entre dans la première version. Les écrans sont dessinés, vous les corrigez, et rien ne se construit qui n'ait été validé.</p>
        <p class="chute">Ensuite, oui, ça va vite — parce que la question difficile est déjà réglée.</p>
      </div>
    </div>
  </section>

  <!-- Méthode : quatre cartes ; les quatre `.vis` reprennent exactement le HTML des `.vis` d'accueil.html -->
  <section class="sec w">
    <div class="tete">
      <div>
        <h2 class="t2">Vous validez les écrans. Ensuite, on développe.</h2>
        <p class="lead">Chaque étape se termine par un document ou des écrans que vous validez. La suivante commence seulement après votre accord.</p>
      </div>
      <a class="lien" href={lien('/methode')}>La méthode en détail →</a>
    </div>
    <div class="etapes">
      <!-- 4 × <div class="etape"> : copier les blocs `.etape` d'accueil.html ; dans la carte « Valider »,
           remplacer <img src="/files/teamago-Decompte.jpg"> par <Image src={ecran('teamago', 'Decompte')} alt="" width={110} densities={[1, 2]} />
           (import { Image } from 'astro:assets'). -->
    </div>
  </section>

  <section class="sec w sombre realisations">
    <div class="tete">
      <div>
        <h2 class="t2">Des produits conçus et développés ici</h2>
        <p class="lead">Des applications conçues de bout en bout, présentées avec ce qu'elles changent pour ceux qui s'en servent chaque jour.</p>
      </div>
      <a class="lien" href={lien('/realisations')}>Voir les réalisations →</a>
    </div>
    <div class="rangee" aria-hidden="true">
      {rangee.map((e, i) => (
        <Iphone3D ecran={ecran(e.projet, e.fichier)} largeur={inclinaisons[i]!.w} haut={e.haut} style={`left:${inclinaisons[i]!.left};top:20px;transform:${inclinaisons[i]!.t}`} />
      ))}
    </div>
  </section>

  <section class="sec w">
    <div class="duo">
      <div>
        <h2 class="t2">Quinze ans de projets, côté technique et côté métier</h2>
        <p class="lead">En indépendant avec des clients directs, chez des éditeurs de logiciels, et dans de grands groupes où un déploiement concerne des milliers de postes.</p>
        <p class="parcours-pro"><span>Développeur</span><i>→</i><span>Chef de projet</span><i>→</i><span>Product Owner</span><i>→</i><span>Business Analyst</span></p>
        <a class="lien" href={lien('/experience')}>Voir le parcours →</a>
      </div>
      <ul class="nuage">{motsCles.map(([m, fort]) => <li class:list={[{ fort }]}>{m}</li>)}</ul>
    </div>
  </section>

  <section class="sec w creme">
    <div class="tete"><div><h2 class="t2">Du premier entretien à l'application en ligne</h2><p class="lead">Tout est pris en charge, avec un seul interlocuteur du début à la fin.</p></div></div>
    <div class="grille-3">
      {services.map((s) => <article class="carte carte--bord"><div class="ico"><Icone nom={s.icone} /></div><h3>{s.titre}</h3><p>{s.texte}</p></article>)}
    </div>
  </section>

  <AppelFinal titre="Décrivez votre projet en quelques phrases" texte="Réponse sous 2 jours ouvrés. Le premier entretien est offert, et vous repartez avec une note écrite de votre projet, que vous donniez suite ou non." />
</Base>
```

- [ ] **Step 2: Style de page**

Ajouter `<style>` en fin de fichier : copier depuis `accueil.html` les règles des blocs `hero`, `preuve`, `scene`/`ombre`, `conviction`/`conv`/`couts`/`chute`, `etapes`/`etape`/`vis`/`doc`/`cols`/`mini`/`bulle`/`tranches`, `rangee`, `duo`/`nuage`/`parcours-pro`, en remplaçant `.bento`, `.nav`, `.fond`, `.iphone`, `.chip`, `.btn`, `.site`, `.w`, `.sec`, `.t2`, `.lead`, `.tete`, `.lien` (désormais globaux ou dans les composants). Préfixer par `:global()` les sélecteurs qui visent des éléments rendus par un composant (`.scene :global(.iphone)`). Adapter :
- `.hero h1` : `font-size: clamp(2.75rem, 7vw, 5rem)` ; `.hero .sous` : `font-size: clamp(1.0625rem, 1.6vw, 1.25rem)`.
- `.chip` enfants : `.rond { width:34px;height:34px;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:13px }`, `.chip b { display:block;font-size:14.5px }`, `.chip small { display:block;font-size:12.5px;color:#6b7280 }`, `.valeur small { font-size:10px;letter-spacing:.12em;color:#8a7f73 }`, `.valeur b { font:500 24px Georgia, serif;color:#1d1a16 }`.
- `.realisations { padding-bottom: 0; overflow: hidden; }` et `.rangee { position: relative; height: 300px; margin-top: 10px; perspective: 1800px; }`.
- `.preuve` devient une liste : `list-style:none;margin:28px 0 0;padding:0;display:flex;gap:18px;flex-wrap:wrap`.

Responsive, à ajouter :

```css
.scene { position: relative; perspective: 1700px; width: 560px; height: 760px; }
@media (max-width: 1100px) {
  .hero { grid-template-columns: 1fr; }
  .scene { zoom: .8; margin-inline: auto; }
  .conv, .duo { grid-template-columns: 1fr; gap: 48px; }
  .conv-titre { font-size: clamp(2.5rem, 7vw, 4.5rem); }
  .etapes { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .rangee { zoom: .8; }
}
@media (max-width: 700px) {
  .scene { zoom: .56; }
  .etapes { grid-template-columns: 1fr; }
  .rangee { zoom: .5; height: 320px; }
}
```

- [ ] **Step 3: Vérifier**

Run: `npm run build && (npm run preview &) && sleep 4 && npm run verifier -- /`
Expected: tous les ✓ pour `/` (six largeurs, mots isolés à 390 et 1440, liens, logo, menu mobile). En cas de ✗ « mot isolé », raccourcir `max-width` du bloc concerné ou passer le texte en `.long`.

Comparer visuellement une capture 1440 px avec `accueil.html` (même composition).

- [ ] **Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Accueil Braise : le produit avant le code, conviction, méthode, réalisations, expérience"
```

---

### Task 7: Page Méthode

**Files:** Rewrite `src/pages/methode.astro`

Source exacte : `methode.html` (textes, CSS des `.escalier`, `.marche`, `.temps`, `.visuel`, `.recoit`, `.engage`, `.doc`, `.tableau`, `.pourquoi`, `.bulle`, `.frise`, `.jauge`).

- [ ] **Step 1: Écrire la page**

Frontmatter : reprendre le tableau `temps` de l'actuel `methode.astro` (titres, résumés, textes, livrables, délais, engagements) en ajoutant `ancre: 'ecouter' | 'cadrer' | 'valider' | 'construire'`, et le tableau `engagements` actuel. Le texte d'« Écouter » devient « …dans les mots de votre métier, pas dans les miens. Vous la corrigez. … » (sans tiret).

Structure :

```astro
<Base titre="Méthode" description="Écouter, cadrer, valider, construire. La méthode de Moamind Solutions, avec ses livrables, ses délais et ses engagements.">
  <Bande hauteur="680px" biais="56%" reserve="120px">
    <div class="ouv w">
      <div>
        <span class="etiq">La méthode</span>
        <h1>Quatre temps, dans cet ordre</h1>
        <p class="sous">La plupart des applications qui échouent ont été très bien développées. Elles répondaient simplement aux mauvaises questions. Voilà comment on s'assure que ce ne sera pas la vôtre.</p>
      </div>
      <nav class="escalier" aria-label="Les quatre temps">
        {temps.map((t, i) => (
          <a class="marche" href={`#${t.ancre}`} style={`--rang:${i}`}><b>{i + 1}</b><div><strong>{t.titre}</strong><span>{t.delai}</span></div></a>
        ))}
      </nav>
    </div>
  </Bande>
  <div class="w">
    {temps.map((t, i) => (
      <section class="temps" id={t.ancre}>
        <div class="visuel" aria-hidden="true"><!-- visuel i : copier le bloc `.visuel` correspondant de methode.html --></div>
        <div class="corps">
          <p class="num"><b>{i + 1}</b><span class="pastille">{t.delai}</span></p>
          <h2>{t.titre}</h2>
          <p class="resume">{t.resume}</p>
          <div class="long">{t.texte.map((p) => <p>{p}</p>)}</div>
          <div class="recoit">
            <div class="liste"><small>Ce que vous recevez</small><ul>{t.livrables.map((l) => <li>{l}</li>)}</ul></div>
            <p class="engage"><small>L'engagement</small>{t.engagement}</p>
          </div>
        </div>
      </section>
    ))}
  </div>
  <section class="sec w sombre">
    <div class="tete"><h2 class="t2">Six mots que tout le monde revendique, et ce qu'ils coûtent</h2></div>
    <dl class="grille-3 engagements">{engagements.map((e) => <div class="carte"><dt>{e.mot}</dt><dd>{e.texte}</dd></div>)}</dl>
  </section>
  <AppelFinal titre="Commençons par écouter" texte="Le premier entretien ne vous engage à rien. Vous repartez avec une note écrite de ce que j'ai compris de votre projet, et elle est à vous, même si vous vous arrêtez là." />
</Base>
```

Les quatre visuels (copiés de `methode.html`) : note de cadrage ; tableau Version 1 / Plus tard / Jamais + « Pourquoi « jamais » » ; `Iphone3D` de `teamago/Decompte` (largeur 230, `haut="#F1F1EA"`, `style="left:50%;top:44px;margin-left:-115px;transform:rotateY(-14deg) rotateX(6deg)"`) et les cinq bulles (trois questions noires, « Corrigé ✓ », « Écran validé ») ; frise des trois tranches. La marche se positionne par `left: calc(var(--rang) * 70px); top: calc(10px + var(--rang) * 130px)`.

- [ ] **Step 2: Style**

Copier le `<style>` de `methode.html`, sans les règles déjà globales. Ajouter : `.recoit ul { list-style: none; margin: 0; padding: 0; }`, `.engagements { margin: 0 } .engagements dt { font-size: 22px; font-weight: 800; letter-spacing: -.025em; margin-bottom: 10px } .engagements dd { margin: 0; color: #B9B2BF }`.

Responsive :

```css
@media (max-width: 1100px) {
  .ouv { grid-template-columns: 1fr; }
  .escalier { min-height: 0; display: grid; gap: 10px; padding-bottom: 40px; }
  .marche { position: static; width: auto; }
  .temps { grid-template-columns: 1fr; gap: 40px; }
  .temps:nth-child(even) .visuel { order: 0; }
}
@media (max-width: 700px) {
  .visuel { height: 420px; }
  .recoit { grid-template-columns: 1fr; }
  .temps h2 { font-size: 40px; }
}
```

- [ ] **Step 3: Vérifier et commiter**

Run: `npm run build && npm run verifier -- /methode` (preview lancé)
Expected: tous ✓, dont « la marche Valider amène à l'étape ».

```bash
git add src/pages/methode.astro
git commit -m "Méthode Braise : escalier des quatre temps, livrables dessinés, engagements"
```

---

### Task 8: Réalisations et études de cas

**Files:** Rewrite `src/pages/realisations/index.astro`, `src/pages/realisations/[slug].astro`

Sources exactes : `realisations.html` et `etude-pilpoil.html` (les deux autres études sont générées du même gabarit).

- [ ] **Step 1: `realisations/index.astro`**

```astro
---
import Base from '../../layouts/Base.astro';
import Bande from '../../components/Bande.astro';
import Iphone3D from '../../components/Iphone3D.astro';
import AppelFinal from '../../components/AppelFinal.astro';
import { lien } from '../../config';
import { ecran } from '../../lib/ecrans';
import { produits } from '../../data/produits';
---
<Base titre="Réalisations" description="Des applications conçues et développées de bout en bout : le problème de départ, ce qu'elles changent pour ceux qui s'en servent, et les écrans qui en sont sortis.">
  <Bande hauteur="620px" biais="62%" reserve="0px">
    <div class="ouv w">
      <span class="etiq">Réalisations</span>
      <h1>Ce que ça donne,<br /><span class="leger">et pourquoi</span></h1>
      <p class="sous">Des applications conçues et développées de bout en bout, du premier entretien à la mise en ligne. Pour chacune : le problème de départ, ce qu'elle change pour ceux qui s'en servent, et les écrans qui en sont sortis.</p>
    </div>
  </Bande>
  <div class="liste">
    {produits.map((p, i) => (
      <article class="produit" style={`--p1:${p.palette.p1};--p2:${p.palette.p2};--p3:${p.palette.p3};--lueur:${p.palette.lueur};--c:${p.palette.contraste};--clair:${p.palette.clair};--fonce:${p.palette.fonce}`}>
        <div>
          <span class="domaine">{p.domaine} · {p.plateforme}</span>
          <h2 translate="no">{p.nom}</h2>
          <p class="base">{p.baseline}</p>
          <p class="res">{p.resume}</p>
          <ul class="choix">{p.benefices.map((b) => <li>{b.titre}</li>)}</ul>
          <a class="btn" href={lien(`/realisations/${p.slug}`)}>Lire l'étude de cas {p.nom} →</a>
        </div>
        <div class="scene" aria-hidden="true">
          <Iphone3D ecran={ecran(p.slug, p.heros[0].fichier)} largeur={230} haut={p.heros[0].haut} statut={p.heros[0].statut} priorite={i === 0} style="left:20px;top:-150px;transform:rotateY(22deg) rotateX(8deg) rotateZ(-8deg)" />
          <Iphone3D ecran={ecran(p.slug, p.heros[1].fichier)} largeur={262} haut={p.heros[1].haut} statut={p.heros[1].statut} priorite={i === 0} style="left:220px;top:-110px;transform:rotateY(-18deg) rotateX(10deg) rotateZ(6deg);z-index:3" />
        </div>
      </article>
    ))}
  </div>
  <AppelFinal titre="Décrivez ce que vous voulez construire" texte="Réponse sous deux jours ouvrés. Le premier entretien ne vous engage à rien, et vous repartez avec une note écrite de votre problème, telle qu'on l'a comprise." />
</Base>
```

Style : copier celui de `realisations.html` ; la couleur de chaque carte devient `background: radial-gradient(60% 80% at 90% 10%, var(--lueur), transparent 60%), linear-gradient(118deg, var(--p1), var(--p2) 60%, var(--p3));` ; le bouton `background: #fff; color: var(--c)` sauf Teamago (`:nth-child(3) .btn { background: var(--clair); color: var(--fonce) }`, idem pour les puces). `.liste { padding: 240px var(--gouttiere) 130px; margin-top: -110px; }`. Responsive :

```css
@media (max-width: 1100px) {
  .produit, .produit:nth-child(even) { grid-template-columns: 1fr; padding: 48px 32px 40px; }
  .produit .scene { order: -1; height: 420px; zoom: .8; }
  .liste { padding-top: 160px; gap: 80px; }
}
@media (max-width: 700px) { .produit .scene { zoom: .55; height: 520px; } .produit h2 { font-size: 52px; } }
```

- [ ] **Step 2: `realisations/[slug].astro`**

Reprendre la structure d'`etude-pilpoil.html` (sections : ouverture en `Bande` couleur produit avec fil d'Ariane dans `<nav aria-label="Fil d'Ariane">`, étiquette « Étude de cas · {annee} », `h1` nom, baseline, résumé, fiche domaine / plateforme / dépôt, deux `Iphone3D` `heros` ; `Chiffres` avec `--c1: palette.voile ; --c3: palette.voile ; --c-texte: palette.p2 ; --c-texte3: palette.p2` et `largeur="64%"` ; « Le point de départ » + `citation` ; « Le parcours principal, en quatre écrans » avec `parcoursIntro` et quatre `Iphone3D` (largeur 210) + étiquettes `suite` ; « Ce que ça change pour ceux qui s'en servent » avec la lead « Trois bénéfices concrets, pensés avant le premier écran et vérifiés sur les maquettes. » et les trois `benefices` (`<Icone nom={b.icone} taille={26} />`) ; « Ce qui a été produit » (`livre`) ; carte « Étude suivante » dans la palette du produit `suivant` avec son `heros[1]` ; `AppelFinal` titre « Un produit à cadrer ? », texte « C'est le travail que vous venez de voir, appliqué à votre projet. Le premier entretien est offert, et vous repartez avec une note écrite. »).

La `Bande` reçoit `couleurs={{ f1: p.palette.p1, f2: p.palette.p2, f3: p.palette.p3, lueur: p.palette.lueur }}`, `hauteur="800px"`, `biais="60%"`, `reserve="300px"`. Les variables `--p-accent`, `--p-voile`, `--p2` sont posées sur `<article class="etude" style=…>`.

Style : copier le `<style>` d'`etude-pilpoil.html` (tel que généré, avec `.suivant` en variables `--s-fond`, `--s-clair`, `--s-fonce`), sans les règles globales. Responsive :

```css
@media (max-width: 1100px) {
  .ouv, .probleme, .decisions { grid-template-columns: 1fr; gap: 40px; }
  .scene { zoom: .8; margin-inline: auto; width: 560px; height: 760px; }
  .collant { position: static; }
  .rang { grid-template-columns: repeat(2, minmax(0, 1fr)); row-gap: 48px; }
  .suite { display: none; }
  .livrables { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .suivant { grid-template-columns: 1fr; }
  .suivant .iphone { display: none; }
}
@media (max-width: 700px) {
  .scene { zoom: .55; }
  .rang, .livrables { grid-template-columns: 1fr; }
  .ouv h1 { font-size: 56px; }
}
```

- [ ] **Step 3: Vérifier et commiter**

Run: `npm run build && npm run verifier -- /realisations /realisations/chargeair /realisations/pilpoil /realisations/teamago`
Expected: tous ✓. Contrôle visuel : chaque étude dans sa couleur, écran Teamago aux noms fictifs.

```bash
git add src/pages/realisations
git commit -m "Réalisations et études de cas Braise : cartes produit, bénéfices utilisateur, étude suivante"
```

---

### Task 9: Page Expérience

**Files:** Rewrite `src/pages/experience.astro`

Source exacte : `experience.html`.

- [ ] **Step 1: Écrire la page**

Frontmatter : garder `terrains`, `apports`, `convictions`, `outils` de l'actuel `experience.astro`, avec ces textes modifiés (tirets retirés) : convictions et textes identiques à `experience.html` ; `terrains[5].enjeu` : « Concevoir des API et fixer les contrats d'interface d'une architecture distribuée, c'est-à-dire décider, avant d'écrire une ligne, ce que chaque service promet aux autres et ce qu'il ne promet pas. » ; ajouter `icone` aux `apports` : `code`, `risque`, `budget`, `audit`.

Sections :
- `Bande hauteur="640px" biais="52%" reserve="0px"` : `h1` « Trois mots,<br /><span class="leger">c'est tout le nom</span> », texte `sous` de la maquette, trois cartes `.mot` MOA / Mind / Solutions.
- « Quinze ans de terrain. Ce que ça change pour votre projet » + lead « Développeur d'abord, puis chef de projets, puis Product Owner et Business Analyst. En clientèle directe, chez des éditeurs, et dans des groupes où un déploiement se compte en milliers de postes. » + `grille-2` des apports avec `Icone`.
- « Les terrains. Où ça s'est joué » : liste de `<details class="terrain">` (le premier `open`), `<summary>` contenant durée, `h3`, `ul.puces`, `span.plus` ; `<p class="enjeu long">` hors du `summary`. Fiche : Formation, Certification, « Bordeaux et des projets sans frontière. ».
- Six convictions (`sombre`, `grille-3`, `carte`).
- Outils (`grille-2`).
- `AppelFinal titre="On en parle ?" texte="Décrivez-moi votre projet en quelques phrases. Je vous réponds sous deux jours ouvrés, et le premier entretien ne vous engage à rien."`.

- [ ] **Step 2: Style**

Copier le `<style>` d'`experience.html`. Responsive :

```css
@media (max-width: 1100px) {
  .ouv, .deux, .outils { grid-template-columns: 1fr; gap: 32px; }
  .triade { padding-bottom: 32px; }
}
@media (max-width: 700px) {
  .mot { grid-template-columns: 1fr; gap: 8px; }
  .terrain summary { grid-template-columns: minmax(0, 1fr) 44px; }
  .duree { grid-column: 1; }
  .terrain summary > div { grid-column: 1; }
  .plus { grid-column: 2; grid-row: 1; }
  .enjeu { margin-left: 0; }
  .fiche { grid-template-columns: 1fr; }
}
```

- [ ] **Step 3: Vérifier et commiter**

Run: `npm run build && npm run verifier -- /experience`
Expected: tous ✓, dont « un terrain se déplie au clic » ; la fiche tient sur une ligne à 1440 px.

```bash
git add src/pages/experience.astro
git commit -m "Expérience Braise : trois mots, terrains dépliables, convictions, Business Analyst"
```

---

### Task 10: Contact et Message reçu

**Files:** Rewrite `src/pages/contact.astro`, `src/pages/merci.astro`

Sources exactes : `contact.html`, `merci.html`. Le formulaire garde l'envoi Web3Forms actuel (champs cachés `access_key`, `subject`, `from_name`, `redirect`, alerte `cleManquante`) et les correctifs de l'audit.

- [ ] **Step 1: Contact**

Reprendre le frontmatter actuel (`cleManquante`, `retour`, `paliers`). Étapes :

```ts
const etapes = [
  { titre: 'Vous écrivez', texte: "Quelques phrases suffisent. Aucun cahier des charges n'est demandé : c'est souvent le travail qu'il reste à faire." },
  { titre: 'Une réponse sous deux jours ouvrés', texte: "Avec une première lecture de votre problème et les questions qu'il soulève." },
  { titre: 'On se parle une heure', texte: 'Gratuitement, et sans engagement. Vous repartez avec une note écrite de ce qui a été compris.' },
];
```

Structure : `Bande hauteur="600px" biais="70%" reserve="0px"` contenant la grille `.contact` (intro : étiquette « Contact », `h1` « Décrivez ce que vous voulez construire », `sous` ; `ol.etapes`) et le formulaire `.form` (carte blanche). Formulaire, champs réels de `contact.html` avec :
- `<input type="checkbox" name="botcheck" hidden tabindex="-1" autocomplete="off">` (anti-spam masqué aux lecteurs d'écran) ;
- profil en radios (`value="Un particulier"` / `"Un professionnel"`, `data-profil`), `#bloc-organisation` masqué pour un particulier, budget en `select` pour un professionnel et en `input` pour un particulier (logique actuelle de `contact.astro`, champs désactivés quand masqués) ;
- `autocomplete="off"` sur échéance, budget, message ; `spellcheck="false"` sur l'e-mail ;
- placeholders terminés par « … » ;
- aide du message reliée par `aria-describedby="aide-message"` ;
- bouton `Envoyer mon projet` ; au `submit`, le script le passe en `disabled` avec le texte « Envoi… ».

Script (en plus de la bascule actuelle) :

```ts
form.addEventListener('submit', () => {
  const bouton = form.querySelector<HTMLButtonElement>('button[type=submit]');
  if (bouton) { bouton.disabled = true; bouton.textContent = 'Envoi…'; }
});
```

Style : `<style>` de `contact.html` (sans règles globales), `.entree:focus { outline: 2px solid transparent; … }` gardé. Responsive :

```css
@media (max-width: 1100px) { .contact { grid-template-columns: 1fr; } .intro { min-height: 0; padding-bottom: 32px; } .etapes { order: 2; } }
@media (max-width: 700px) { .rang { grid-template-columns: 1fr; } .form { padding: 26px; } }
```

- [ ] **Step 2: Message reçu**

`Bande hauteur="780px" biais="62%" reserve="0px"`, `h1` « C'est noté.<br /><span class="leger">Votre projet sera lu avec attention.</span> », texte et boutons de `merci.html`, carte `.accuse` : « Votre projet est bien arrivé » ; « Et maintenant : » ; 1 « Votre message est lu en entier. » ; 2 « Une réponse vous parvient sous deux jours ouvrés. » ; 3 « Un entretien d'une heure est fixé ensemble. ». Style de `merci.html` ; sous 1100 px, une colonne.

- [ ] **Step 3: Vérifier et commiter**

Run: `npm run build && npm run verifier -- /contact /merci`
Expected: tous ✓, dont saisie, bascule particulier et champ anti-spam masqué.

```bash
git add src/pages/contact.astro src/pages/merci.astro
git commit -m "Contact et message reçu Braise : formulaire en carte, sans première personne, correctifs d'accessibilité"
```

---

### Task 11: 404 et Mentions légales

**Files:** Rewrite `src/pages/404.astro`, `src/pages/mentions-legales.astro`

Sources exactes : `404.html`, `mentions-legales.html`.

- [ ] **Step 1: 404**

`Bande hauteur="820px" biais="64%" reserve="200px"` : « 404 » en filigrane, `h1` « Cette page n'existe pas », texte et boutons de la maquette (« Retour à l'accueil » → `lien('/')`), `Iphone3D` de `pilpoil/Carte` et carte flottante « Aucun résultat ici ». Style de `404.html` ; sous 1100 px, la scène passe sous le texte à `zoom: .7`.

- [ ] **Step 2: Mentions légales**

Reprendre le contenu actuel de `mentions-legales.astro` dans la structure de `mentions-legales.html` : `Bande hauteur="430px" biais="70%" reserve="0px"`, sommaire `<ol class="sommaire">` de liens `#editeur`, `#contact`, `#hebergement`, `#propriete`, `#donnees`, `#cookies`, sections `.bloc` avec ces `id`. Script de surlignage (seul JS de la page) :

```astro
<script>
  const liens = [...document.querySelectorAll<HTMLAnchorElement>('.sommaire a')];
  const blocs = [...document.querySelectorAll<HTMLElement>('.bloc[id]')];
  const marquer = (id: string) => liens.forEach((l) => l.classList.toggle('actif', l.hash === `#${id}`));
  const suivre = () => {
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) return marquer(blocs.at(-1)!.id);
    const courant = blocs.filter((b) => b.getBoundingClientRect().top <= innerHeight * 0.3).at(-1) ?? blocs[0]!;
    marquer(courant.id);
  };
  addEventListener('scroll', suivre, { passive: true });
  liens.forEach((l) => l.addEventListener('click', () => setTimeout(() => marquer(l.hash.slice(1)), 700)));
  suivre();
</script>
```

Style de `mentions-legales.html` ; sous 1100 px, sommaire masqué (`display: none`) et contenu pleine largeur.

- [ ] **Step 3: Vérifier et commiter**

Run: `npm run build && npm run verifier -- /404 /mentions-legales`
Expected: tous ✓, dont le surlignage de « Cookies ».

```bash
git add src/pages/404.astro src/pages/mentions-legales.astro
git commit -m "404 et mentions légales Braise : sommaire en ancres surligné à la lecture"
```

---

### Task 12: Documentation et vérification finale

**Files:** Modify `context/CONTEXT-MOAMIND.md`, `README.md`, `src/config.ts` (description)

- [ ] **Step 1: `context/CONTEXT-MOAMIND.md`**

Mettre à jour :
- « Direction artistique du site » : remplacer la section par le système Braise (jetons du § 2 de la spec, Plus Jakarta Sans + Geist, bandeau en biais, iPhone 3D, cartes arrondies, couleurs produit sur les études).
- Règle 2 : « Les écrans de l'accueil sont dans des iPhone en 3D ; celui de devant, dans le hero, est visible en entier. Aucun nom d'application. »
- Positionnement : retirer « produits maison » et « le site le dit explicitement » ; les réalisations sont présentées sans dire qui les a créées, par leurs bénéfices utilisateur.
- Voix : pas de première personne du studio sur Accueil, Réalisations, études de cas, Contact, Message reçu.
- Nouvelle règle 8 : « Aucune personne réelle sur les écrans. Les écrans Teamago sont anonymisés au rendu (`scripts/anonymiser.mjs`) ; le club s'appelle « Les Hérons ». »
- Parcours : ajouter Business Analyst.
- Historique : « Le 10 septembre 2026, la direction éditoriale est remplacée par la direction « Braise », jugée plus moderne et moins générique. »

- [ ] **Step 2: `README.md`**

Mettre à jour la description des polices et des composants, et documenter `npm test`, `npm run verifier` (avec `npm run preview` au préalable) et `npm run ecrans -- <projet>`.

- [ ] **Step 3: Vérification complète**

Run :

```bash
npm test
npx astro check
npm run build
npm run preview &
sleep 4
npm run verifier
```

Expected : tests verts, `astro check` 0 erreur, build OK, « Tout est vert. » sur les onze pages.

- [ ] **Step 4: Captures pour l'utilisateur**

Capturer les onze pages à 1440 et 390 px (Chrome headless, pleine page) dans le dossier scratchpad de la session, et les comparer aux maquettes.

- [ ] **Step 5: Commit**

```bash
git add context/CONTEXT-MOAMIND.md README.md src/config.ts
git commit -m "Contexte et README à jour de la refonte Braise"
```
