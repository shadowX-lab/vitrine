# Cadran — Contexte du projet

> Fichier de référence du site vitrine. Toute affirmation publiée sur le site
> doit pouvoir être retrouvée ici. Mis à jour le 9 septembre 2026.

## En une phrase

Cadran est un studio de conception et de développement d'applications web et
mobiles qui vend la décision produit avant la ligne de code. Accroche :
**« Le produit avant le code. »**

## Le nom

Un cadran mesure avant que l'aiguille ne bouge. C'est la promesse : on gradue le
problème, on le lit, on se met d'accord sur ce qu'on voit — ensuite seulement on
avance. Le mot porte aussi l'idée d'instrument de précision et de temps lisible
d'un coup d'œil, deux choses que le studio revendique.

Conséquence graphique : le motif de **graduation** (traits de mesure fins,
numérotation des étapes) est la signature de la marque. Le cadran n'est jamais
dessiné littéralement.

## Positionnement

Le marché est saturé d'agences qui vendent des jours-homme. Cadran vend
l'inverse : le temps passé à ne pas construire la mauvaise chose. L'argument
n'est pas moral, il est économique — une fonctionnalité mal cadrée coûte le
développement, plus le retrait, plus la confiance perdue.

**Ce qui rend la promesse vérifiable :** le studio construit ses propres
produits. Pil'Poil, ChargeAir et Teamago ne sont pas des références clients, ce
sont des produits maison, et le site le dit explicitement. Chacun expose une
décision de conception argumentée et les écrans qui en découlent. C'est une
démonstration de méthode, pas un portfolio de prestations.

## Voix

« Nous », sans jamais afficher d'effectif ni de taille d'équipe. Ton direct,
phrases courtes, aucun jargon d'agence. On ne dit pas « accompagner la
transformation digitale » ; on dit ce qu'on fait.

## Les mots-clés, traduits en engagements

Les mots-clés bruts (rapidité, efficacité, écoute, validation, compréhension,
moderne) ne sont pas affichés tels quels : un adjectif que tout le monde
revendique ne convainc personne. Chacun devient un engagement mesurable.

| Mot-clé | Ce qui est affiché sur le site |
|---|---|
| Écoute | Un entretien de cadrage avant tout devis. On rend une note de ce qu'on a compris, et le client la corrige. |
| Compréhension | On restitue le problème dans les mots du métier du client, pas dans les nôtres. La note de cadrage est le livrable qui le prouve. |
| Rapidité | Des maquettes cliquables en quelques jours, pas en quelques semaines. |
| Validation | Rien ne part en développement sans un écran validé. La maquette est le contrat. |
| Efficacité | On construit le parcours qui porte la valeur, et on reporte le reste. Chaque produit maison en montre l'arbitrage. |
| Moderne | Des interfaces qui tiennent la comparaison avec ce que les gens utilisent tous les jours. Les écrans sont là pour être jugés. |

## La méthode, en quatre temps

1. **Écouter** — un entretien, puis une note de ce qu'on a compris. Gratuite,
   et elle vous appartient même si on s'arrête là.
2. **Cadrer** — le problème est réduit à ce qui compte. On tranche ce qui entre
   dans la première version et ce qui attend. Chaque arbitrage est écrit avec
   sa raison.
3. **Valider** — des écrans réels, pas des schémas. On les regarde ensemble,
   on les corrige, et on ne code pas avant que vous disiez oui.
4. **Fabriquer** — développement par tranches complètes, livrées une par une.
   Chaque tranche fonctionne de bout en bout.

## Les trois produits

### Pil'Poil — le réseau des animaux perdus et retrouvés

Réseau temps réel de déclaration d'animaux perdus et trouvés, avec
géolocalisation, correspondances automatiques et mise en relation.

- **Le problème :** le stress du propriétaire est immédiat, les outils existants
  sont lents ou fermés. L'analyse de huit concurrents (Filalapat, 30 Millions
  d'amis, PiP my pet, CPasPerdu…) montre le même défaut partout : l'inscription
  obligatoire avant de pouvoir signaler quoi que ce soit.
- **La décision forte :** l'application s'ouvre sur « j'ai trouvé un animal », pas
  sur un écran de connexion. Signaler un animal trouvé ne demande aucun compte.
  Le compte n'est exigé que pour déclarer une perte — c'est ce qui permet à la
  personne d'être rappelée. Le formulaire de perte et celui de découverte sont
  le même formulaire.
- **La délicatesse :** l'écran de mise en relation montre au demandeur ce que
  l'autre personne verra de lui avant qu'il n'envoie. Les coordonnées ne
  circulent qu'après acceptation, et jamais dans les deux sens.
- **Écrans :** 24 artboards, palette teal `#0E7C6B` sur ivoire.
- **Dépôt :** github.com/shadowX-lab/pilpoil

