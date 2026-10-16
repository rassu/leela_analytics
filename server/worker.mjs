import { handleContact } from './contact.mjs';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/contact') return handleContact(request, env);
    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return Response.json({ ok: false, error: { code: 'NOT_FOUND', message: 'This API route does not exist.' } }, {
        status: 404,
        headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' },
      });
    }
    return env.ASSETS.fetch(request);
  },
};
