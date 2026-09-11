import type { Langue } from './routes';

const fr = {
  meta: { titre: 'Contact', description: 'Décrivez votre projet. Réponse sous deux jours ouvrés, premier entretien de cadrage gratuit et sans engagement.' },
  etiquette: 'Contact',
  /** Groupes de mots séparés par « | » : sous 700 px, chaque groupe prend sa ligne. */
  titre: { gras: 'Quelques phrases|suffisent', leger: 'pour lancer|la discussion.' },
  sous: "Pas besoin d'un cahier des charges. Un&nbsp;problème, une intuition, une contrainte : c'est un bon point de départ. C'est même le meilleur.",
  etapes: [
    { titre: 'Vous écrivez', texte: 'Avec vos mots, sans jargon technique : la traduction fait partie du travail.' },
    { titre: 'Une réponse sous deux jours ouvrés', texte: "Avec une première lecture de votre problème et les questions qu'il soulève." },
    { titre: 'On se parle une heure', texte: 'Gratuitement, et sans engagement. Vous repartez avec une note écrite de ce qui a été compris.' },
  ],
  rdvQuestion: 'Vous préférez parler tout de suite ?',
  formulaire: {
    sujet: 'Nouveau projet — Moamind Solutions',
    expediteur: 'Site Moamind Solutions',
    titre: 'Votre projet',
    profil: { legende: 'Vous êtes', particulier: 'Un particulier', professionnel: 'Un professionnel' },
    nom: { libelle: 'Votre nom', exemple: 'Camille Martin…' },
    organisation: { libelle: 'Organisation', exemple: 'Transports Martin…' },
    email: { libelle: 'Adresse e-mail', exemple: 'camille@exemple.fr…' },
    nature: { legende: "De quoi s'agit-il ?", choix: ['Application mobile', 'Application web', 'Les deux', 'Cadrage seul', 'Je ne sais pas encore'] },
    echeance: { libelle: 'Échéance souhaitée', defaut: 'À définir ensemble', choix: ['Le plus tôt possible', 'Dans les trois mois', 'Dans les six mois', 'Plus tard, je prépare'] },
    budget: { libelle: 'Budget envisagé', facultatif: 'facultatif', paliers: ['Je ne sais pas encore', 'Moins de 5 000 €', '5 000 € à 15 000 €', '15 000 € à 50 000 €', 'Plus de 50 000 €'], exemple: 'Par exemple 3 000 €…' },
    message: { libelle: 'Votre projet', aide: "Ce que vous faites, qui s'en sert, ce qui coince aujourd'hui." },
    envoyer: 'Envoyer mon projet',
    envoi: 'Envoi…',
    mention: 'Vos informations servent uniquement à vous répondre. Elles ne sont ni revendues, ni utilisées pour autre chose.',
  },
};

const en: typeof fr = {
  meta: { titre: 'Contact', description: 'Describe your project. Reply within two business days; the first scoping call is free and commits you to nothing.' },
  etiquette: 'Contact',
  titre: { gras: 'A few sentences', leger: 'are all it takes to start.' },
  sous: "No need for a specification document. A problem, a hunch, a constraint: that's a good place to start. The best one, in fact.",
  etapes: [
    { titre: 'You write', texte: 'In your own words, no technical jargon: translating it is part of the job.' },
    { titre: 'A reply within two business days', texte: 'With a first reading of your problem and the questions it raises.' },
    { titre: 'A one-hour conversation', texte: 'Free, with no commitment. You leave with a written note of what was understood.' },
  ],
  rdvQuestion: 'Rather talk right away?',
  formulaire: {
    sujet: 'New project — Moamind Solutions',
    expediteur: 'Moamind Solutions website',
    titre: 'Your project',
    profil: { legende: 'You are', particulier: 'An individual', professionnel: 'A business' },
    nom: { libelle: 'Your name', exemple: 'Camille Martin…' },
    organisation: { libelle: 'Organization', exemple: 'Martin Transport…' },
    email: { libelle: 'Email address', exemple: 'camille@example.com…' },
    nature: { legende: 'What is it about?', choix: ['Mobile app', 'Web app', 'Both', 'Scoping only', 'Not sure yet'] },
    echeance: { libelle: 'Target date', defaut: 'To be decided together', choix: ['As soon as possible', 'Within three months', 'Within six months', 'Later, just planning ahead'] },
    budget: { libelle: 'Planned budget', facultatif: 'optional', paliers: ['Not sure yet', 'Under €5,000', '€5,000 to €15,000', '€15,000 to €50,000', 'Over €50,000'], exemple: 'For example €3,000…' },
    message: { libelle: 'Your project', aide: 'What you do, who uses it, what gets in the way today.' },
    envoyer: 'Send my project',
    envoi: 'Sending…',
    mention: 'Your information is used only to reply to you. It is never sold or used for anything else.',
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
