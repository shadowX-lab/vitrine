# Refonte « Braise » du site Moamind Solutions

> Spec validée page par page sur maquettes le 10 septembre 2026.
> Maquettes de référence : `.superpowers/brainstorm/34998-1789049536/content/`
> (`accueil.html`, `methode.html`, `realisations.html`, `etude-*.html`,
> `experience.html`, `contact.html`, `merci.html`, `404.html`,
> `mentions-legales.html`, styles communs dans `braise.css`).

## 1. Objectif

Remplacer la direction « éditoriale » (crème, serif Newsreader, mot en italique,
surtitres en petites capitales), jugée « générée par IA », par une direction
**moderne et premium** inspirée d'Olmo, Beyonds et Around, et réécrire les
textes qui ne correspondent plus au positionnement. Le site reste statique
(Astro 5), rapide, sans framework client, publié sur GitHub Pages sous `/vitrine`.

Le premium passe par la retenue : aucune photo de banque d'images, aucun
décor en pointillés ou triangles, aucun texte en dégradé, aucun carrousel.

## 2. Système de design

### Couleurs (tokens CSS)

| Jeton | Valeur | Usage |
|---|---|---|
| `--f1` / `--f2` / `--f3` | `#6E2213` / `#C24A26` / `#F08A45` | Dégradé Braise (bandeaux, appel final, bouton d'envoi) |
| `--lueur` | `rgba(255,200,120,.4)` | Halo dans les bandeaux |
| `--encre` | `#15121F` | Texte, section sombre, pied de page |
| `--encre-2` | `#4B4453` | Texte courant |
| `--gris` | `#6E6674` | Texte secondaire (contraste ≥ 4,5:1 sur blanc et sur crème) |
| `--trait` | `#EDE6E1` | Bordures |
| `--creme` / `--voile` / `--voile2` | `#FBF6F2` / `#FBEDE6` / `#FFF1E3` | Fonds de sections et de cartes |

Chaque étude de cas prend la couleur de son produit (`palette` dans
`src/data/produits.ts`) : ChargeAir terracotta, Pil'Poil teal, Teamago olive et
citron. La couleur Braise reste sur le bouton « Décrire mon projet » et
l'appel final.

### Typographie

- **Plus Jakarta Sans** (variable, auto-hébergée via `@fontsource-variable/plus-jakarta-sans`) :
  titres en 800, interlettrage serré (−0,035 à −0,05 em) ; la seconde ligne
  des grands titres en 400 (« **Le produit** / avant le code. »,
  « **Ce que ça donne,** / et pourquoi », « **Trois mots,** / c'est tout le
  nom », « **C'est noté.** / Votre projet sera lu avec attention. »).
- **Geist** (déjà installée) pour les petits éléments d'interface : cartes
  flottantes, barres d'état des iPhone, aides de formulaire.
- Newsreader est retirée.
- Préchargement (`<link rel="preload" as="font">`) des deux fichiers latins
  critiques.

### Règles de typographie (toutes les pages)

Appliquées **au rendu Astro** par un utilitaire `src/lib/typo.ts`, donc sans
JavaScript côté client :

1. **Aucun mot isolé en fin de ligne** : pour tout texte d'au moins six mots,
   les trois derniers mots sont liés par des espaces insécables. Les textes
   courts (titres, accroches, légendes, cartes) sont en
   `text-wrap: balance` ; les paragraphes longs en `text-wrap: pretty`.
2. **Ponctuation française** : espace insécable après « et avant », avant
   les deux-points ; espace fine insécable avant ; ! ?
3. **Grands titres** (≥ 40 px) : virgule et point resserrés contre la lettre
   (`<span class="ponct">`, marge −0,09 em), la police les espaçant trop.

Vérification automatique à 390 et 1440 px (voir § 8).

### Formes et éléments

- **Bandeau en biais** : fond Braise (ou couleur produit) découpé en
  diagonale, bas plus haut à droite, fin trait lumineux en diagonale. Le fond
  est un calque à part : ce qui en déborde (iPhone, cartes, formulaire) n'est
  jamais rogné. Sa hauteur suit le contenu (le texte ne tombe jamais sur la
  partie blanche).
- **iPhone en 3D** (CSS, sans image de cadre) : épaisseur par couches,
  cadre métal, Dynamic Island, barre d'état iOS (9:41) à la couleur du haut
  de l'écran, reflet, boutons latéraux, ombre portée. Rotation par
  `transform` en perspective.
- **Cartes** très arrondies (22 à 40 px), pastilles en capsule, ombres
  longues et douces.
- **Cartes flottantes** reprises des vraies apps (« À payer 12,40 € »,
  « 6 chiens trouvés »).
- Rythme des sections : blanc, crème, une section sombre par page au plus,
  appel final en biais Braise, pied de page sombre.
- Mouvement discret (survol, défilement doux), désactivé sous
  `prefers-reduced-motion`.

## 3. Composants Astro

| Composant | Rôle |
|---|---|
| `layouts/Base.astro` | Tête (polices préchargées, métadonnées), `Entete`, `PiedDePage` |
| `components/Entete.astro` | Logo (→ accueil), Méthode, Réalisations, Expérience, bouton « Décrire mon projet » ; menu repliable sous 760 px |
| `components/Bande.astro` | Bandeau en biais : couleur, hauteur, pente ; créneaux texte et visuel |
| `components/Iphone3D.astro` | iPhone 3D : écran (`astro:assets`), largeur, rotation, couleur de barre d'état, priorité de chargement |
| `components/CarteFlottante.astro` | Carte d'interface flottante |
| `components/Chiffres.astro` | Trois cartes de chiffres |
| `components/AppelFinal.astro` | Bandeau final en biais (titre, texte, boutons ; lien de rendez-vous si `LIEN_RDV`) |
| `components/PiedDePage.astro` | « Votre produit est étudié, cadré et validé avant la première ligne de code. », liens, mentions |
| `lib/typo.ts` | Règles de typographie du § 2 |

`Telephone.astro` est remplacé par `Iphone3D.astro`. Correctif au passage :
`width={largeur}` avec `densities={[1, 2]}` (aujourd'hui l'image 2x fait
4 fois la largeur affichée).

## 4. Pages

Le contenu de chaque page est celui des maquettes validées.

- **Accueil** — Bandeau : étiquette « Conception et développement · web et
  mobile », « **Le produit** / avant le code. », phrase choc « La plupart
  des applications… On commence par celles-là. », deux boutons, deux iPhone
  3D (ChargeAir devant, Pil'Poil derrière) qui débordent, deux cartes
  flottantes. Chiffres 15 ans / 0 / 1 (espace dessous). **Conviction** :
  « Le code n'est pas le sujet. / Il est la conséquence. », schéma des
  trois coûts, les trois paragraphes d'origine mot pour mot, chute en
  encadré sombre. **Méthode** : « Vous validez les écrans. Ensuite, on
  développe. », quatre cartes avec leur livrable dessiné. **Réalisations**
  (sombre) : quatre iPhone resserrés, coupés à mi-hauteur, sans nom d'app.
  **Expérience** : Développeur → Chef de projet → Product Owner → Business
  Analyst, nuage de mots-clés. **Périmètre** : six services. Appel final.
- **Méthode** — Quatre marches en escalier qui débordent du bandeau et
  mènent chacune à leur étape (ancres). Quatre rangées alternées : livrable
  dessiné (note de cadrage corrigée ; tableau Version 1 / Plus tard / Jamais ;
  écran annoté de trois questions client, « Corrigé ✓ », « Écran validé » ;
  frise des tranches), résumé, deux paragraphes, « Ce que vous recevez »,
  engagement. Six engagements en section sombre.
- **Réalisations** — « **Ce que ça donne,** / et pourquoi », texte sans
  « je » ni « produit maison ». Une grande carte par produit dans sa
  couleur, deux iPhone qui débordent par le haut, trois bénéfices, bouton
  « Lire l'étude de cas <nom> ». Environ 200 px entre l'introduction et la
  première carte.
- **Étude de cas** (`/realisations/<slug>`) — Bandeau à la couleur du
  produit (fil d'Ariane, « Étude de cas · 2026 », nom, accroche, fiche
  domaine / plateforme / dépôt), deux iPhone 3D ; chiffres ; point de
  départ avec phrase clé ; parcours en quatre écrans reliés par des
  étiquettes ; **« Ce que ça change pour ceux qui s'en servent »** (trois
  bénéfices, titre fixe à gauche) ; livrables ; étude suivante (en boucle)
  dans la couleur du produit suivant ; appel final.
- **Expérience** — « **Trois mots,** / c'est tout le nom », cartes MOA /
  Mind / Solutions qui débordent ; quatre apports ; terrains dépliables
  (`<details>`, mots-clés toujours visibles, + / −) ; fiche (Formation,
  Certification, « Bordeaux et des projets sans frontière. ») ; six
  convictions en sombre ; outils ; appel final.
- **Contact** — « Décrivez ce que vous voulez construire », trois étapes
  sans « je » ; formulaire en carte blanche qui déborde du bandeau.
- **Message reçu**, **404**, **Mentions légales** — même bandeau en version
  courte ; sommaire des mentions en ancres, section courante surlignée.

## 5. Données (`src/data/produits.ts`)

- `benefices: { icone, titre, texte }[]` (trois par produit) remplace
  `decisions` ; ce sont aussi les trois points de la page Réalisations.
- `palette` étendue : `p1`, `p2`, `p3` (dégradé), `accent`, `voile`, `lueur`,
  `clair` et `fonce` (carte « étude suivante »).
- `heros: [derriere, devant]` et, par écran, la couleur du haut
  (barre d'état).
- `eventail` (accueil) : `chargeair/Session` devant, `pilpoil/Carte`
  derrière. `rangee` inchangée (écrans sans nom d'app).

## 6. Contenu

- Positionnement : **le produit avant le code**. Les réalisations sont
  présentées sans dire qui les a créées ni qu'il s'agit de projets
  personnels ; elles parlent du bénéfice pour l'utilisateur.
- Pas de première personne du studio sur l'Accueil, Réalisations, les
  études de cas, Contact et Message reçu. Méthode et Expérience gardent
  leur « je ». Les formules où le visiteur parle (« Décrire mon projet »,
  « Je ne sais pas encore ») restent.
- `context/CONTEXT-MOAMIND.md` est mis à jour : direction artistique Braise,
  règle 2 assouplie (l'iPhone de devant du hero est visible en entier),
  plus de « produits maison », Business Analyst, anonymisation, nouvelle
  phrase de pied de page.

## 7. Écrans d'applications

`scripts/render-ecrans.mjs` anonymise les écrans Teamago au rendu, sans
toucher aux maquettes du projet Teamago : neuf personnes réelles remplacées
par des personnes fictives (nom, prénom seul, initiales des pastilles,
adresse e-mail) et « Les Cabots » remplacé par « Les Hérons ». Puis
`npm run ecrans` régénère `src/assets/ecrans/`. Le script vérifie qu'aucun
nom réel ne subsiste.

## 8. Responsive, accessibilité, performance

**Responsive** (le site entier, validé à 320, 375, 390, 768, 1024 et
1440 px, sans défilement horizontal) :

- ≥ 1100 px : mises en page des maquettes.
- 700 à 1100 px : hero sur une colonne, iPhone réduits sous le texte,
  grilles de trois passent à deux.
- < 700 px : menu repliable (corrige le débordement de l'en-tête relevé à
  l'audit), pente du bandeau adoucie, iPhone à environ 60 % toujours en 3D,
  cartes sur une colonne, formulaire pleine largeur.

**Accessibilité et correctifs de l'audit du 10 septembre** :

- Champ anti-spam du formulaire masqué aux lecteurs d'écran (`hidden`).
- Focus visible partout, y compris en contraste élevé Windows
  (`outline` transparent plutôt que `outline: none`).
- `spellcheck="false"` sur l'e-mail, `autocomplete` sur tous les champs,
  aide du message reliée par `aria-describedby`, bouton « Envoyer mon
  projet » qui passe à « Envoi… ».
- Liens « Lire l'étude de cas » avec le nom du produit.
- Fil d'Ariane dans un `<nav>`.
- Contrastes ≥ 4,5:1 pour tout texte.
- `translate="no"` sur les noms de marque.
- `touch-action: manipulation` sur les éléments cliquables.

**Performance** : aucun JavaScript client hors formulaire (bascule
particulier / professionnel, état d'envoi) et sommaire des mentions ;
`fetchpriority="high"` sur l'iPhone principal ; images au bon gabarit ;
polices préchargées. Image de partage (`og:image`) aux couleurs Braise, la
carte `summary_large_image` n'ayant aujourd'hui aucune image.

## 9. Vérification

1. `npx astro check` et `npm run build` sans erreur.
2. Contrôles dans Chrome headless sur le build (`npm run preview`) :
   - aucun défilement horizontal aux six largeurs ;
   - aucun texte dont la dernière ligne ne porte qu'un ou deux mots
     (390 et 1440 px) ;
   - tous les liens internes répondent 200 ;
   - terrains dépliables, ancres de Méthode et des mentions, formulaire
     (saisie, bascule, état d'envoi).
3. Captures des pages à 1440 et 390 px pour validation.

## 10. Hors périmètre

À fournir par Moamind Solutions : clé Web3Forms, lien de prise de
rendez-vous, informations légales réelles.
