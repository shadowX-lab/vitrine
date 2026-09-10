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
