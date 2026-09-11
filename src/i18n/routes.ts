/** Les langues du site et l'adresse de chaque page dans chacune (sans la base du site). */

export type Langue = 'fr' | 'en';
export const LANGUES: readonly Langue[] = ['fr', 'en'];

/** Toujours écrits dans leur propre langue, quelle que soit la page. */
export const NOMS_LANGUES: Record<Langue, string> = { fr: 'Français', en: 'English' };

export const autre = (langue: Langue): Langue => (langue === 'fr' ? 'en' : 'fr');

export type Page = 'accueil' | 'methode' | 'realisations' | 'etude' | 'experience' | 'contact' | 'merci' | 'mentions';

export const ROUTES: Record<Page, Record<Langue, string>> = {
  accueil: { fr: '/', en: '/en/' },
  methode: { fr: '/methode', en: '/en/method' },
  realisations: { fr: '/realisations', en: '/en/work' },
  etude: { fr: '/realisations/:slug', en: '/en/work/:slug' },
  experience: { fr: '/experience', en: '/en/experience' },
  contact: { fr: '/contact', en: '/en/contact' },
  merci: { fr: '/merci', en: '/en/thank-you' },
  mentions: { fr: '/mentions-legales', en: '/en/legal-notice' },
};

export function chemin(page: Page, langue: Langue, slug?: string): string {
  const modele = ROUTES[page][langue];
  if (!modele.includes(':slug')) return modele;
  if (!slug) throw new Error(`Un slug est requis pour la page « ${page} »`);
  return modele.replace(':slug', slug);
}
