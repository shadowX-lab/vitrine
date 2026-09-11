# Site bilingue français / anglais — plan d'implémentation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Proposer tout le site Moamind en anglais sous `/vitrine/en/…`, avec une mappemonde de choix de langue dans l'en-tête et un lien en pied de page, sans dupliquer la mise en page.

**Architecture:** Chaque page devient une vue (`src/vues/*.astro`) qui reçoit sa langue et lit ses textes dans un module `src/i18n/<page>.ts` exportant `{ fr, en }`. Des routes minces (`src/pages/*.astro`, `src/pages/en/*.astro`) appellent la vue. Une table unique (`src/i18n/routes.ts`) donne l'adresse de chaque page dans chaque langue ; `lien(page, langue, slug?)` la préfixe de la base `/vitrine`.

**Tech Stack:** Astro 5 (statique), TypeScript, CSS natif, tests `node:test` (Node 24, TypeScript lu nativement), vérification Chrome headless (`scripts/verifier-site.mjs`).

**Spec:** `docs/superpowers/specs/2026-09-11-site-bilingue-design.md`

## Global Constraints

- Les adresses françaises ne changent pas ; l'anglais vit sous `/vitrine/en/` : `/en/`, `/en/method`, `/en/work`, `/en/work/<slug>`, `/en/experience`, `/en/contact`, `/en/thank-you`, `/en/legal-notice`, `/en/404`.
- Aucune redirection automatique selon la langue du navigateur.
- Anglais américain. Adaptation, pas mot à mot : ton direct, phrases courtes, aucun jargon d'agence.
- Voix anglaise : « we » uniquement quand la phrase montre le client et Xavier ensemble ; « I » là où le français dit « je » (Méthode, Expérience, mentions légales, 404) ; jamais « we » pour le studio ; accueil, réalisations, études de cas, contact et message reçu sans aucune première personne du studio (exception : « Describe my project »).
- Lexique : Method · Work · Experience · Contact ; Describe my project ; See the work ; Scoping note ; Slice ; Case study ; Message received ; Legal notice ; Reply within two business days ; MOA = *maîtrise d'ouvrage*, « the client side of a project — that's you ».
- Noms jamais traduits, avec `translate="no"` : Moamind Solutions, Pil'Poil, ChargeAir, Teamago.
- Titres `h1` à deux parties : ligne grasse puis ligne légère, sans virgule, point final sur la ligne légère.
- Aucun mot seul (ni deux mots courts) en fin de ligne, dans les deux langues (règle vérifiée par `npm run verifier`).
- Les fichiers importés par les tests Node (`src/i18n/*.ts`, `src/data/produits.ts`, `src/lib/typo.ts`) n'ont que des `import type` : Node n'accepte pas les imports sans extension.
- Le HTML inséré avec `set:html` ne provient que des fichiers du dépôt.
- Commits sur la branche `refonte-braise`, messages en français, terminés par :
  ```
  Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01XQvKQKVRT23P8QGtySUQVP
  ```
- Ne rien pousser et ne rien fusionner dans `main` sans l'accord explicite de l'utilisateur (un push sur `main` publie le site).
- `README.md` et `context/CONTEXT-MOAMIND.md` ont des modifications non commitées qui ne viennent pas de ce plan : ne jamais les inclure dans un commit sans l'accord de l'utilisateur.

## Vérifications disponibles

- `npm test` : tests unitaires (`tests/*.test.mjs`).
- `npm run build` : génère `dist/`.
- `npm run verifier -- /page …` : contrôles dans Chrome contre `http://localhost:4321/vitrine`. Lancer d'abord un serveur : `npx astro dev --port 4321` en arrière-plan (ou `npm run build && npx astro preview --port 4321`). Sans argument, parcourt toutes les pages de la liste `TOUTES`.

## Structure des fichiers

| Fichier | Rôle |
|---|---|
| `src/i18n/routes.ts` (créé) | Types `Langue`, `Page` ; table `ROUTES` ; `chemin()`, `autre()`, `LANGUES`, `NOMS_LANGUES` |
| `src/i18n/types.ts` (créé) | Type `Titre` |
| `src/i18n/commun.ts` (créé) | Textes partagés : navigation, pied de page, boutons récurrents |
| `src/i18n/{accueil,methode,realisations,experience,contact,merci,mentions,introuvable}.ts` (créés) | Textes de chaque page, `{ fr, en }` |
| `src/config.ts` (modifié) | `lien(page, langue, slug?)`, `ressource()`, `equivalent()` ; `STUDIO` sans textes |
| `src/lib/typo.ts`, `src/middleware.ts` (modifiés) | Typographie selon la langue |
| `src/layouts/Base.astro` (modifié) | `lang`, métadonnées, `hreflang`, `noindex` |
| `src/components/Entete.astro`, `PiedDePage.astro`, `AppelFinal.astro`, `Icone.astro` (modifiés) | Textes par langue, sélecteur, icône `globe` |
| `src/components/SelecteurLangue.astro` (créé) | Mappemonde et menu Français / English |
| `src/data/produits.ts` (modifié) | Textes des réalisations dans `textes: { fr, en }`, `localiser()` |
| `src/vues/*.astro` (créés) | Balisage et style de chaque page, sans texte en dur |
| `src/pages/**` (réduits) et `src/pages/en/**` (créés) | Routes minces |
| `scripts/verifier-site.mjs` (modifié) | Pages anglaises, sélecteur, titres ajustés |
| `tests/routes.test.mjs`, `tests/i18n.test.mjs` (créés), `tests/typo.test.mjs`, `tests/produits.test.mjs` (modifiés) | Tests |
| `astro.config.mjs` (modifié) | 404 exclues du sitemap |

## Méthode commune pour convertir une page en vue (tâches 5 à 11)

Chaque tâche de page applique exactement ces règles ; la tâche 5 (Message reçu) les montre en entier.

1. Créer `src/i18n/<page>.ts` sur ce modèle :
   ```ts
   import type { Langue } from './routes';
   import type { Titre } from './types';

   const fr = { /* textes français, VERBATIM depuis la page actuelle */ };
   const en: typeof fr = { /* traduction, mêmes clés */ };

   const textes: Record<Langue, typeof fr> = { fr, en };
   export default textes;
   ```
   Les valeurs françaises sont copiées caractère pour caractère depuis la page actuelle (apostrophes, `&nbsp;`, `’` compris). Un texte qui contient du HTML (`<strong>`, `<br />`, `&nbsp;`, `<span translate="no">`) reste une chaîne et sera rendu avec `set:html`.
2. Créer `src/vues/<Vue>.astro` : copier la page actuelle entière (frontmatter, balisage, `<script>`, `<style>`), puis :
   - ajouter `import type { Langue } from '../i18n/routes';`, `import textes from '../i18n/<page>';`, `import commun from '../i18n/commun';`, et `interface Props { langue: Langue }` ; `const { langue } = Astro.props; const t = textes[langue]; const c = commun[langue];` ;
   - remplacer chaque texte en dur par sa clé (`{t.cle}`, ou `<p set:html={t.cle} />` pour une chaîne HTML) ;
   - remplacer `lien('/x')` par `lien('<page>', langue)` selon la table des routes ;
   - passer `langue` et `page` à `<Base>` et `langue` à `<AppelFinal>` ;
   - les chemins d'import passent de `../` (pages) à `../` (vues) : les deux dossiers sont au même niveau sous `src/`, les imports relatifs restent donc identiques, sauf pour `realisations/[slug].astro` (`../../` → `../`).
3. Remplacer le contenu de la page française par une route mince, et créer la route anglaise :
   ```astro
   ---
   import Vue from '../vues/<Vue>.astro';
   ---
   <Vue langue="fr" />
   ```
4. Vérifier : `npm test`, puis `npm run verifier -- /<page-fr> /en/<page-en>` (la page française doit rester identique : comparer visuellement avant/après à 1440 et 390 px si un doute existe).

---

### Task 1: Table des routes et `lien()` par langue

**Files:**
- Create: `src/i18n/routes.ts`
- Modify: `src/config.ts`
- Modify (appels de `lien`) : `src/layouts/Base.astro:6,17,29`, `src/components/Entete.astro`, `src/components/PiedDePage.astro`, `src/components/AppelFinal.astro:9`, `src/pages/index.astro:45-46,93,129,144`, `src/pages/404.astro:17-18`, `src/pages/merci.astro:16-17`, `src/pages/contact.astro:7`, `src/pages/realisations/index.astro:34`, `src/pages/realisations/[slug].astro:31,100`
- Test: `tests/routes.test.mjs`

**Interfaces:**
- Produces:
  - `type Langue = 'fr' | 'en'`, `LANGUES: readonly Langue[]`, `NOMS_LANGUES: Record<Langue, string>`, `autre(l: Langue): Langue`
  - `type Page = 'accueil' | 'methode' | 'realisations' | 'etude' | 'experience' | 'contact' | 'merci' | 'mentions'`
  - `ROUTES: Record<Page, Record<Langue, string>>`, `chemin(page: Page, langue: Langue, slug?: string): string` (sans la base)
  - `lien(page: Page, langue: Langue, slug?: string): string` (avec la base, dans `src/config.ts`)
  - `ressource(fichier: string): string` (base + fichier statique)
  - `equivalent(langue: Langue, page?: Page, slug?: string): string` (page donnée dans `langue`, ou accueil de `langue` si `page` absent)

- [ ] **Step 1: Écrire le test qui échoue**

`tests/routes.test.mjs` :
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES, LANGUES, chemin, autre } from '../src/i18n/routes.ts';

test('chaque page a une adresse dans chaque langue', () => {
  for (const [page, adresses] of Object.entries(ROUTES)) {
    for (const l of LANGUES) assert.ok(adresses[l]?.startsWith('/'), `${page}.${l}`);
  }
});

test('les adresses françaises actuelles ne changent pas', () => {
  assert.equal(chemin('accueil', 'fr'), '/');
  assert.equal(chemin('methode', 'fr'), '/methode');
  assert.equal(chemin('realisations', 'fr'), '/realisations');
  assert.equal(chemin('etude', 'fr', 'pilpoil'), '/realisations/pilpoil');
  assert.equal(chemin('experience', 'fr'), '/experience');
  assert.equal(chemin('contact', 'fr'), '/contact');
  assert.equal(chemin('merci', 'fr'), '/merci');
  assert.equal(chemin('mentions', 'fr'), '/mentions-legales');
});

