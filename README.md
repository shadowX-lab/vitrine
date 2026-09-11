# Moamind Solutions — site vitrine

Site vitrine du studio **Moamind Solutions**. *Le produit avant le code.*

Astro 5, statique, sans framework côté client. Publié automatiquement sur
GitHub Pages à chaque `push` sur `main`.

## Démarrer

```bash
npm install
npm run dev       # http://localhost:4321/
npm run build     # génère dist/
npm test          # typographie, anonymisation, données des réalisations
npm run verifier  # contrôles dans Chrome (lancer `npm run preview` avant)
```

`npm run verifier` parcourt les onze pages à 320, 375, 390, 768, 1024 et
1440 px : aucun défilement horizontal, aucun mot isolé en fin de ligne, liens
internes valides, et les interactions (menu mobile, terrains dépliables,
formulaire, ancres). Il s'arrête en erreur au moindre échec.

## À remplir avant la mise en ligne

Tout est regroupé dans [`src/config.ts`](src/config.ts) :

| Constante | Ce qu'il faut y mettre |
|---|---|
| `CLE_FORMULAIRE` | Votre clé d'accès [Web3Forms](https://web3forms.com) — gratuite, aucun compte serveur. Sans elle, la page Contact affiche un avertissement et le formulaire n'envoie rien. |
| `LIEN_RDV` | Votre URL Cal.com ou Calendly. Laissée vide, le bouton « Réserver 30 minutes » n'apparaît nulle part. |

Les informations légales (raison sociale, SIREN, directeur de la publication)
sont à compléter dans [`src/pages/mentions-legales.astro`](src/pages/mentions-legales.astro).

## Les écrans des produits

Les captures de Pil'Poil, ChargeAir et Teamago ne sont pas dessinées à la main :
elles sont **rendues depuis les maquettes d'origine** des trois projets.

```bash
npm run ecrans            # les trois projets
npm run ecrans -- teamago # un seul projet
```

[`scripts/render-ecrans.mjs`](scripts/render-ecrans.mjs) lit le `canvas.json` de
chaque projet voisin (`../PilPoil`, `../ChargeAir`, `../Teamago`), reconstruit
chaque artboard `.dc.html` en document autonome, et le photographie en 390 × 844
à deux fois la densité avec Chrome en mode headless. Les PNG atterrissent dans
`src/assets/ecrans/` et `astro:assets` les sert ensuite en WebP responsive.

Modifiez une maquette dans le projet d'origine, relancez la commande : le site
est à jour. Les trois dossiers projet doivent être présents à côté de celui-ci.

Le rendu impose le thème clair, quelle que soit l'apparence du Mac. Les écrans
Teamago reprennent un vrai fichier de club : au rendu,
[`scripts/anonymiser.mjs`](scripts/anonymiser.mjs) remplace les personnes et le
club par des équivalents fictifs. Les maquettes d'origine ne sont pas modifiées.

## Structure

```
context/CONTEXT-MOAMIND.md  Source unique du contenu — positionnement, méthode,
                            fiche de chaque produit. À lire en premier.
src/config.ts               Réglages du site (clés, liens, helper de base URL)
src/data/produits.ts        Contenu des trois réalisations (données pures, testées)
src/lib/ecrans.ts           Résolution des écrans rendus
src/lib/typo.ts             Typographie française (mots liés, espaces insécables)
src/middleware.ts           Applique la typographie à chaque page rendue
src/styles/global.css       Jetons « Braise », socle, utilitaires
src/layouts/                Gabarit de page
src/components/             Bandeau en biais, iPhone 3D, chiffres, appel final,
                            en-tête (menu mobile), pied de page
src/pages/                  Une page par fichier ; realisations/[slug].astro
                            génère une étude de cas par produit
scripts/render-ecrans.mjs   Rendu des maquettes en images
scripts/anonymiser.mjs      Personnes et club fictifs sur les écrans Teamago
scripts/verifier-site.mjs   Contrôles du site construit dans Chrome
tests/                      Tests `node:test`
docs/superpowers/           Spec et plan de la refonte Braise
```

## Domaine

Le site est publié sur **https://moamind-solutions.com**, à la racine
(`site` dans `astro.config.mjs`, sans `base`). Le domaine est déclaré dans les
réglages GitHub Pages du dépôt : avec un déploiement GitHub Actions, un fichier
`public/CNAME` serait ignoré. Pour changer de domaine : modifier `site`, puis le
domaine personnalisé dans les réglages Pages et les enregistrements DNS.
