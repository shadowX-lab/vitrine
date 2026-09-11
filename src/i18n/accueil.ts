import type { Langue } from './routes';
import type { Titre } from './types';

const fr = {
  etiquette: 'Conception et développement · web et mobile',
  titre: { gras: 'Le produit', leger: 'avant le code.' } as Titre,
  sous: 'La plupart des applications qui échouent ont été très bien développées. Elles répondaient simplement aux mauvaises questions. On commence par celles-là.',
  preuve: ['Réponse sous 2 jours ouvrés', 'Premier entretien offert'],
  chipChiens: { titre: '1 chien trouvé', sous: 'à moins de 5 km' },
  chipPrix: {
    estime: 'ESTIMÉ',
    kwh: { valeur: '12,6', unite: 'kWh ajoutés' },
    payer: 'À PAYER',
    prix: { valeur: '12,40', unite: '€ au total' },
  },
  chiffres: [
    { valeur: '15 ans', libelle: "d'expérience, du développement au pilotage produit" },
    { valeur: '0', libelle: 'ligne de code avant un écran que vous avez validé' },
    { valeur: '1', libelle: 'seul interlocuteur, du premier entretien à la mise en ligne' },
  ],
  conviction: {
    /** Le second morceau contient `&nbsp;` : chaîne HTML. */
    titre: ["Le code n'est pas le sujet.", 'Il est la&nbsp;conséquence.'] as [string, string],
    couts: ['Son développement', '+ son retrait', "+ la confiance de ceux qui s'en servaient"],
    legende: 'Ce que coûte vraiment une fonctionnalité mal cadrée.',
    /** Chaînes HTML (`<strong>`). */
    paragraphes: [
      "Une fonctionnalité mal cadrée ne coûte pas seulement son développement. Elle coûte son développement, puis son retrait, puis la confiance de ceux qui s'en servaient. <strong>C'est le poste de dépense le plus lourd d'un projet, et personne ne le facture.</strong>",
      "Alors on prend le temps au début, là où il est bon marché. On cherche d'abord à comprendre votre métier, avant de vous proposer quoi que ce soit. On tranche ensemble ce qui entre dans la première version. Les écrans sont dessinés, vous les corrigez, et rien ne se construit qui n'ait été validé.",
    ],
    chute: 'Ensuite, oui, ça va vite — parce que la question difficile est déjà réglée.',
  },
  methode: {
    titre: 'Vous validez les écrans. Ensuite, on développe.',
    lead: 'Chaque étape se termine par un document ou des écrans que vous validez. La suivante commence seulement après votre accord.',
    lien: 'La méthode en détail →',
    etapes: [
      { delai: 'Sous une semaine', titre: 'Écouter', texte: 'Un entretien sur votre métier. Vous recevez une note écrite de ce qui a été compris, et vous la corrigez.' },
      { delai: '1 à 2 semaines', titre: 'Cadrer', texte: 'On décide ensemble ce qui entre dans la première version et ce qui attend. Chaque choix est écrit avec sa raison.' },
      { delai: 'Quelques jours par parcours', titre: 'Valider', texte: 'Vous testez des maquettes cliquables avec vos vrais libellés. Rien ne part en développement sans votre accord.' },
      { delai: 'Au rythme des tranches', titre: 'Construire', texte: "L'application arrive par parcours complets, utilisables dès leur mise en ligne." },
    ],
    /** Textes des livrables dessinés sur les cartes (décoratifs, masqués aux lecteurs d'écran). */
    visuels: {
      note: 'Note de cadrage',
      correction: '« Les chauffeurs ne voient pas les prix »',
      v1: 'Version 1',
      v1Items: ['Réserver un créneau', "Payer d'avance", 'Suivre la charge'],
      plusTard: 'Plus tard',
      plusTardItems: ['Abonnements', 'Avis'],
      remonter: 'Remonter le total ?',
      valide: 'Validé',
      tranches: [
        { nom: 'Tranche 1 · Réservation', etat: 'En ligne' },
        { nom: 'Tranche 2 · Paiement', etat: 'En cours' },
        { nom: 'Tranche 3 · Espace hôte', etat: 'Prévue' },
      ],
    },
  },
  realisations: {
    titre: 'Des produits conçus et développés ici',
    lead: "Des applications conçues de bout en bout, présentées avec ce qu'elles changent pour ceux qui s'en servent chaque jour.",
    lien: 'Voir les réalisations →',
  },
  experience: {
    titre: 'Quinze ans de projets, côté technique et côté métier',
    lead: 'En indépendant avec des clients directs, chez des éditeurs de logiciels, et dans de grands groupes où un déploiement concerne des milliers de postes.',
    parcours: ['Développeur', 'Chef de projet', 'Product Owner', 'Business Analyst'],
    lien: 'Voir le parcours →',
    /** Mot-clé, et vrai s'il est mis en avant. */
    motsCles: [
      ['Sécurité auditée', true], ["Passage à l'échelle", false], ['Règles métier', false], ['Budget et arbitrages', true],
      ['Architecture distribuée', false], ['Tests de bout en bout', false], ["Contrats d'API", false], ['Feuille de route', true],
      ['Migration sans interruption', false], ['Parcours utilisateur', false], ["Critères d'acceptation", false], ['Formation et support', false],
    ] as [string, boolean][],
  },
  services: {
    titre: "Du premier entretien à l'application en ligne",
    lead: 'Tout est pris en charge, avec un seul interlocuteur du début à la fin.',
    /** Dans l'ordre des icônes de la vue. */
    items: [
      { titre: 'Cadrage produit', texte: "Entretiens, analyse de votre métier et de l'existant, choix du périmètre. Vous gardez le document, quoi qu'il arrive." },
      { titre: "Design d'interface", texte: "Parcours et écrans dessinés au pixel, en clair et en sombre, pour le téléphone comme pour l'ordinateur." },
      { titre: 'Applications mobiles', texte: "iOS et Android, avec la finition d'une app native : gestes, animations, accessibilité." },
      { titre: 'Sites et applications web', texte: 'Rapides, accessibles, bien référencés. Ce site en est un exemple.' },
      { titre: 'Back-end et données', texte: 'API claires, modèle de données lisible, migrations propres, tests sur les règles métier.' },
      { titre: 'Mise en ligne et suivi', texte: "Publication sur les stores, mesure, corrections. L'application continue d'évoluer après la livraison." },
    ],
  },
  appel: {
    titre: 'Décrivez votre projet en quelques phrases',
    texte: 'Réponse sous 2 jours ouvrés. Le premier entretien est offert, et vous repartez avec une note écrite de votre projet, que vous donniez suite ou non.',
  },
};

