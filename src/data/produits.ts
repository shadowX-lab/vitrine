/** Les trois réalisations. Textes validés sur maquettes le 10 septembre 2026. */

export type Icone = 'prix' | 'horloge' | 'feuille' | 'eclair' | 'cloche' | 'coeur' | 'check' | 'calc' | 'suivi';
export type Ecran = { projet: string; fichier: string; haut: string; statut?: string };
export type Etape = { fichier: string; haut: string; statut?: string; titre: string; texte: string; suite?: string };
export type Benefice = { icone: Icone; titre: string; texte: string };

export type Produit = {
  slug: string;
  nom: string;
  baseline: string;
  resume: string;
  domaine: string;
  plateforme: string;
  annee: string;
  depot?: string;
  palette: { p1: string; p2: string; p3: string; accent: string; voile: string; contraste: string; clair: string; fonce: string; lueur: string };
  /** Écrans du bandeau : derrière, puis devant. */
  heros: [Omit<Ecran, 'projet'>, Omit<Ecran, 'projet'>];
  chiffres: { valeur: string; libelle: string }[];
  probleme: string[];
  citation: string;
  parcoursIntro: string;
  parcours: Etape[];
  benefices: Benefice[];
  livre: string[];
  suivant: string;
};

export const produits: Produit[] = [
  {
    slug: 'chargeair',
    nom: 'ChargeAir',
    baseline: 'La recharge électrique entre voisins',
    resume: "Réserver un créneau sur la borne d'un particulier du quartier, quand on roule à l'électrique sans prise chez soi.",
    domaine: 'Mobilité électrique',
    plateforme: 'iOS et Android',
    annee: '2026',
    depot: 'https://github.com/shadowX-lab/ChargeAir',
    palette: { p1: '#4A1B0F', p2: '#8E3A22', p3: '#D9794F', accent: '#AF5236', voile: '#F7E7E0', contraste: '#7A3822', clair: '#FFD9C4', fonce: '#4A1B0F', lueur: 'rgba(255,200,150,.35)' },
    heros: [{ fichier: 'Reservation', haut: '#F7F1EA' }, { fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6' }],
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
      { fichier: 'Main', haut: '#F7F1EA', titre: 'Trouver, près de chez soi', texte: "Les bornes du quartier, leur prix à l'heure, et celles qui acceptent votre voiture.", suite: 'On choisit un créneau' },
      { fichier: 'Reservation', haut: '#F7F1EA', titre: 'Réserver, prix connu', texte: "Le total s'affiche avant de confirmer. Il ne changera plus, quoi qu'il arrive ensuite.", suite: 'Le soir venu, on branche' },
      { fichier: 'Session', haut: '#3E5C39', statut: '#F4F1E6', titre: 'Charger tranquille', texte: "Le décompte tourne, la fin est annoncée à l'avance. Rien à surveiller.", suite: 'Et on repart' },
      { fichier: 'FinSession', haut: '#F7F1EA', titre: 'Repartir, et revenir', texte: "L'économie réalisée est chiffrée, et le prochain créneau se reprogramme en un geste." },
    ],
    benefices: [
      { icone: 'prix', titre: "Jusqu'à 40 % moins cher qu'une borne rapide", texte: "Une charge chez un voisin coûte 12,40 € là où une borne rapide en demande 21. Le conducteur sans prise chez lui paie enfin le juste prix, et l'hôte rentabilise une borne qui dormait vingt-deux heures sur vingt-quatre." },
      { icone: 'horloge', titre: "Un prix connu d'avance, sans surprise", texte: "Le montant s'affiche au moment de réserver et ne bouge plus. Pas de relevé, pas de compteur, pas de litige : on sait ce qu'on paie avant de brancher, et la fin de charge est annoncée à l'avance." },
      { icone: 'feuille', titre: "L'électrique accessible, et plus écologique", texte: "Les bornes existent déjà, dans les garages du quartier. Les partager évite d'en installer de nouvelles et ouvre la voiture électrique à ceux qui n'ont pas de prise chez eux, sans rien changer à leurs habitudes." },
    ],
    livre: ['Analyse du domaine et note de cadrage', 'Les décisions fondatrices, écrites et argumentées', 'Parcours conducteur et espace hôte maquettés', 'Modèle de domaine et spécification de conception'],
    suivant: 'pilpoil',
  },
  {
    slug: 'pilpoil',
    nom: 'Pil’Poil',
    baseline: 'Le réseau des animaux perdus et retrouvés',
    resume: 'Signaler un animal trouvé en trente secondes, retrouver le sien, et échanger sans exposer ses coordonnées.',
    domaine: 'Entraide de voisinage',
    plateforme: 'Application iOS',
    annee: '2026',
    depot: 'https://github.com/shadowX-lab/pilpoil',
    palette: { p1: '#043B33', p2: '#0A5D50', p3: '#1FA488', accent: '#0E7C6B', voile: '#E7F3F0', contraste: '#0A5D50', clair: '#B8F2DF', fonce: '#043B33', lueur: 'rgba(170,255,220,.28)' },
    heros: [{ fichier: 'Correspondances', haut: '#F5F6F4' }, { fichier: 'Main', haut: '#F5F6F4' }],
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
      { fichier: 'Main', haut: '#F5F6F4', titre: 'Vous venez de trouver un animal', texte: "C'est le premier geste proposé, en grand, sans connexion.", suite: 'On le décrit' },
      { fichier: 'SignalementCouleurs', haut: '#F5F6F4', titre: 'Le décrire, vite', texte: 'Espèce, couleurs, lieu. On touche des choix au lieu de taper du texte.', suite: 'Rapprochement automatique' },
      { fichier: 'Correspondances', haut: '#F5F6F4', titre: 'Les rapprochements arrivent', texte: 'Le propriétaire voit les animaux qui pourraient être le sien.', suite: 'Reste à se parler' },
      { fichier: 'MiseEnRelation', haut: '#F5F6F4', titre: 'Se parler, en confiance', texte: "Chacun voit ce qu'il partage avant de le partager." },
    ],
    benefices: [
      { icone: 'eclair', titre: 'Un animal signalé en 30 secondes', texte: "La personne qui trouve un animal le signale en quelques gestes, photo comprise, sans créer de compte. Chaque signalement compte : c'est souvent lui qui ramène l'animal chez lui." },
      { icone: 'cloche', titre: 'Les propriétaires prévenus sans chercher', texte: "Dès qu'un animal trouvé ressemble au leur, les propriétaires reçoivent une alerte. Plus besoin de parcourir des dizaines d'annonces dans l'angoisse : les rapprochements arrivent d'eux-mêmes." },
      { icone: 'coeur', titre: 'Des retrouvailles en toute confiance', texte: "Chacun voit ce qu'il partage avant de l'envoyer, et les coordonnées ne circulent qu'avec l'accord des deux personnes. On aide sans s'exposer, et on retrouve son animal sereinement." },
    ],
    livre: ['Étude du terrain et des usages existants', 'Règles de gestion et modèle de données', 'Parcours complets maquettés, du signalement à la clôture', 'Application iOS et interface de vérification des fiches'],
    suivant: 'teamago',
  },
  {
    slug: 'teamago',
    nom: 'Teamago',
    baseline: 'L’argent et la logistique autour du match',
    resume: 'Organiser un déplacement de club amateur et faire tomber les comptes juste, au centime, sans y passer ses dimanches.',
    domaine: 'Sport amateur',
    plateforme: 'Application iOS',
    annee: '2026',
    palette: { p1: '#171C0B', p2: '#3A4A10', p3: '#6D8A1E', accent: '#4C6116', voile: '#EFF6D9', contraste: '#3A4A10', clair: '#D4FF4F', fonce: '#1E2410', lueur: 'rgba(212,255,79,.25)' },
    heros: [{ fichier: 'Participants', haut: '#F1F1EA' }, { fichier: 'Decompte', haut: '#F1F1EA' }],
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
      { fichier: 'Infos', haut: '#F1F1EA', titre: 'Créer le déplacement', texte: 'Destination, date, heure de départ. La distance et le péage se remplissent seuls.', suite: 'On dit qui vient' },
      { fichier: 'Participants', haut: '#F1F1EA', titre: 'Qui vient, qui conduit', texte: 'Joueurs, accompagnants, conducteurs. Chacun a sa part, calculée au fur et à mesure.', suite: 'Le calcul tombe juste' },
      { fichier: 'Decompte', haut: '#F1F1EA', titre: 'Ça boucle', texte: 'Les participations couvrent exactement les frais. Le club ne gagne ni ne perd un centime.', suite: 'Reste à encaisser' },
      { fichier: 'Reglement', haut: '#F1F1EA', titre: 'Suivre les règlements', texte: 'Qui a payé, qui doit être remboursé, et le récapitulatif prêt à envoyer.' },
    ],
    benefices: [
      { icone: 'check', titre: 'Des comptes justes, en toute simplicité', texte: "Frais kilométriques, péages, minibus, hôtel : tout est réparti automatiquement entre les participants. Le solde du club tombe à 0,00 €, et l'écran affiche « Ça boucle » pour le prouver." },
      { icone: 'calc', titre: 'Fini les calculs à la main et les erreurs', texte: "Plus de tableur à tenir ni de formule à vérifier le dimanche soir. Les montants se calculent au centime près, même quand un conducteur ou un péage s'ajoute en route." },
      { icone: 'suivi', titre: "Chaque règlement suivi d'un coup d'œil", texte: 'Qui a payé, qui doit être remboursé, ce qui reste à encaisser : tout est visible au même endroit, et le récapitulatif part en un geste.' },
    ],
    livre: ['Reprise du tableur existant comme spécification de référence', 'Règles de répartition et contrôles de cohérence', 'Parcours organisateur maquetté, en clair et en sombre', 'Modèle de domaine et périmètre de première version arbitré'],
    suivant: 'chargeair',
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
