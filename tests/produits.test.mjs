import { test } from 'node:test';
import assert from 'node:assert/strict';
import { produits, eventail, rangee, localiser } from '../src/data/produits.ts';

const HEX = /^#[0-9A-Fa-f]{6}$/;
const INTERDITS_ACCUEIL = ['chargeair/Main', 'chargeair/Reservation', 'pilpoil/Main', 'pilpoil/Profil'];
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

test('l’accueil ne montre aucun écran portant un nom d’application', () => {
  for (const e of [...eventail, ...rangee]) assert.ok(!INTERDITS_ACCUEIL.includes(`${e.projet}/${e.fichier}`), `${e.projet}/${e.fichier}`);
});
