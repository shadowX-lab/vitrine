import { defineMiddleware } from 'astro:middleware';
import { typographierHtml } from './lib/typo';

/**
 * Typographie française sur chaque page HTML, au build comme en développement.
 * Seules les pages sont lues : une image lue comme du texte serait corrompue.
 */
export const onRequest = defineMiddleware(async ({ url }, next) => {
  const reponse = await next();
  const type = reponse.headers.get('content-type') ?? '';
  const estPage = type.includes('text/html') || (!type && !/\.[a-z0-9]+$/i.test(url.pathname.replace(/\/$/, '')));
  if (!estPage) return reponse;
  const html = await reponse.text();
  return new Response(typographierHtml(html), { status: reponse.status, headers: reponse.headers });
});
