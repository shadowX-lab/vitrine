/** Réglages du site. Seul le lien de rendez-vous reste à remplir. */

import { chemin, DOMAINES, type Langue, type Page } from './i18n/routes';

/** Clé d'accès Web3Forms (https://web3forms.com), liée à l'adresse qui reçoit les messages du formulaire. Publique par nature. */
export const CLE_FORMULAIRE = '5aab8bf4-0583-44a1-a4b3-4360656005ea';

/** URL de prise de rendez-vous (Cal.com, Calendly…). Laisser vide masque le bouton. */
export const LIEN_RDV = '';

export const STUDIO = {
  nom: 'Moamind Solutions',
  /** Les deux moitiés du nom, pour le mot-marque. */
  nomCourt: 'Moamind',
  nomSuffixe: 'Solutions',
  ville: 'Bordeaux',
} as const;

/**
 * En ligne, chaque langue est à la racine de son domaine. En développement, un seul serveur
 * sert les deux : les pages anglaises y vivent sous /en (leur dossier dans src/pages et dist).
 */
const prefixe = (langue: Langue) => (langue === 'en' && import.meta.env.DEV ? '/en' : '');

/** Adresse d'une page dans sa langue, relative à la racine de son domaine. */
export function lien(page: Page, langue: Langue, slug?: string): string {
  return prefixe(langue) + chemin(page, langue, slug);
}

/** Adresse complète d'une page, sur le domaine de sa langue (en développement, le domaine du français). */
export function absolu(page: Page, langue: Langue, slug?: string): string {
  return new URL(lien(page, langue, slug), import.meta.env.DEV ? DOMAINES.fr : DOMAINES[langue]).href;
}

/** Adresse d'un fichier statique de `public/`, copié à la racine des deux domaines. */
export function ressource(fichier: string): string {
  return fichier;
}

/**
 * Lien du sélecteur de langue vers `cible`, depuis une page en `courante` : la même page, ou
 * l'accueil pour la 404. Vers l'autre domaine, `?langue=` enregistre le choix (voir .htaccess).
 */
export function equivalent(cible: Langue, courante: Langue, page?: Page, slug?: string): string {
  const [p, s] = page ? [page, slug] : (['accueil', undefined] as const);
  if (cible === courante || import.meta.env.DEV) return lien(p, cible, s);
  return `${absolu(p, cible, s)}?langue=${cible}`;
}
