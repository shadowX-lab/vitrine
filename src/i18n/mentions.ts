import type { Langue } from './routes';

const fr = {
  meta: { titre: 'Mentions légales', description: 'Mentions légales et politique de confidentialité du site de Moamind Solutions.' },
  etiquette: 'Informations légales',
  titre: 'Mentions légales',
  rappel: "Ce site vient d'être mis en ligne : les informations ci-dessous sont à compléter avec les données réelles de la structure avant toute diffusion publique.",
  foi: 'Seule cette version française fait foi.',
  sommaireAria: 'Sommaire',
  blocs: [
    {
      id: 'editeur',
      court: 'Éditeur du site',
      titre: 'Éditeur du site',
      paragraphes: [
        `<span translate="no">Moamind Solutions</span> · raison sociale&nbsp;<em>à&nbsp;compléter</em><br />
          Forme juridique et capital social&nbsp;:&nbsp;<em>à&nbsp;compléter</em><br />
          Siège social&nbsp;:&nbsp;<em>à&nbsp;compléter</em><br />
          SIREN / SIRET&nbsp;:&nbsp;<em>à&nbsp;compléter</em><br />
          Numéro de TVA intracommunautaire&nbsp;:&nbsp;<em>à&nbsp;compléter</em><br />
          Directeur de la publication&nbsp;:&nbsp;<em>à&nbsp;compléter</em>`,
      ],
    },
    {
      id: 'contact',
      court: 'Me contacter',
      titre: 'Me contacter',
      paragraphes: ["Toute demande passe par le formulaire de la page Contact. Aucune adresse électronique n'est publiée sur ce site."],
    },
    {
      id: 'hebergement',
      court: 'Hébergement',
      titre: 'Hébergement',
      paragraphes: ['Le site est hébergé par GitHub Pages, GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, États-Unis.'],
    },
    {
      id: 'propriete',
      court: 'Propriété intellectuelle',
      titre: 'Propriété intellectuelle',
      paragraphes: [
        "L'ensemble des contenus de ce site, textes, maquettes, captures d'écran des applications présentées, identité visuelle et code, est la propriété de <span translate=\"no\">Moamind Solutions</span>, sauf mention contraire. Toute reproduction ou représentation, totale ou partielle, sans autorisation écrite préalable est interdite.",
      ],
    },
    {
      id: 'donnees',
      court: 'Données personnelles',
      titre: 'Données personnelles',
      paragraphes: [
        'Les informations transmises par le formulaire de contact (nom, organisation, adresse électronique, nature du projet, échéance, budget et message) servent exclusivement à répondre à votre demande. Elles ne sont ni revendues, ni cédées, ni utilisées à des fins de prospection par des tiers.',
        "L'acheminement des messages est assuré par Web3Forms. Les données sont conservées le temps nécessaire au traitement de la demande, et au maximum trois ans après le dernier échange.",
        "Conformément au règlement général sur la protection des données, vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation, d'opposition et de portabilité de vos données. Ces droits s'exercent par le formulaire de contact. Vous pouvez également introduire une réclamation auprès de la CNIL.",
      ],
    },
    {
      id: 'cookies',
      court: 'Cookies',
      titre: "Cookies et mesure d'audience",
      paragraphes: ["Ce site ne dépose aucun cookie et n'utilise aucun outil de mesure d'audience ni de traçage publicitaire. Aucune bannière de consentement n'est donc nécessaire."],
    },
  ],
};

const en: typeof fr = {
  meta: { titre: 'Legal notice', description: "Legal notice and privacy policy for the Moamind Solutions website." },
  etiquette: 'Legal information',
  titre: 'Legal notice',
  rappel: 'This site has just gone live: the information below needs to be completed with the real details of the business before any public release.',
  foi: 'This English version is provided for convenience. In case of any discrepancy, the French version prevails.',
  sommaireAria: 'Contents',
  blocs: [
    {
      id: 'publisher',
      court: 'Publisher',
      titre: 'Publisher',
      paragraphes: [
        `<span translate="no">Moamind Solutions</span> · legal name&nbsp;<em>to&nbsp;be completed</em><br />
          Legal form and share capital&nbsp;:&nbsp;<em>to&nbsp;be completed</em><br />
          Registered office&nbsp;:&nbsp;<em>to&nbsp;be completed</em><br />
          Company registration number&nbsp;:&nbsp;<em>to&nbsp;be completed</em><br />
          VAT number&nbsp;:&nbsp;<em>to&nbsp;be completed</em><br />
          Publication director&nbsp;:&nbsp;<em>to&nbsp;be completed</em>`,
      ],
    },
    {
      id: 'contact',
      court: 'Contact me',
      titre: 'Contact me',
      paragraphes: ['Every request goes through the form on the Contact page. No email address is published on this site.'],
    },
    {
      id: 'hosting',
      court: 'Hosting',
      titre: 'Hosting',
      paragraphes: ['The site is hosted by GitHub Pages, GitHub, Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, United States.'],
    },
    {
      id: 'intellectual-property',
      court: 'Intellectual property',
      titre: 'Intellectual property',
      paragraphes: [
        'All the content on this site, text, mockups, screenshots of the applications shown, visual identity and code, belongs to <span translate="no">Moamind Solutions</span>, unless stated otherwise. Any reproduction or use, in whole or in part, without prior written permission is prohibited.',
      ],
    },
    {
      id: 'personal-data',
      court: 'Personal data',
      titre: 'Personal data',
      paragraphes: [
        'The information sent through the contact form (name, organization, email address, nature of the project, target date, budget and message) is used solely to reply to your request. It is never sold, passed on, or used for marketing purposes by third parties.',
        'Messages are delivered by Web3Forms. Data is kept for as long as needed to handle the request, and for a maximum of three years after the last exchange.',
        'Under the GDPR, you have the right to access, correct, erase, restrict, object to, and port your data. These rights can be exercised through the contact form. You can also file a complaint with the CNIL (the French data protection authority).',
      ],
    },
    {
      id: 'cookies',
      court: 'Cookies',
      titre: 'Cookies and audience measurement',
      paragraphes: ['This site does not set any cookies and does not use any audience measurement or advertising tracking tool. No consent banner is therefore needed.'],
    },
  ],
};

const textes: Record<Langue, typeof fr> = { fr, en };
export default textes;
