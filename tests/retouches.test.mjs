import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retoucher } from '../scripts/retouches.mjs';

const repere = (style) => `    <div class="pp-pin" style="${style}"><svg width="14" height="14" viewBox="0 0 24 24"><path d="M0 0Z"></path></svg></div>\n`;
const carte = `<div>6 chiens trouvés</div>\n${repere('left: 158px; top: 218px;')}${repere('left: 186px; top: 372px;')}${repere('left: 190px; top: 450px;')}`;

test('la carte Pil’Poil annonce un chien et ne garde que le repère sous la Seine', () => {
  const sortie = retoucher('pilpoil', 'Carte', carte);
  assert.ok(sortie.includes('1 chien trouvé') && !sortie.includes('6 chiens'));
  assert.equal(sortie.match(/pp-pin/g)?.length, 1);
  assert.ok(sortie.includes('top: 372px'));
});

test('échoue si la maquette a changé', () => {
  assert.throws(() => retoucher('pilpoil', 'Carte', carte.replace('6 chiens', '7 chiens')), /introuvable/);
  assert.throws(() => retoucher('pilpoil', 'Carte', carte.replace('top: 372px', 'top: 380px')), /0 repère/);
});

test('ne touche pas aux autres écrans', () => {
  assert.equal(retoucher('pilpoil', 'Alertes', carte), carte);
});
