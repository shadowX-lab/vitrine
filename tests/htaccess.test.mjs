import { test } from 'node:test';
import assert from 'node:assert/strict';
import { htaccess, correspondances } from '../scripts/htaccess.mjs';
import { ROUTES } from '../src/i18n/routes.ts';

test('chaque page française a son équivalent sur le domaine anglais, et inversement', () => {
  const fr = correspondances('fr', 'en');
  const en = correspondances('en', 'fr');
  assert.equal(fr.length, Object.keys(ROUTES).length);
  assert.ok(fr.includes('  RewriteRule ^methode/?$ https://moamind-solutions.com/method [R=302,L]'));
  assert.ok(fr.includes('  RewriteRule ^realisations/([^/]+)/?$ https://moamind-solutions.com/work/$1 [R=302,L]'));
  assert.ok(fr.includes('  RewriteRule ^$ https://moamind-solutions.com/ [R=302,L]'));
  assert.ok(en.includes('  RewriteRule ^legal-notice/?$ https://moamind-solutions.fr/mentions-legales [R=302,L]'));
});

test('la détection saute exactement les redirections de pages quand elle ne s’applique pas', () => {
  for (const langue of ['fr', 'en']) {
    const texte = htaccess(langue);
    const saut = Number(texte.match(/\[S=(\d+)\]/)[1]);
    const suivantes = texte.split('[S=')[1].split('\n').slice(1, saut + 1);
    assert.equal(saut, Object.keys(ROUTES).length, langue);
    assert.ok(suivantes.every((l) => l.includes('[R=302,L]')), langue);
  }
});

test('le français renvoie en/ vers le domaine anglais ; chaque domaine enregistre son choix de langue', () => {
  assert.match(htaccess('fr'), /RewriteRule \^en\(\/\.\*\)\?\$ https:\/\/moamind-solutions\.com\$1 \[R=301,L\]/);
  assert.doesNotMatch(htaccess('en'), /\^en\(/);
  assert.match(htaccess('fr'), /CO=langue:fr:moamind-solutions\.fr:/);
  assert.match(htaccess('en'), /CO=langue:en:moamind-solutions\.com:/);
});

test('un navigateur déjà dans la langue du domaine n’est pas redirigé', () => {
  assert.match(htaccess('fr'), /Accept-Language\} \^fr \[NC\]\n {2}RewriteRule \^ - \[S=/);
  assert.match(htaccess('en'), /Accept-Language\} !\^fr \[NC\]\n {2}RewriteRule \^ - \[S=/);
});
