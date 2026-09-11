import type { Langue } from './routes';
import type { Titre } from './types';

const fr = {
  meta: {
    titre: 'Réalisations',
    description: "Des applications conçues et développées de bout en bout : le problème de départ, ce qu'elles changent pour ceux qui s'en servent, et les écrans qui en sont sortis.",
  },
  etiquette: 'Réalisations',
  titre: { gras: 'Du besoin', leger: "à l'application." } as Titre,
  sous: "Des applications conçues et développées de bout en bout, du premier entretien à la mise en ligne. Pour chacune : le problème de départ, ce qu'elle change pour ceux qui s'en servent, et les écrans qui en sont sortis.",
  lireEtude: { avant: "Lire l'étude de cas", apres: '→' },
  appel: {
    titre: 'Décrivez ce que vous voulez construire',
    texte: 'Réponse sous deux jours ouvrés. Le premier entretien ne vous engage à rien, et vous repartez avec une note écrite de votre problème, telle qu\'on l\'a comprise.',
  },
  etude: {
    filAria: "Fil d'Ariane",
    etiquette: 'Étude de cas',
    fiche: { domaine: 'Domaine', plateforme: 'Plateforme', code: 'Code', depotPublic: 'Dépôt public ↗', depotPrive: 'Dépôt privé' },
    ecranPrincipal: 'écran principal',
    depart: 'Le point de départ',
    parcours: 'Le parcours principal, en quatre écrans',
    benefices: { titre: "Ce que ça change pour ceux qui s'en servent", lead: 'Trois bénéfices concrets, pensés avant le premier écran et vérifiés sur les maquettes.' },
    livre: 'Ce qui a été produit',
    suivante: 'Étude suivante',
    lire: "Lire l'étude de cas →",
    appel: { titre: 'Un produit à cadrer ?', texte: "C'est le travail que vous venez de voir, appliqué à votre projet. Le premier entretien est offert, et vous repartez avec une note écrite." },
  },
};

const en: typeof fr = {
  meta: {
    titre: 'Work',
    description: 'Apps designed and built end to end: the problem to start with, what they change for the people who use them, and the screens that came out of it.',
  },
  etiquette: 'Work',
  titre: { gras: 'From need', leger: 'to app.' } as Titre,
  sous: 'Apps designed and built end to end, from the first conversation to launch. For each one: the problem to start with, what it changes for the people who use it, and the screens that came out of it.',
  lireEtude: { avant: 'Read the', apres: 'case study →' },
  appel: {
    titre: 'Describe what you want to build',
    texte: "Reply within two business days. The first conversation commits you to nothing, and you leave with a written note of your problem, as it's been understood.",
  },
  etude: {
    filAria: 'Breadcrumb',
    etiquette: 'Case study',
    fiche: { domaine: 'Field', plateforme: 'Platform', code: 'Code', depotPublic: 'Public repository ↗', depotPrive: 'Private repository' },
    ecranPrincipal: 'main screen',
    depart: 'Where it started',
    parcours: 'The main journey, in four screens',
    benefices: { titre: 'What it changes for the people who use it', lead: 'Three concrete benefits, thought through before the first screen and checked against the wireframes.' },
    livre: 'What was delivered',
    suivante: 'Next case study',
    lire: 'Read the case study →',
    appel: { titre: 'A product to scope?', texte: "This is the work you just saw, applied to your project. The first conversation is free, and you leave with a written note." },
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
