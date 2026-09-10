import type { ImageMetadata } from 'astro';

const fichiers = import.meta.glob<{ default: ImageMetadata }>('../assets/ecrans/**/*.png', { eager: true });

/** Récupère un écran rendu par `npm run ecrans`. */
export function ecran(projet: string, nom: string): ImageMetadata {
  const cle = `../assets/ecrans/${projet}/${nom}.png`;
  const module = fichiers[cle];
  if (!module) throw new Error(`Écran introuvable : ${cle}`);
  return module.default;
}
