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
