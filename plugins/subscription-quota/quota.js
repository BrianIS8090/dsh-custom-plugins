/** Users must explicitly configure their own HTTPS billing origin. */
export const ORIGIN_REF = 'SUBSCRIPTION_QUOTA_BILLING_ORIGIN';
export const BILLING_PATH = '/v0/resource/plugins/cpa-key-billing/subscription';
export const PANEL_PATH = '/v0/resource/plugins/cpa-key-billing/ui#account/subscription';
export const RECORD_KEY = 'subscription-quota/api-key';

export class QuotaError extends Error {
  constructor(code) { super(code); this.code = code; }
}
const finite = value => typeof value === 'number' && Number.isFinite(value);
const text = value => typeof value === 'string' ? value.slice(0, 160) : '';
const date = value => typeof value === 'string' && Number.isFinite(Date.parse(value)) ? new Date(value).toISOString() : null;

export function validateBillingOrigin(value) {
  if (typeof value !== 'string') throw new QuotaError('invalid-endpoint');
  let url;
  try { url = new URL(value.trim()); } catch { throw new QuotaError('invalid-endpoint'); }
  if (url.protocol !== 'https:' || !url.hostname || url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new QuotaError('invalid-endpoint');
  }
  return url.origin;
}

/** Whitelist response fields; never pass an upstream error, identity, or key to UI. */
export function normalizeQuota(body) {
  const sub = body?.subscription;
  if (!sub || typeof sub !== 'object' || typeof sub.unlimited !== 'boolean' || !Array.isArray(sub.windows)) throw new QuotaError('invalid-response');
  const windows = sub.windows.map(window => {
    if (!window || !Array.isArray(window.dimensions)) throw new QuotaError('invalid-response');
    return {
      name: text(window.name), started: window.started === true, blocked: window.blocked === true,
      startAt: date(window.start_at), endAt: date(window.end_at),
      dimensions: window.dimensions.map(dimension => {
        if (!dimension || !finite(dimension.limit) || dimension.limit < 0 || !finite(dimension.remaining) || !finite(dimension.used) || typeof dimension.metric !== 'string') throw new QuotaError('invalid-response');
        return {
          metric: text(dimension.metric), currency: /^[A-Z]{3}$/.test(dimension.currency) ? dimension.currency : null,
          limit: dimension.limit, remaining: Math.max(0, dimension.remaining), used: dimension.used,
          percent: dimension.limit > 0 ? Math.max(0, Math.min(100, dimension.remaining / dimension.limit * 100)) : null,
          blocked: dimension.blocked === true,
        };
      }),
    };
  });
  if (!sub.unlimited && !windows.some(window => window.dimensions.length)) throw new QuotaError('invalid-response');
  return {
    name: text(sub.name), unlimited: sub.unlimited, blocked: sub.blocked === true,
    shared: sub.shared_quota === true, windows,
    concurrency: {
      current: finite(body.concurrency?.current) ? body.concurrency.current : null,
      limit: finite(body.concurrency?.limit) ? body.concurrency.limit : null,
    },
  };
}

export function validateKey(value) {
  if (typeof value !== 'string') throw new QuotaError('invalid-key');
  const key = value.trim();
  if (key.length < 8 || key.length > 1024 || /\s|[^\x21-\x7e]/.test(key)) throw new QuotaError('invalid-key');
  return key;
}

export async function fetchQuota(key, billingOrigin, fetchImpl = fetch) {
  try {
    const endpoint = validateBillingOrigin(billingOrigin) + BILLING_PATH;
    const response = await fetchImpl(endpoint, {
      method: 'GET', headers: { Authorization: 'Bearer ' + validateKey(key), Accept: 'application/json' },
      redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(15000),
    });
    if (response.status === 401 || response.status === 403) throw new QuotaError('unauthorized');
    if (response.status === 429) throw new QuotaError('rate-limited');
    if (!response.ok) throw new QuotaError('upstream-unavailable');
    const raw = await response.text();
    if (raw.length > 256000) throw new QuotaError('invalid-response');
    let body;
    try { body = JSON.parse(raw); } catch { throw new QuotaError('invalid-response'); }
    return normalizeQuota(body);
  } catch (error) {
    // Fetch errors and remote payloads can contain secrets; return fixed codes only.
    if (error instanceof QuotaError) throw error;
    throw new QuotaError(error?.name === 'TimeoutError' || error?.name === 'AbortError' ? 'timeout' : 'network');
  }
}

