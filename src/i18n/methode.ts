import type { Langue } from './routes';
import type { Titre } from './types';

const fr = {
  meta: { titre: 'Méthode', description: 'Écouter, cadrer, valider, construire. La méthode de Moamind Solutions, avec ses livrables, ses délais et ses engagements.' },
  etiquette: 'La méthode',
  titre: { gras: "Comprendre d'abord", leger: 'construire ensuite.' } as Titre,
  sous: "La plupart des applications qui échouent ont été très bien développées. Elles répondaient simplement aux mauvaises questions. Voilà comment on s'assure que ce ne sera pas la vôtre.",
  escalierAria: 'Les quatre temps',
  temps: [
    {
      ancre: 'ecouter',
      titre: 'Écouter',
      resume: 'Comprendre votre métier avant de vous proposer quoi que ce soit.',
      texte: [
        "Un entretien, sans grille de questions toute faite et sans démonstration commerciale. Ce que je cherche à savoir : ce que vous faites, qui s'en sert, ce qui coince aujourd'hui, et ce que vous avez déjà tenté.",
        "J'en tire une note écrite de ce que j'ai compris, dans les mots de votre métier, pas dans les miens. Vous la corrigez. Tant qu'elle sonne faux à la lecture, rien ne commence : un malentendu à cette étape se paie au centuple plus tard.",
      ],
      livrables: ['Note de cadrage écrite', 'Reformulation de votre problème', 'Les questions qui restent ouvertes'],
      delai: 'Sous une semaine',
      engagement: 'La note est à vous, même si vous ne donnez pas suite.',
    },
    {
      ancre: 'cadrer',
      titre: 'Cadrer',
      resume: 'Réduire le problème à ce qui compte, et écrire pourquoi.',
      texte: [
        "C'est l'étape que la plupart des projets sautent, et c'est celle qui décide de tout. On regarde ce qui existe, on identifie les décisions structurantes, et on tranche : ce qui entre dans la première version, ce qui attend, ce qui n'existera jamais.",
        "Chaque arbitrage est écrit avec sa raison. Ça paraît bureaucratique jusqu'au jour où la question revient en réunion, six mois plus tard, et où la réponse est déjà là, avec son argument.",
      ],
      livrables: ['Périmètre de la première version', 'Décisions de conception argumentées', "Ce qui est explicitement reporté"],
      delai: 'Une à deux semaines',
      engagement: "Si le cadrage montre qu'il ne faut pas construire l'application, je vous le dis.",
    },
    {
      ancre: 'valider',
      titre: 'Valider',
      resume: 'Des écrans réels, corrigés ensemble, avant la moindre ligne de code.',
      texte: [
        "Pas de boîtes grises, pas de schéma d'architecture en guise de maquette. Des écrans finis, à la bonne taille, avec vos vrais libellés et vos vraies données d'exemple. En clair et en sombre. Sur téléphone comme sur écran large.",
        'On les regarde ensemble, vous les annotez, je corrige. Reprendre un écran coûte une heure ; reprendre la même chose après développement coûte une semaine et entame la confiance.',
      ],
      livrables: ['Maquettes cliquables de chaque parcours', "Parcours d'erreur et cas limites", 'Le périmètre visuel figé'],
      delai: 'Quelques jours par parcours',
      engagement: 'Rien ne part en développement sans un écran que vous avez validé.',
    },
    {
      ancre: 'construire',
      titre: 'Construire',
      resume: 'Par tranches complètes, livrées une par une.',
      texte: [
        "Une tranche, c'est un parcours qui fonctionne de bout en bout : l'écran, la logique, les données, la mise en ligne. Je la termine, je vous la livre, vous l'utilisez pour de vrai. Puis la suivante.",
        'Ce que je ne fais jamais : ouvrir cinq chantiers en parallèle et vous montrer soixante pour cent de chacun. Un produit à soixante pour cent ne se montre pas, ne se teste pas, et ne se corrige pas.',
      ],
      livrables: ['Application en ligne à chaque tranche', 'Code documenté et testé', 'Publication sur les stores'],
      delai: 'Au rythme des tranches',
      engagement: 'Chaque livraison est utilisable, pas seulement démontrable.',
    },
  ],
  visuels: {
    note: {
      titre: 'Note de cadrage',
      meta: 'Version 2 · corrigée par le client',
      rubriques: ['Ce que vous faites', "Qui s'en sert", "Ce qui coince aujourd'hui"],
      correction: '« Ce ne sont pas les clients qui se plaignent, ce sont les chauffeurs. »',
    },
    tableau: {
      colonnes: [
        { titre: 'Version 1', items: ['Réserver un créneau', "Payer d'avance", 'Suivre la charge', "Noter l'hôte"] },
        { titre: 'Plus tard', items: ['Abonnements', 'Parrainage'] },
        { titre: 'Jamais', items: ['Facturer au kWh'] },
      ],
      pourquoi: '<b>Pourquoi « jamais » :</b> facturer au kWh exigerait un compteur certifié et ferait de l\'hôte un revendeur d\'électricité.',
    },
    bulles: [
      'Remonter le total en haut ?',
      'Afficher le nombre de parts voyageur ?',
      "Et si un péage s'ajoute en route ?",
      'Corrigé ✓',
      'Écran validé',
    ],
    frise: [
      { nom: 'Tranche 1 · Trouver une borne', detail: 'Recherche, fiche, disponibilités', etat: 'En ligne' },
      { nom: 'Tranche 2 · Réserver et payer', detail: 'Créneau, prix fixé, paiement', etat: 'En cours' },
      { nom: 'Tranche 3 · Espace hôte', detail: 'Disponibilités, revenus', etat: 'Prévue' },
    ],
  },
  recoit: 'Ce que vous recevez',
  engagement: "L'engagement",
  engagements: {
    titre: 'Six mots que tout le monde revendique, et ce qu\'ils coûtent',
    items: [
      { mot: 'Écoute', texte: "Un entretien de cadrage avant tout devis, et une note écrite de ce que j'ai compris, que vous pouvez corriger." },
      { mot: 'Compréhension', texte: "Votre problème vous est restitué dans les mots de votre métier. Si la note sonne faux à la lecture, c'est que je n'ai pas compris." },
      { mot: 'Rapidité', texte: 'Des maquettes cliquables en quelques jours. La vitesse vient du cadrage, jamais de la précipitation.' },
      { mot: 'Validation', texte: 'La maquette est le contrat. Vous ne découvrez rien à la livraison.' },
      { mot: 'Efficacité', texte: 'On construit le parcours qui porte la valeur et on reporte le reste, en le disant et en écrivant pourquoi.' },
      { mot: 'Modernité', texte: 'Des interfaces qui tiennent la comparaison avec ce que vos utilisateurs manipulent tous les jours. Les écrans sont en ligne : jugez-les.' },
    ],
  },
  appel: {
    titre: 'Commençons par écouter',
    texte: "Le premier entretien ne vous engage à rien. Vous repartez avec une note écrite de ce que j'ai compris de votre projet, et elle est à vous, même si vous vous arrêtez là.",
  },
};