test('les adresses anglaises sont sous /en/ et en anglais', () => {
  assert.equal(chemin('accueil', 'en'), '/en/');
  assert.equal(chemin('methode', 'en'), '/en/method');
  assert.equal(chemin('realisations', 'en'), '/en/work');
  assert.equal(chemin('etude', 'en', 'teamago'), '/en/work/teamago');
  assert.equal(chemin('merci', 'en'), '/en/thank-you');
  assert.equal(chemin('mentions', 'en'), '/en/legal-notice');
});

test('une étude de cas exige un slug', () => {
  assert.throws(() => chemin('etude', 'fr'), /slug/);
});

test('autre() donne l’autre langue', () => {
  assert.equal(autre('fr'), 'en');
  assert.equal(autre('en'), 'fr');
});
```

- [ ] **Step 2: Lancer le test, vérifier qu'il échoue**

Run: `npm test`
Expected: FAIL, `Cannot find module …/src/i18n/routes.ts`.

- [ ] **Step 3: Créer `src/i18n/routes.ts`**

```ts
/** Les langues du site et l'adresse de chaque page dans chacune (sans la base /vitrine). */

export type Langue = 'fr' | 'en';
export const LANGUES: readonly Langue[] = ['fr', 'en'];

/** Toujours écrits dans leur propre langue, quelle que soit la page. */
export const NOMS_LANGUES: Record<Langue, string> = { fr: 'Français', en: 'English' };

export const autre = (langue: Langue): Langue => (langue === 'fr' ? 'en' : 'fr');

export type Page = 'accueil' | 'methode' | 'realisations' | 'etude' | 'experience' | 'contact' | 'merci' | 'mentions';

export const ROUTES: Record<Page, Record<Langue, string>> = {
  accueil: { fr: '/', en: '/en/' },
  methode: { fr: '/methode', en: '/en/method' },
  realisations: { fr: '/realisations', en: '/en/work' },
  etude: { fr: '/realisations/:slug', en: '/en/work/:slug' },
  experience: { fr: '/experience', en: '/en/experience' },
  contact: { fr: '/contact', en: '/en/contact' },
  merci: { fr: '/merci', en: '/en/thank-you' },
  mentions: { fr: '/mentions-legales', en: '/en/legal-notice' },
};

export function chemin(page: Page, langue: Langue, slug?: string): string {
  const modele = ROUTES[page][langue];
  if (!modele.includes(':slug')) return modele;
  if (!slug) throw new Error(`Un slug est requis pour la page « ${page} »`);
  return modele.replace(':slug', slug);
}
```

- [ ] **Step 4: Remplacer `lien()` dans `src/config.ts`**

Remplacer la fonction `lien` actuelle (lignes 21-25) par :
```ts
import { chemin, type Langue, type Page } from './i18n/routes';

const base = () => import.meta.env.BASE_URL.replace(/\/$/, '');

/** Adresse d'une page dans une langue, base du site comprise (nécessaire sous /vitrine). */
export function lien(page: Page, langue: Langue, slug?: string): string {
  const c = chemin(page, langue, slug);
  return c === '/' ? base() || '/' : `${base()}${c}`;
}

/** Adresse d'un fichier statique de `public/`, sans notion de langue. */
export function ressource(fichier: string): string {
  return `${base()}${fichier}`;
}

/** La page donnée, dans la langue demandée ; sans page (404), l'accueil de cette langue. */
export function equivalent(langue: Langue, page?: Page, slug?: string): string {
  return page ? lien(page, langue, slug) : lien('accueil', langue);
}
```
L'`import` va en tête de fichier.

- [ ] **Step 5: Mettre à jour chaque appel**

Correspondance exacte (tout en français pour l'instant) :

| Ancien | Nouveau |
|---|---|
| `lien('/')` | `lien('accueil', 'fr')` |
| `lien('/methode')` | `lien('methode', 'fr')` |
| `lien('/realisations')` | `lien('realisations', 'fr')` |
| ``lien(`/realisations/${p.slug}`)`` | `lien('etude', 'fr', p.slug)` |
| ``lien(`/realisations/${s.slug}`)`` | `lien('etude', 'fr', s.slug)` |
| `lien('/experience')` | `lien('experience', 'fr')` |
| `lien('/contact')` | `lien('contact', 'fr')` |
| `lien('/merci')` | `lien('merci', 'fr')` |
| `lien('/mentions-legales')` | `lien('mentions', 'fr')` |
| `lien('/og.png')`, `lien('/favicon.svg')` (Base) | `ressource('/og.png')`, `ressource('/favicon.svg')` |

Dans `Entete.astro`, la liste `liens` porte des chemins passés à `lien(l.href)` : la remplacer par
```ts
const liens: { page: Page; texte: string }[] = [
  { page: 'methode', texte: 'Méthode' },
  { page: 'realisations', texte: 'Réalisations' },
  { page: 'experience', texte: 'Expérience' },
];
```
avec `import type { Page } from '../i18n/routes';`, les liens en `lien(l.page, 'fr')`, et `courant` inchangé mais appelé avec `chemin(l.page, 'fr')` (importer `chemin`).

Vérifier qu'il ne reste aucun ancien appel : `grep -rn "lien('/\|lien(\`/" src` ne doit rien renvoyer.

- [ ] **Step 6: Lancer les tests et le build**

Run: `npm test && npm run build`
Expected: tous les tests passent (30), build `11 page(s) built`.

- [ ] **Step 7: Vérifier dans Chrome que rien n'a bougé**

Run (serveur de dev lancé sur 4321) : `npm run verifier`
Expected: `Tout est vert.`

- [ ] **Step 8: Commit**

```bash
git add src/i18n/routes.ts src/config.ts src/layouts/Base.astro src/components src/pages tests/routes.test.mjs
git commit -m "Table des routes par langue et lien(page, langue)"
```

---

### Task 2: Typographie selon la langue

**Files:**
- Modify: `src/lib/typo.ts:112-137` (`typographierHtml`)
- Modify: `src/middleware.ts`
- Test: `tests/typo.test.mjs`

**Interfaces:**
- Consumes: `type Langue` (Task 1), en `import type`.
- Produces: `typographierHtml(html: string, langue?: Langue): string` (défaut `'fr'`).

- [ ] **Step 1: Écrire les tests qui échouent** (ajouter à la fin de `tests/typo.test.mjs`)

```js
test('en anglais, aucune espace n’est ajoutée avant la ponctuation', () => {
  const html = '<p>Ready? Here is the plan: three steps, one call!</p>';
  assert.ok(!typographierHtml(html, 'en').includes(FINE));
  assert.ok(typographierHtml(html, 'en').includes('Ready? Here is the plan: three'));
});

test('en anglais, les trois derniers mots d’un paragraphe restent liés', () => {
  assert.equal(
    typographierHtml('<p>Nothing gets built until you say yes.</p>', 'en'),
    `<p>Nothing gets built until you${NBSP}say${NBSP}yes.</p>`,
  );
});

