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

export type Ecran = { fichier: string; titre: string; legende: string };

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
  galerie: Ecran[];
  livre: string[];
};

export const produits: Produit[] = [
  {
    slug: 'chargeair',
    nom: 'ChargeAir',
    baseline: 'La recharge électrique entre voisins',
    resume:
      "Place de marché de location de bornes de recharge domestiques. Un conducteur sans borne chez lui réserve un créneau chez un particulier du quartier.",
    domaine: 'Mobilité électrique · Place de marché',
    annee: '2026',
    plateforme: 'Application mobile iOS et Android',
    palette: { accent: '#AF5236', voile: '#F7E7E0', contraste: '#7A3822' },
    depot: 'https://github.com/shadowX-lab/ChargeAir',
    probleme: [
      "Un conducteur d'électrique sans borne à domicile n'a qu'une option : la charge rapide. Pour 31 kWh, comptez environ 21 €. La même énergie chez un particulier revient à 12,40 €. L'écart est réel, la borne du voisin est inutilisée quatre-vingts pour cent du temps, et pourtant rien ne les met en relation.",
      "Le piège du sujet, c'est de le traiter comme un Airbnb de la prise électrique. C'est exactement ce qu'il ne faut pas faire, et le cadrage a servi à le démontrer avant d'écrire une ligne.",
    ],
    decisions: [
      {
        titre: "C'est de la recharge à destination, pas une station-service",
        texte:
          "Une borne domestique délivre 3 à 11 kW, soit trois à six heures à l'arrêt. Personne ne s'immobilise aussi longtemps au hasard. Le service ne s'adresse donc qu'à des conducteurs déjà immobilisés — chez eux, chez leur hébergeur, au travail. Conséquence directe sur l'interface : la réservation est toujours planifiée, jamais opportuniste, et l'unité vendue est un créneau long.",
      },
      {
        titre: 'On facture un créneau, jamais de l’énergie',
        texte:
          "Facturer au kilowattheure exigerait un compteur certifié et relèverait juridiquement de la revente d'électricité. On vend une mise à disposition, tarifée à l'heure. Trois conséquences : aucune contrainte de métrologie, aucun litige de relevé, et un montant connu dès la réservation. Comme le conducteur, lui, raisonne en €/kWh, l'équivalent estimé est affiché partout à côté du prix horaire.",
      },
      {
        titre: 'Aucun matériel, aucun QR code, aucun OCPP',
        texte:
          "Puisque le montant est déjà fixé, la confirmation de branchement ne sert jamais à facturer. Elle sert au no-show, à la notification de fin de charge et à la preuve en cas de litige. Un bouton dans l'application avec vérification de position rend ces trois services sans rien poser sur la borne. Le seul verrou physique réel reste le code du portail, communiqué une heure avant le créneau.",
      },
      {
        titre: '« Estimé », jamais « consommé »',
        texte:
          "Corollaire du choix précédent : aucune énergie réellement livrée n'est connue du système. Chaque kilowattheure et chaque kilomètre affiché est calculé à partir du modèle de véhicule et de la puissance de la borne. C'est devenu une règle de vocabulaire imposée à toute l'interface — le genre de contrainte qui ne coûte rien si elle est posée au cadrage, et qui coûte une refonte si elle arrive après.",
      },
      {
        titre: 'Le produit doit fabriquer de la récurrence',
        texte:
          "Un hôte a besoin de quinze à vingt sessions par mois pour dégager une centaine d'euros nets. Aucun flux de passage ne produit ce volume : seuls un ou deux conducteurs réguliers y parviennent. C'est l'inverse d'Airbnb, où l'on ne revient presque jamais chez le même hôte. D'où le compteur de visites côté hôte, la reprogrammation proposée en fin de session, et un badge qui récompense la fidélité à un même hôte plutôt que le volume.",
      },
    ],
    chiffres: [
      { valeur: '12,40 €', libelle: 'contre 21 € en charge rapide, pour 31 kWh' },
      { valeur: '7', libelle: 'écrans, un parcours complet des deux côtés du marché' },
      { valeur: '5', libelle: 'décisions fondatrices écrites avant le premier écran' },
    ],
    heros: 'Session',
    galerie: [
      { fichier: 'Main', titre: 'Recherche', legende: "La carte affiche le prix horaire de chaque borne et le filtre de compatibilité s'appuie sur le véhicule déclaré." },
      { fichier: 'Borne', titre: 'Fiche de borne', legende: "Compatibilité, durée de charge et gain estimé sont calculés pour votre voiture, pas donnés dans l'absolu." },
      { fichier: 'Reservation', titre: 'Réservation', legende: "Le total est fixé ici, et la comparaison avec la borne rapide est affichée parce qu'elle est le seul argument vraiment décisif." },
      { fichier: 'Session', titre: 'Session en cours', legende: "Le décompte porte sur le créneau réservé, pas sur la charge réelle. La notification de fin est prévue avant même le branchement." },
      { fichier: 'FinSession', titre: 'Fin de session', legende: "L'énergie est annoncée comme estimée, l'économie réalisée est chiffrée, et la reprogrammation est proposée dans la foulée." },
      { fichier: 'Vehicule', titre: 'Mon véhicule', legende: "La brique de domaine centrale : ce profil alimente le filtre de compatibilité, l'estimation de charge et la prévision de fin." },
      { fichier: 'Hote', titre: 'Espace hôte', legende: '148 € sur dix-neuf sessions : l’ordre de grandeur réel est affiché tel quel, sans promesse gonflée.' },
    ],
    livre: [
      'Analyse du domaine et note de cadrage',
      'Les cinq décisions fondatrices, écrites et argumentées',
      'Sept écrans maquettés, parcours conducteur et espace hôte',
      'Spécification de conception et modèle de domaine',
    ],
  },
  {
    slug: 'pilpoil',
    nom: 'Pil’Poil',
    baseline: 'Le réseau des animaux perdus et retrouvés',
    resume:
      "Réseau temps réel de signalement d'animaux perdus et trouvés : géolocalisation, correspondances automatiques et mise en relation entre propriétaires et personnes qui ont vu l'animal.",
    domaine: 'Réseau d’entraide · Temps réel',
    annee: '2026',
    plateforme: 'Application mobile iOS',
    palette: { accent: '#0E7C6B', voile: '#E7F3F0', contraste: '#0A5D50' },
    depot: 'https://github.com/shadowX-lab/pilpoil',
    probleme: [
      "Quand un animal disparaît, la détresse est immédiate et la fenêtre utile se compte en heures. L'étude de huit applications existantes — Filalapat, 30 Millions d'amis, PiP my pet, CPasPerdu et les autres — a fait ressortir toujours le même défaut : il faut créer un compte avant de pouvoir signaler quoi que ce soit, et parfois même posséder un numéro d'identification.",
      "Or la personne qui croise un chien errant dans la rue n'est pas celle qui a un problème. Elle rend service. Lui demander de s'inscrire, c'est perdre le signalement.",
    ],
    decisions: [
      {
        titre: 'L’application s’ouvre sur « j’ai trouvé un animal »',
        texte:
          "Pas sur un écran de connexion, pas sur un catalogue d'annonces. Le premier geste proposé est celui de la personne qui rend service, parce que c'est le geste le plus fragile : elle est pressée, elle ne connaît pas l'application, elle abandonnera à la première friction. Signaler un animal trouvé ne demande donc aucun compte.",
      },
      {
        titre: 'Le compte n’est exigé que pour déclarer une perte',
        texte:
          "Et pour une raison qui se dit en une phrase à l'utilisateur : c'est ce qui permet à quelqu'un de vous joindre quand votre animal est retrouvé. Une contrainte qu'on explique cesse d'être une contrainte. C'est le même arbitrage que partout ailleurs dans le produit — on ne supprime pas les règles, on les rend compréhensibles au moment où elles s'appliquent.",
      },
      {
        titre: 'Un seul formulaire pour la perte et pour la découverte',
        texte:
          "Espèce, race, couleurs, tatouage, signes distinctifs, lieu, heure : ce sont les mêmes champs des deux côtés. Les tenir identiques n'est pas une économie de développement, c'est ce qui rend la correspondance automatique possible. On ne peut rapprocher deux fiches que si elles sont écrites dans la même langue.",
      },
      {
        titre: 'La mise en relation montre d’abord ce que l’autre verra',
        texte:
          "Avant d'envoyer une demande, on affiche exactement ce que la personne d'en face recevra de vous. Les coordonnées ne circulent qu'après acceptation, et jamais dans les deux sens. Une demande ne peut être acceptée ou refusée qu'une seule fois. Ce sont trois règles de conception qui coûtent une demi-journée à décider et qui font toute la différence entre un service qu'on utilise et un service qu'on redoute.",
      },
      {
        titre: 'Le filtrage des correspondances est un enjeu de crédibilité',
        texte:
          "Ne jamais proposer un lapin à quelqu'un qui cherche un chien. L'utilisateur définit le périmètre dans lequel il accepte d'être alerté, et les correspondances sont classées par force de ressemblance. Une notification inutile suffit à faire désinstaller une application qu'on n'ouvre que dans les mauvais moments.",
      },
    ],
    chiffres: [
      { valeur: '0', libelle: 'compte requis pour signaler un animal trouvé' },
      { valeur: '24', libelle: 'écrans maquettés, du signalement à la clôture' },
      { valeur: '8', libelle: 'applications concurrentes analysées avant de dessiner' },
    ],
    heros: 'Main',
    galerie: [
      { fichier: 'Main', titre: 'Accueil', legende: "Le geste le plus fragile est mis en premier et en grand. Les animaux trouvés près de vous sont visibles sans se connecter." },
      { fichier: 'Carte', titre: 'Autour de moi', legende: 'Les signalements sont posés sur la carte avec le rayon choisi. Le filtre par espèce est immédiat.' },
      { fichier: 'SignalementCouleurs', titre: 'Signaler — l’animal', legende: "Les couleurs se choisissent en deux gestes plutôt qu'en champ libre : c'est ce qui rend deux fiches comparables." },
      { fichier: 'Correspondances', titre: 'Correspondances', legende: 'Les animaux trouvés qui pourraient être le vôtre, classés par force de ressemblance et par proximité.' },
      { fichier: 'MiseEnRelation', titre: 'Mise en relation', legende: "Avant l'envoi, on montre au demandeur ce que l'autre personne verra de lui. Rien ne circule sans acceptation." },
      { fichier: 'FicheAnnonce', titre: 'Fiche d’annonce', legende: "La fiche dit tout de suite si l'animal a été recueilli et si quelqu'un est joignable." },
      { fichier: 'DeclarationLancee', titre: 'L’avis est lancé', legende: "Un écran qui explique ce qui va se passer maintenant, plutôt qu'une confirmation vide." },
      { fichier: 'MesAnimaux', titre: 'Mes animaux', legende: "L'état de chaque animal et le nombre de correspondances en attente, dès l'ouverture." },
    ],
    livre: [
      'Analyse de huit applications concurrentes',
      'Règles de gestion et modèle de données',
      'Vingt-quatre écrans maquettés, parcours complets',
      'Application iOS et interface d’administration des fiches',
    ],
  },
  {
    slug: 'teamago',
    nom: 'Teamago',
    baseline: 'L’argent et la logistique autour du match',
    resume:
      "Gestion des déplacements et de la trésorerie des clubs sportifs amateurs : répartition des frais, position de chaque conducteur, bouclage au centime.",
    domaine: 'Sport amateur · Trésorerie associative',
    annee: '2026',
    plateforme: 'Application mobile iOS',
    palette: { accent: '#4C6116', voile: '#EFF6D9', contraste: '#3A4A10' },
    probleme: [
      "Ce projet part d'une pièce à conviction : un classeur Excel réel, construit par un dirigeant de club pour organiser les déplacements de son équipe en 2019. Sept onglets, cinq contrôles de cohérence, un reçu imprimable par conducteur. Ce n'est pas une maquette, c'est un outil qui a tourné pour de vrai.",
      "Sur le cas de référence — Le Lioran, 700 km aller-retour, huit payeurs, 581 € à répartir — le contrôle de bouclage de ce classeur affiche « Incohérence du montant des remboursements ». Autrement dit : même quelqu'un qui fabrique son propre outil de gestion n'arrive pas à faire tomber les comptes juste à la main. C'est l'argument produit tout entier, et il était dans le fichier avant qu'on dessine quoi que ce soit.",
    ],
    decisions: [
      {
        titre: 'On divise par les voyageurs, pas par les voitures',
        texte:
          "L'assiette du trajet — frais kilométriques, péages, location du minibus — est divisée par le nombre de personnes transportées. Conséquence voulue : on paie le même prix quelle que soit la voiture dans laquelle on monte, conducteur compris. C'est la règle qui évite les discussions de parking, et elle vient telle quelle du classeur d'origine, où elle avait déjà fait ses preuves.",
      },
      {
        titre: 'L’association est un compte comme un autre',
        texte:
          "Elle avance, elle encaisse, elle rembourse. Son solde doit tomber à 0,00 €, et c'est ce zéro qui fait office de contrôle de bouclage. Le bénéfice de conception est ailleurs que dans la comptabilité : le conducteur cesse d'être un cas particulier codé en dur, il devient simplement quelqu'un qui a avancé de l'argent. Une abstraction bien choisie supprime plus de code qu'elle n'en ajoute.",
      },
      {
        titre: 'Participant et voyageur ne sont pas la même chose',
        texte:
          "Quelqu'un qui rejoint le match par ses propres moyens participe à l'inscription et à l'hôtel, mais pas au trajet. Un parent venu avec deux enfants ne remplit qu'une ligne, avec des parts d'accompagnants rattachées à lui. Cette distinction, invisible dans un tableur, structure tout le modèle de données.",
      },
      {
        titre: 'Le bouclage est affiché, pas caché dans un onglet',
        texte:
          "« Ça boucle », en haut de l'écran de décompte, avec la phrase qui l'explique : les participations couvrent exactement les frais. Le classeur avait la même vérification, enfouie dans une cellule que personne ne regardait. Sortir un contrôle de l'ombre et en faire l'élément le plus visible de l'écran, c'est une décision produit, pas une décision technique.",
      },
      {
        titre: 'Ce qui a été volontairement reporté',
        texte:
          "Covoiturage nominatif, notes de frais photo, attestation fiscale d'abandon de frais, solde de saison consolidé, multi-utilisateur. Tout cela était dans l'intention de départ. Rien n'est dans la première version, parce que le noyau comptable devait tomber juste avant qu'on empile quoi que ce soit dessus. Une première version qui fait une chose entièrement vaut mieux que cinq à moitié.",
      },
    ],
    chiffres: [
      { valeur: '0,00 €', libelle: 'le solde de l’association : c’est ça, le bouclage' },
      { valeur: '581 €', libelle: 'du cas de référence, répartis au centime entre 8 payeurs' },
      { valeur: '14', libelle: 'écrans, de la création du déplacement au règlement' },
    ],
    heros: 'Decompte',
    galerie: [
      { fichier: 'Decompte', titre: 'Décompte', legende: "Le contrôle de bouclage est l'élément le plus visible de l'écran, pas une cellule cachée en bas d'un onglet." },
      { fichier: 'Main', titre: 'La saison', legende: 'Reste à encaisser et à rembourser en un coup d’œil, déplacement par déplacement.' },
      { fichier: 'Deplacement', titre: 'Le déplacement', legende: 'Distance et durée calculées sur l’itinéraire ; le péage est repris du dernier trajet identique puis corrigé au ticket.' },
      { fichier: 'FicheParticipant', titre: 'Fiche participant', legende: "Joueur, voyageur, conducteur : trois qualités indépendantes. La position nette peut être négative — le club doit alors de l'argent." },
      { fichier: 'Participants', titre: 'Participants', legende: 'Une ligne par payeur, le conducteur en négatif, le total du déplacement en haut.' },
      { fichier: 'Reglement', titre: 'Règlement', legende: 'Quatre réglés sur huit, ce qui reste à encaisser, ce qui reste à rembourser. Le suivi est le vrai travail du trésorier.' },
      { fichier: 'Argent', titre: 'Paramètres financiers', legende: 'Barème, inscription, séjour, arrondi : tout ce qui change le calcul est réuni sur un seul écran.' },
      { fichier: 'Mail', titre: 'Récapitulatif', legende: "Le message part depuis votre boîte, un destinataire à la fois. Rien n'est envoyé sans que vous l'ayez vu." },
    ],
    livre: [
      'Reprise du classeur de 2019 comme spécification de référence',
      'Règles de répartition et contrôles de bouclage',
      'Quatorze écrans maquettés, clair et sombre',
      'Modèle de domaine et périmètre de première version arbitré',
    ],
  },
];

export const parSlug = (slug: string): Produit => {
  const produit = produits.find((p) => p.slug === slug);
  if (!produit) throw new Error(`Produit inconnu : ${slug}`);
  return produit;
};