### ChargeAir — la recharge entre particuliers

Place de marché de location de bornes de recharge domestiques entre voisins.

- **Le problème :** un conducteur d'électrique sans borne à domicile n'a que la
  charge rapide, à environ 21 € pour 31 kWh, contre 12,40 € chez un particulier.
- **Les décisions fondatrices :** (a) c'est de la recharge à destination, pas une
  station-service — une borne domestique délivre 3 à 11 kW, soit 3 à 6 heures à
  l'arrêt, donc la réservation est toujours planifiée ; (b) on facture un
  créneau, pas de l'énergie — facturer au kWh exigerait un compteur certifié et
  relèverait de la revente d'électricité ; (c) aucun matériel, aucun OCPP, aucun
  QR code : le montant étant fixé d'avance, la confirmation de branchement ne
  sert qu'au no-show, à la notification de fin et à la preuve en cas de litige ;
  (d) rien n'est mesuré, tout est estimé — d'où la règle de vocabulaire
  imposée à toute l'interface : « estimé », jamais « consommé » ; (e) le produit
  doit fabriquer de la récurrence, parce qu'un hôte a besoin de quinze à vingt
  sessions par mois pour dégager une centaine d'euros nets, ce qu'aucun flux de
  passage ne produit.
- **Écrans :** 7 artboards, palette terracotta `#AF5236` sur beige.
- **Dépôt :** github.com/shadowX-lab/ChargeAir

### Teamago — l'argent et la logistique autour du match

Gestion des déplacements et de la trésorerie des clubs sportifs amateurs.
Accroche du produit : « Everything but the game. »

- **L'antériorité :** un classeur Excel réel, utilisé pour organiser les
  déplacements d'un club en 2019. Cas de référence : Le Lioran, 21 novembre,
  700 km aller-retour, 8 payeurs, 581 € à répartir.
- **L'argument produit le plus fort :** dans ce fichier construit par un
  organisateur méthodique, le contrôle de bouclage affiche « Incohérence du
  montant des remboursements ». Même quelqu'un qui fabrique son propre outil
  n'arrive pas à faire tomber les comptes juste à la main.
- **La décision forte :** l'assiette du trajet est divisée par le nombre de
  voyageurs, pas de voitures — on paie le même prix quelle que soit la voiture
  dans laquelle on monte, conducteur compris. Et l'association devient un compte
  comme un autre : elle avance, encaisse, rembourse, et son solde doit tomber à
  0,00 €. Le conducteur cesse d'être un cas particulier.
- **Positionnement :** complémentaire de SportEasy, pas concurrent. « SportEasy
  gère l'équipe le jour du match, Teamago gère l'argent et la logistique
  autour. »
- **Écrans :** 14 artboards, palette encre `#0E1116` et citron `#D3FF4F`.
- **Dépôt :** aucun dépôt distant à ce jour (git local uniquement).

## Direction artistique du site

- **Fond** ivoire `#F7F4EE`, **encre** `#14161A`, **accent** laiton `#B8873B`.
- **Typographie** : Instrument Serif pour les titres, Inter Variable pour le texte.
- **Signature** : graduations — traits de mesure fins en bordure de section,
  étapes numérotées, filets sous les titres.
- **Couleurs projet** : chaque étude de cas reprend l'accent de son produit
  (teal, terracotta, citron). Le site sert d'écrin neutre ; la couleur vient des
  écrans.

## Décisions techniques

- **Astro 5**, statique, zéro framework client. Le site doit se charger vite,
  c'est la première preuve du discours.
- **CSS natif avec tokens**, pas de framework utilitaire : un site d'agence qui
  ressemble à un template annule son propre argument.
- **Écrans en images** : `scripts/render-ecrans.mjs` rend les artboards
  `.dc.html` des trois projets en PNG @2x avec Chrome headless, puis
  `astro:assets` les sert en AVIF/WebP responsive. Le script est rejouable : on
  modifie une maquette, on relance, le site est à jour.
- **Formulaire** : Web3Forms (clé publique, aucun serveur). Clé et lien de
  rendez-vous isolés dans `src/config.ts`.
- **Déploiement** : GitHub Actions vers GitHub Pages à chaque push sur `main`.

## Ce qui reste à fournir

- La clé d'accès Web3Forms (`src/config.ts` → `CLE_FORMULAIRE`).
- L'URL de prise de rendez-vous Cal.com ou Calendly (`src/config.ts` → `LIEN_RDV`).
- Les informations légales réelles (raison sociale, SIREN, hébergeur) dans
  `src/pages/mentions-legales.astro`.
- Décision sur l'affichage public d'une adresse e-mail : aucune n'est publiée
  pour l'instant, le formulaire est le seul canal.
