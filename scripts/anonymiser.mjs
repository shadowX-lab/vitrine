/**
 * Les maquettes Teamago reprennent un vrai fichier de club : on remplace, au rendu
 * seulement, les personnes et le club par des équivalents fictifs.
 * Ordre de l'application : nom puis prénom.
 */
export const PERSONNES = [
  ['Pont', 'Alexis', 'Petit', 'Lucas'],
  ['Barbion', 'William', 'Bernard', 'Nathan'],
  ['Chambre', 'Samuel', 'Moreau', 'Théo'],
  ['Chambre', 'Véronique', 'Moreau', 'Claire'],
  ['Roque', 'Olivier', 'Girard', 'Enzo'],
  ['Defer', 'Xavier', 'Martin', 'Julien'],
  ['Barret', 'Hugo', 'Fontaine', 'Louis'],
  ['Michaely', 'Gabriel', 'Rousseau', 'Adam'],
  ['Lachartre', 'Aymeric', 'Garnier', 'Paul'],
];
export const CLUB = ['Les Cabots', 'Les Hérons'];

export function anonymiser(html) {
  let sortie = html.replaceAll(CLUB[0], CLUB[1]);
  for (const [nom, prenom, nouveauNom, nouveauPrenom] of PERSONNES) {
    sortie = sortie
      .replaceAll(`${nom} ${prenom}`, `${nouveauNom} ${nouveauPrenom}`)
      .replaceAll(`>${nom[0]}${prenom[0]}<`, `>${nouveauNom[0]}${nouveauPrenom[0]}<`)
      .replaceAll(`${prenom.toLowerCase()}.${nom.toLowerCase()}@`, `${nouveauPrenom.toLowerCase()}.${nouveauNom.toLowerCase()}@`)
      .replace(new RegExp(`\\b${prenom}\\b`, 'g'), nouveauPrenom);
  }
  return sortie;
}
