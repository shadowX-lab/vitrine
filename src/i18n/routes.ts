/** Les langues du site, leur domaine, et l'adresse de chaque page à la racine de ce domaine. */

export type Langue = 'fr' | 'en';
export const LANGUES: readonly Langue[] = ['fr', 'en'];

/** Toujours écrits dans leur propre langue, quelle que soit la page. */
export const NOMS_LANGUES: Record<Langue, string> = { fr: 'Français', en: 'English' };

export const autre = (langue: Langue): Langue => (langue === 'fr' ? 'en' : 'fr');

/** Chaque langue a son domaine : le français à la racine de public_html, l'anglais dans public_html/en. */
export const DOMAINES: Record<Langue, string> = { fr: 'https://moamind-solutions.fr', en: 'https://moamind-solutions.com' };

export type Page = 'accueil' | 'methode' | 'realisations' | 'etude' | 'experience' | 'contact' | 'merci' | 'mentions';

export const ROUTES: Record<Page, Record<Langue, string>> = {
  accueil: { fr: '/', en: '/' },
  methode: { fr: '/methode', en: '/method' },
  realisations: { fr: '/realisations', en: '/work' },
  etude: { fr: '/realisations/:slug', en: '/work/:slug' },
  experience: { fr: '/experience', en: '/experience' },
  contact: { fr: '/contact', en: '/contact' },
  merci: { fr: '/merci', en: '/thank-you' },
  mentions: { fr: '/mentions-legales', en: '/legal-notice' },
};

export function chemin(page: Page, langue: Langue, slug?: string): string {
  const modele = ROUTES[page][langue];
  if (!modele.includes(':slug')) return modele;
  if (!slug) throw new Error(`Un slug est requis pour la page « ${page} »`);
  return modele.replace(':slug', slug);
}
