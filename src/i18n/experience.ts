import type { Langue } from './routes';
import type { Titre } from './types';

const fr = {
  meta: { titre: 'Expérience', description: "Quinze ans à concevoir et construire des produits, du développement au pilotage, en petite structure comme en grand groupe. Et ce que ça change concrètement pour votre projet." },
  etiquette: 'À qui vous parlez',
  titre: { gras: 'Du code au produit', leger: 'le secret de la réussite.' } as Titre,
  sous: "<span translate=\"no\">Moamind Solutions</span> conçoit et développe des applications web et mobiles. Ce qui distingue la maison tient en une phrase : ce que je vends, c'est le temps passé à ne pas construire la mauvaise chose.",
  triade: [
    { mot: 'MOA', html: "<strong>La maîtrise d'ouvrage, c'est vous.</strong> Celui qui commande, qui connaît son métier et qui sait pourquoi il veut ce produit. Mon premier travail est de me mettre à votre place." },
    { mot: 'Mind', html: "<strong>L'esprit.</strong> On réfléchit avant d'agir. Chaque décision s'écrit avec sa raison, pour qu'on puisse y revenir sans la reprendre de zéro." },
    { mot: 'Solutions', html: "<strong>La réalisation.</strong> Une réflexion qui ne se livre pas ne vaut rien. Je construis, je mets en ligne, on mesure, par tranches complètes." },
  ],
  apports: {
    titre: "Quinze ans de terrain. Ce que ça change pour votre projet",
    lead: "Développeur d'abord, puis chef de projets, puis Product Owner et Business Analyst. En clientèle directe, chez des éditeurs, et dans des groupes où un déploiement se compte en milliers de postes.",
    items: [
      { titre: 'Je parle les deux langues', texte: "J'ai écrit du code pendant des années avant de piloter des produits. Vous n'aurez pas à traduire votre métier en jargon technique, ni à faire confiance sur parole quand on vous dira que « c'est compliqué »." },
      { titre: 'Je vois les risques avant qu’ils coûtent', texte: "Une dépendance oubliée, une règle réglementaire qui change tout, une donnée que personne ne sait où trouver : ce sont les sujets qui font déraper un projet. Quinze ans de terrain, c'est surtout une bibliothèque de ces pièges-là." },
      { titre: 'J’ai tenu des budgets, pas seulement des tickets', texte: "En indépendant, l'argent était celui du client, en face de moi. En grand groupe, il fallait défendre un arbitrage devant des gens qui n'avaient pas le temps. Les deux apprennent à dire non, et à expliquer pourquoi." },
      { titre: 'J’ai été audité', texte: "Faire valider des normes de sécurité par des auditeurs externes change le rapport à la rigueur. Ce qui n'est pas écrit n'existe pas, et ce qui n'est pas prouvé n'est pas acquis. Ça se retrouve dans chaque note de cadrage que je rends." },
    ],
  },
  terrains: {
    titre: "Les terrains. Où ça s'est joué",
    lead: "Des parcs de plusieurs milliers de postes. Des normes de sécurité validées par des auditeurs externes. Des règles métier qui changent d'un pays à l'autre. Et, à l'autre bout, des clients qui paient de leur poche.",
    items: [
      {
        duree: '3 ans',
        milieu: 'Opérateur cloud européen',
        enjeu: "Des déploiements sur des parcs de plusieurs milliers de postes, coordonnés entre plusieurs sites. Des normes de sécurité à faire valider par des auditeurs externes, où ce qui n'est pas écrit n'existe pas. Un backlog à tenir pour une équipe de huit développeurs, et un run de niveau 2 qui ne s'arrête jamais.",
        cles: ['Passage à l’échelle', 'Sécurité auditée', 'Backlog produit', 'Pilotage d’équipe', 'Processus métier'],
      },
      {
        milieu: 'Groupe bancaire européen',
        enjeu: "Automatiser le travail répétitif de milliers d'utilisateurs sans casser leurs habitudes. Des stratégies de tests de bout en bout et de non-régression, parce qu'à cette échelle une régression ne se mesure pas en tickets : elle se mesure en appels au support.",
        cles: ['Automatisation', 'Expérience utilisateur', 'Tests de bout en bout', 'Non-régression'],
      },
      {
        duree: '3 ans',
        milieu: 'Commerce international',
        enjeu: "Un logiciel de vente dont les règles de gestion des stocks changent d'un pays à l'autre, au gré des réglementations. Le genre de domaine où la difficulté n'est jamais le code : c'est de comprendre la règle, et de la faire énoncer clairement par quelqu'un qui la connaît trop bien pour la formuler.",
        cles: ['Règles métier', 'Réglementation', 'Déploiement continu', 'Non-régression'],
      },
      {
        duree: '2 ans',
        milieu: 'Entité numérique d’un opérateur télécom',
        enjeu: "Recueillir des besoins clients et les transformer en exigences technico-fonctionnelles tenables. Puis migrer l'application vers une architecture distribuée sans interrompre ceux qui s'en servaient tous les jours.",
        cles: ['Exigences', 'Architecture distribuée', 'Migration', 'Support production'],
      },
      {
        milieu: 'Éditeur de gestion documentaire',
        enjeu: "Transformer des besoins métier flous en périmètre livrable, décider ce qui entre dans chaque version, et défendre les arbitrages devant ceux qui voulaient tout, tout de suite. La feuille de route et les critères d'acceptation pour seuls garde-fous.",
        cles: ['Besoins métier', 'Feuille de route', 'Critères d’acceptation', 'Stratégie de tests'],
      },
      {
        milieu: 'Service de mobilité électrique',
        enjeu: "Concevoir des API et fixer les contrats d'interface d'une architecture distribuée, c'est-à-dire décider, avant d'écrire une ligne, ce que chaque service promet aux autres et ce qu'il ne promet pas.",
        cles: ['Contrats d’API', 'Architecture distribuée', 'Tests automatisés', 'Formation'],
      },
      {
        duree: '5 ans',
        milieu: 'Clients directs, en indépendant',
        enjeu: "Des projets menés de bout en bout : le budget, les parcours, les maquettes, le développement, la formation et le support. Un interlocuteur unique, souvent non technique, qui paie de sa poche et à qui il faut rendre des comptes en français.",
        cles: ['Budget et arbitrage', 'Parcours utilisateur', 'Maquettes', 'Formation', 'Support'],
      },
    ],
  },
  fiche: [
    { terme: 'Formation', valeur: "Diplôme d'ingénieur informatique" },
    { terme: 'Certification', valeur: 'Professional Scrum Product Owner I' },
    { terme: 'Base', valeur: "Bordeaux et des projets sans frontière." },
  ],
  convictions: {
    titre: "Six convictions, chacune payée d'un exemple",
    items: [
      { titre: 'Une décision écrite vaut mieux qu’une réunion', texte: "Un arbitrage qu'on ne peut pas relire n'existe pas : il sera repris, retourné, et re-décidé autrement dans six mois. J'écris ce qu'on tranche et pourquoi." },
      { titre: 'La contrainte se pose au début, ou elle coûte une refonte', texte: "Décider qu'un chiffre serait toujours présenté comme estimé ne coûte rien au cadrage. Découvert après le développement, le même point impose de reprendre chaque écran." },
      { titre: 'Une bonne abstraction supprime plus de code qu’elle n’en ajoute', texte: "Faire d'un club une caisse comme une autre, qui avance, encaisse et rembourse, a fait disparaître le conducteur comme cas particulier." },
      { titre: 'La friction se met là où elle se justifie', texte: "Signaler un animal trouvé ne demande aucun compte. Déclarer une perte en demande un, et l'écran explique pourquoi. Une règle qu'on justifie cesse d'être subie." },
      { titre: 'Une tranche finie vaut mieux que cinq à moitié', texte: 'Un produit à soixante pour cent ne se montre pas, ne se teste pas et ne se corrige pas. Je livre des parcours complets, un par un.' },
      { titre: 'Le soin visible renseigne sur le reste', texte: "Un utilisateur ne peut pas juger une architecture. Il juge le chargement, l'alignement, le texte d'erreur, et il en déduit la qualité de ce qu'il ne voit pas." },
    ],
  },
  outils: {
    titre: 'Ce avec quoi je construis',
    lead: "Une technologie se choisit pour un problème, pas pour un curriculum. Voilà ce que j'utilise le plus souvent, et pourquoi.",
    items: [
      { titre: 'Mobile', texte: 'iOS natif (Swift, SwiftUI), Android, multiplateforme quand le besoin le justifie.' },
      { titre: 'Web', texte: "Astro, TypeScript, rendu statique quand c'est possible. Ce site en est un exemple." },
      { titre: 'Back-end et données', texte: 'API typées, contrats d’interface explicites, migrations versionnées, tests sur la logique métier.' },
      { titre: 'Conduite de projet', texte: 'Découpage en tranches livrables, priorisation argumentée, recette avec vous. Certifié PSPO I.' },
    ],
  },
  appel: { titre: 'On en parle ?', texte: "Décrivez-moi votre projet en quelques phrases. Je vous réponds sous deux jours ouvrés, et le premier entretien ne vous engage à rien." },
};

