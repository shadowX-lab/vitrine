# Site bilingue français / anglais

> Spec validée section par section le 11 septembre 2026. Hors périmètre : les
> images (écrans des applications, image de partage), traitées dans un second
> temps.

## 1. Objectif

Proposer tout le site en anglais, en plus du français, sans dupliquer la mise en
page. Le visiteur choisit sa langue avec une mappemonde en haut à droite de
l'en-tête, ou avec un lien en pied de page. Le français reste la langue par
défaut et ses adresses ne changent pas.

## 2. Adresses

Une table unique, `src/i18n/routes.ts`, associe chaque page à son adresse dans
chaque langue. Toutes les adresses sont préfixées par la base `/vitrine`.

| Identifiant | Français | English |
|---|---|---|
| `accueil` | `/` | `/en/` |
| `methode` | `/methode` | `/en/method` |
| `realisations` | `/realisations` | `/en/work` |
| `etude` (par slug) | `/realisations/<slug>` | `/en/work/<slug>` |
| `experience` | `/experience` | `/en/experience` |
| `contact` | `/contact` | `/en/contact` |
| `merci` | `/merci` | `/en/thank-you` |
| `mentions` | `/mentions-legales` | `/en/legal-notice` |

- Le type `Langue` vaut `'fr' | 'en'`.
- `lien(page, langue, slug?)` remplace l'actuel `lien('/chemin')` et renvoie
  l'adresse complète, base comprise. Les ressources statiques (`/favicon.svg`,
  `/og.png`) passent par une fonction distincte, sans notion de langue.
- Chaque page déclare son identifiant (et son slug pour une étude de cas) :
  c'est ce qui donne son équivalent dans l'autre langue.
- Aucune redirection automatique selon la langue du navigateur.

## 3. Sélecteur de langue

### En-tête

- Icône mappemonde en SVG, ajoutée à `Icone.astro` (`globe`), placée entre la
  navigation principale et le bouton « Décrire mon projet ».
- Un `<details>` ouvre un petit menu, sur le modèle du menu mobile existant,
  sans JavaScript : « Français » et « English », chacun menant à la même page
  dans l'autre langue. La langue active porte une coche et `aria-current="true"`.
- Les noms de langue sont toujours écrits dans leur propre langue, avec
  `lang` et `hreflang` sur chaque lien.
- Nom accessible du bouton : « Choisir la langue » / « Choose language ».
- Sous 760 px, la mappemonde reste visible, à gauche du bouton du menu mobile.

### Pied de page

Dans la dernière ligne, à côté du lien vers les mentions légales :
« Français · English », la langue active marquée par `aria-current="true"`.

### Page 404

GitHub Pages sert un seul `404.html`. La page contient les deux versions : le
français est visible par défaut, l'anglais porte `hidden`. Un script en ligne
de quelques lignes bascule vers l'anglais si le chemin demandé commence par
`/vitrine/en/` (il met aussi à jour `lang` et `<title>`). Sans JavaScript, le
français s'affiche.

## 4. Organisation du code

### Trois couches

- `src/vues/` : une vue par page (`Accueil`, `Methode`, `Realisations`,
  `Etude`, `Experience`, `Contact`, `Merci`, `MentionsLegales`, `Introuvable`).
  Chaque vue reprend le balisage et le style de la page actuelle et reçoit sa
  langue ; elle ne contient aucun texte en dur.
