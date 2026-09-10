import type { ImageMetadata } from 'astro';

const fichiers = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/ecrans/**/*.png',
  { eager: true },
);

/** Récupère un écran rendu par `npm run ecrans`. */
export function ecran(projet: string, nom: string): ImageMetadata {
  const cle = `../assets/ecrans/${projet}/${nom}.png`;
  const module = fichiers[cle];
  if (!module) throw new Error(`Écran introuvable : ${cle}`);
  return module.default;
}

/** Une étape du parcours principal. `suite` est la flèche vers l'écran suivant. */
export type Etape = {
  fichier: string;
  titre: string;
  texte: string;
  suite?: string;
};

export type Produit = {
  slug: string;
  nom: string;
  baseline: string;
  resume: string;
  domaine: string;
  annee: string;
  plateforme: string;
  palette: { accent: string; voile: string; contraste: string };
  depot?: string;
  probleme: string[];
  decisions: { titre: string; texte: string }[];
  chiffres: { valeur: string; libelle: string }[];
  heros: string;
  parcours: Etape[];
  livre: string[];
};

export const produits: Produit[] = [
  {
    slug: 'chargeair',
    nom: 'ChargeAir',
    baseline: 'La recharge électrique entre voisins',
    resume:
      "Réserver un créneau sur la borne d'un particulier du quartier, quand on roule à l'électrique sans prise chez soi.",
    domaine: 'Mobilité électrique',
    annee: '2026',
    plateforme: 'Application mobile iOS et Android',
    palette: { accent: '#AF5236', voile: '#F7E7E0', contraste: '#7A3822' },
    depot: 'https://github.com/shadowX-lab/ChargeAir',
    probleme: [
      "Vous roulez à l'électrique, vous n'avez pas de prise chez vous, et chaque recharge vous coûte presque le double de ce qu'elle devrait. Pendant ce temps, la borne du voisin de palier dort vingt-deux heures sur vingt-quatre. Entre les deux, il n'y a rien.",
      "Le piège de ce sujet, c'est de le traiter comme une location de courte durée ordinaire : une annonce, un calendrier, un paiement. En creusant, on tombe très vite sur trois murs — le droit de l'électricité, la physique de la charge lente, et l'économie réelle d'un hôte. Aucun des trois ne se voit depuis un cahier des charges. Tous les trois ont changé le produit.",
    ],
    decisions: [
      {
        titre: 'On vend un créneau, jamais de l’énergie',
        texte:
          "Facturer au kilowattheure supposerait un compteur certifié et ferait basculer l'hôte dans la revente d'électricité, avec tout ce que ça implique. On vend donc une mise à disposition, tarifée à l'heure. Le montant est connu au moment de réserver et ne bouge plus : plus de compteur, plus de litige de relevé, plus de mauvaise surprise. C'est une contrainte juridique retournée en argument commercial.",
      },
      {
        titre: 'Personne ne s’arrête six heures par hasard',
        texte:
          "Une borne domestique met trois à six heures à remplir une voiture. Ça disqualifie d'emblée le conducteur de passage : le service ne peut s'adresser qu'à quelqu'un de déjà immobilisé — chez lui, chez ses hôtes, à son travail. Toute l'application en découle. On ne cherche pas une borne libre maintenant, on planifie une nuit ou une journée.",
      },
      {
        titre: '« Estimé », jamais « consommé »',
        texte:
          "Puisque rien n'est branché sur la borne, l'application ne mesure aucune énergie : elle l'estime, à partir du modèle de voiture et de la puissance déclarée. Ça pourrait rester un détail d'ingénierie. C'est devenu une règle de vocabulaire imposée à chaque écran, parce qu'un chiffre présenté comme mesuré alors qu'il est calculé, c'est une promesse qu'on ne peut pas tenir.",
      },
    ],
    chiffres: [
      { valeur: '12,40 €', libelle: 'la même charge, contre 21 € sur une borne rapide' },
      { valeur: '3 à 6 h', libelle: "le temps réel d'une charge à domicile — tout part de là" },
      { valeur: 'Aucun', libelle: 'matériel à installer, à scanner ou à coller sur la borne' },
    ],
    heros: 'Session',
    parcours: [
      {
        fichier: 'Main',
        titre: 'Trouver, près de chez soi',
        texte: "Les bornes du quartier, leur prix à l'heure, et celles qui acceptent votre voiture.",
        suite: 'On choisit un créneau',
      },
      {
        fichier: 'Reservation',
        titre: 'Réserver, prix connu',
        texte: "Le total s'affiche avant de confirmer. Il ne changera plus, quoi qu'il arrive ensuite.",
        suite: 'Le soir venu, on branche',
      },
      {
        fichier: 'Session',
        titre: 'Charger tranquille',
        texte: "Le décompte tourne, la fin est annoncée à l'avance. Rien à surveiller.",
        suite: 'Et on repart',
      },
      {
        fichier: 'FinSession',
        titre: 'Repartir, et revenir',
        texte: "L'économie réalisée est chiffrée, et le prochain créneau se reprogramme en un geste.",
      },
    ],
    livre: [
      'Analyse du domaine et note de cadrage',
      'Les décisions fondatrices, écrites et argumentées',
      'Parcours conducteur et espace hôte maquettés',
      'Modèle de domaine et spécification de conception',
    ],
  },
  {
    slug: 'pilpoil',
    nom: 'Pil’Poil',
    baseline: 'Le réseau des animaux perdus et retrouvés',
    resume:
      "Signaler un animal trouvé en trente secondes, retrouver le sien, et se parler sans livrer ses coordonnées à tout le monde.",
    domaine: 'Entraide de voisinage',
    annee: '2026',
    plateforme: 'Application mobile iOS',
    palette: { accent: '#0E7C6B', voile: '#E7F3F0', contraste: '#0A5D50' },
    depot: 'https://github.com/shadowX-lab/pilpoil',
    probleme: [
      "Un chien disparaît. Dans l'heure qui suit, son propriétaire est incapable de réfléchir clairement, et la fenêtre pendant laquelle on peut encore le retrouver se referme. C'est un moment où l'on ne pardonne aucune friction.",
      "En regardant ce qui existe déjà, un défaut revient partout : il faut créer un compte avant de pouvoir signaler quoi que ce soit. Or la personne qui croise un chien errant dans la rue n'a aucun problème à résoudre — elle rend service, elle est pressée, et elle abandonnera au premier formulaire. Lui demander de s'inscrire, c'est perdre le signalement. Tout le produit part de ce constat.",
    ],
    decisions: [
      {
        titre: 'Aucun compte pour signaler un animal trouvé',
        texte:
          "L'application s'ouvre sur le geste de celui qui rend service, pas sur un écran de connexion. C'est le geste le plus fragile de toute la chaîne : il fallait qu'il tienne en trente secondes, appareil photo compris. Le compte n'est exigé que pour déclarer une perte — et on explique à l'écran pourquoi : c'est ce qui permettra à quelqu'un de vous joindre.",
      },
      {
        titre: 'Le même formulaire des deux côtés',
        texte:
          "Espèce, couleurs, signes distinctifs, lieu, heure : perdu ou trouvé, ce sont les mêmes champs. Ce n'est pas une économie de développement, c'est ce qui rend le rapprochement automatique possible. On ne peut comparer deux fiches que si elles sont écrites dans la même langue — et les couleurs se choisissent en deux gestes plutôt qu'en texte libre, pour la même raison.",
      },
      {
        titre: 'On voit ce que l’autre verra, avant d’envoyer',
        texte:
          "Avant qu'une demande de mise en relation ne parte, l'écran montre exactement ce que la personne d'en face recevra de vous. Les coordonnées ne circulent qu'après acceptation, jamais dans les deux sens, et une demande ne se tranche qu'une fois. Trois règles décidées en une demi-journée, et c'est tout ce qui sépare un service qu'on utilise d'un service qu'on redoute.",
      },
    ],
    chiffres: [
      { valeur: '30 s', libelle: 'pour signaler un animal trouvé, sans créer de compte' },
      { valeur: 'Jamais', libelle: 'de coordonnées échangées sans accord explicite' },
      { valeur: 'Un seul', libelle: 'formulaire pour les pertes et pour les découvertes' },
    ],
    heros: 'Main',
    parcours: [
      {
        fichier: 'Main',
        titre: 'Vous venez de trouver un animal',
        texte: "C'est le premier geste proposé, en grand, sans connexion préalable.",
        suite: 'On le décrit en deux gestes',
      },
      {
        fichier: 'SignalementCouleurs',
        titre: 'Le décrire, vite',
        texte: 'Espèce, couleurs, lieu. Des choix à taper du doigt plutôt que du texte à saisir.',
        suite: 'Le rapprochement se fait seul',
      },
      {
        fichier: 'Correspondances',
        titre: 'Les rapprochements arrivent',
        texte: 'De son côté, le propriétaire voit les animaux qui pourraient être le sien.',
        suite: 'Reste à se parler',
      },
      {
        fichier: 'MiseEnRelation',
        titre: 'Se parler, en confiance',
        texte: "Chacun voit ce qu'il partage avant de le partager. Rien ne circule sans accord.",
      },
    ],
    livre: [
      'Étude du terrain et des usages existants',
      'Règles de gestion et modèle de données',
      'Parcours complets maquettés, du signalement à la clôture',
      "Application iOS et interface de vérification des fiches",
    ],
  },
  {
    slug: 'teamago',
    nom: 'Teamago',
    baseline: 'L’argent et la logistique autour du match',
    resume:
      "Organiser un déplacement de club amateur et faire tomber les comptes juste, au centime, sans y passer ses dimanches.",
    domaine: 'Sport amateur',
    annee: '2026',
    plateforme: 'Application mobile iOS',
    palette: { accent: '#4C6116', voile: '#EFF6D9', contraste: '#3A4A10' },
    probleme: [
      "Ce projet commence par une pièce à conviction : le tableur d'un dirigeant de club, construit à la main pour organiser les déplacements de son équipe. Sept onglets, cinq contrôles de cohérence, un reçu imprimable par conducteur. Ce n'est pas une maquette d'école, c'est un outil qui a tourné pendant des saisons.",
      "Et sur le déplacement de référence — sept cents kilomètres, huit payeurs, 581 € à répartir — le contrôle final affiche : incohérence du montant des remboursements. Quelqu'un de méthodique, qui a fabriqué son propre outil, n'arrive toujours pas à faire tomber les comptes juste. C'est là qu'il y avait un produit, et il était visible avant qu'on dessine le moindre écran.",
    ],
    decisions: [
      {
        titre: 'On divise par les gens, pas par les voitures',
        texte:
          "Essence, péages, location du minibus : le tout est réparti entre les personnes transportées, pas entre les véhicules. Conséquence voulue — on paie le même prix quelle que soit la voiture dans laquelle on monte, le conducteur compris. C'est la règle qui met fin aux discussions de parking, et elle vient telle quelle du tableur d'origine, où elle avait déjà fait ses preuves.",
      },
      {
        titre: 'Le club est un compte comme un autre',
        texte:
          "Il avance, il encaisse, il rembourse, et son solde doit tomber à zéro. Ce zéro sert de preuve : si les comptes bouclent, il s'affiche. Le vrai gain n'est pas comptable, il est ailleurs — le conducteur cesse d'être un cas particulier codé à part, il devient simplement quelqu'un qui a avancé de l'argent. Une bonne abstraction supprime plus de code qu'elle n'en ajoute.",
      },
      {
        titre: 'La vérification s’affiche, elle ne se cache pas',
        texte:
          "« Ça boucle », en haut de l'écran, avec la phrase qui l'explique. Le tableur faisait déjà ce contrôle — enfoui dans une cellule que personne ne regardait, et qui affichait une erreur depuis des mois. Sortir une vérification de l'ombre et en faire l'élément le plus visible de l'écran : ce n'est pas une décision technique, c'est une décision de produit.",
      },
    ],
    chiffres: [
      { valeur: '0,00 €', libelle: 'le solde du club — la preuve que tout est juste' },
      { valeur: '581 €', libelle: 'du déplacement de référence, répartis au centime' },
      { valeur: 'Zéro', libelle: 'dimanche perdu à refaire les comptes à la main' },
    ],
    heros: 'Decompte',
    parcours: [
      {
        fichier: 'Infos',
        titre: 'Créer le déplacement',
        texte: "Destination, date, heure de départ. La distance et le péage se remplissent seuls.",
        suite: 'On dit qui vient',
      },
      {
        fichier: 'Participants',
        titre: 'Qui vient, qui conduit',
        texte: 'Joueurs, accompagnants, conducteurs. Chacun a sa part, calculée au fur et à mesure.',
        suite: 'Le calcul tombe juste',
      },
      {
        fichier: 'Decompte',
        titre: 'Ça boucle',
        texte: "Les participations couvrent exactement les frais. Le club ne gagne ni ne perd un centime.",
        suite: 'Reste à encaisser',
      },
      {
        fichier: 'Reglement',
        titre: 'Suivre les règlements',
        texte: "Qui a payé, qui doit être remboursé, et le récapitulatif prêt à envoyer.",
      },
    ],
    livre: [
      "Reprise du tableur existant comme spécification de référence",
      'Règles de répartition et contrôles de cohérence',
      'Parcours organisateur maquetté, en clair et en sombre',
      'Modèle de domaine et périmètre de première version arbitré',
    ],
  },
];

export const parSlug = (slug: string): Produit => {
  const produit = produits.find((p) => p.slug === slug);
  if (!produit) throw new Error(`Produit inconnu : ${slug}`);
  return produit;
};

/** Écrans montrés sur la page d'accueil, dans leur cadre de téléphone.
 *  Aucun de ces écrans ne porte le nom de son application : la marque
 *  n'apparaît nulle part avant la page réalisations. */

/** L'éventail du hero : gauche, avant, droite. */
export const eventail = [
  { projet: 'pilpoil', fichier: 'Carte' },
  { projet: 'chargeair', fichier: 'Session' },
  { projet: 'teamago', fichier: 'Decompte' },
];

/** La rangée plus bas dans la page, volontairement chevauchée. */
export const rangee = [
  // Reservation est écarté : il affiche « Frais de service ChargeAir ».
  { projet: 'chargeair', fichier: 'Borne' },
  { projet: 'teamago', fichier: 'Participants' },
  { projet: 'pilpoil', fichier: 'MiseEnRelation' },
  { projet: 'chargeair', fichier: 'Hote' },
];
