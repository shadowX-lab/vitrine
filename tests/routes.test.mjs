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
