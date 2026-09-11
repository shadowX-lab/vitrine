import type { Langue } from './routes';

const fr = {
  meta: { titre: 'Page introuvable', description: "Cette page n'existe pas." },
  titre: "Cette page n'existe pas",
  sous: "Un lien cassé, une adresse mal recopiée, ou une page qu'on a retirée. Dans les trois cas, ce n'est pas votre faute.",
  carte: { titre: 'Aucun résultat ici', sous: "Essayez plutôt l'accueil" },
};

const en: typeof fr = {
  meta: { titre: 'Page not found', description: "This page doesn't exist." },
  titre: "This page doesn't exist",
  sous: "A broken link, a mistyped address, or a page that was taken down. In all three cases, it's not your fault.",
  carte: { titre: 'No results here', sous: 'Try the home page instead' },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
