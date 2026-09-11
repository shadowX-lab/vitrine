/** Réglages du site. Seul le lien de rendez-vous reste à remplir. */

import { chemin, type Langue, type Page } from './i18n/routes';

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

const base = () => import.meta.env.BASE_URL.replace(/\/$/, '');

/** Adresse d'une page dans une langue, base du site comprise (nécessaire sous /vitrine). */
export function lien(page: Page, langue: Langue, slug?: string): string {
  const c = chemin(page, langue, slug);
  return c === '/' ? base() || '/' : `${base()}${c}`;
}

/** Adresse d'un fichier statique de `public/`, sans notion de langue. */
export function ressource(fichier: string): string {
  return `${base()}${fichier}`;
}

/** La page donnée, dans la langue demandée ; sans page (404), l'accueil de cette langue. */
export function equivalent(langue: Langue, page?: Page, slug?: string): string {
  return page ? lien(page, langue, slug) : lien('accueil', langue);
}
