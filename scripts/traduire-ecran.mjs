/**
 * Version anglaise des écrans, au rendu seulement : les maquettes d'origine ne changent pas.
 * Chaque nœud de texte (hors styles et scripts) et chaque placeholder dont le contenu, sans ses
 * espaces de bord, figure dans le dictionnaire du projet est remplacé ; les autres sont signalés.
 */
const BLOCS_IGNORES = /(<(?:style|script)\b[^>]*>[\s\S]*?<\/(?:style|script)>)/i;
const ATTRIBUTS = /\b(placeholder|value|aria-label)="([^"]*)"/g;
const LETTRE = /[A-Za-zÀ-ÿ]/;

/** Applique `remplacer` à chaque texte visible (et `nombre` aux nombres seuls) ; renvoie le HTML transformé. */
function parcourir(html, remplacer, nombre = (texte) => texte) {
  // split() sur un groupe capturant intercale les blocs ignorés : ils occupent les rangs impairs.
  return html.split(BLOCS_IGNORES).map((bloc, i) => {
    if (i % 2 === 1) return bloc;
    return bloc.split(/(<[^>]+>)/).map((jeton) => {
      if (!jeton.startsWith('<')) {
        const cle = jeton.trim();
        // Les entités (&euro;, &nbsp;…) ne comptent pas comme des lettres : « 12,40 &euro; » est un nombre.
        if (LETTRE.test(cle.replace(/&[a-z0-9#]+;/gi, ''))) return jeton.replace(cle, remplacer(cle));
        return /\d/.test(cle) ? jeton.replace(cle, nombre(cle)) : jeton;
      }
      return jeton.replace(ATTRIBUTS, (tout, nom, valeur) => (LETTRE.test(valeur) ? `${nom}="${remplacer(valeur)}"` : tout));
    }).join('');
  }).join('');
}

/**
 * Un nombre seul (sans lettre) à l'anglaise : « 1 234,50 € » → « €1,234.50 », « 12,6 » → « 12.6 ».
 * Les textes avec des lettres passent par le dictionnaire, qui fixe lui-même leur format.
 */
export function nombreAnglais(texte) {
  const espace = texte.replace(/&nbsp;|&#8239;|[  ]/g, ' ');
  const montant = espace.match(/^(-|−|&minus;)? ?([\d ]+?)(?:,(\d+))? ?(?:€|&euro;)$/);
  if (!montant) return texte.replace(/(\d),(\d)/g, '$1.$2');
  const [, signe = '', entier, decimales] = montant;
  const milliers = entier.replace(/ /g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${signe}&euro;${milliers}${decimales ? `.${decimales}` : ''}`;
}

/** Textes visibles d'un écran, dans l'ordre, sans doublons. */
export function textes(html) {
  const vus = new Set();
  parcourir(html, (texte) => { vus.add(texte); return texte; });
  return [...vus];
}

/**
 * Traduit un écran ; `manquants` liste les textes absents du dictionnaire. Une valeur peut être une
 * liste, appliquée dans l'ordre d'apparition puis en boucle : les jours « L M M J V S D » ont deux
 * « M » qui deviennent « T » puis « W ».
 */
export function traduire(html, dictionnaire) {
  const manquants = new Set();
  const rangs = new Map();
  const sortie = parcourir(html, (texte) => {
    if (Object.hasOwn(dictionnaire, texte)) {
      const valeur = dictionnaire[texte];
      if (!Array.isArray(valeur)) return valeur;
      const rang = rangs.get(texte) ?? 0;
      rangs.set(texte, rang + 1);
      return valeur[rang % valeur.length];
    }
    manquants.add(texte);
    return texte;
  }, nombreAnglais);
  return { html: sortie, manquants: [...manquants] };
}
