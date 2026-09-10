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
