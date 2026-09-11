import type { ImageMetadata } from 'astro';
import type { Langue } from '../i18n/routes';

const fichiers = import.meta.glob<{ default: ImageMetadata }>('../assets/ecrans/**/*.png', { eager: true });

/**
 * Récupère un écran rendu par `npm run ecrans`. En anglais, sa version traduite
 * (`assets/ecrans/en/`) si elle existe, sinon l'écran français.
 */
export function ecran(projet: string, nom: string, langue: Langue = 'fr'): ImageMetadata {
  const anglais = langue === 'en' ? fichiers[`../assets/ecrans/en/${projet}/${nom}.png`] : undefined;
  if (anglais) return anglais.default;
  const cle = `../assets/ecrans/${projet}/${nom}.png`;
  const module = fichiers[cle];
  if (!module) throw new Error(`Écran introuvable : ${cle}`);
  return module.default;
}
