import { defineMiddleware } from 'astro:middleware';
import { typographierHtml } from './lib/typo';

/** Typographie française sur chaque page HTML, au build comme en développement. */
export const onRequest = defineMiddleware(async (_, next) => {
  const reponse = await next();
  const type = reponse.headers.get('content-type') ?? '';
  const html = await reponse.text();
  if (!type.includes('text/html') && !/^\s*<!doctype html/i.test(html)) {
    return new Response(html, reponse);
  }
  return new Response(typographierHtml(html), { status: reponse.status, headers: reponse.headers });
});
