#!/usr/bin/env node
/**
 * Rend les artboards Claude Design (.dc.html) des projets Cadran en PNG @2x.
 *
 * Les artboards sont autonomes mais enveloppés dans <x-dc> et déclarent leurs
 * feuilles de style dans <helmet>. On reconstruit un document propre, on l'écrit
 * à côté de l'original pour que les images relatives résolvent, et on
 * photographie la fenêtre en 390x844 avec Chrome en mode headless.
 *
 * Les écrans listés dans `scripts/ecrans-en/<projet>.mjs` sont aussi rendus en anglais, dans
 * `src/assets/ecrans/en/`, avec le dictionnaire du même fichier. Un texte non traduit arrête le rendu.
 *
 * `npm run ecrans`                    tous les écrans, en français puis en anglais
 * `npm run ecrans -- en pilpoil`      seulement l'anglais, seulement Pil'Poil
 * `npm run ecrans -- pilpoil/Carte`   un seul écran
 * `npm run ecrans -- --manquants en`  liste les textes anglais manquants, sans rien rendre
 */
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { anonymiser } from './anonymiser.mjs';
import { retoucher } from './retouches.mjs';
import { traduire } from './traduire-ecran.mjs';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const RACINE = resolve(import.meta.dirname, '..');
const PROJETS = resolve(RACINE, '..');
const SORTIE = join(RACINE, 'src/assets/ecrans');

const SOURCES = {
  pilpoil: join(PROJETS, 'PilPoil/design/ecrans-2026-09-09'),
  chargeair: join(PROJETS, 'ChargeAir/design'),
  teamago: join(PROJETS, 'Teamago/design'),
};

/** Écrans à rendre en anglais et leur dictionnaire, ou null si le projet n'en a pas. */
async function versionAnglaise(projet) {
  const fichier = join(import.meta.dirname, 'ecrans-en', `${projet}.mjs`);
  return existsSync(fichier) ? import(fichier) : null;
}

/** Contenu de l'artboard tel qu'il sera photographié : anonymisé, retouché, traduit s'il le faut. */
function contenu(source, projet, nom, dictionnaire) {
  const lu = readFileSync(source, 'utf8');
  // Les maquettes Teamago reprennent un vrai fichier de club : personnes et club deviennent fictifs.
  const brut = retoucher(projet, nom, projet === 'teamago' ? anonymiser(lu) : lu);
  return dictionnaire ? traduire(brut, dictionnaire) : { html: brut, manquants: [] };
}

/** Extrait le contenu utile d'un artboard et le remonte dans un document standard. */
function documentAutonome(brut, langue) {
  const helmet = brut.match(/<helmet>([\s\S]*?)<\/helmet>/i)?.[1] ?? '';
  const corps = brut
    .match(/<body[^>]*>([\s\S]*?)<\/body>/i)?.[1]
    .replace(/<helmet>[\s\S]*?<\/helmet>/gi, '')
    .replace(/<\/?x-dc[^>]*>/gi, '')
    .trim() ?? '';

  return `<!doctype html>
<html lang="${langue}"><head><meta charset="utf-8">
${helmet}
<style>html,body{margin:0;padding:0;width:390px;height:844px;overflow:hidden;background:#fff}</style>
</head><body>${corps}</body></html>`;
}

function photographier(source, destination, html, langue) {
  const temporaire = join(dirname(source), `.rendu-${Date.now()}.html`);
  writeFileSync(temporaire, documentAutonome(html, langue));
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
    // Filet de sécurité : un rendu dure quelques secondes, jamais deux minutes.
    ], { stdio: 'pipe', timeout: 120000 });
  } finally {
    rmSync(temporaire, { force: true });
  }
}

const options = process.argv.slice(2);
const seulementManquants = options.includes('--manquants');
const langues = ['fr', 'en'].filter((l) => options.includes(l));
const filtre = options.filter((o) => !['fr', 'en', '--manquants'].includes(o));
const rendues = langues.length ? langues : ['fr', 'en'];
const retenu = (projet, nom) => !filtre.length || filtre.includes(projet) || filtre.includes(`${projet}/${nom}`);

let total = 0;
const manquantsParEcran = [];
for (const [projet, dossier] of Object.entries(SOURCES)) {
  if (filtre.length && !filtre.some((f) => f === projet || f.startsWith(`${projet}/`))) continue;
  const manifeste = JSON.parse(readFileSync(join(dossier, 'canvas.json'), 'utf8'));
  const anglais = await versionAnglaise(projet);

  for (const artboard of manifeste.artboards) {
    const nom = artboard.file.replace(/\.dc\.html$/, '');
    if (!retenu(projet, nom)) continue;
    const source = join(dossier, artboard.file);
    for (const langue of rendues) {
      if (langue === 'en' && !anglais?.ecrans.includes(nom)) continue;
      const { html, manquants } = contenu(source, projet, nom, langue === 'en' ? anglais.dictionnaire : null);
      if (manquants.length) manquantsParEcran.push({ ecran: `${projet}/${nom}`, manquants });
      if (seulementManquants || manquants.length) continue;
      const cible = langue === 'fr' ? join(SORTIE, projet) : join(SORTIE, 'en', projet);
      mkdirSync(cible, { recursive: true });
      photographier(source, join(cible, `${nom}.png`), html, langue);
      console.log(`  ${langue === 'en' ? 'en/' : ''}${projet}/${nom}.png  — ${artboard.title}`);
      total++;
    }
  }
}

for (const { ecran, manquants } of manquantsParEcran) {
  console.log(`\n${ecran} : ${manquants.length} texte(s) sans traduction anglaise`);
  for (const m of manquants) console.log(`  ${JSON.stringify(m)}`);
}
if (!seulementManquants) console.log(`\n${total} écrans rendus dans src/assets/ecrans/`);
// Un écran anglais incomplet n'est pas rendu : l'image précédente resterait en place sans qu'on le voie.
if (manquantsParEcran.length && !seulementManquants) process.exit(1);
