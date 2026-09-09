/** Réglages du site. Les deux constantes du haut sont à remplir. */

/** Clé d'accès Web3Forms — https://web3forms.com (gratuit, aucun compte serveur). */
export const CLE_FORMULAIRE = 'REMPLACER-PAR-VOTRE-CLE-WEB3FORMS';

/** URL de prise de rendez-vous (Cal.com, Calendly…). Laisser vide masque le bouton. */
export const LIEN_RDV = '';

export const STUDIO = {
  nom: 'Cadran',
  accroche: 'Le produit avant le code',
  description:
    "Studio de conception et de développement d'applications web et mobiles. " +
    'On cadre le problème, on valide les écrans, ensuite on construit.',
  ville: 'France',
} as const;

/** Préfixe les liens internes avec la base du site (nécessaire sous /vitrine). */
export function lien(chemin: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return chemin === '/' ? base || '/' : `${base}${chemin}`;
}
