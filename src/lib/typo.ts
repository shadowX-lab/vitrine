/**
 * Typographie française appliquée au HTML rendu (voir src/middleware.ts).
 * 1. Les trois derniers vrais mots d'un bloc de texte d'au moins six mots restent ensemble, les deux
 *    derniers d'un h3 d'au moins trois mots. Les h1 et h2 s'en remettent à `text-wrap: balance` : en
 *    grand corps, des mots liés dépasseraient la largeur d'un téléphone.
 * 2. Espaces insécables autour de « », avant : ; fine insécable avant ; ! ?
 * 3. Dans les h1 et h2, virgule et point sont resserrés contre la lettre.
 */
export const NBSP = '\u00a0';
export const FINE = '\u202f';

const MOTS_MIN = 6;
/** Une séparation entre deux mots : suite d'espaces, retours à la ligne, insécables ou `&nbsp;`. */
const SEPARATION = /(?:[ \t\n\r\u00a0\u202f]|&nbsp;)+/g;
/** Une séparation déjà insécable ne contient aucune espace ordinaire ni retour à la ligne. */
const DEJA_LIEE = /^(?:[\u00a0\u202f]|&nbsp;)+$/;

function compterMots(texte: string): number {
  return texte.replace(/&nbsp;/g, ' ').split(/[\s\u00a0\u202f]+/).filter(Boolean).length;
}

/** Un « vrai » mot contient une lettre ou un chiffre ; « », ». ou — n'en sont pas. */
const VRAI_MOT = /[\p{L}\d]/u;

/**
 * Garde ensemble les `mots` derniers vrais mots du texte réparti dans `morceaux` (les nœuds texte
 * d'un bloc, dans l'ordre) : chaque séparation qui les suit devient insécable, ponctuation isolée
 * comprise. Les espaces finales sont ignorées ; une séparation déjà insécable reste telle quelle,
 * ce qui rend l'opération idempotente.
 */
function lierMorceaux(morceaux: string[], mots = 3): string[] {
  const sortie = [...morceaux];
  let vus = 0;
  let suivant = '';
  let finAtteinte = false;
  for (let i = sortie.length - 1; i >= 0; i--) {
    let s = sortie[i]!;
    let limite = s.length;
    if (!finAtteinte) {
      limite = s.replace(/[\s  ]+$/, '').length;
      if (limite === 0) continue;
      finAtteinte = true;
    }
    const separations = [...s.slice(0, limite).matchAll(SEPARATION)];
    let fin = limite;
    for (let k = separations.length - 1; k >= 0; k--) {
      const sep = separations[k]!;
      const apres = s.slice(sep.index! + sep[0].length, fin) + suivant;
      suivant = '';
      if (VRAI_MOT.test(apres)) vus++;
      if (vus >= mots) { sortie[i] = s; return sortie; }
      if (!DEJA_LIEE.test(sep[0])) s = s.slice(0, sep.index) + NBSP + s.slice(sep.index! + sep[0].length);
      fin = sep.index!;
    }
    // Le début de ce nœud prolonge le mot qui commence dans le nœud suivant.
    suivant = s.slice(0, fin) + suivant;
    sortie[i] = s;
  }
  return sortie;
}

export function lierFin(texte: string): string {
  if (compterMots(texte) < MOTS_MIN) return texte;
  return lierMorceaux([texte])[0]!;
}

export function ponctuationFrancaise(texte: string): string {
  return texte
    .replace(/« /g, `«${NBSP}`)
    .replace(/ »/g, `${NBSP}»`)
    .replace(/ :/g, `${NBSP}:`)
    .replace(/ ([;!?])/g, `${FINE}$1`);
}

const IGNORES = new Set(['script', 'style', 'textarea', 'pre', 'code', 'svg']);
const BLOCS_LIES = new Set(['p', 'li', 'dd', 'small', 'figcaption', 'blockquote']);
/** Les petits titres gardent leurs deux derniers mots ensemble ; les grands titres s'en remettent à l'équilibrage. */
const TITRES_LIES = new Set(['h3']);
const BLOCS = new Set([...BLOCS_LIES, ...TITRES_LIES, 'h1', 'h2', 'div', 'ul', 'ol', 'section', 'article', 'details', 'summary', 'h4', 'h5', 'h6', 'table', 'form', 'fieldset', 'nav', 'header', 'footer', 'main']);
const VIDES = new Set(['br', 'img', 'input', 'meta', 'link', 'hr', 'source', 'wbr', 'area', 'base', 'col', 'embed', 'track']);
const TITRES_RESSERRES = new Set(['h1', 'h2']);

/** Caractères à usage privé : virgule et point de titre, remplacés par leur <span> en toute fin. */
const VIRGULE = '\ue000';
const POINT = '\ue001';

type Ouvert = { nom: string; debut: number; aUnBloc: boolean };

export function typographierHtml(html: string): string {
  const jetons = html.split(/(<[^>]+>)/);
  const pile: Ouvert[] = [];
  let ignore = 0;

  jetons.forEach((jeton, i) => {
    if (jeton.startsWith('<')) {
      const m = jeton.match(/^<\s*(\/)?\s*([a-zA-Z][a-zA-Z0-9-]*)/);
      if (!m) return;
      const fermeture = Boolean(m[1]);
      const nom = m[2]!.toLowerCase();
      const vide = VIDES.has(nom) || jeton.endsWith('/>');
      if (IGNORES.has(nom)) {
        if (!vide) ignore += fermeture ? -1 : 1;
        return;
      }
      if (vide || ignore > 0) return;
      if (!fermeture) {
        if (BLOCS.has(nom)) pile.forEach((o) => { o.aUnBloc = true; });
        pile.push({ nom, debut: i, aUnBloc: false });
        return;
      }
      for (let k = pile.length - 1; k >= 0; k--) {
        if (pile[k]!.nom !== nom) continue;
        const ouvert = pile.splice(k)[0]!;
        const lies = BLOCS_LIES.has(nom) ? { min: MOTS_MIN, mots: 3 } : TITRES_LIES.has(nom) ? { min: 3, mots: 2 } : null;
        if (lies && !ouvert.aUnBloc) {
          const indices: number[] = [];
          for (let t = ouvert.debut + 1; t < i; t++) if (!jetons[t]!.startsWith('<')) indices.push(t);
          if (compterMots(indices.map((t) => jetons[t]).join('')) >= lies.min) {
            const resultat = lierMorceaux(indices.map((t) => jetons[t]!), lies.mots);
            indices.forEach((t, n) => { jetons[t] = resultat[n]!; });
          }
        }
        break;
      }
      return;
    }
    if (ignore > 0 || !jeton) return;
    let texte = ponctuationFrancaise(jeton);
    if (pile.some((o) => TITRES_RESSERRES.has(o.nom))) {
      // Marques provisoires : la liaison des mots, faite à la fermeture du bloc, ne doit pas voir de balises.
      texte = texte.replace(/(?<=[\p{L}\d])([.,])(?!\d)/gu, (signe) => (signe === ',' ? VIRGULE : POINT));
    }
    jetons[i] = texte;
  });
  return jetons.join('')
    .replaceAll(VIRGULE, '<span class="ponct">,</span>')
    .replaceAll(POINT, '<span class="ponct">.</span>');
}
