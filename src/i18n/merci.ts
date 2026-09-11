import type { Langue } from './routes';
import type { Titre } from './types';

const fr = {
  meta: { titre: 'Message reçu', description: 'Votre message est bien arrivé.' },
  etiquette: 'Message reçu',
  titre: { gras: "C'est noté.", leger: 'Votre projet sera lu avec attention.' } as Titre,
  sous: 'Vous aurez une réponse sous deux jours ouvrés. Une vraie réponse, écrite après lecture de votre message, pas un accusé de réception.',
  accuse: {
    titre: 'Votre projet est bien arrivé',
    sous: 'Et maintenant :',
    suite: ['Votre message est lu en entier.', 'Une réponse vous parvient sous deux jours ouvrés.', "Un entretien d'une heure est fixé ensemble."],
  },
};

const en: typeof fr = {
  meta: { titre: 'Message received', description: 'Your message has arrived.' },
  etiquette: 'Message received',
  titre: { gras: 'Got it.', leger: 'Your project will be read carefully.' },
  sous: 'You will get a reply within two business days. A real reply, written after reading your message, not an automatic acknowledgment.',
  accuse: {
    titre: 'Your project has arrived',
    sous: 'What happens next:',
    suite: ['Your message is read in full.', 'You get a reply within two business days.', 'We set up a one-hour call together.'],
  },
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
