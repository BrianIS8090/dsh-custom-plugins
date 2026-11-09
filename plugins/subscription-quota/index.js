import { createQuotaService, QuotaError, ORIGIN_REF, RECORD_KEY } from './quota.js';

export const name = 'subscription-quota';
export const inject = [];
const PATH = '/api/subscription-quota';
const json = (body, status = 200) => Response.json(body, {
  status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' },
});

export function apply(ctx) {
  ctx.inject(['credentials', 'connection'], child => {
    const service = createQuotaService(child.credentials);
    child.on('credentials/record-updated', key => {
      if ((typeof key === 'string' ? key : key?.key) === RECORD_KEY) service.invalidate();
    });
    child.on('credentials/reference-updated', ref => {
      if (ref === ORIGIN_REF) service.invalidate();
    });
    child.effect(() => child.connection.fetch.register({
      path: PATH, methods: ['GET', 'POST', 'DELETE'], requestBody: 'buffered',
      async fetch(request) {
        try {
          if (request.method === 'GET') return json(await service.status(new URL(request.url).searchParams.get('refresh') === '1'));
          // Cross-origin HTML forms cannot send this header or JSON. No CORS opt-in.
          // Native DSH strips Origin before forwarding an already-trusted request.
          // Web requests with Origin were fenced by connection admission too;
          // compare their actual Host, not the bridge's synthetic dsh.internal URL.
          let sameOrigin = !request.headers.has('origin');
          try {
            if (request.headers.has('origin')) {
              const origin = new URL(request.headers.get('origin'));
              const authority = new URL(origin.protocol + '//' + request.headers.get('host'));
              sameOrigin = ['http:', 'https:'].includes(origin.protocol) && origin.host === authority.host;
            }
          } catch {}
          if (!sameOrigin || request.headers.get('x-subscription-quota') !== '1') return json({ ok: false, error: 'forbidden' }, 403);
          if (request.method === 'DELETE') return json(await service.remove());
          if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ ok: false, error: 'invalid-request' }, 415);
          const raw = await request.text();
          if (raw.length > 2048) return json({ ok: false, error: 'invalid-request' }, 413);
          let body;
          try { body = JSON.parse(raw); } catch { return json({ ok: false, error: 'invalid-request' }, 400); }
          return json(await service.save({ apiKey: body?.apiKey, billingOrigin: body?.billingOrigin }));
        } catch (error) {
          return json({ ok: false, error: error instanceof QuotaError ? error.code : 'credential-store' }, 400);
        }
      },
    }), 'subscription-quota: authenticated local API');
  });
}
