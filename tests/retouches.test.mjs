import { test } from 'node:test';
import assert from 'node:assert/strict';
import { retoucher, variantes } from '../scripts/retouches.mjs';

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

const accueil = `<div style="padding: 62px 22px 0 22px;">\n<div style="display: flex;"><div class="logo"></div>\n<div style="font-size: 18px; font-weight: 800; letter-spacing: -0.01em;">Pil'Poil</div></div>\n<div>Ensemble,</div>\n<div>à 352 m · il y a 3 h</div><div>à 897 m · il y a 1 h</div></div>`;

test('l’écran d’accueil Pil’Poil a une variante sans le nom de l’application', () => {
  const [variante, ...autres] = variantes('pilpoil', 'Main');
  assert.equal(autres.length, 0);
  assert.equal(variante.nom, 'MainSansNom');
  const sortie = variante.retouche(accueil);
  assert.ok(!sortie.includes("Pil'Poil") && sortie.includes('class="logo"') && sortie.includes('Ensemble,'));
  assert.ok(sortie.includes('padding: 14px 22px 0 22px;') && !sortie.includes('62px'));
  assert.throws(() => variante.retouche(accueil.replace('18px', '20px')), /introuvable/);
  assert.ok(sortie.includes('>à 6,3 km · il y a 1 h<') && sortie.includes('>à 352 m · il y a 3 h<') && !sortie.includes('897 m'));
  assert.throws(() => variante.retouche(accueil.replace('62px', '60px')), /introuvable/);
  assert.throws(() => variante.retouche(accueil.replace('897 m', '900 m')), /introuvable/);
});

test('un écran sans variante n’en produit aucune', () => {
  assert.deepEqual(variantes('pilpoil', 'Carte'), []);
  assert.deepEqual(variantes('chargeair', 'Main'), []);
});
