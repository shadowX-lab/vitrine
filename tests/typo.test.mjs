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

test('typographierHtml resserre la ponctuation d’un long titre sans casser la balise', () => {
  const sortie = typographierHtml('<h2>Six mots que tout le monde revendique, et ce qu’ils coûtent</h2>');
  assert.equal(sortie, `<h2>Six mots que tout le monde revendique<span class="ponct">,</span> et ce${NBSP}qu’ils${NBSP}coûtent</h2>`);
});

test('typographierHtml traite les entités &nbsp; comme des espaces déjà liées', () => {
  const html = '<p>Un deux trois quatre cinq six&nbsp;sept huit</p>';
  assert.equal(typographierHtml(html), `<p>Un deux trois quatre cinq six&nbsp;sept${NBSP}huit</p>`);
});
