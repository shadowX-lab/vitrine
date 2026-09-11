/**
 * Les deux .htaccess du site, générés depuis la table des routes : moamind-solutions.fr sert
 * public_html (français), moamind-solutions.com sert public_html/en (anglais).
 */
import { ROUTES, DOMAINES, autre } from '../src/i18n/routes.ts';

/** Redirections des pages de `de` vers leur équivalent sur le domaine de `vers`. */
export function correspondances(de, vers) {
  return Object.values(ROUTES).map((route) => {
    const source = route[de].replace(/^\//, '').replace(':slug', '([^/]+)');
    const motif = source ? `^${source}/?$` : '^$';
    return `  RewriteRule ${motif} ${DOMAINES[vers]}${route[vers].replace(':slug', '$1')} [R=302,L]`;
  });
}

export function htaccess(langue) {
  const domaine = DOMAINES[langue];
  const hote = new URL(domaine).host;
  const cible = autre(langue);
  const regles = correspondances(langue, cible);
  // Condition qui dispense de la détection : un navigateur déjà dans la langue du domaine.
  const bonneLangue = langue === 'fr' ? 'RewriteCond %{HTTP:Accept-Language} ^fr [NC]' : 'RewriteCond %{HTTP:Accept-Language} !^fr [NC]';

  return `# Généré par scripts/preparer-domaines.mjs à chaque build : ne pas modifier à la main.
# ${domaine}, racine public_html${langue === 'en' ? '/en' : ''}.
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # La validation des certificats (AutoSSL) lit /.well-known/ : jamais de redirection.
  RewriteRule ^\\.well-known/ - [L]

  # Une seule adresse : https://${hote}, sans www. Le frontal d'o2switch termine parfois le
  # TLS lui-même : sans le test de X-Forwarded-Proto, boucle de redirection.
  RewriteCond %{HTTP_HOST} ^www\\. [NC]
  RewriteRule ^ ${domaine}%{REQUEST_URI} [R=301,L]
  RewriteCond %{HTTPS} off
  RewriteCond %{HTTP:X-Forwarded-Proto} !https
  RewriteRule ^ ${domaine}%{REQUEST_URI} [R=301,L]
${langue === 'fr' ? `
  # Le dossier en/ est la racine du domaine anglais.
  RewriteRule ^en(/.*)?$ ${DOMAINES.en}$1 [R=301,L]
` : ''}
  # Choix fait avec le sélecteur de langue : ?langue=${langue} l'enregistre un an, puis l'adresse est nettoyée.
  RewriteCond %{QUERY_STRING} (^|&)langue=${langue}(&|$)
  RewriteRule ^ %{REQUEST_URI}? [CO=langue:${langue}:${hote}:525600:/:1:1,R=302,L]

  # Détection : sans choix enregistré, un navigateur ${langue === 'fr' ? "qui n'est pas en français" : 'en français'} part sur
  # ${DOMAINES[cible]}, à la page équivalente. Jamais les robots, sans quoi une langue ne serait pas indexée.
  RewriteCond %{HTTP_COOKIE} (^|;\\s*)langue= [OR]
  RewriteCond %{HTTP_USER_AGENT} (bot|crawl|spider|slurp|preview|facebookexternalhit|lighthouse|headless) [NC,OR]
  RewriteCond %{REQUEST_METHOD} !^GET$ [OR]
  RewriteCond %{HTTP:Accept-Language} ^$ [OR]
  ${bonneLangue}
  RewriteRule ^ - [S=${regles.length}]
${regles.join('\n')}
</IfModule>

<IfModule mod_headers.c>
  # Les fichiers de /_astro/ portent l'empreinte de leur contenu : ils ne changent jamais.
  <If "%{REQUEST_URI} =~ m#^/_astro/#">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </If>
  # Les pages sont revalidées à chaque visite : une mise en ligne se voit tout de suite.
  <FilesMatch "\\.html$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
</IfModule>
`;
}