const en: typeof fr = {
  meta: { titre: 'Method', description: "Listen, scope, validate, build: the Moamind Solutions method, with its deliverables, timelines and commitments." },
  etiquette: 'The method',
  titre: { gras: 'Understand first', leger: 'build second.' },
  sous: "Most apps that fail were built very well. They just answered the wrong questions. Here's how I make sure yours won't be one of them.",
  escalierAria: 'The four steps',
  temps: [
    {
      ancre: 'listen',
      titre: 'Listen',
      resume: 'Understand your business before I propose anything.',
      texte: [
        "An interview, no script and no sales pitch. What I want to know: what you do, who uses it, what's not working today, and what you've already tried.",
        "I write up what I understood, in your business's own words, not mine. You correct it. As long as it reads wrong, nothing starts: a misunderstanding at this stage costs ten times more later.",
      ],
      livrables: ['Written scoping note', 'Your problem, restated', 'The questions still open'],
      delai: 'Within a week',
      engagement: "The note is yours, even if you don't go further.",
    },
    {
      ancre: 'scope',
      titre: 'Scope',
      resume: 'Cut the problem down to what matters, and write down why.',
      texte: [
        "This is the step most projects skip, and it's the one that decides everything. I look at what exists, identify the decisions that actually matter, and draw the line: what's in the first version, what waits, what never happens.",
        "Every call is written down with its reason. It feels bureaucratic, until the question comes back up in a meeting six months later, and the answer is already there, argument included.",
      ],
      livrables: ['Scope of the first version', 'Design decisions, with reasons', 'What is explicitly deferred'],
      delai: 'One to two weeks',
      engagement: "If the scoping shows the app shouldn't be built, I'll tell you.",
    },
    {
      ancre: 'validate',
      titre: 'Validate',
      resume: 'Real screens, corrected together, before a single line of code.',
      texte: [
        "No gray boxes, no architecture diagram standing in for a mockup. Finished screens, full size, with your real labels and real sample data. Light and dark. Phone and wide screen.",
        "We look at them together, you mark them up, I fix them. Redoing a screen costs an hour; redoing the same thing after development costs a week, and it dents trust.",
      ],
      livrables: ['Clickable mockups of every flow', 'Error paths and edge cases', 'The visual scope, locked'],
      delai: 'A few days per flow',
      engagement: "Nothing goes into development without a screen you've approved.",
    },
    {
      ancre: 'build',
      titre: 'Build',
      resume: 'In complete slices, delivered one at a time.',
      texte: [
        "A slice is a flow that works end to end: the screen, the logic, the data, the release. I finish it, I deliver it, you use it for real. Then the next one.",
        "What I never do: open five fronts at once and show you sixty percent of each. A product at sixty percent can't be shown, can't be tested, and can't be fixed.",
      ],
      livrables: ['A live app after every slice', 'Documented, tested code', 'Store submissions'],
      delai: 'At the pace of the slices',
      engagement: 'Every delivery is usable, not just demoable.',
    },
  ],
  visuels: {
    note: {
      titre: 'Scoping note',
      meta: 'Version 2 · corrected by the client',
      rubriques: ['What you do', 'Who uses it', "What's not working today"],
      correction: '“It\'s not the customers who complain, it\'s the drivers.”',
    },
    tableau: {
      colonnes: [
        { titre: 'Version 1', items: ['Book a time slot', 'Pay up front', 'Track the charge', 'Rate the host'] },
        { titre: 'Later', items: ['Subscriptions', 'Referrals'] },
        { titre: 'Never', items: ['Bill by the kWh'] },
      ],
      pourquoi: '<b>Why “never”:</b> billing by the kWh would require a certified meter and turn the host into an electricity reseller.',
    },
    bulles: [
      'Move the total to the top?',
      'Show the number of rider shares?',
      'What if a toll gets added along the way?',
      'Fixed ✓',
      'Screen approved',
    ],
    frise: [
      { nom: 'Slice 1 · Find a charger', detail: 'Search, listing, availability', etat: 'Live' },
      { nom: 'Slice 2 · Book and pay', detail: 'Time slot, fixed price, payment', etat: 'In progress' },
      { nom: 'Slice 3 · Host dashboard', detail: 'Availability, earnings', etat: 'Planned' },
    ],
  },
  recoit: 'What you get',
  engagement: 'The commitment',
  engagements: {
    titre: 'Six words everyone claims, and what they cost',
    items: [
      { mot: 'Listening', texte: 'A scoping interview before any quote, and a written note of what I understood, which you can correct.' },
      { mot: 'Understanding', texte: "Your problem, handed back in your business's own words. If the note reads wrong, it means I got it wrong." },
      { mot: 'Speed', texte: 'Clickable mockups within days. The speed comes from the scoping, never from rushing.' },
      { mot: 'Validation', texte: "The mockup is the contract. You discover nothing at delivery." },
      { mot: 'Efficiency', texte: 'We build the flow that carries the value and defer the rest, saying so and writing down why.' },
      { mot: 'Modern design', texte: 'Interfaces that hold up against what your users handle every day. The screens are live: judge them yourself.' },
    ],
  },
  appel: {
    titre: "Let's start by listening",
    texte: "The first call doesn't commit you to anything. You leave with a written note of what I understood about your project, and it's yours, even if you stop there.",
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
