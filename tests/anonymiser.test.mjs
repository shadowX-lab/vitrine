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
