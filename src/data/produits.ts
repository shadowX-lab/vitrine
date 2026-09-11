/** Les trois réalisations. Textes validés sur maquettes le 10 septembre 2026. */

import type { Langue } from '../i18n/routes';

export type Icone = 'prix' | 'horloge' | 'feuille' | 'eclair' | 'cloche' | 'coeur' | 'check' | 'calc' | 'suivi';
export type Ecran = { projet: string; fichier: string; haut: string; statut?: string };
export type EcranEtape = Omit<Ecran, 'projet'>;

export type TextesProduit = {
  baseline: string;
  resume: string;
  domaine: string;
  plateforme: string;
  chiffres: { valeur: string; libelle: string }[];
  probleme: string[];
  citation: string;
  parcoursIntro: string;
  /** Aligné sur `ecrans` : même ordre, même longueur. */
  parcours: { titre: string; texte: string; suite?: string }[];
  /** Aligné sur `icones`. */
  benefices: { titre: string; texte: string }[];
  livre: string[];
};

export type Produit = {
  slug: string;
  nom: string;
  annee: string;
  /** Page de l'application sur l'App Store. */
  appStore: string;
  palette: { p1: string; p2: string; p3: string; accent: string; voile: string; contraste: string; clair: string; fonce: string; lueur: string };
  /** Écrans du bandeau : derrière, puis devant. */
  heros: [EcranEtape, EcranEtape];
  /** Les quatre écrans du parcours principal. */
  ecrans: EcranEtape[];
  icones: Icone[];
  suivant: string;
  textes: Record<Langue, TextesProduit>;
};

export type ProduitLocalise = Omit<Produit, 'textes' | 'ecrans' | 'icones'> &
  Omit<TextesProduit, 'parcours' | 'benefices'> & {
    parcours: (EcranEtape & TextesProduit['parcours'][number])[];
    benefices: ({ icone: Icone } & TextesProduit['benefices'][number])[];
  };

/** Le produit tel qu'une page le lit dans une langue : écrans et textes réunis. */
export function localiser(p: Produit, langue: Langue): ProduitLocalise {
  const { textes, ecrans, icones, ...reste } = p;
  const t = textes[langue];
  return {
    ...reste,
    ...t,
    parcours: ecrans.map((e, i) => ({ ...e, ...t.parcours[i]! })),
    benefices: icones.map((icone, i) => ({ icone, ...t.benefices[i]! })),
  };
}

/** Lien fictif en attendant la publication des applications : même adresse pour les trois. */
const APP_STORE_FICTIF = 'https://apps.apple.com/app/id0000000000';