- `src/i18n/` : les textes. Un fichier par page, plus `commun.ts` (navigation,
  pied de page, appel final, sélecteur, lien d'évitement « Aller au contenu »).
  Chaque fichier exporte `{ fr, en }`, typé de sorte que la version anglaise
  doive avoir exactement les clés de la française.
- `src/pages/` et `src/pages/en/` : des routes minces qui choisissent la vue,
  la langue et l'identifiant de page. `404.astro` reste à la racine.

### Forme des textes

- **Titres** en `{ gras, leger }` ; la vue pose le `<br />` et
  `<span class="leger">`. Les coupures manuelles du titre Contact en français
  (groupes affichés en bloc sous 700 px) restent portées par la vue, via un
  découpage optionnel en groupes.
- **Paragraphes avec emphase** (`<strong>`, `<br />`, `&nbsp;`) : chaînes HTML
  insérées avec `set:html`. Ce HTML ne provient que des fichiers du dépôt.
- **Réalisations** (`src/data/produits.ts`) : slug, nom, palette, écrans, dépôt
  et enchaînement restent partagés ; tous les textes passent dans
  `textes: { fr, en }`. `eventail` et `rangee` ne changent pas.
- **Formulaire** : libellés, choix proposés, objet de l'e-mail et page de retour
  (`/merci` ou `/en/thank-you`) suivent la langue de la page. Un champ caché
  `langue` indique au destinataire la langue du visiteur.

## 5. Typographie et référencement

### Typographie automatique

`typographierHtml(html, langue)` :

- **Toutes langues** : liaison des derniers mots (paragraphes, `h3`) et
  resserrement de la virgule et du point dans les `h1` et `h2`.
- **Français seulement** : espaces insécables avant « : ; ! ? » et dans les
  guillemets « ».

Le middleware lit la langue dans l'attribut `lang` de `<html>`. Des tests
unitaires couvrent le cas anglais (« Ready? » reste collé, les derniers mots
restent liés).

### Métadonnées (`Base.astro`)

- `<html lang>` selon la langue.
- `<link rel="alternate" hreflang="fr|en|x-default">` vers les deux versions ;
  `x-default` pointe vers le français.
- `og:locale` `fr_FR` ou `en_US`, et `og:locale:alternate` pour l'autre.
- `canonical`, titre et description propres à chaque langue.
- Le sitemap liste les pages des deux langues ; l'association entre versions
  passe par les `hreflang` de chaque page.
- `og.png` et les écrans des applications restent inchangés (texte français
  dans les iPhone) jusqu'au chantier images.

## 6. Traduction

### Principes

Adaptation, pas mot à mot, en anglais américain, en gardant le ton : direct,
phrases courtes, aucun jargon d'agence. Les noms Moamind Solutions, Pil'Poil,
ChargeAir et Teamago ne sont pas traduits et gardent `translate="no"`.

### Voix

- « we » uniquement quand la phrase montre que ce sont le client et Xavier
  ensemble (« we review the screens together ») ; ailleurs, « you » ou une
  tournure sans sujet.
- « I » là où le français dit « je », sur les mêmes pages : Méthode,
  Expérience, mentions légales, 404.
- Jamais « we » pour désigner le studio ; rien n'indique combien de personnes
  y travaillent.
- Accueil, Réalisations, études de cas, Contact et Message reçu : aucune
  première personne du studio, comme en français. Seule exception, le visiteur
  qui parle de son projet (« Describe my project »).

### Lexique

| Français | English |
|---|---|
| Méthode · Réalisations · Expérience · Contact | Method · Work · Experience · Contact |
| Décrire mon projet | Describe my project |
| Voir les réalisations | See the work |
| Note de cadrage | Scoping note |
| Tranche | Slice |
| Maîtrise d'ouvrage (MOA) | *maîtrise d'ouvrage* : « the client side of a project — that's you » |
| Étude de cas | Case study |
| Message reçu · Mentions légales | Message received · Legal notice |
| Réponse sous deux jours ouvrés | Reply within two business days |

Sur Expérience, les cartes MOA / Mind / Solutions expliquent que MOA est
l'abréviation française de *maîtrise d'ouvrage*.

### Titres principaux

| Page | Français | English |
|---|---|---|
| Accueil | **Le produit** / avant le code. | **Product** / before code. |
| Méthode | **Comprendre d'abord** / construire ensuite. | **Understand first** / build second. |
| Réalisations | **Du besoin** / à l'application. | **From need** / to app. |
| Expérience | **Du code au produit** / le secret de la réussite. | **From code to product** / the secret to success. |
| Contact | **Quelques phrases suffisent** / pour lancer la discussion. | **A few sentences** / are all it takes to start. |

Les titres anglais n'ont pas besoin des coupures manuelles du titre Contact
français ; la taille qui suit la colonne (`cqi`) reste en place, avec des
coefficients recalés si la plus longue ligne anglaise est plus large.

### Mentions légales

Traduites intégralement. Une ligne en tête de la version anglaise précise
qu'en cas de divergence, la version française fait foi.

### Contexte

`context/CONTEXT-MOAMIND.md` reçoit une section « Version anglaise » : règles
de voix, lexique, adresses.

## 7. Vérification

- `npm test` :
  - chaque identifiant de la table a une adresse dans les deux langues ;
  - la typographie anglaise n'ajoute aucune espace avant la ponctuation ;
  - les textes anglais des réalisations ne contiennent ni « I », ni « my »,
    ni « we », ni « in-house » (équivalent du test français existant).
- `npm run verifier` parcourt les onze pages françaises et les dix pages
  anglaises (la 404 est commune) de 320 à 1440 px : débordements, mots isolés,
  liens internes, interactions, et le sélecteur de langue (depuis chaque page,
  le lien de l'autre langue mène à son équivalent).
- Le build échoue si une clé de texte manque dans une langue (typage).
