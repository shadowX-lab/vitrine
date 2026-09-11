import { test } from 'node:test';
import assert from 'node:assert/strict';
import { nombreAnglais, textes, traduire } from '../scripts/traduire-ecran.mjs';

const ecran = `<style>.a::after{content:"Réserver"}</style>
<div class="a"> Réserver </div><span>12,40 &euro;</span><input placeholder="Ville, quartier"><b>ChargeAir</b>
<script>const x = "Réserver";</script><p>Annuler</p>`;

test('textes() liste les textes visibles, placeholders compris, sans styles ni scripts', () => {
  assert.deepEqual(textes(ecran), ['Réserver', 'Ville, quartier', 'ChargeAir', 'Annuler']);
});

test('traduire() remplace les textes connus en gardant les espaces de bord', () => {
  const { html, manquants } = traduire(ecran, { Réserver: 'Book', 'Ville, quartier': 'City, area', ChargeAir: 'ChargeAir', Annuler: 'Cancel' });
  assert.ok(html.includes('<div class="a"> Book </div>'));
  assert.ok(html.includes('<span>&euro;12.40</span>'));
  assert.ok(html.includes('placeholder="City, area"'));
  assert.ok(html.includes('content:"Réserver"') && html.includes('const x = "Réserver"'), 'styles et scripts intacts');
  assert.deepEqual(manquants, []);
});

test('les nombres seuls passent au format anglais sans dictionnaire', () => {
  assert.equal(nombreAnglais('581,00 €'), '&euro;581.00');
  assert.equal(nombreAnglais('1&nbsp;234,50&nbsp;&euro;'), '&euro;1,234.50');
  assert.equal(nombreAnglais('-72,63 €'), '-&euro;72.63');
  assert.equal(nombreAnglais('0,00 €'), '&euro;0.00');
  assert.equal(nombreAnglais('12,6'), '12.6');
  assert.equal(nombreAnglais('20:03'), '20:03');
  assert.equal(traduire('<b>581,00 €</b>', {}).html, '<b>&euro;581.00</b>');
});

test('traduire() signale les textes absents du dictionnaire', () => {
  assert.deepEqual(traduire('<p>Annuler</p><p>Valider</p>', { Annuler: 'Cancel' }).manquants, ['Valider']);
});
