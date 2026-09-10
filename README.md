# Moamind Solutions — site vitrine

Site vitrine du studio **Moamind Solutions**. *Le produit avant le code.*

Astro 5, statique, sans framework côté client. Publié automatiquement sur
GitHub Pages à chaque `push` sur `main`.

## Démarrer

```bash
npm install
npm run dev      # http://localhost:4321/vitrine/
npm run build    # génère dist/
```

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
npm run ecrans
```

[`scripts/render-ecrans.mjs`](scripts/render-ecrans.mjs) lit le `canvas.json` de
chaque projet voisin (`../PilPoil`, `../ChargeAir`, `../Teamago`), reconstruit
chaque artboard `.dc.html` en document autonome, et le photographie en 390 × 844
à deux fois la densité avec Chrome en mode headless. Les PNG atterrissent dans
`src/assets/ecrans/` et `astro:assets` les sert ensuite en WebP responsive.

Modifiez une maquette dans le projet d'origine, relancez la commande : le site
est à jour. Les trois dossiers projet doivent être présents à côté de celui-ci.

## Structure

```
context/CONTEXT-MOAMIND.md  Source unique du contenu — positionnement, méthode,
                            fiche de chaque produit. À lire en premier.
src/config.ts               Réglages du site (clés, liens, helper de base URL)
src/data/produits.ts        Contenu des trois études de cas
src/styles/global.css       Jetons de design, liseré, bandes d’écran
src/layouts/                Gabarit de page
src/components/             En-tête, pied de page, téléphone, appel à l'action
src/pages/                  Une page par fichier ; realisations/[slug].astro
                            génère une étude de cas par produit
scripts/render-ecrans.mjs   Rendu des maquettes en images
```

## Changer de domaine

Le site est publié sous `/vitrine`. Pour un domaine propre, dans
`astro.config.mjs` : passer `base` à `'/'` et `site` au domaine, puis ajouter un
fichier `public/CNAME` contenant ce domaine.