const en: typeof fr = {
  meta: { titre: 'Experience', description: 'Fifteen years designing and building products, from development to leadership, in small teams and large ones. And what that means, concretely, for your project.' },
  etiquette: "Who you're talking to",
  titre: { gras: 'From code to product', leger: 'the secret to success.' },
  sous: '<span translate="no">Moamind Solutions</span> designs and builds web and mobile apps. What sets it apart fits in one sentence: what you’re paying for is the time spent not building the wrong thing.',
  triade: [
    { mot: 'MOA', html: "<strong>Maîtrise d'ouvrage — the client side of a project. That's you.</strong> The one who commissions the work, who knows the trade, and who knows why this product should exist. My first job is to put myself in your shoes." },
    { mot: 'Mind', html: '<strong>The thinking.</strong> Think before you act. Every decision gets written down with its reasoning, so it can be revisited without starting from scratch.' },
    { mot: 'Solutions', html: '<strong>The delivery.</strong> Thinking that never ships is worth nothing. I build, I launch, we measure — in complete slices.' },
  ],
  apports: {
    titre: 'Fifteen years in the field. What that means for your project',
    lead: 'Developer first, then project lead, then Product Owner and Business Analyst. For direct clients, for software vendors, and inside groups where a rollout is measured in thousands of machines.',
    items: [
      { titre: 'I speak both languages', texte: "I wrote code for years before I started running products. You won't need to translate your business into technical jargon, or take it on faith when someone tells you it's complicated." },
      { titre: 'I see risk before it costs you', texte: "A forgotten dependency, a regulation that changes everything, a piece of data nobody can locate — these are what derail a project. Fifteen years in the field mostly means a library of these traps." },
      { titre: "I've managed budgets, not just tickets", texte: "As a freelancer, the money was the client's, sitting across from me. In a large group, I had to defend a decision to people with no time to spare. Both teach you to say no, and to explain why." },
      { titre: "I've been audited", texte: "Getting security standards signed off by outside auditors changes how you treat rigor. What isn't written down doesn't exist, and what isn't proven isn't settled. It shows up in every scoping note I hand over." },
    ],
  },
  terrains: {
    titre: 'The terrain. Where it played out',
    lead: 'Fleets of thousands of machines. Security standards signed off by outside auditors. Business rules that change from one country to the next. And, at the other end, clients paying out of their own pocket.',
    items: [
      {
        duree: '3 years',
        milieu: 'European cloud operator',
        enjeu: "Rollouts across fleets of thousands of machines, coordinated between several sites. Security standards that outside auditors had to sign off — where what isn't written down doesn't exist. A backlog to run for a team of eight developers, and a level-2 support rotation that never stops.",
        cles: ['Scaling', 'Audited security', 'Product backlog', 'Team leadership', 'Business process'],
      },
      {
        milieu: 'European banking group',
        enjeu: "Automating repetitive work for thousands of users without breaking their habits. End-to-end and regression test strategies, because at this scale a regression isn't measured in tickets — it's measured in support calls.",
        cles: ['Automation', 'User experience', 'End-to-end testing', 'Regression testing'],
      },
      {
        duree: '3 years',
        milieu: 'International retail',
        enjeu: "Sales software where inventory rules change from one country to the next, depending on local regulation. The kind of domain where the hard part is never the code — it's understanding the rule, and getting it stated clearly by someone who knows it too well to put it into words.",
        cles: ['Business rules', 'Regulation', 'Continuous deployment', 'Regression testing'],
      },
      {
        duree: '2 years',
        milieu: 'Digital arm of a telecom operator',
        enjeu: 'Gathering client needs and turning them into requirements that actually hold up. Then migrating the application to a distributed architecture without interrupting the people using it every day.',
        cles: ['Requirements', 'Distributed architecture', 'Migration', 'Production support'],
      },
      {
        milieu: 'Document management vendor',
        enjeu: 'Turning fuzzy business needs into a deliverable scope, deciding what makes each release, and defending those calls to people who wanted everything, right away. The roadmap and the acceptance criteria as the only guardrails.',
        cles: ['Business needs', 'Roadmap', 'Acceptance criteria', 'Test strategy'],
      },
      {
        milieu: 'Electric mobility service',
        enjeu: "Designing APIs and setting the interface contracts of a distributed architecture — deciding, before a single line is written, what each service promises the others, and what it doesn't.",
        cles: ['API contracts', 'Distributed architecture', 'Automated testing', 'Training'],
      },
      {
        duree: '5 years',
        milieu: 'Direct clients, as a freelancer',
        enjeu: 'Projects run end to end: budget, user flows, mockups, development, training, and support. One point of contact, often non-technical, paying out of pocket, who needs plain answers — no jargon.',
        cles: ['Budget and trade-offs', 'User flows', 'Mockups', 'Training', 'Support'],
      },
    ],
  },
  fiche: [
    { terme: 'Education', valeur: 'Computer engineering degree' },
    { terme: 'Certification', valeur: 'Professional Scrum Product Owner I' },
    { terme: 'Base', valeur: 'Bordeaux, with projects that know no borders.' },
  ],
  convictions: {
    titre: 'Six convictions, each backed by an example',
    items: [
      { titre: 'A written decision beats a meeting', texte: "A decision you can't look back on doesn't exist — it gets reopened, flipped, and decided differently again in six months. I write down what we decide, and why." },
      { titre: 'Set the constraint early, or pay for a rebuild', texte: 'Deciding a number will always be shown as an estimate costs nothing during scoping. Found after development, that same detail means reworking every screen.' },
      { titre: 'A good abstraction removes more code than it adds', texte: 'Treating a carpool group as just another account — one that advances money, collects it, and pays it back — made the driver disappear as a special case.' },
      { titre: "Friction belongs only where it's earned", texte: "Reporting a found animal doesn't require an account. Reporting a loss does, and the screen explains why. A rule that explains itself stops feeling like a burden." },
      { titre: 'One finished slice beats five half-done', texte: "A product at sixty percent can't be shown, tested, or fixed. I deliver complete user flows, one at a time." },
      { titre: 'Visible care tells you about the rest', texte: "Users can't judge an architecture. They judge the load time, the alignment, the error message — and from that, they infer the quality of what they can't see." },
    ],
  },
  outils: {
    titre: 'What I build with',
    lead: "A technology gets chosen for the problem, not for a résumé. Here's what I reach for most, and why.",
    items: [
      { titre: 'Mobile', texte: 'Native iOS (Swift, SwiftUI), Android, cross-platform when the need justifies it.' },
      { titre: 'Web', texte: 'Astro, TypeScript, static rendering whenever possible. This site is one example.' },
      { titre: 'Back end and data', texte: 'Typed APIs, explicit interface contracts, versioned migrations, tests on business logic.' },
      { titre: 'Project management', texte: 'Breaking work into deliverable slices, prioritization you can follow, acceptance testing together. Certified PSPO I.' },
    ],
  },
  appel: { titre: 'Shall we talk?', texte: "Describe your project in a few sentences. I'll reply within two business days, and the first call doesn't commit you to anything." },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
