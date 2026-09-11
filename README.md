# Moamind Solutions — site vitrine

Site vitrine du studio **Moamind Solutions**. *Le produit avant le code.*

Astro 5, statique, sans framework côté client. Publié automatiquement chez
o2switch à chaque `push` sur `main` : le français sur https://moamind-solutions.fr,
l'anglais sur https://moamind-solutions.com.

## Démarrer

```bash
npm install
npm run dev       # http://localhost:4321/ (français) et /en/ (anglais)
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

## Hébergement et mise en ligne

Deux domaines chez **o2switch**, déclarés dans `src/i18n/routes.ts` (`DOMAINES`) :

| Domaine | Langue | Racine cPanel | Dossier de `dist/` |
|---|---|---|---|
| https://moamind-solutions.fr | français | `public_html` | `dist/` |
| https://moamind-solutions.com | anglais | `public_html/en` | `dist/en/` |

Les pages anglaises sont construites dans `dist/en/` avec des liens à la racine
(`/method`, `/work`…). Après `astro build`, `scripts/preparer-domaines.mjs` y
copie les ressources (`_astro/`, favicon, image de partage), place la 404 anglaise,
écrit le plan du site anglais, les deux `robots.txt` et les deux `.htaccess`
(générés depuis la table des routes par `scripts/htaccess.mjs`). En développement,
un seul serveur sert les deux langues : l'anglais y est sous `/en/`.

Chaque `.htaccess` impose `https` sans `www`, sert la 404 de sa langue, renvoie
`moamind-solutions.fr/en/…` vers le domaine anglais, et gère la langue :

- **Choix explicite** : le sélecteur (mappemonde, pied de page) mène à la page
  équivalente de l'autre domaine avec `?langue=xx`, qui pose un cookie d'un an sur
  ce domaine ; la détection ne s'y applique plus.
- **Détection** : sans ce cookie, un navigateur qui n'est pas en français arrivant
  sur le `.fr` part sur la page équivalente du `.com`, et un navigateur en français
  arrivant sur le `.com` part sur le `.fr`. Les robots ne sont jamais redirigés.

À chaque `push` sur `main`, `.github/workflows/deploy.yml` construit le site et
envoie `dist/` dans `public_html` par FTPS : seuls les fichiers modifiés partent,
et ceux qu'une publication précédente avait envoyés puis qui ont disparu sont
supprimés. Le reste de `public_html` (par exemple `cgi-bin/`) n'est jamais touché.

Le workflow lit trois secrets du dépôt (Settings → Secrets and variables →
Actions) :

| Secret | Valeur |
|---|---|
| `FTP_SERVEUR` | nom du serveur o2switch indiqué dans cPanel (ex. `xxxx.o2switch.net`) |
| `FTP_UTILISATEUR` | identifiant cPanel ou d'un compte FTP dédié |
| `FTP_MOT_DE_PASSE` | son mot de passe |

Le dossier de destination vaut `public_html/`, valable pour l'identifiant
cPanel. Pour un compte FTP dédié dont la racine est déjà `public_html`, créer la
variable de dépôt `FTP_DOSSIER` avec la valeur `./`.
