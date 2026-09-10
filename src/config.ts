/** Réglages du site. Les deux constantes du haut sont à remplir. */

/** Clé d'accès Web3Forms — https://web3forms.com (gratuit, aucun compte serveur). */
export const CLE_FORMULAIRE = 'REMPLACER-PAR-VOTRE-CLE-WEB3FORMS';

/** URL de prise de rendez-vous (Cal.com, Calendly…). Laisser vide masque le bouton. */
export const LIEN_RDV = '';

export const STUDIO = {
  nom: 'Moamind Solutions',
  /** Les deux moitiés du nom, pour le mot-marque. */
  nomCourt: 'Moamind',
  nomSuffixe: 'Solutions',
  accroche: 'Le produit avant le code',
  description:
    "Conception et développement d'applications web et mobiles. On cadre le " +
    'problème, vous validez les écrans, rien ne se construit avant.',
  ville: 'Bordeaux',
} as const;

/** Préfixe les liens internes avec la base du site (nécessaire sous /vitrine). */
export function lien(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return chemin === '/' ? base || '/' : `${base}${chemin}`;
}