const en: typeof fr = {
  etiquette: 'Design and development · web and mobile',
  titre: { gras: 'Product', leger: 'before code.' },
  sous: 'Most apps that fail were built well. They just answered the wrong questions. Here, the questions come first.',
  preuve: ['Reply within two business days', 'Free first call'],
  chipChiens: { titre: '1 dog found', sous: 'within 5 km' },
  chipPrix: {
    estime: 'ESTIMATED',
    kwh: { valeur: '12.6', unite: 'kWh added' },
    payer: 'TO PAY',
    prix: { valeur: '12.40', unite: '€ total' },
  },
  chiffres: [
    { valeur: '15 years', libelle: 'of experience, from writing code to running products' },
    { valeur: '0', libelle: 'lines of code before you approve the screens' },
    { valeur: '1', libelle: 'point of contact, from the first call to launch' },
  ],
  conviction: {
    titre: ['Code is not the point.', 'It is the&nbsp;consequence.'],
    couts: ['Building it', '+ removing it', '+ the trust of the people who used it'],
    legende: 'What a poorly scoped feature really costs.',
    paragraphes: [
      "A poorly scoped feature doesn't just cost the build. It costs the build, then the removal, then the trust of the people who relied on it. <strong>It's the biggest expense in any project, and nobody ever bills for it.</strong>",
      "So the time is spent up front, where it's cheap. The first job is to understand your business, before proposing anything at all. Together, we decide what goes into the first version. The screens get drawn, you mark them up, and nothing gets built until you've approved it.",
    ],
    chute: 'After that, yes, it moves fast — because the hard question is already answered.',
  },
  methode: {
    titre: 'You approve the screens. Then it gets built.',
    lead: 'Every step ends with a document or screens for you to approve. The next one starts only after you sign off.',
    lien: 'The method in detail →',
    etapes: [
      { delai: 'Within a week', titre: 'Listen', texte: 'A conversation about your business. You get a written note of what was understood, and you correct it.' },
      { delai: '1 to 2 weeks', titre: 'Scope', texte: 'Together, we decide what goes into the first version and what waits. Every choice is written down with its reason.' },
      { delai: 'A few days per flow', titre: 'Approve', texte: 'You test clickable mockups with your actual wording. Nothing goes into development without your go-ahead.' },
      { delai: 'Slice by slice', titre: 'Build', texte: 'The app arrives in complete flows, each one usable the day it goes live.' },
    ],
    visuels: {
      note: 'Scoping note',
      correction: '“Drivers can’t see the prices”',
      v1: 'Version 1',
      v1Items: ['Book a slot', 'Pay upfront', 'Track charging'],
      plusTard: 'Later',
      plusTardItems: ['Subscriptions', 'Reviews'],
      remonter: 'Move the total up?',
      valide: 'Approved',
      tranches: [
        { nom: 'Slice 1 · Booking', etat: 'Live' },
        { nom: 'Slice 2 · Payment', etat: 'In progress' },
        { nom: 'Slice 3 · Host portal', etat: 'Planned' },
      ],
    },
  },
  realisations: {
    titre: 'Products designed and built here',
    lead: 'Apps designed end to end, shown with what they change for the people who use them every day.',
    lien: 'See the work →',
  },
  experience: {
    titre: 'Fifteen years of projects, on the tech side and the business side',
    lead: 'As a freelancer with direct clients, at software companies, and in large corporations where a single rollout reaches thousands of workstations.',
    parcours: ['Developer', 'Project Manager', 'Product Owner', 'Business Analyst'],
    lien: 'See the background →',
    motsCles: [
      ['Security audits', true], ['Scaling', false], ['Business rules', false], ['Budget and trade-offs', true],
      ['Distributed architecture', false], ['End-to-end testing', false], ['API contracts', false], ['Roadmap', true],
      ['Zero-downtime migration', false], ['User journeys', false], ['Acceptance criteria', false], ['Training and support', false],
    ],
  },
  services: {
    titre: 'From the first call to a live app',
    lead: 'Everything is covered, with one point of contact from start to finish.',
    items: [
      { titre: 'Product scoping', texte: 'Interviews, a close look at your business and what already exists, a clear scope. You keep the document, no matter what.' },
      { titre: 'Interface design', texte: 'Flows and screens designed to the pixel, in light and dark mode, for phone and desktop alike.' },
      { titre: 'Mobile apps', texte: 'iOS and Android, with the polish of a native app: gestures, animations, accessibility.' },
      { titre: 'Websites and web apps', texte: 'Fast, accessible, and built to rank. This site is one example.' },
      { titre: 'Back end and data', texte: 'Clear APIs, a readable data model, clean migrations, tests on the business rules.' },
      { titre: 'Launch and follow-up', texte: 'Store releases, analytics, fixes. The app keeps evolving after handoff.' },
    ],
  },
  appel: {
    titre: 'Describe your project in a few sentences',
    texte: 'Reply within two business days. The first call is free, and you walk away with a written note on your project, whether you move forward or not.',
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
