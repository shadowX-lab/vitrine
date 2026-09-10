#!/usr/bin/env node
/**
 * Rend les artboards Claude Design (.dc.html) des projets Cadran en PNG @2x.
 *
 * Les artboards sont autonomes mais enveloppés dans <x-dc> et déclarent leurs
 * feuilles de style dans <helmet>. On reconstruit un document propre, on l'écrit
 * à côté de l'original pour que les images relatives résolvent, et on
 * photographie la fenêtre en 390x844 avec Chrome en mode headless.
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { anonymiser } from './anonymiser.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RACINE = resolve(import.meta.dirname, '..');
const PROJETS = resolve(RACINE, '..');
const SORTIE = join(RACINE, 'src/assets/ecrans');

const SOURCES = {
  pilpoil: join(PROJETS, 'PilPoil/design/ecrans-2026-09-09'),
  chargeair: join(PROJETS, 'ChargeAir/design'),
  teamago: join(PROJETS, 'Teamago/design'),
};

/** Extrait le contenu utile d'un artboard et le remonte dans un document standard. */
function documentAutonome(source, projet) {
  const lu = readFileSync(source, 'utf8');
  // Les maquettes Teamago reprennent un vrai fichier de club : personnes et club deviennent fictifs.
  const brut = projet === 'teamago' ? anonymiser(lu) : lu;
  const helmet = brut.match(/<helmet>([\s\S]*?)<\/helmet>/i)?.[1] ?? '';
  const corps = brut
    .match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
    .replace(/<helmet>[\s\S]*?<\/helmet>/gi, '')
    .replace(/<\/?x-dc[^>]*>/gi, '')
    .trim() ?? '';

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8">
${helmet}
<style>html,body{margin:0;padding:0;width:390px;height:844px;overflow:hidden;background:#fff}</style>
</head><body>${corps}</body></html>`;
}

function photographier(source, destination, projet) {
  const temporaire = join(dirname(source), `.rendu-${Date.now()}.html`);
  writeFileSync(temporaire, documentAutonome(source, projet));
  try {
    execFileSync(CHROME, [
      '--headless=new', '--disable-gpu', '--hide-scrollbars',
      '--window-size=390,844', '--force-device-scale-factor=2',
      '--default-background-color=00000000',
      // Thème clair imposé : sinon Chrome suit l'apparence du Mac, sombre le soir.
      '--blink-settings=preferredColorScheme=1',
      '--virtual-time-budget=4000',
      `--screenshot=${destination}`,
      `file://${temporaire}`,
    ], { stdio: 'pipe' });
  } finally {
    rmSync(temporaire, { force: true });
  }
}

let total = 0;
// `npm run ecrans -- teamago` ne rend que les projets nommés.
const filtre = process.argv.slice(2);
for (const [projet, dossier] of Object.entries(SOURCES)) {
  if (filtre.length && !filtre.includes(projet)) continue;
  const manifeste = JSON.parse(readFileSync(join(dossier, 'canvas.json'), 'utf8'));
  const cible = join(SORTIE, projet);
  mkdirSync(cible, { recursive: true });

  for (const artboard of manifeste.artboards) {
    const nom = artboard.file.replace(/\.dc\.html$/, '');
    const destination = join(cible, `${nom}.png`);
    photographier(join(dossier, artboard.file), destination, projet);
    console.log(`  ${projet}/${nom}.png  — ${artboard.title}`);
    total++;
  }
}
console.log(`\n${total} écrans rendus dans src/assets/ecrans/`);