/** Per-plugin single-flight cache. A credential or endpoint change invalidates old responses. */
export function createQuotaService(credentials, { load = fetchQuota, now = Date.now } = {}) {
  let generation = 0, cached, lastGood, pending;
  let mutations = Promise.resolve();
  function invalidate() { generation++; cached = undefined; lastGood = undefined; pending = undefined; }
  async function status(force = false) {
    if (!force && cached && now() - cached.at < cached.ttl) return cached.body;
    if (pending) return pending;
    const ticket = generation;
    const task = (async () => {
      let key, billingOrigin;
      try {
        [key, billingOrigin] = await Promise.all([
          credentials.readRecord(RECORD_KEY).then(record => record?.key),
          credentials.resolve(ORIGIN_REF).then(record => record?.value),
        ]);
        billingOrigin = billingOrigin ? validateBillingOrigin(billingOrigin) : undefined;
      } catch (error) {
        if (error instanceof QuotaError) return { ok: false, configured: false, endpointConfigured: false, error: error.code };
        return { ok: false, configured: false, endpointConfigured: false, error: 'credential-store' };
      }
      if (ticket !== generation) return status();
      if (!key || !billingOrigin) return { ok: true, configured: false, endpointConfigured: Boolean(billingOrigin), ...(billingOrigin ? { billingOrigin } : {}) };
      let body;
      try {
        const quota = await load(key, billingOrigin);
        body = { ok: true, configured: true, endpointConfigured: true, billingOrigin, fetchedAt: new Date(now()).toISOString(), quota };
        if (ticket === generation) lastGood = body;
      } catch (error) {
        const code = error instanceof QuotaError ? error.code : 'unavailable';
        if (ticket === generation && code === 'unauthorized') lastGood = undefined;
        body = code !== 'unauthorized' && lastGood
          ? { ...lastGood, stale: true, error: code }
          : { ok: false, configured: true, endpointConfigured: true, billingOrigin, error: code };
      }
      if (ticket !== generation) return status();
      cached = { body, at: now(), ttl: body.error ? 15000 : 60000 };
      return body;
    })();
    pending = task;
    try { return await task; } finally { if (pending === task) pending = undefined; }
  }
  function mutate(operation) {
    const task = mutations.then(operation);
    mutations = task.catch(() => {});
    return task;
  }
  return {
    status, invalidate,
    save(value) {
      return mutate(async () => {
        const key = validateKey(value?.apiKey);
        const billingOrigin = validateBillingOrigin(value?.billingOrigin);
        const quota = await load(key, billingOrigin); // Validate access before replacing working credentials.
        const previous = await credentials.resolve(ORIGIN_REF);
        await credentials.set(ORIGIN_REF, billingOrigin);
        try {
          await credentials.modifyRecord(RECORD_KEY, () => ({ kind: 'api-key', key }));
        } catch (error) {
          if (previous?.value) await credentials.set(ORIGIN_REF, previous.value);
          else await credentials.unset(ORIGIN_REF);
          throw error;
        }
        invalidate();
        const body = { ok: true, configured: true, endpointConfigured: true, billingOrigin, fetchedAt: new Date(now()).toISOString(), quota };
        lastGood = body;
        cached = { body, at: now(), ttl: 60000 };
        return body;
      });
    },
    remove() {
      return mutate(async () => {
        await credentials.deleteRecord(RECORD_KEY);
        invalidate();
        const previous = await credentials.resolve(ORIGIN_REF);
        const billingOrigin = previous?.value ? validateBillingOrigin(previous.value) : undefined;
        return { ok: true, configured: false, endpointConfigured: Boolean(billingOrigin), ...(billingOrigin ? { billingOrigin } : {}) };
      });
    },
  };
}
