import type { Langue } from './routes';

const fr = {
  accroche: 'Le produit avant le code',
  description: "Conception et développement d'applications web et mobiles. On cadre le problème, vous validez les écrans, rien ne se construit avant.",
  sautContenu: 'Aller au contenu',
  /** Complète le nom du studio dans le nom accessible du logo : « Moamind Solutions, accueil ». */
  accueil: 'accueil',
  nav: { aria: 'Navigation principale', methode: 'Méthode', realisations: 'Réalisations', experience: 'Expérience', ouvrirMenu: 'Ouvrir le menu' },
  cta: 'Décrire mon projet',
  voirRealisations: 'Voir les réalisations',
  retourAccueil: "Retour à l'accueil",
  rdv: 'Réserver 30 minutes',
  langue: { choisir: 'Choisir la langue', pied: 'Langue' },
  pied: {
    aria: 'Navigation de pied de page',
    phrase: 'Votre produit est étudié, cadré et validé avant la première ligne de code.',
    travail: 'Le travail',
    studio: 'Le studio',
    contact: 'Contact',
    base: 'Basé à Bordeaux, au travail partout',
    mentions: 'Mentions légales',
  },
};

const en: typeof fr = {
  accroche: 'Product before code',
  description: 'Design and development of web and mobile apps. The problem gets scoped, you approve the screens, and nothing gets built before that.',
  sautContenu: 'Skip to content',
  accueil: 'home',
  nav: { aria: 'Main navigation', methode: 'Method', realisations: 'Work', experience: 'Experience', ouvrirMenu: 'Open menu' },
  cta: 'Describe my project',
  voirRealisations: 'See the work',
  retourAccueil: 'Back to home',
  rdv: 'Book 30 minutes',
  langue: { choisir: 'Choose language', pied: 'Language' },
  pied: {
    aria: 'Footer navigation',
    phrase: 'Your product is studied, scoped and approved before the first line of code.',
    travail: 'The work',
    studio: 'The studio',
    contact: 'Contact',
    base: 'Based in Bordeaux, working everywhere',
    mentions: 'Legal notice',
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
