/**
 * Retouches propres au site, appliquées au rendu seulement : les maquettes d'origine ne changent pas.
 * Chaque retouche échoue bruyamment si la maquette a changé, plutôt que de laisser passer l'ancien écran.
 */
const REPERE = / *<div class="pp-pin" style="([^"]*)">[\s\S]*?<\/svg><\/div>\n?/g;

function remplacer(html, avant, apres) {
  if (!html.includes(avant)) throw new Error(`Retouche impossible : « ${avant} » introuvable`);
  return html.replace(avant, apres);
}

export const RETOUCHES = {
  // L'accueil et la 404 annoncent un seul chien trouvé : la carte ne garde que le repère sous la Seine.
  'pilpoil/Carte': (html) => {
    let garde = 0;
    const sortie = remplacer(html, '6 chiens trouvés', '1 chien trouvé').replace(REPERE, (repere, style) => {
      if (!style.includes('top: 372px')) return '';
      garde++;
      return repere;
    });
    if (garde !== 1) throw new Error(`Retouche impossible : ${garde} repère(s) conservé(s) au lieu d'un`);
    return sortie;
  },
};

export function retoucher(projet, nom, html) {
  const retouche = RETOUCHES[`${projet}/${nom}`];
  return retouche ? retouche(html) : html;
}

/**
 * Variantes : un artboard rendu une seconde fois, sous un autre nom, avec une retouche de plus.
 * Clé : `projet/variante` ; `source` est l'artboard de départ, déjà retouché par RETOUCHES.
 */
export const VARIANTES = {
  // L'accueil ne montre aucun nom d'application : son écran Pil'Poil garde le logo, pas le nom.
  // Les 62 px réservés en haut à la barre d'état doublent celle du téléphone 3D : il en reste 14.
  // La pastille de l'accueil annonce « 1 chien trouvé à moins de 5 km » : le second chien passe au-delà.
  'pilpoil/MainSansNom': {
    source: 'Main',
    retouche: (html) => [
      [`<div style="font-size: 18px; font-weight: 800; letter-spacing: -0.01em;">Pil'Poil</div>`, ''],
      ['padding: 62px 22px 0 22px;', 'padding: 14px 22px 0 22px;'],
      ['>à 897 m · il y a 1 h<', '>à 6,3 km · il y a 1 h<'],
    ].reduce((sortie, [avant, apres]) => remplacer(sortie, avant, apres), html),
  },
};

/** Variantes d'un artboard : `[{ nom, retouche }]`, vide s'il n'en a pas. */
export function variantes(projet, source) {
  return Object.entries(VARIANTES)
    .filter(([cle, v]) => cle.startsWith(`${projet}/`) && v.source === source)
    .map(([cle, v]) => ({ nom: cle.slice(projet.length + 1), retouche: v.retouche }));
}