export const produits: Produit[] = [
  {
    slug: 'chargeair',
    nom: 'ChargeAir',
    annee: '2026',
    appStore: APP_STORE_FICTIF,
    palette: { p1: '#4A1B0F', p2: '#8E3A22', p3: '#D9794F', accent: '#AF5236', voile: '#F7E7E0', contraste: '#7A3822', clair: '#FFD9C4', fonce: '#4A1B0F', lueur: 'rgba(255,200,150,.35)' },
    heros: [{ fichier: 'Reservation', haut: '#F7F1EA' }, { fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6' }],
    ecrans: [
      { fichier: 'Main', haut: '#F7F1EA' },
      { fichier: 'Reservation', haut: '#F7F1EA' },
      { fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6' },
      { fichier: 'FinSession', haut: '#F7F1EA' },
    ],
    icones: ['prix', 'horloge', 'feuille'],
    suivant: 'pilpoil',
    textes: {
      fr: {
        baseline: 'La recharge électrique entre voisins',
        resume: "Réserver un créneau sur la borne d'un particulier du quartier, quand on roule à l'électrique sans prise chez soi.",
        domaine: 'Mobilité électrique',
        plateforme: 'iOS et Android',
        chiffres: [
          { valeur: '12,40 €', libelle: 'la même charge, contre 21 € sur une borne rapide' },
          { valeur: '3 à 6 h', libelle: "le temps réel d'une charge à domicile : tout part de là" },
          { valeur: 'Aucun', libelle: 'matériel à installer, à scanner ou à coller sur la borne' },
        ],
        probleme: [
          "Vous roulez à l'électrique, vous n'avez pas de prise chez vous, et chaque recharge vous coûte presque le double de ce qu'elle devrait. Pendant ce temps, la borne du voisin de palier dort vingt-deux heures sur vingt-quatre. Entre les deux, il n'y a rien.",
          "Le piège de ce sujet, c'est de le traiter comme une location de courte durée ordinaire : une annonce, un calendrier, un paiement. En creusant, on tombe très vite sur trois murs : le droit de l'électricité, la physique de la charge lente, et l'économie réelle d'un hôte.",
        ],
        citation: 'Aucun des trois ne se voit depuis un cahier des charges. Tous les trois ont changé le produit.',
        parcoursIntro: "De la borne repérée dans le quartier à la voiture rechargée, prix connu d'avance.",
        parcours: [
          { titre: 'Trouver, près de chez soi', texte: "Les bornes du quartier, leur prix à l'heure, et celles qui acceptent votre voiture.", suite: 'On choisit un créneau' },
          { titre: 'Réserver, prix connu', texte: "Le total s'affiche avant de confirmer. Il ne changera plus, quoi qu'il arrive ensuite.", suite: 'Le soir venu, on branche' },
          { titre: 'Charger tranquille', texte: "Le décompte tourne, la fin est annoncée à l'avance. Rien à surveiller.", suite: 'Et on repart' },
          { titre: 'Repartir, et revenir', texte: "L'économie réalisée est chiffrée, et le prochain créneau se reprogramme en un geste." },
        ],
        benefices: [
          { titre: "Jusqu'à 40 % moins cher qu'une borne rapide", texte: "Une charge chez un voisin coûte 12,40 € là où une borne rapide en demande 21. Le conducteur sans prise chez lui paie enfin le juste prix, et l'hôte rentabilise une borne qui dormait vingt-deux heures sur vingt-quatre." },
          { titre: "Un prix connu d'avance, sans surprise", texte: "Le montant s'affiche au moment de réserver et ne bouge plus. Pas de relevé, pas de compteur, pas de litige : on sait ce qu'on paie avant de brancher, et la fin de charge est annoncée à l'avance." },
          { titre: "L'électrique accessible, et plus écologique", texte: "Les bornes existent déjà, dans les garages du quartier. Les partager évite d'en installer de nouvelles et ouvre la voiture électrique à ceux qui n'ont pas de prise chez eux, sans rien changer à leurs habitudes." },
        ],
        livre: ['Analyse du domaine et note de cadrage', 'Les décisions fondatrices, écrites et argumentées', 'Parcours conducteur et espace hôte maquettés', 'Modèle de domaine et spécification de conception'],
      },
      en: {
        baseline: 'EV charging between neighbors',
        resume: "Book a time slot on a neighbor's charger when you drive electric and have no charging point at home.",
        domaine: 'Electric mobility',
        plateforme: 'iOS and Android',
        chiffres: [
          { valeur: '€12.40', libelle: 'for the same charge, against €21 at a fast charger' },
          { valeur: '3–6 h', libelle: 'the real time of a home charge — everything starts there' },
          { valeur: 'None', libelle: 'equipment to install, scan, or stick on the charger' },
        ],
        probleme: [
          "You drive electric, you have no charging point at home, and every charge costs almost double what it should. Meanwhile, the neighbor's charger sits idle twenty-two hours out of twenty-four. Between the two, there's nothing.",
          'The trap here is treating it like an ordinary short-term rental: a listing, a calendar, a payment. Dig a little and three walls appear fast: electricity regulation, the physics of slow charging, and the real economics of a host.',
        ],
        citation: 'None of the three shows up in a spec sheet. All three changed the product.',
        parcoursIntro: 'From spotting a charger nearby to a charged car, at a price known in advance.',
        parcours: [
          { titre: 'Find one nearby', texte: 'The chargers nearby, their price per hour, and which ones fit your car.', suite: 'Pick a time slot' },
          { titre: 'Book at a known price', texte: "The total shows before you confirm. It won't change after that, whatever happens next.", suite: 'That evening, plug in' },
          { titre: 'Charge without worry', texte: 'The countdown runs, the end time is set in advance. Nothing to watch.', suite: 'Then drive off' },
          { titre: 'Drive off, and come back', texte: 'The savings are shown in numbers, and the next slot books again in one tap.' },
        ],
        benefices: [
          { titre: 'Up to 40% cheaper than a fast charger', texte: "A charge at a neighbor's costs €12.40 where a fast charger asks €21. Drivers without a charging point at home finally pay a fair price, and hosts earn from a charger that used to sit idle twenty-two hours a day." },
          { titre: 'A price known upfront, no surprises', texte: "The amount shows at booking and stays fixed. No meter reading, no dispute: drivers know what they'll pay before plugging in, and the end time is set in advance." },
          { titre: 'EVs made accessible, and greener', texte: 'The chargers already exist, in garages nearby. Sharing them avoids installing new ones and opens electric driving to people without a charging point at home, without changing their habits.' },
        ],
        livre: ['Domain analysis and scoping note', 'The founding decisions, written and argued', 'Driver journey and host space wireframed', 'Domain model and design specification'],
      },
    },
  },
  {
    slug: 'pilpoil',
    nom: 'Pil’Poil',
    annee: '2026',
    appStore: APP_STORE_FICTIF,
    palette: { p1: '#043B33', p2: '#0A5D50', p3: '#1FA488', accent: '#0E7C6B', voile: '#E7F3F0', contraste: '#0A5D50', clair: '#B8F2DF', fonce: '#043B33', lueur: 'rgba(170,255,220,.28)' },
    heros: [{ fichier: 'Correspondances', haut: '#F5F6F4' }, { fichier: 'Main', haut: '#F5F6F4' }],
    ecrans: [
      { fichier: 'Main', haut: '#F5F6F4' },
      { fichier: 'SignalementCouleurs', haut: '#F5F6F4' },
      { fichier: 'Correspondances', haut: '#F5F6F4' },
      { fichier: 'MiseEnRelation', haut: '#F5F6F4' },
    ],
    icones: ['eclair', 'cloche', 'coeur'],
    suivant: 'teamago',
    textes: {
      fr: {
        baseline: 'Le réseau des animaux perdus et retrouvés',
        resume: 'Signaler un animal trouvé en trente secondes, retrouver le sien, et échanger sans exposer ses coordonnées.',
        domaine: 'Entraide de voisinage',
        plateforme: 'Application iOS',
        chiffres: [
          { valeur: '30 s', libelle: 'pour signaler un animal trouvé, sans créer de compte' },
          { valeur: 'Jamais', libelle: "de coordonnées partagées sans l'accord des deux personnes" },
          { valeur: '1', libelle: 'seul formulaire pour les pertes et pour les découvertes' },
        ],
        probleme: [
          "Quand un chien disparaît, son propriétaire a peu de temps et peu de lucidité. Les chances de le retrouver baissent d'heure en heure, et chaque formulaire en trop coûte des minutes.",
          'Les services existants partagent le même défaut : il faut créer un compte avant de signaler quoi que ce soit. Or la personne qui croise un chien errant rend service, elle est pressée, et elle abandonne au premier formulaire.',
        ],
        citation: "Lui demander de s'inscrire, c'est perdre le signalement. Tout le produit part de ce constat.",
        parcoursIntro: "De la découverte d'un animal à la mise en relation avec son propriétaire.",
        parcours: [
          { titre: 'Vous venez de trouver un animal', texte: "C'est le premier geste proposé, en grand, sans connexion.", suite: 'On le décrit' },
          { titre: 'Le décrire, vite', texte: 'Espèce, couleurs, lieu. On touche des choix au lieu de taper du texte.', suite: 'Rapprochement automatique' },
          { titre: 'Les rapprochements arrivent', texte: 'Le propriétaire voit les animaux qui pourraient être le sien.', suite: 'Reste à se parler' },
          { titre: 'Se parler, en confiance', texte: "Chacun voit ce qu'il partage avant de le partager." },
        ],
        benefices: [
          { titre: 'Un animal signalé en 30 secondes', texte: "La personne qui trouve un animal le signale en quelques gestes, photo comprise, sans créer de compte. Chaque signalement compte : c'est souvent lui qui ramène l'animal chez lui." },
          { titre: 'Les propriétaires prévenus sans chercher', texte: "Dès qu'un animal trouvé ressemble au leur, les propriétaires reçoivent une alerte. Plus besoin de parcourir des dizaines d'annonces dans l'angoisse : les rapprochements arrivent d'eux-mêmes." },
          { titre: 'Des retrouvailles en toute confiance', texte: "Chacun voit ce qu'il partage avant de l'envoyer, et les coordonnées ne circulent qu'avec l'accord des deux personnes. On aide sans s'exposer, et on retrouve son animal sereinement." },
        ],
        livre: ['Étude du terrain et des usages existants', 'Règles de gestion et modèle de données', 'Parcours complets maquettés, du signalement à la clôture', 'Application iOS et interface de vérification des fiches'],
      },
      en: {
        baseline: 'The network for lost and found pets',
        resume: 'Report a found pet in thirty seconds, find your own, and message without exposing contact details.',
        domaine: 'Neighborly help',
        plateforme: 'iOS app',
        chiffres: [
          { valeur: '30 s', libelle: 'to report a found pet, no account needed' },
          { valeur: 'Never', libelle: "contact details shared without both people's consent" },
          { valeur: '1', libelle: 'single form for lost pets and for found ones' },
        ],
        probleme: [
          'When a dog goes missing, its owner has little time and little clarity of mind. The odds of finding it drop by the hour, and every extra form costs minutes.',
          'Existing services share the same flaw: an account is required before reporting anything. But the person who spots a stray dog is doing a favor, in a hurry, and drops off at the first form.',
        ],
        citation: 'Asking them to sign up loses the report. The whole product starts from that.',
        parcoursIntro: 'From finding a pet to connecting with its owner.',
        parcours: [
          { titre: 'You just found a pet', texte: "It's the first option offered, front and center, no login needed.", suite: 'Describe it' },
          { titre: 'Describe it, fast', texte: 'Species, colors, location. Tap choices instead of typing text.', suite: 'Automatic matching' },
          { titre: 'Matches come in', texte: 'The owner sees the pets that might be theirs.', suite: 'Time to talk' },
          { titre: 'Talk, with confidence', texte: "Each person sees what they're sharing before they share it." },
        ],
        benefices: [
          { titre: 'A pet reported in 30 seconds', texte: "Whoever finds a pet reports it in a few taps, photo included, with no account to create. Every report matters — it's often what brings the pet back home." },
          { titre: 'Owners alerted without searching', texte: 'As soon as a found pet resembles theirs, owners get an alert. No more scrolling through dozens of listings in anguish: matches arrive on their own.' },
          { titre: 'Reunions with full confidence', texte: "Each person sees what they're sharing before it's sent, and contact details only move with both people's consent. Helping doesn't mean exposure, and finding a pet stays worry-free." },
        ],
        livre: ['Field research and study of existing habits', 'Business rules and data model', 'Full journeys wireframed, from report to closure', 'iOS app and listing-review interface'],
      },
    },
  },
  {
    slug: 'teamago',
    nom: 'Teamago',
    annee: '2026',
    appStore: APP_STORE_FICTIF,
    palette: { p1: '#171C0B', p2: '#3A4A10', p3: '#6D8A1E', accent: '#4C6116', voile: '#EFF6D9', contraste: '#3A4A10', clair: '#D4FF4F', fonce: '#1E2410', lueur: 'rgba(212,255,79,.25)' },
    heros: [{ fichier: 'Participants', haut: '#F1F1EA' }, { fichier: 'Decompte', haut: '#F1F1EA' }],
    ecrans: [
      { fichier: 'Infos', haut: '#F1F1EA' },
      { fichier: 'Participants', haut: '#F1F1EA' },
      { fichier: 'Decompte', haut: '#F1F1EA' },
      { fichier: 'Reglement', haut: '#F1F1EA' },
    ],
    icones: ['check', 'calc', 'suivi'],
    suivant: 'chargeair',
    textes: {
      fr: {
        baseline: 'L’argent et la logistique autour du match',
        resume: 'Organiser un déplacement de club amateur et faire tomber les comptes juste, au centime, sans y passer ses dimanches.',
        domaine: 'Sport amateur',
        plateforme: 'Application iOS',
        chiffres: [
          { valeur: '0,00 €', libelle: 'le solde du club : la preuve que tout est juste' },
          { valeur: '581 €', libelle: 'du déplacement de référence, répartis au centime' },
          { valeur: 'Zéro', libelle: 'dimanche perdu à refaire les comptes à la main' },
        ],
        probleme: [
          "Ce projet commence par une pièce à conviction : le tableur d'un dirigeant de club, construit à la main pour organiser les déplacements de son équipe. Sept onglets, cinq contrôles de cohérence, un reçu imprimable par conducteur. Un outil qui a tourné pendant des saisons.",
          "Et sur le déplacement de référence, sept cents kilomètres, huit payeurs, 581 € à répartir, le contrôle final affiche : incohérence du montant des remboursements. Quelqu'un de méthodique, qui a fabriqué son propre outil, n'arrive toujours pas à faire tomber les comptes juste.",
        ],
        citation: "C'est là qu'il y avait un produit, et il était visible avant qu'on dessine le moindre écran.",
        parcoursIntro: 'De la création du déplacement aux comptes qui bouclent, au centime près.',
        parcours: [
          { titre: 'Créer le déplacement', texte: 'Destination, date, heure de départ. La distance et le péage se remplissent seuls.', suite: 'On dit qui vient' },
          { titre: 'Qui vient, qui conduit', texte: 'Joueurs, accompagnants, conducteurs. Chacun a sa part, calculée au fur et à mesure.', suite: 'Le calcul tombe juste' },
          { titre: 'Ça boucle', texte: 'Les participations couvrent exactement les frais. Le club ne gagne ni ne perd un centime.', suite: 'Reste à encaisser' },
          { titre: 'Suivre les règlements', texte: 'Qui a payé, qui doit être remboursé, et le récapitulatif prêt à envoyer.' },
        ],
        benefices: [
          { titre: 'Des comptes justes, en toute simplicité', texte: "Frais kilométriques, péages, minibus, hôtel : tout est réparti automatiquement entre les participants. Le solde du club tombe à 0,00 €, et l'écran affiche « Ça boucle » pour le prouver." },
          { titre: 'Fini les calculs à la main et les erreurs', texte: "Plus de tableur à tenir ni de formule à vérifier le dimanche soir. Les montants se calculent au centime près, même quand un conducteur ou un péage s'ajoute en route." },
          { titre: "Chaque règlement suivi d'un coup d'œil", texte: 'Qui a payé, qui doit être remboursé, ce qui reste à encaisser : tout est visible au même endroit, et le récapitulatif part en un geste.' },
        ],
        livre: ['Reprise du tableur existant comme spécification de référence', 'Règles de répartition et contrôles de cohérence', 'Parcours organisateur maquetté, en clair et en sombre', 'Modèle de domaine et périmètre de première version arbitré'],
      },
      en: {
        baseline: 'The money and logistics around the game',
        resume: "Organize an amateur club's away trip and make the accounts balance, to the cent, without losing a Sunday to it.",
        domaine: 'Amateur sports',
        plateforme: 'iOS app',
        chiffres: [
          { valeur: '€0.00', libelle: "the club's balance, proof that everything's fair" },
          { valeur: '€581', libelle: 'of the reference trip, split to the cent' },
          { valeur: 'Zero', libelle: 'Sundays lost redoing the accounts by hand' },
        ],
        probleme: [
          "This project starts with a piece of evidence: a club manager's spreadsheet, hand-built to organize the team's away trips. Seven tabs, five consistency checks, a printable receipt per driver. A tool that ran for seasons.",
          'And on the reference trip, seven hundred kilometers, eight payers, €581 to split, the final check reads: reimbursement amount inconsistent. Someone methodical enough to build their own tool still can’t make the accounts balance.',
        ],
        citation: 'That’s where a product was, visible before a single screen got drawn.',
        parcoursIntro: 'From creating the trip to accounts that balance, down to the cent.',
        parcours: [
          { titre: 'Create the trip', texte: 'Destination, date, departure time. Distance and toll fill in on their own.', suite: "Who's coming" },
          { titre: "Who's coming, who's driving", texte: 'Players, companions, drivers. Each gets a share, calculated as you go.', suite: 'The numbers balance' },
          { titre: 'It balances', texte: 'Contributions cover the costs exactly. The club neither gains nor loses a cent.', suite: 'Time to collect' },
          { titre: 'Track payments', texte: "Who's paid, who's owed a refund, and a summary ready to send." },
        ],
        benefices: [
          { titre: 'Fair accounts, made simple', texte: 'Mileage, tolls, minibus, hotel: everything splits automatically between participants. The balance lands on €0.00, and the screen shows “It balances” to prove it.' },
          { titre: 'No more hand calculations, no more errors', texte: 'No spreadsheet to maintain, no formula to check on a Sunday night. Amounts calculate to the cent, even when a driver or a toll gets added along the way.' },
          { titre: 'Every payment tracked at a glance', texte: "Who's paid, who's owed a refund, what's left to collect: it's all visible in one place, and the summary sends in one tap." },
        ],
        livre: ['The existing spreadsheet adopted as the reference spec', 'Splitting rules and consistency checks', 'Organizer journey wireframed, in light and dark', 'Domain model and first-version scope decided'],
      },
    },
  },
];

export const parSlug = (slug: string): Produit => {
  const produit = produits.find((p) => p.slug === slug);
  if (!produit) throw new Error(`Produit inconnu : ${slug}`);
  return produit;
};

/** Hero de l'accueil : derrière, puis devant. Aucun de ces écrans ne porte le nom de son application. */
export const eventail: [Ecran, Ecran] = [
  { projet: 'pilpoil', fichier: 'Carte', haut: '#F4F5F4' },
  { projet: 'chargeair', fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6' },
];

/** Section sombre de l'accueil, téléphones resserrés et coupés à mi-hauteur. */
export const rangee: Ecran[] = [
  { projet: 'chargeair', fichier: 'Borne', haut: '#F7F1EA' },
  { projet: 'teamago', fichier: 'Participants', haut: '#F1F1EA' },
  { projet: 'pilpoil', fichier: 'MiseEnRelation', haut: '#F4F5F4' },
  { projet: 'chargeair', fichier: 'Hote', haut: '#F7F1EA' },
];