test('en anglais, virgule et point des h1 sont resserrés comme en français', () => {
  assert.equal(typographierHtml('<h1>Product before code.</h1>', 'en'), '<h1>Product before code<span class="ponct">.</span></h1>');
});
```

- [ ] **Step 2: Lancer, vérifier l'échec**

Run: `npm test`
Expected: FAIL sur le premier test (une fine insécable est ajoutée avant `?`).

- [ ] **Step 3: Rendre `typographierHtml` sensible à la langue**

Dans `src/lib/typo.ts` : ajouter en tête `import type { Langue } from '../i18n/routes';`, changer la signature en `export function typographierHtml(html: string, langue: Langue = 'fr'): string {`, et remplacer la ligne
```ts
    let texte = ponctuationFrancaise(jeton);
```
par
```ts
    // Les espaces avant : ; ! ? et dans les guillemets sont une règle française ; en anglais, ce seraient des fautes.
    let texte = langue === 'fr' ? ponctuationFrancaise(jeton) : jeton;
```
Mettre à jour le commentaire d'en-tête du fichier : le point 2 devient « En français seulement : espaces insécables… ».

- [ ] **Step 4: Lire la langue dans le middleware**

Dans `src/middleware.ts`, remplacer les deux dernières lignes du gestionnaire par :
```ts
  const html = await reponse.text();
  const langue = /<html[^>]*\blang="en"/.test(html) ? 'en' : 'fr';
  return new Response(typographierHtml(html, langue), { status: reponse.status, headers: reponse.headers });
```
et le commentaire de tête par « Typographie de chaque page HTML, selon la langue déclarée par `<html lang>`, au build comme en développement. »

- [ ] **Step 5: Lancer les tests**

Run: `npm test`
Expected: PASS (33 tests).

- [ ] **Step 6: Commit**

```bash
git add src/lib/typo.ts src/middleware.ts tests/typo.test.mjs
git commit -m "Typographie : règles françaises réservées aux pages en français"
```

---

### Task 3: Textes communs, gabarit et composants partagés par langue

**Files:**
- Create: `src/i18n/types.ts`, `src/i18n/commun.ts`
- Create: `tests/i18n.test.mjs`
- Modify: `src/config.ts` (retirer `accroche` et `description` de `STUDIO`)
- Modify: `src/layouts/Base.astro`, `src/components/Entete.astro`, `src/components/PiedDePage.astro`, `src/components/AppelFinal.astro`
- Modify (appels) : toutes les pages qui utilisent `<Base>`, `<AppelFinal>` ou `STUDIO.accroche` / `STUDIO.description`

**Interfaces:**
- Consumes: `Langue`, `Page`, `lien`, `ressource` (Task 1).
- Produces:
  - `type Titre = { gras: string; leger: string }` (`src/i18n/types.ts`)
  - `commun[langue]` avec les clés : `accroche`, `description`, `sautContenu`, `accueil`, `nav.{aria,methode,realisations,experience,ouvrirMenu}`, `cta`, `voirRealisations`, `retourAccueil`, `rdv`, `langue.{choisir,pied}`, `pied.{aria,phrase,travail,studio,contact,base,mentions}`
  - `<Base titre description langue page? slug? suffixe? indexer?>`
  - `<Entete langue page? slug?>`, `<PiedDePage langue page? slug?>`, `<AppelFinal titre texte langue>`

- [ ] **Step 1: Écrire le test de structure des traductions**

`tests/i18n.test.mjs` :
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';

const dossier = new URL('../src/i18n/', import.meta.url);
const modules = readdirSync(dossier).filter((f) => f.endsWith('.ts') && !['routes.ts', 'types.ts'].includes(f));

/** Réduit une valeur à sa forme : mêmes clés, mêmes longueurs de listes, mêmes types. */
function forme(v) {
  if (Array.isArray(v)) return v.map(forme);
  if (v && typeof v === 'object') return Object.fromEntries(Object.keys(v).sort().map((k) => [k, forme(v[k])]));
  return typeof v;
}
function vides(v, chemin = '') {
  if (typeof v === 'string') return v.trim() ? [] : [chemin];
  if (v && typeof v === 'object') return Object.entries(v).flatMap(([k, x]) => vides(x, `${chemin}.${k}`));
  return [];
}

test('au moins le module commun existe', () => assert.ok(modules.includes('commun.ts')));

for (const fichier of modules) {
  test(`${fichier} : l’anglais a exactement la forme du français`, async () => {
    const { default: textes } = await import(new URL(fichier, dossier));
    assert.deepEqual(forme(textes.en), forme(textes.fr));
  });
  test(`${fichier} : aucun texte anglais vide`, async () => {
    const { default: textes } = await import(new URL(fichier, dossier));
    assert.deepEqual(vides(textes.en), []);
  });
}
```

- [ ] **Step 2: Lancer, vérifier l'échec**

Run: `npm test`
Expected: FAIL sur « au moins le module commun existe ».

- [ ] **Step 3: Créer `src/i18n/types.ts` et `src/i18n/commun.ts`**

`src/i18n/types.ts` :
```ts
/** Titre à deux parties : la vue pose le retour à la ligne et le style léger. */
export type Titre = { gras: string; leger: string };
```

`src/i18n/commun.ts` :
```ts
import type { Langue } from './routes';

const fr = {
  accroche: 'Le produit avant le code',
  description: "Conception et développement d'applications web et mobiles. On cadre le problème, vous validez les écrans, rien ne se construit avant.",
  sautContenu: 'Aller au contenu',
  /** Complète le nom du studio dans le nom accessible du logo : « Moamind Solutions, accueil ». */
  accueil: 'accueil',
  nav: { aria: 'Navigation principale', methode: 'Méthode', realisations: 'Réalisations', experience: 'Expérience', ouvrirMenu: 'Ouvrir le menu' },
  cta: 'Décrire mon projet',
  voirRealisations: 'Voir les réalisations',
  retourAccueil: "Retour à l'accueil",
  rdv: 'Réserver 30 minutes',
  langue: { choisir: 'Choisir la langue', pied: 'Langue' },
  pied: {
    aria: 'Navigation de pied de page',
    phrase: 'Votre produit est étudié, cadré et validé avant la première ligne de code.',
    travail: 'Le travail',
    studio: 'Le studio',
    contact: 'Contact',
    base: 'Basé à Bordeaux, au travail partout',
    mentions: 'Mentions légales',
  },
};

const en: typeof fr = {
  accroche: 'Product before code',
  description: 'Design and development of web and mobile apps. The problem gets scoped, you approve the screens, and nothing gets built before that.',
  sautContenu: 'Skip to content',
  accueil: 'home',
  nav: { aria: 'Main navigation', methode: 'Method', realisations: 'Work', experience: 'Experience', ouvrirMenu: 'Open menu' },
  cta: 'Describe my project',
  voirRealisations: 'See the work',
  retourAccueil: 'Back to home',
  rdv: 'Book 30 minutes',
  langue: { choisir: 'Choose language', pied: 'Language' },
  pied: {
    aria: 'Footer navigation',
    phrase: 'Your product is studied, scoped and approved before the first line of code.',
    travail: 'The work',
    studio: 'The studio',
    contact: 'Contact',
    base: 'Based in Bordeaux, working everywhere',
    mentions: 'Legal notice',
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
```

- [ ] **Step 4: Lancer les tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: `STUDIO` sans textes**

Dans `src/config.ts`, retirer `accroche` et `description` de `STUDIO` (il garde `nom`, `nomCourt`, `nomSuffixe`, `ville`). Dans `src/pages/index.astro:37`, remplacer
`<Base titre={`${STUDIO.nom} — ${STUDIO.accroche}`} description={STUDIO.description} suffixe={false}>` par
`<Base titre={`${STUDIO.nom} — ${commun.fr.accroche}`} description={commun.fr.description} suffixe={false} langue="fr" page="accueil">` avec `import commun from '../i18n/commun';`.

- [ ] **Step 6: `Base.astro` par langue**

Remplacer le frontmatter et les lignes concernées :
```astro
---
import '../styles/global.css';
import jakarta from '@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2?url';
import Entete from '../components/Entete.astro';
import PiedDePage from '../components/PiedDePage.astro';
import { ressource, STUDIO } from '../config';
import commun from '../i18n/commun';
import type { Langue, Page } from '../i18n/routes';

interface Props {
  titre: string;
  description: string;
  langue: Langue;
  /** Identifiant de la page dans la table des routes ; absent pour la 404. */
  page?: Page;
  slug?: string;
  /** Ajouté tel quel après le titre. Laisser vide pour la page d'accueil. */
  suffixe?: boolean;
  /** Faux pour les pages que les moteurs ne doivent pas indexer (404). */
  indexer?: boolean;
}

const { titre, description, langue, page, slug, suffixe = true, indexer = true } = Astro.props;
const c = commun[langue];
const titreComplet = suffixe ? `${titre} · ${STUDIO.nom}` : titre;
const canonique = new URL(Astro.url.pathname, Astro.site);
const image = new URL(ressource('/og.png'), Astro.site);
---

<!doctype html>
<html lang={langue}>
```
Dans le `<head>` : `href={ressource('/favicon.svg')}`, `<meta property="og:locale" content={langue === 'fr' ? 'fr_FR' : 'en_US'} />`, et ajouter `{!indexer && <meta name="robots" content="noindex" />}` après la description. Dans le `<body>` :
```astro
    <a class="saut-contenu" href="#contenu">{c.sautContenu}</a>
    <Entete langue={langue} page={page} slug={slug} />
    <main id="contenu"><slot /></main>
    <PiedDePage langue={langue} page={page} slug={slug} />
```
(Les `hreflang` et `og:locale:alternate` arrivent à la tâche 12, quand toutes les pages anglaises existent.)

- [ ] **Step 7: `Entete.astro` par langue**

Frontmatter :
```astro
---
import { lien, STUDIO } from '../config';
import commun from '../i18n/commun';
import type { Langue, Page } from '../i18n/routes';
interface Props { langue: Langue; page?: Page; slug?: string }
const { langue, page } = Astro.props;
const c = commun[langue];
const liens: { page: Page; texte: string }[] = [
  { page: 'methode', texte: c.nav.methode },
  { page: 'realisations', texte: c.nav.realisations },
  { page: 'experience', texte: c.nav.experience },
];
/** Une étude de cas relève de la rubrique Réalisations. */
const courant = (p: Page) => (p === page || (p === 'realisations' && page === 'etude') ? 'page' : undefined);
---
```
Balisage : logo `href={lien('accueil', langue)}` et `aria-label={`${STUDIO.nom}, ${c.accueil}`}` ; `<nav aria-label={c.nav.aria}>` ; liens `href={lien(l.page, langue)} aria-current={courant(l.page)}` ; CTA et entrée du menu mobile `href={lien('contact', langue)}` avec `{c.cta}` ; `<summary aria-label={c.nav.ouvrirMenu}>`. Le style ne change pas.

- [ ] **Step 8: `PiedDePage.astro` par langue**

Frontmatter :
```astro
---
import { lien, STUDIO } from '../config';
import commun from '../i18n/commun';
import type { Langue, Page } from '../i18n/routes';
interface Props { langue: Langue; page?: Page; slug?: string }
const { langue } = Astro.props;
const c = commun[langue];
---
```
Balisage : logo `href={lien('accueil', langue)}`, `<p>{c.pied.phrase}</p>`, `<nav aria-label={c.pied.aria}>`, `<h2>{c.pied.travail}</h2>` (liens Méthode et Réalisations avec `c.nav.*` et `lien(…, langue)`), `<h2>{c.pied.studio}</h2>` (Expérience, `{c.pied.contact}`), ligne du bas `© {année} {STUDIO.nom} · {c.pied.base}` et `<a href={lien('mentions', langue)}>{c.pied.mentions}</a>`.

- [ ] **Step 9: `AppelFinal.astro` par langue**

```astro
---
import { lien, LIEN_RDV } from '../config';
import commun from '../i18n/commun';
import type { Langue } from '../i18n/routes';
interface Props { titre: string; texte: string; langue: Langue }
const { titre, texte, langue } = Astro.props;
const c = commun[langue];
---
```
Bouton plein : `href={lien('contact', langue)}` et `{c.cta}` ; bouton de rendez-vous : `{c.rdv}`.

- [ ] **Step 10: Passer la langue depuis chaque page**

Chaque `<Base …>` reçoit `langue="fr"` et `page` : `index` → `accueil`, `methode` → `methode`, `realisations/index` → `realisations`, `realisations/[slug]` → `etude` avec `slug={p.slug}`, `experience` → `experience`, `contact` → `contact`, `merci` → `merci`, `mentions-legales` → `mentions`, `404` → aucune page et `indexer={false}`. Chaque `<AppelFinal …>` reçoit `langue="fr"`.

- [ ] **Step 11: Vérifier**

Run: `npm test && npm run build`, puis `npm run verifier`
Expected: tests verts, build OK, `Tout est vert.` (le site français est identique).

- [ ] **Step 12: Commit**

```bash
git add src/i18n src/config.ts src/layouts src/components src/pages tests/i18n.test.mjs
git commit -m "Textes communs et gabarit par langue : en-tête, pied de page, appel final"
```

---

### Task 4: Réalisations : textes par langue dans `produits.ts`

**Files:**
- Modify: `src/data/produits.ts`
- Modify: `tests/produits.test.mjs`
- Modify (lecture des produits) : `src/pages/realisations/index.astro`, `src/pages/realisations/[slug].astro`

**Interfaces:**
- Consumes: `type Langue` (Task 1), en `import type`.
- Produces:
  - `type TextesProduit = { baseline: string; resume: string; domaine: string; plateforme: string; chiffres: { valeur: string; libelle: string }[]; probleme: string[]; citation: string; parcoursIntro: string; parcours: { titre: string; texte: string; suite?: string }[]; benefices: { titre: string; texte: string }[]; livre: string[] }`
  - `type Produit = { slug; nom; annee; depot?; palette; heros; ecrans: EcranEtape[]; icones: Icone[]; suivant: string; textes: Record<Langue, TextesProduit> }` avec `type EcranEtape = { fichier: string; haut: string; statut?: string }`
  - `type ProduitLocalise` : champs de `Produit` sans `textes`/`ecrans`/`icones`, plus ceux de `TextesProduit`, avec `parcours: (EcranEtape & { titre; texte; suite? })[]` et `benefices: { icone: Icone; titre: string; texte: string }[]`
  - `localiser(p: Produit, langue: Langue): ProduitLocalise`
  - `parSlug`, `eventail`, `rangee` inchangés.

- [ ] **Step 1: Mettre les tests à la nouvelle forme** (`tests/produits.test.mjs`)

Remplacer les trois premiers tests par :
```js
import { produits, eventail, rangee, localiser } from '../src/data/produits.ts';
const LANGUES = ['fr', 'en'];

test('trois produits complets, dans chaque langue', () => {
  assert.equal(produits.length, 3);
  for (const p of produits) {
    assert.equal(p.ecrans.length, 4, p.slug);
    assert.equal(p.icones.length, 3, p.slug);
    assert.equal(p.heros.length, 2, p.slug);
    for (const c of ['p1', 'p2', 'p3', 'accent', 'voile', 'contraste', 'clair', 'fonce']) assert.match(p.palette[c], HEX, `${p.slug}.${c}`);
    for (const l of LANGUES) {
      const t = p.textes[l];
      assert.equal(t.parcours.length, 4, `${p.slug}.${l}`);
      assert.equal(t.benefices.length, 3, `${p.slug}.${l}`);
      assert.equal(t.chiffres.length, 3, `${p.slug}.${l}`);
      assert.equal(t.parcours.at(-1).suite, undefined, `${p.slug}.${l}`);
      assert.deepEqual(Object.keys(t).sort(), Object.keys(p.textes.fr).sort(), `${p.slug}.${l}`);
    }
  }
});

test('localiser() réunit écrans et textes du parcours', () => {
  const p = localiser(produits[0], 'en');
  assert.equal(p.parcours[0].fichier, produits[0].ecrans[0].fichier);
  assert.equal(p.parcours[0].titre, produits[0].textes.en.parcours[0].titre);
  assert.equal(p.benefices[0].icone, produits[0].icones[0]);
});

test('les études s’enchaînent en boucle', () => {
  const vus = new Set();
  let p = produits[0];
  for (let i = 0; i < 3; i++) { vus.add(p.slug); p = produits.find((x) => x.slug === p.suivant); }
  assert.equal(vus.size, 3);
  assert.equal(p.slug, produits[0].slug);
});

test('aucun texte français ne parle de produit maison, de « je » ni de fonctionnement plutôt que de bénéfice', () => {
  const textes = JSON.stringify(produits.map((p) => p.textes.fr));
  for (const motif of [/maison/i, /\bje\b/i, /\bj'/i, /références clients/i, /on vend/i, /par les gens/i]) {
    assert.ok(!motif.test(textes), `motif ${motif} trouvé`);
  }
});

test('aucun texte anglais ne parle à la première personne du studio ni de produit maison', () => {
  const textes = JSON.stringify(produits.map((p) => p.textes.en));
  for (const motif of [/\bI\b/, /\bmy\b/i, /\bwe\b/i, /\bour\b/i, /in-house/i]) {
    assert.ok(!motif.test(textes), `motif ${motif} trouvé`);
  }
});
```
Garder le test « l’accueil ne montre aucun écran portant un nom d’application » tel quel.

- [ ] **Step 2: Lancer, vérifier l'échec**

Run: `npm test`
Expected: FAIL (`p.ecrans` indéfini, `localiser` introuvable).

- [ ] **Step 3: Restructurer `src/data/produits.ts`**

Types (remplacent les lignes 3-28) :
```ts
import type { Langue } from '../i18n/routes';

export type Icone = 'prix' | 'horloge' | 'feuille' | 'eclair' | 'cloche' | 'coeur' | 'check' | 'calc' | 'suivi';
export type Ecran = { projet: string; fichier: string; haut: string; statut?: string };
export type EcranEtape = Omit<Ecran, 'projet'>;

export type TextesProduit = {
  baseline: string;
  resume: string;
  domaine: string;
  plateforme: string;
  chiffres: { valeur: string; libelle: string }[];
  probleme: string[];
  citation: string;
  parcoursIntro: string;
  /** Aligné sur `ecrans` : même ordre, même longueur. */
  parcours: { titre: string; texte: string; suite?: string }[];
  /** Aligné sur `icones`. */
  benefices: { titre: string; texte: string }[];
  livre: string[];
};

export type Produit = {
  slug: string;
  nom: string;
  annee: string;
  depot?: string;
  palette: { p1: string; p2: string; p3: string; accent: string; voile: string; contraste: string; clair: string; fonce: string; lueur: string };
  /** Écrans du bandeau : derrière, puis devant. */
  heros: [EcranEtape, EcranEtape];
  /** Les quatre écrans du parcours principal. */
  ecrans: EcranEtape[];
  icones: Icone[];
  suivant: string;
  textes: Record<Langue, TextesProduit>;
};

export type ProduitLocalise = Omit<Produit, 'textes' | 'ecrans' | 'icones'> &
  Omit<TextesProduit, 'parcours' | 'benefices'> & {
    parcours: (EcranEtape & TextesProduit['parcours'][number])[];
    benefices: ({ icone: Icone } & TextesProduit['benefices'][number])[];
  };

/** Le produit tel qu'une page le lit dans une langue : écrans et textes réunis. */
export function localiser(p: Produit, langue: Langue): ProduitLocalise {
  const { textes, ecrans, icones, ...reste } = p;
  const t = textes[langue];
  return {
    ...reste,
    ...t,
    parcours: ecrans.map((e, i) => ({ ...e, ...t.parcours[i]! })),
    benefices: icones.map((icone, i) => ({ icone, ...t.benefices[i]! })),
  };
}
```
Données : pour chaque produit, garder `slug`, `nom`, `annee`, `depot`, `palette`, `heros`, `suivant` ; déplacer `fichier`/`haut`/`statut` de chaque étape de `parcours` vers `ecrans` (même ordre) ; déplacer les `icone` de `benefices` vers `icones` (même ordre) ; déplacer tout le reste (textes) dans `textes.fr`, **verbatim**. Écrire `textes.en` avec la même forme.

Repères de traduction pour `textes.en` (le reste suit les règles de voix et le lexique) :
- `plateforme` : `iOS and Android` / `iOS app` ; `domaine` : `Electric mobility`, `Neighborly help`, `Amateur sports`.
- Montants et unités à l'anglaise : `€12.40`, `€21`, `€581`, `€0.00`, `3–6 h`, `30 s`, `40%`.
- ChargeAir `baseline` : `EV charging between neighbors` ; Pil'Poil : `The network for lost and found pets` ; Teamago : `The money and logistics around the game` (l'accroche produit « Everything but the game » n'est pas affichée ici).
- `suite` (flèches entre écrans), courtes et sans sujet : `Pick a time slot`, `That evening, plug in`, `Then drive off`, etc.
- Aucune première personne du studio : le test du step 1 le vérifie.

- [ ] **Step 4: Lire les produits localisés dans les deux pages actuelles**

`src/pages/realisations/index.astro` : `{produits.map((produit, i) => { const p = localiser(produit, 'fr'); return (<article …>…</article>); })}`, le reste inchangé (`p.baseline`, `p.benefices`, etc. existent toujours sur l'objet localisé).
`src/pages/realisations/[slug].astro` : `const p = localiser(Astro.props.produit, 'fr'); const s = localiser(parSlug(p.suivant), 'fr');` — le reste du fichier lit les mêmes champs qu'avant.

- [ ] **Step 5: Vérifier**

Run: `npm test && npm run build`, puis `npm run verifier -- /realisations /realisations/chargeair /realisations/pilpoil /realisations/teamago`
Expected: tests verts (dont le test anglais), build OK, `Tout est vert.`

- [ ] **Step 6: Commit**

```bash
git add src/data/produits.ts tests/produits.test.mjs src/pages/realisations
git commit -m "Réalisations : textes français et anglais séparés des écrans"
```

---

### Task 5: Message reçu (modèle complet de conversion)

**Files:**
- Create: `src/i18n/merci.ts`, `src/vues/Merci.astro`, `src/pages/en/thank-you.astro`
- Modify: `src/pages/merci.astro` (route mince)

**Interfaces:**
- Consumes: `commun` (Task 3), `lien` (Task 1), `Titre` (Task 3).
- Produces: `src/vues/Merci.astro` avec `Props { langue: Langue }`.

- [ ] **Step 1: Créer `src/i18n/merci.ts`**

```ts
import type { Langue } from './routes';
import type { Titre } from './types';

const fr = {
  meta: { titre: 'Message reçu', description: 'Votre message est bien arrivé.' },
  etiquette: 'Message reçu',
  titre: { gras: "C'est noté.", leger: 'Votre projet sera lu avec attention.' } as Titre,
  sous: 'Vous aurez une réponse sous deux jours ouvrés. Une vraie réponse, écrite après lecture de votre message, pas un accusé de réception.',
  accuse: {
    titre: 'Votre projet est bien arrivé',
    sous: 'Et maintenant :',
    suite: ['Votre message est lu en entier.', 'Une réponse vous parvient sous deux jours ouvrés.', "Un entretien d'une heure est fixé ensemble."],
  },
};

const en: typeof fr = {
  meta: { titre: 'Message received', description: 'Your message has arrived.' },
  etiquette: 'Message received',
  titre: { gras: 'Got it.', leger: 'Your project will be read carefully.' },
  sous: 'You will get a reply within two business days. A real reply, written after reading your message, not an automatic acknowledgment.',
  accuse: {
    titre: 'Your project has arrived',
    sous: 'What happens next:',
    suite: ['Your message is read in full.', 'You get a reply within two business days.', 'We set up a one-hour call together.'],
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
```

- [ ] **Step 2: Lancer les tests**

Run: `npm test`
Expected: PASS, dont « merci.ts : l’anglais a exactement la forme du français ».

- [ ] **Step 3: Créer `src/vues/Merci.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Bande from '../components/Bande.astro';
import { lien } from '../config';
import commun from '../i18n/commun';
import textes from '../i18n/merci';
import type { Langue } from '../i18n/routes';

interface Props { langue: Langue }
const { langue } = Astro.props;
const t = textes[langue];
const c = commun[langue];
---
<Base titre={t.meta.titre} description={t.meta.description} langue={langue} page="merci">
  <Bande hauteur="780px" biais="62%" reserve="0px">
    <div class="merci w">
      <div>
        <span class="etiq">{t.etiquette}</span>
        <h1>{t.titre.gras}<br /><span class="leger">{t.titre.leger}</span></h1>
        <p class="sous">{t.sous}</p>
        <div class="boutons">
          <a class="btn btn--plein" href={lien('realisations', langue)}>{c.voirRealisations}</a>
          <a class="btn btn--contour" href={lien('accueil', langue)}>{c.retourAccueil}</a>
        </div>
      </div>
      <div class="accuse">
        <span class="ok" aria-hidden="true">✓</span>
        <p class="accuse-titre">{t.accuse.titre}</p>
        <p class="accuse-sous">{t.accuse.sous}</p>
        <ol>{t.accuse.suite.map((s) => <li>{s}</li>)}</ol>
      </div>
    </div>
  </Bande>
</Base>
```
puis recopier à l'identique le bloc `<style>` de `src/pages/merci.astro` (lignes 30-44).

- [ ] **Step 4: Routes**

`src/pages/merci.astro` (remplace tout le fichier) :
```astro
---
import Merci from '../vues/Merci.astro';
---
<Merci langue="fr" />
```
`src/pages/en/thank-you.astro` :
```astro
---
import Merci from '../../vues/Merci.astro';
---
<Merci langue="en" />
```

- [ ] **Step 5: Vérifier**

Run: `npm test && npm run build`, puis `npm run verifier -- /merci /en/thank-you`
Expected: `Tout est vert.` Ouvrir `http://localhost:4321/vitrine/en/thank-you` : en-tête, textes et pied de page en anglais ; `/vitrine/merci` inchangé.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/merci.ts src/vues/Merci.astro src/pages/merci.astro src/pages/en/thank-you.astro
git commit -m "Message reçu en français et en anglais"
```

---

### Task 6: Réalisations et études de cas

**Files:**
- Create: `src/i18n/realisations.ts`, `src/vues/Realisations.astro`, `src/vues/Etude.astro`, `src/pages/en/work/index.astro`, `src/pages/en/work/[slug].astro`
- Modify: `src/pages/realisations/index.astro`, `src/pages/realisations/[slug].astro` (routes minces)

**Interfaces:**
- Consumes: `localiser`, `produits`, `parSlug`, `type Produit` (Task 4) ; `commun`, `lien`.
- Produces: `Realisations.astro` (`Props { langue }`), `Etude.astro` (`Props { langue: Langue; produit: Produit }`).

- [ ] **Step 1: Créer `src/i18n/realisations.ts`** selon la méthode commune, avec exactement ces clés (valeurs françaises verbatim depuis les fichiers cités) :

```ts
const fr = {
  meta: { titre: 'Réalisations', description: /* index.astro:13 */ },
  etiquette: 'Réalisations',
  titre: { gras: 'Du besoin', leger: "à l'application." } as Titre,
  sous: /* index.astro:18 */,
  lireEtude: { avant: "Lire l'étude de cas", apres: '→' },   // index.astro:34, le nom du produit entre les deux
  appel: { titre: /* index.astro:44 */, texte: /* index.astro:44 */ },
  etude: {
    filAria: "Fil d'Ariane",
    etiquette: 'Étude de cas',                 // [slug]:32, suivi de « · année »
    fiche: { domaine: 'Domaine', plateforme: 'Plateforme', code: 'Code', depotPublic: 'Dépôt public ↗', depotPrive: 'Dépôt privé' },
    ecranPrincipal: 'écran principal',         // alt de l'iPhone de devant : « Nom, écran principal »
    depart: 'Le point de départ',
    parcours: 'Le parcours principal, en quatre écrans',
    benefices: { titre: "Ce que ça change pour ceux qui s'en servent", lead: /* [slug]:81 */ },
    livre: 'Ce qui a été produit',
    suivante: 'Étude suivante',
    lire: "Lire l'étude de cas →",
    appel: { titre: 'Un produit à cadrer ?', texte: /* [slug]:114 */ },
  },
};
```
Anglais : `meta.titre` et `etiquette` `Work`, titre `{ gras: 'From need', leger: 'to app.' }`, `lireEtude` `{ avant: 'Read the', apres: 'case study →' }` (la vue rend `{avant} <span translate="no">{nom}</span> {apres}`, soit « Read the ChargeAir case study → »), `etude.etiquette` `Case study`, `filAria` `Breadcrumb`, fiche `Field` / `Platform` / `Code` / `Public repository ↗` / `Private repository`, `ecranPrincipal` `main screen`, `depart` `Where it started`, `parcours` `The main journey, in four screens`, `benefices.titre` `What it changes for the people who use it`, `livre` `What was delivered`, `suivante` `Next case study`, `lire` `Read the case study →`, `appel.titre` `A product to scope?`.

- [ ] **Step 2: Lancer les tests** — Run: `npm test` — Expected: PASS.

- [ ] **Step 3: Créer `src/vues/Realisations.astro`** en appliquant la méthode commune à `src/pages/realisations/index.astro` : `const p = localiser(produit, langue)` dans la boucle, lien du bouton `lien('etude', langue, p.slug)`, texte du bouton `<span>{t.lireEtude.avant} <span translate="no">{p.nom}</span> {t.lireEtude.apres}</span>`, `<Base … langue={langue} page="realisations">`, `<AppelFinal titre={t.appel.titre} texte={t.appel.texte} langue={langue} />`.

- [ ] **Step 4: Créer `src/vues/Etude.astro`** à partir de `src/pages/realisations/[slug].astro` : sans `getStaticPaths` (il reste dans les routes), `interface Props { langue: Langue; produit: Produit }`, `const p = localiser(Astro.props.produit, langue); const s = localiser(parSlug(p.suivant), langue);`, textes fixes remplacés par `t.etude.*`, fil d'Ariane `lien('realisations', langue)` et `c.nav.realisations`, étiquette `{t.etude.etiquette} · {p.annee}`, alt `` `${p.nom}, ${t.etude.ecranPrincipal}` ``, lien suivant `lien('etude', langue, s.slug)`, `<Base titre={`${p.nom} — ${p.baseline}`} description={p.resume} langue={langue} page="etude" slug={p.slug}>`.

- [ ] **Step 5: Routes**

`src/pages/realisations/index.astro` :
```astro
---
import Realisations from '../../vues/Realisations.astro';
---
<Realisations langue="fr" />
```
`src/pages/realisations/[slug].astro` :
```astro
---
import Etude from '../../vues/Etude.astro';
import { produits, type Produit } from '../../data/produits';

export function getStaticPaths() {
  return produits.map((produit) => ({ params: { slug: produit.slug }, props: { produit } }));
}
const { produit } = Astro.props as { produit: Produit };
---
<Etude langue="fr" produit={produit} />
```
`src/pages/en/work/index.astro` et `src/pages/en/work/[slug].astro` : identiques avec `../../../` et `langue="en"`.

- [ ] **Step 6: Vérifier**

Run: `npm test && npm run build`, puis `npm run verifier -- /realisations /realisations/chargeair /realisations/pilpoil /realisations/teamago /en/work /en/work/chargeair /en/work/pilpoil /en/work/teamago`
Expected: `Tout est vert.`

- [ ] **Step 7: Commit**

```bash
git add src/i18n/realisations.ts src/vues/Realisations.astro src/vues/Etude.astro src/pages/realisations src/pages/en/work
git commit -m "Réalisations et études de cas en français et en anglais"
```

---

### Task 7: Accueil

**Files:**
- Create: `src/i18n/accueil.ts`, `src/vues/Accueil.astro`, `src/pages/en/index.astro`
- Modify: `src/pages/index.astro` (route mince)

- [ ] **Step 1: Créer `src/i18n/accueil.ts`** avec ces clés (français verbatim depuis `src/pages/index.astro`, numéros de ligne entre parenthèses) :

- Pas de clé `meta` : la vue compose le titre (`Moamind Solutions — ` + `commun.accroche`) et reprend `commun.description`.
- `etiquette` (41), `titre: Titre` (`Le produit` / `avant le code.`), `sous` (43), `preuve: string[]` (48, deux éléments).
- `chipChiens: { titre: '1 chien trouvé', sous: 'à moins de 5 km' }` (56).
- `chipPrix: { estime: 'ESTIMÉ', kwh: { valeur: '12,6', unite: 'kWh ajoutés' }, payer: 'À PAYER', prix: { valeur: '12,40', unite: '€ au total' } }` (59-60).
- `chiffres: { valeur: string; libelle: string }[]` (67-69).
- `conviction: { titre: [string, string], couts: string[], legende: string, paragraphes: string[], chute: string }` (73, 15, 77, 80-81, 82) — `titre[1]` contient `&nbsp;` et les `paragraphes` du `<strong>` : chaînes HTML.
- `methode: { titre, lead, lien, etapes: { delai: string; titre: string; texte: string }[], visuels: { note: string; correction: string; v1: string; v1Items: string[]; plusTard: string; plusTardItems: string[]; remonter: string; valide: string; tranches: { nom: string; etat: string }[] } }` (90-118).
- `realisations: { titre, lead, lien }` (126-129).
- `experience: { titre, lead, parcours: string[], lien, motsCles: [string, boolean][] }` (141-144, 24-28).
- `services: { titre, lead, items: { titre: string; texte: string }[] }` (151, 16-23 ; les icônes restent dans la vue, dans le même ordre).
- `appel: { titre, texte }` (157).

Anglais : titre `{ gras: 'Product', leger: 'before code.' }` ; `chipChiens` `{ titre: '1 dog found', sous: 'within 5 km' }` ; `chipPrix` `ESTIMATED` / `12.6` / `kWh added` / `TO PAY` / `12.40` / `€ total` ; `conviction.titre` `['Code is not the point.', 'It is the&nbsp;consequence.']` ; `methode.lien` `The method in detail →` ; `realisations.lien` `See the work →` ; `experience.lien` `See the background →` ; aucune première personne du studio (règle de l'accueil).

- [ ] **Step 2: Lancer les tests** — Run: `npm test` — Expected: PASS.

- [ ] **Step 3: Créer `src/vues/Accueil.astro`** par la méthode commune ; `<Base titre={`${STUDIO.nom} — ${c.accroche}`} description={c.description} suffixe={false} langue={langue} page="accueil">` ; les icônes de services restent un tableau local `const icones = ['cadrage', 'interface', 'mobile', 'web', 'donnees', 'suite'] as const;` combiné par index avec `t.services.items` ; les `inclinaisons` et `eventail`/`rangee` ne changent pas.

- [ ] **Step 4: Routes** — `src/pages/index.astro` → `<Accueil langue="fr" />` ; `src/pages/en/index.astro` → `<Accueil langue="en" />` (import `../../vues/Accueil.astro`).

- [ ] **Step 5: Vérifier** — Run: `npm test && npm run build`, puis `npm run verifier -- / /en/` — Expected: `Tout est vert.` (le contrôle du logo attend `/vitrine` ou `/vitrine/` ; pour `/en/`, il sera adapté à la tâche 13 : un échec « le logo mène à l'accueil (/vitrine/en/) » est attendu ici et seulement celui-là).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/accueil.ts src/vues/Accueil.astro src/pages/index.astro src/pages/en/index.astro
git commit -m "Accueil en français et en anglais"
```

---

### Task 8: Méthode

**Files:**
- Create: `src/i18n/methode.ts`, `src/vues/Methode.astro`, `src/pages/en/method.astro`
- Modify: `src/pages/methode.astro` (route mince)

- [ ] **Step 1: Créer `src/i18n/methode.ts`** (français verbatim depuis `src/pages/methode.astro`) :

- `meta: { titre: 'Méthode', description }` (68), `etiquette` (72), `titre: Titre` (`Comprendre d'abord` / `construire ensuite.`), `sous` (74), `escalierAria: 'Les quatre temps'` (76).
- `temps: { ancre: string; titre: string; resume: string; texte: string[]; livrables: string[]; delai: string; engagement: string }[]` (8-57, quatre éléments).
- `visuels: { note: { titre, meta, rubriques: string[], correction }, tableau: { colonnes: { titre: string; items: string[] }[], pourquoi: string }, bulles: string[], frise: { nom: string; detail: string; etat: string }[] }` (90-122) — `pourquoi` contient `<b>` : chaîne HTML ; `correction` sans le `✎` (la vue l'ajoute).
- `recoit: 'Ce que vous recevez'`, `engagement: "L'engagement"` (132-133).
- `engagements: { titre: string; items: { mot: string; texte: string }[] }` (141, 59-66).
- `appel: { titre, texte }` (145).

Anglais : titre `{ gras: 'Understand first', leger: 'build second.' }` ; ancres `listen`, `scope`, `validate`, `build` ; titres des temps `Listen`, `Scope`, `Validate`, `Build` ; `note.titre` `Scoping note` ; tranches `Slice 1 · Find a charger`… ; « je » → « I » (page Méthode) ; `engagements.titre` sans virgule obligatoire (c'est un `h2`) : `Six words everyone claims, and what they cost`.

- [ ] **Step 2: Lancer les tests** — Run: `npm test` — Expected: PASS.

- [ ] **Step 3: Créer `src/vues/Methode.astro`** par la méthode commune ; l'escalier lie `href={`#${t.ancre}`}` et les sections `id={t.ancre}` ; ajouter `data-ajuste` sur le `h1` (contrôlé à la tâche 13) ; garder le style tel quel (règle `cqi` comprise).

- [ ] **Step 4: Routes** — `src/pages/methode.astro` → `<Methode langue="fr" />` ; `src/pages/en/method.astro` → `<Methode langue="en" />`.

- [ ] **Step 5: Vérifier** — Run: `npm test && npm run build`, puis `npm run verifier -- /methode /en/method` — Expected: vert, sauf le contrôle `/methode : la marche « Valider »` qui cherche `#valider` et n'existe pas encore pour `/en/method` (adapté à la tâche 13).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/methode.ts src/vues/Methode.astro src/pages/methode.astro src/pages/en/method.astro
git commit -m "Méthode en français et en anglais"
```

---

### Task 9: Expérience

**Files:**
- Create: `src/i18n/experience.ts`, `src/vues/Experience.astro`, `src/pages/en/experience.astro`
- Modify: `src/pages/experience.astro` (route mince)

- [ ] **Step 1: Créer `src/i18n/experience.ts`** (français verbatim depuis `src/pages/experience.astro`) :

- `meta: { titre: 'Expérience', description }` (76), `etiquette` (80), `titre: Titre` (`Du code au produit` / `le secret de la réussite.`), `sous` (82) en chaîne HTML avec `<span translate="no">Moamind Solutions</span>` à la place de `{STUDIO.nom}`.
- `triade: { mot: 'MOA' | 'Mind' | 'Solutions'; html: string }[]` (85-87) — le contenu du `<dd>`, `<strong>` compris ; `mot` identique dans les deux langues.
- `apports: { titre, lead, items: { titre: string; texte: string }[] }` (94-95, 53-58) ; icônes (`code`, `risque`, `budget`, `audit`) dans la vue.
- `terrains: { titre, lead, items: { duree?: string; milieu: string; enjeu: string; cles: string[] }[] }` (104-105, 11-51) — même présence de `duree` élément par élément dans les deux langues.
- `fiche: { terme: string; valeur: string }[]` (123-125).
- `convictions: { titre, items: { titre: string; texte: string }[] }` (130, 60-67).
- `outils: { titre, lead, items: { titre: string; texte: string }[] }` (138, 69-74).
- `appel: { titre, texte }` (145).

Anglais : `etiquette` `Who you're talking to` ; titre `{ gras: 'From code to product', leger: 'the secret to success.' }` ; triade : `MOA` → `<strong>Maîtrise d'ouvrage — the client side of a project. That's you.</strong> The one who commissions, who knows the trade and why this product should exist. My first job is to put myself in your shoes.` ; `Mind` → `<strong>The thinking.</strong> …` ; `Solutions` → `<strong>The delivery.</strong> …` ; durées `3 years`, `2 years`, `5 years` ; fiche `Education` / `Computer engineering degree`, `Certification` / `Professional Scrum Product Owner I`, `Base` / `Bordeaux, with projects that know no borders.` ; « je » → « I ».

- [ ] **Step 2: Lancer les tests** — Run: `npm test` — Expected: PASS.

- [ ] **Step 3: Créer `src/vues/Experience.astro`** par la méthode commune ; `<p class="sous" set:html={t.sous} />` ; `<dd set:html={m.html} />` ; `data-ajuste` sur le `h1`.

- [ ] **Step 4: Routes** — `src/pages/experience.astro` → `<Experience langue="fr" />` ; `src/pages/en/experience.astro` → `<Experience langue="en" />`.

- [ ] **Step 5: Vérifier** — Run: `npm test && npm run build`, puis `npm run verifier -- /experience /en/experience` — Expected: `Tout est vert.` (le contrôle « un terrain se déplie » ne vise que `/experience` jusqu'à la tâche 13).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/experience.ts src/vues/Experience.astro src/pages/experience.astro src/pages/en/experience.astro
git commit -m "Expérience en français et en anglais"
```

---

### Task 10: Contact

**Files:**
- Create: `src/i18n/contact.ts`, `src/vues/Contact.astro`, `src/pages/en/contact.astro`
- Modify: `src/pages/contact.astro` (route mince)

**Interfaces:**
- Produces: formulaire envoyant `access_key`, `subject`, `from_name`, `redirect` (vers `lien('merci', langue)`), `langue` (caché), `profil`, `nom`, `organisation`, `email`, `nature`, `echeance`, `budget`, `message` ; bouton `data-envoi` portant le texte « Envoi… » / « Sending… ».

- [ ] **Step 1: Créer `src/i18n/contact.ts`**

```ts
import type { Langue } from './routes';

const fr = {
  meta: { titre: 'Contact', description: 'Décrivez votre projet. Réponse sous deux jours ouvrés, premier entretien de cadrage gratuit et sans engagement.' },
  etiquette: 'Contact',
  /** Groupes de mots séparés par « | » : sous 700 px, chaque groupe prend sa ligne. */
  titre: { gras: 'Quelques phrases|suffisent', leger: 'pour lancer|la discussion.' },
  sous: "Pas besoin d'un cahier des charges. Un&nbsp;problème, une intuition, une contrainte : c'est un bon point de départ. C'est même le meilleur.",
  etapes: [
    { titre: 'Vous écrivez', texte: 'Avec vos mots, sans jargon technique : la traduction fait partie du travail.' },
    { titre: 'Une réponse sous deux jours ouvrés', texte: "Avec une première lecture de votre problème et les questions qu'il soulève." },
    { titre: 'On se parle une heure', texte: 'Gratuitement, et sans engagement. Vous repartez avec une note écrite de ce qui a été compris.' },
  ],
  rdvQuestion: 'Vous préférez parler tout de suite ?',
  formulaire: {
    sujet: 'Nouveau projet — Moamind Solutions',
    expediteur: 'Site Moamind Solutions',
    titre: 'Votre projet',
    profil: { legende: 'Vous êtes', particulier: 'Un particulier', professionnel: 'Un professionnel' },
    nom: { libelle: 'Votre nom', exemple: 'Camille Martin…' },
    organisation: { libelle: 'Organisation', exemple: 'Transports Martin…' },
    email: { libelle: 'Adresse e-mail', exemple: 'camille@exemple.fr…' },
    nature: { legende: "De quoi s'agit-il ?", choix: ['Application mobile', 'Application web', 'Les deux', 'Cadrage seul', 'Je ne sais pas encore'] },
    echeance: { libelle: 'Échéance souhaitée', defaut: 'À définir ensemble', choix: ['Le plus tôt possible', 'Dans les trois mois', 'Dans les six mois', 'Plus tard, je prépare'] },
    budget: { libelle: 'Budget envisagé', facultatif: 'facultatif', paliers: ['Je ne sais pas encore', 'Moins de 5 000 €', '5 000 € à 15 000 €', '15 000 € à 50 000 €', 'Plus de 50 000 €'], exemple: 'Par exemple 3 000 €…' },
    message: { libelle: 'Votre projet', aide: "Ce que vous faites, qui s'en sert, ce qui coince aujourd'hui." },
    envoyer: 'Envoyer mon projet',
    envoi: 'Envoi…',
    mention: 'Vos informations servent uniquement à vous répondre. Elles ne sont ni revendues, ni utilisées pour autre chose.',
  },
};

const en: typeof fr = {
  meta: { titre: 'Contact', description: 'Describe your project. Reply within two business days; the first scoping call is free and commits you to nothing.' },
  etiquette: 'Contact',
  titre: { gras: 'A few sentences', leger: 'are all it takes to start.' },
  sous: "No need for a specification document. A problem, a hunch, a constraint: that's a good place to start. The best one, in fact.",
  etapes: [
    { titre: 'You write', texte: 'In your own words, no technical jargon: translating it is part of the job.' },
    { titre: 'A reply within two business days', texte: 'With a first reading of your problem and the questions it raises.' },
    { titre: 'A one-hour conversation', texte: 'Free, with no commitment. You leave with a written note of what was understood.' },
  ],
  rdvQuestion: 'Rather talk right away?',
  formulaire: {
    sujet: 'New project — Moamind Solutions',
    expediteur: 'Moamind Solutions website',
    titre: 'Your project',
    profil: { legende: 'You are', particulier: 'An individual', professionnel: 'A business' },
    nom: { libelle: 'Your name', exemple: 'Camille Martin…' },
    organisation: { libelle: 'Organization', exemple: 'Martin Transport…' },
    email: { libelle: 'Email address', exemple: 'camille@example.com…' },
    nature: { legende: 'What is it about?', choix: ['Mobile app', 'Web app', 'Both', 'Scoping only', 'Not sure yet'] },
    echeance: { libelle: 'Target date', defaut: 'To be decided together', choix: ['As soon as possible', 'Within three months', 'Within six months', 'Later, just planning ahead'] },
    budget: { libelle: 'Planned budget', facultatif: 'optional', paliers: ['Not sure yet', 'Under €5,000', '€5,000 to €15,000', '€15,000 to €50,000', 'Over €50,000'], exemple: 'For example €3,000…' },
    message: { libelle: 'Your project', aide: 'What you do, who uses it, what gets in the way today.' },
    envoyer: 'Send my project',
    envoi: 'Sending…',
    mention: 'Your information is used only to reply to you. It is never sold or used for anything else.',
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
```
Les groupes sont une chaîne séparée par `|` plutôt qu'une liste : le français en a deux par partie, l'anglais un seul, et le test de structure compare les longueurs de listes.

- [ ] **Step 2: Lancer les tests** — Run: `npm test` — Expected: PASS.

- [ ] **Step 3: Créer `src/vues/Contact.astro`** par la méthode commune :
  - titre : `<h1 data-ajuste>{t.titre.gras.split('|').map((g, i) => <>{i > 0 && ' '}<span class="groupe">{g}</span></>)}<br /><span class="leger">{t.titre.leger.split('|').map((g, i) => <>{i > 0 && ' '}<span class="groupe">{g}</span></>)}</span></h1>` ;
  - `<p class="sous" set:html={t.sous} />` ;
  - `const retour = new URL(lien('merci', langue), Astro.site).href;` ;
  - champs cachés `subject={t.formulaire.sujet}`, `from_name={t.formulaire.expediteur}`, et `<input type="hidden" name="langue" value={langue} />` ;
  - choix `profil` : `value={t.formulaire.profil.particulier}` avec `data-profil="particulier"` (idem professionnel) — le script lit `data-profil`, pas la valeur ;
  - bouton `<button class="envoyer" type="submit" data-envoi={t.formulaire.envoi}>{t.formulaire.envoyer}</button>` et, dans le script, `bouton.textContent = bouton.dataset.envoi ?? '…';` ;
  - rendez-vous : `{t.rdvQuestion} <a …>{c.rdv}</a>`.

- [ ] **Step 4: Routes** — `src/pages/contact.astro` → `<Contact langue="fr" />` ; `src/pages/en/contact.astro` → `<Contact langue="en" />`.

- [ ] **Step 5: Vérifier** — Run: `npm test && npm run build`, puis `npm run verifier -- /contact /en/contact`. Vérifier aussi dans `dist/en/contact/index.html` : `name="redirect" value="https://shadowx-lab.github.io/vitrine/en/thank-you"` et `name="langue" value="en"`.
Expected: vert (le contrôle d'interaction du formulaire vise `/contact` et clique la valeur « Un particulier » : il sera rendu indépendant de la langue à la tâche 13).

- [ ] **Step 6: Commit**

```bash
git add src/i18n/contact.ts src/vues/Contact.astro src/pages/contact.astro src/pages/en/contact.astro
git commit -m "Contact en français et en anglais, retour vers la page de la même langue"
```

---

### Task 11: Mentions légales et 404

**Files:**
- Create: `src/i18n/mentions.ts`, `src/i18n/introuvable.ts`, `src/vues/MentionsLegales.astro`, `src/vues/Introuvable.astro`, `src/pages/en/legal-notice.astro`, `src/pages/en/404.astro`
- Modify: `src/pages/mentions-legales.astro`, `src/pages/404.astro` (routes minces), `astro.config.mjs`

- [ ] **Step 1: Créer `src/i18n/mentions.ts`** (français verbatim depuis `src/pages/mentions-legales.astro`) :

- `meta: { titre, description }` (15), `etiquette` (17), `titre: 'Mentions légales'` (chaîne simple, `h1` sur une ligne), `rappel` (25).
- `foi` : en français `'Seule cette version française fait foi.'` (non affichée : la vue n'affiche `foi` qu'en anglais) ; en anglais `'This English version is provided for convenience. In case of any discrepancy, the French version prevails.'`.
- `blocs: { id: string; court: string; titre: string; paragraphes: string[] }[]` (6-13 pour `id`/`court`, 27-64 pour `titre`/`paragraphes`) — l'éditeur est un seul paragraphe HTML avec ses `<br />`, `&nbsp;` et `<em>à&nbsp;compléter</em>` ; `{STUDIO.nom}` devient `<span translate="no">Moamind Solutions</span>`.
- `sommaireAria: 'Sommaire'`.

Anglais : ids `publisher`, `contact`, `hosting`, `intellectual-property`, `personal-data`, `cookies` ; `<em>to be completed</em>` ; `Contact me` pour `Me contacter` ; RGPD → GDPR ; CNIL → `the CNIL (the French data protection authority)` ; `sommaireAria` `Contents`.

- [ ] **Step 2: Créer `src/i18n/introuvable.ts`**

```ts
import type { Langue } from './routes';

const fr = {
  meta: { titre: 'Page introuvable', description: "Cette page n'existe pas." },
  titre: "Cette page n'existe pas",
  sous: "Un lien cassé, une adresse mal recopiée, ou une page qu'on a retirée. Dans les trois cas, ce n'est pas votre faute.",
  carte: { titre: 'Aucun résultat ici', sous: "Essayez plutôt l'accueil" },
};

const en: typeof fr = {
  meta: { titre: 'Page not found', description: "This page doesn't exist." },
  titre: "This page doesn't exist",
  sous: "A broken link, a mistyped address, or a page that was taken down. In all three cases, it's not your fault.",
  carte: { titre: 'No results here', sous: 'Try the home page instead' },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
```

- [ ] **Step 3: Lancer les tests** — Run: `npm test` — Expected: PASS.

- [ ] **Step 4: Créer `src/vues/MentionsLegales.astro`** par la méthode commune : sommaire généré depuis `t.blocs` (`href={`#${b.id}`}`, texte `b.court`) ; `{langue === 'en' && <p class="rappel">{t.foi}</p>}` avant `t.rappel` ; chaque bloc `<section class="bloc" id={b.id}><h2>{b.titre}</h2>{b.paragraphes.map((p) => <p set:html={p} />)}</section>` ; script et style recopiés à l'identique.

- [ ] **Step 5: Créer `src/vues/Introuvable.astro`** par la méthode commune, avec `<Base … langue={langue} indexer={false}>` (sans `page`) et, pour la 404 française seulement, la redirection des adresses anglaises avant tout affichage :
```astro
{langue === 'fr' && (
  <script is:inline slot="tete" define:vars={{ prefixe: lien('accueil', 'en'), cible: `${lien('accueil', 'en')}404/` }}>
    // GitHub Pages ne sert qu'un 404.html : une adresse anglaise inconnue est renvoyée vers la 404 anglaise.
    if (location.pathname.startsWith(prefixe) && location.pathname !== cible) location.replace(cible);
  </script>
)}
```
Boutons : `c.retourAccueil` → `lien('accueil', langue)`, `c.voirRealisations` → `lien('realisations', langue)`.

- [ ] **Step 6: Routes et sitemap**

`src/pages/404.astro` → `<Introuvable langue="fr" />` ; `src/pages/en/404.astro` → `<Introuvable langue="en" />` ; `src/pages/mentions-legales.astro` → `<MentionsLegales langue="fr" />` ; `src/pages/en/legal-notice.astro` → `<MentionsLegales langue="en" />`.
Dans `astro.config.mjs` : `integrations: [sitemap({ filter: (page) => !/\/404\/?$/.test(page) })],`.

- [ ] **Step 7: Vérifier**

Run: `npm test && npm run build` ; `ls dist/en/404/index.html dist/404.html` ; `grep -c '404' dist/sitemap-0.xml` doit afficher `0`. Puis `npm run verifier -- /mentions-legales /en/legal-notice /404 /en/404`.
Expected: fichiers présents, sitemap sans 404, contrôles verts.

- [ ] **Step 8: Commit**

```bash
git add src/i18n/mentions.ts src/i18n/introuvable.ts src/vues/MentionsLegales.astro src/vues/Introuvable.astro src/pages/mentions-legales.astro src/pages/404.astro src/pages/en/legal-notice.astro src/pages/en/404.astro astro.config.mjs
git commit -m "Mentions légales et 404 en français et en anglais"
```

---

### Task 12: Sélecteur de langue, lien de pied de page et `hreflang`

**Files:**
- Create: `src/components/SelecteurLangue.astro`
- Modify: `src/components/Icone.astro`, `src/components/Entete.astro`, `src/components/PiedDePage.astro`, `src/layouts/Base.astro`

**Interfaces:**
- Consumes: `equivalent(langue, page?, slug?)`, `LANGUES`, `NOMS_LANGUES`, `autre` (Task 1) ; `commun[langue].langue` (Task 3).
- Produces: `<SelecteurLangue langue page? slug?>` ; classe `.langues` (le vérificateur de la tâche 13 lit `.entete .langues a[hreflang]` et `.pied .langues-pied a[hreflang]`).

- [ ] **Step 1: Icône `globe`** — dans `src/components/Icone.astro`, ajouter `'globe'` au type `Service` et la trace :
```ts
  globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M5.5 7h13M5.5 17h13M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>',
```

- [ ] **Step 2: Créer `src/components/SelecteurLangue.astro`**

```astro
---
import Icone from './Icone.astro';
import { equivalent } from '../config';
import commun from '../i18n/commun';
import { LANGUES, NOMS_LANGUES, type Langue, type Page } from '../i18n/routes';
interface Props { langue: Langue; page?: Page; slug?: string }
const { langue, page, slug } = Astro.props;
---
<details class="langues">
  <summary aria-label={commun[langue].langue.choisir}><Icone nom="globe" taille={20} /></summary>
  <ul>
    {LANGUES.map((l) => (
      <li><a href={equivalent(l, page, slug)} lang={l} hreflang={l} aria-current={l === langue ? 'true' : undefined}>{NOMS_LANGUES[l]}</a></li>
    ))}
  </ul>
</details>

<style>
  .langues { position: relative; }
  .langues summary { list-style: none; cursor: pointer; width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; color: #fff; background: rgba(255,255,255,.16); transition: background .15s; }
  .langues summary:hover, .langues[open] summary { background: rgba(255,255,255,.26); }
  .langues summary::-webkit-details-marker { display: none; }
  .langues ul { position: absolute; right: 0; top: 54px; z-index: 30; min-width: 170px; list-style: none; margin: 0; padding: 8px; background: #fff; color: var(--encre); border-radius: 16px; box-shadow: 0 30px 60px -24px rgba(21,18,31,.45); }
  .langues a { display: flex; align-items: center; gap: 10px; padding: 11px 12px; border-radius: 10px; font-weight: 600; }
  .langues a::before { content: ''; width: 14px; flex: none; }
  .langues a[aria-current='true']::before { content: '✓'; color: var(--f2); }
  .langues a:hover, .langues a[aria-current='true'] { background: var(--voile); color: var(--f1); }
</style>
```

- [ ] **Step 3: Placer la mappemonde dans l'en-tête** — dans `Entete.astro`, entre `</nav>` et le CTA : `<SelecteurLangue langue={langue} page={page} slug={slug} />` (lire `slug` dans les props). Sous 760 px, la mappemonde reste affichée (aucune règle ne la masque) ; vérifier qu'elle se place à gauche du bouton du menu.

- [ ] **Step 4: Lien de langue en pied de page** — dans `PiedDePage.astro`, remplacer la ligne du bas par :
```astro
  <div class="bas">
    <span>© {new Date().getFullYear()} {STUDIO.nom} · {c.pied.base}</span>
    <span class="droite">
      <nav class="langues-pied" aria-label={c.langue.pied}>
        {LANGUES.map((l, i) => (
          <>{i > 0 && <span aria-hidden="true"> · </span>}<a href={equivalent(l, page, slug)} lang={l} hreflang={l} aria-current={l === langue ? 'true' : undefined}>{NOMS_LANGUES[l]}</a></>
        ))}
      </nav>
      <a href={lien('mentions', langue)}>{c.pied.mentions}</a>
    </span>
  </div>
```
avec les imports `equivalent`, `LANGUES`, `NOMS_LANGUES`, la lecture de `page` et `slug`, et le style :
```css
  .droite { display: flex; gap: 22px; flex-wrap: wrap; }
  .langues-pied a[aria-current='true'] { color: #fff; font-weight: 700; }
```

- [ ] **Step 5: `hreflang` et `og:locale:alternate` dans `Base.astro`**

Importer `lien` et `LANGUES`, `autre`, puis dans le `<head>`, après `canonical` :
```astro
    {page && LANGUES.map((l) => <link rel="alternate" hreflang={l} href={new URL(lien(page, l, slug), Astro.site)} />)}
    {page && <link rel="alternate" hreflang="x-default" href={new URL(lien(page, 'fr', slug), Astro.site)} />}
```
et après `og:locale` :
```astro
    <meta property="og:locale:alternate" content={autre(langue) === 'fr' ? 'fr_FR' : 'en_US'} />
```

- [ ] **Step 6: Vérifier**

Run: `npm test && npm run build` ; `grep -o 'hreflang="[a-z-]*" href="[^"]*"' dist/methode/index.html` doit afficher les trois alternatives (`fr` → `/vitrine/methode`, `en` → `/vitrine/en/method`, `x-default` → `/vitrine/methode`). Puis `npm run verifier -- / /en/ /methode /en/method` et, à 390 px, ouvrir la mappemonde à la main sur `/vitrine/en/` pour vérifier que le menu s'ouvre dans l'écran.
Expected: alternatives présentes, contrôles verts (hors échecs connus des tâches 7 et 8).

- [ ] **Step 7: Commit**

```bash
git add src/components src/layouts/Base.astro
git commit -m "Mappemonde de choix de langue, lien de pied de page et hreflang"
```

---

### Task 13: Vérificateur bilingue et titres ajustés en anglais

**Files:**
- Modify: `scripts/verifier-site.mjs`
- Modify (si le contrôle l'exige) : `src/vues/Methode.astro`, `src/vues/Experience.astro`, `src/vues/Contact.astro` (coefficients `cqi` anglais)

- [ ] **Step 1: Pages anglaises et contrôle du logo**

```js
const TOUTES = [
  '/', '/methode', '/realisations', '/realisations/chargeair', '/realisations/pilpoil', '/realisations/teamago', '/experience', '/contact', '/merci', '/mentions-legales', '/404',
  '/en/', '/en/method', '/en/work', '/en/work/chargeair', '/en/work/pilpoil', '/en/work/teamago', '/en/experience', '/en/contact', '/en/thank-you', '/en/legal-notice', '/en/404',
];
const anglaise = (page) => page.startsWith('/en/');
```
Contrôle du logo :
```js
  const logo = await ev(`document.querySelector('.entete .logo')?.getAttribute('href')`);
  const attendu = anglaise(page) ? ['/vitrine/en/'] : ['/vitrine', '/vitrine/'];
  verdict(attendu.includes(logo), `${page} : le logo mène à l'accueil de sa langue (${logo})`);
```

- [ ] **Step 2: Contrôle du sélecteur de langue** (dans la boucle des pages, après le logo)

```js
  const langue = await ev(`document.documentElement.lang`);
  const autreLangue = langue === 'fr' ? 'en' : 'fr';
  const cibleEntete = await ev(`document.querySelector('.entete .langues a[hreflang="${autreLangue}"]')?.getAttribute('href')`);
  const ciblePied = await ev(`document.querySelector('.pied .langues-pied a[hreflang="${autreLangue}"]')?.getAttribute('href')`);
  const alternative = await ev(`document.querySelector('link[rel=alternate][hreflang="${autreLangue}"]')?.getAttribute('href') ?? null`);
  const statut = cibleEntete ? await ev(`fetch(${JSON.stringify(cibleEntete)}).then((r) => r.status)`) : 0;
  const coherent = cibleEntete === ciblePied && (alternative === null || new URL(alternative).pathname === cibleEntete);
  verdict(langue === (anglaise(page) ? 'en' : 'fr') && statut === 200 && coherent, `${page} : sélecteur vers ${cibleEntete} (${statut})`);
```

- [ ] **Step 3: Titres ajustés sans coupure imprévue**

Ajouter après `MOTS_ISOLES` :
```js
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
```
et dans la boucle des largeurs (toutes les largeurs) :
```js
    const coupes = await ev(TITRE_AJUSTE);
    verdict(coupes.length === 0, `${page} @${w}px : titre sans coupure imprévue${coupes.length ? ' → ' + coupes[0] : ''}`);
```

- [ ] **Step 4: Interactions indépendantes de la langue**

Remplacer le bloc d'interactions par une boucle sur les deux langues :
```js
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
```

- [ ] **Step 5: Lancer le vérificateur complet**

Run: `npm run verifier`
Expected: tous les contrôles verts. Si `titre sans coupure imprévue` échoue sur une page anglaise, ajuster le coefficient de cette langue dans la vue concernée, sans toucher au français, par une règle du type :
```css
  :global(html[lang='en']) .ouv h1 { font-size: min(clamp(2.75rem, 6vw, 4.5rem), 9.5cqi); }
```
(Contact : `:global(html[lang='en']) .intro h1` pour la règle large et, dans `@media (max-width: 700px)`, la règle mobile.) Baisser le coefficient par pas de 0,5 jusqu'au vert. Si un « mot isolé » apparaît dans un texte anglais, reformuler légèrement la phrase anglaise plutôt que d'ajouter une insécable à la main.

- [ ] **Step 6: Commit**

```bash
git add scripts/verifier-site.mjs src/vues
git commit -m "Vérificateur bilingue : pages anglaises, sélecteur, titres ajustés"
```

---

### Task 14: Contexte, relecture et livraison

**Files:**
- Modify: `context/CONTEXT-MOAMIND.md` (après accord de l'utilisateur, voir Global Constraints)

- [ ] **Step 1: Relire toutes les pages anglaises**

Après `npm run build` :
- texte français oublié : `grep -rhoE '[^<>]*[éèêàùç][^<>]*' dist/en --include=index.html | sort -u` ne doit lister que « Français », « Maîtrise d'ouvrage », les noms propres et les attributs d'images ;
- première personne du studio : `grep -rhoE '[^<>.]*\b(we|our|I|my)\b[^<>.]*' dist/en/index.html dist/en/work dist/en/contact dist/en/thank-you | sort -u` ne doit lister que « Describe my project » et des phrases où « we » est suivi de « together ».
Puis ouvrir chaque page anglaise à 1440 et 390 px dans le navigateur.

- [ ] **Step 2: Section « Version anglaise » dans `context/CONTEXT-MOAMIND.md`**

Demander d'abord à l'utilisateur si le fichier peut être commité avec ses modifications en attente. Puis ajouter, après la section « Voix » :
```markdown
## Version anglaise

Le site existe en anglais sous `/vitrine/en/` (adresses dans `src/i18n/routes.ts`),
avec les mêmes règles que le français :

- « we » seulement quand la phrase montre le client et Xavier ensemble ;
  ailleurs « you » ou une tournure sans sujet ; « I » là où le français dit « je ».
- Jamais « we » pour le studio ; accueil, réalisations, études de cas, contact
  et message reçu sans première personne du studio.
- Anglais américain ; lexique : Method, Work, Experience, Describe my project,
  See the work, Scoping note, Slice, Case study, Legal notice.
- MOA reste en français et s'explique : *maîtrise d'ouvrage*, « the client side
  of a project — that's you ».
- Les écrans des applications sont encore en français sur les pages anglaises.
```

- [ ] **Step 3: Vérification finale**

Run: `npm test && npm run build && npm run verifier`
Expected: tous les tests verts, build `22 page(s) built` (11 + 11), `Tout est vert.`

- [ ] **Step 4: Commit et remise**

```bash
git add context/CONTEXT-MOAMIND.md
git commit -m "Contexte : règles de la version anglaise"
```
Puis présenter le résultat à l'utilisateur (adresses locales `/vitrine/` et `/vitrine/en/`) et **demander** avant tout push ou fusion dans `main`.
