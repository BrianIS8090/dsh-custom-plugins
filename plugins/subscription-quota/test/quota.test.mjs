import { test } from 'node:test';
import assert from 'node:assert/strict';
import { normalizeQuota, fetchQuota, validateKey, validateBillingOrigin, createQuotaService, QuotaError, BILLING_PATH, ORIGIN_REF, RECORD_KEY } from '../quota.js';
import { apply } from '../index.js';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// Fully synthetic response: no account name, commercial amounts or real timestamps.
const raw = (remaining = 60) => ({ subscription: { name: 'Example subscription', unlimited: false, blocked: false, windows: [{ name: 'Example window', started: true, end_at: '2030-01-01T00:00:00Z', dimensions: [{ metric: 'amount', currency: 'USD', limit: 100, used: 100 - remaining, remaining }] }] }, concurrency: { current: 1, limit: 4 } });
const normalized = () => normalizeQuota(raw());
const ORIGIN = 'https://billing.example.com';
const credentials = () => {
  let record;
  const refs = new Map();
  return {
    readRecord: async () => record,
    modifyRecord: async (key, fn) => { assert.equal(key, RECORD_KEY); record = await fn(record); },
    deleteRecord: async () => { record = undefined; },
    resolve: async ref => { assert.equal(ref, ORIGIN_REF); return refs.has(ref) ? { value: refs.get(ref) } : undefined; },
    set: async (ref, value) => { assert.equal(ref, ORIGIN_REF); refs.set(ref, value); },
    unset: async ref => { refs.delete(ref); },
  };
};

test('normalizes a synthetic API response, resets and remaining percent, omits unknown fields', () => {
  const body = raw(); body.secret = 'never'; body.subscription.apiKey = 'never';
  const quota = normalizeQuota(body);
  assert.equal(quota.windows[0].endAt, '2030-01-01T00:00:00.000Z');
  assert.equal(quota.windows[0].dimensions[0].remaining, 60);
  assert.ok(Math.abs(quota.windows[0].dimensions[0].percent - 60) < 0.001);
  assert.equal(JSON.stringify(quota).includes('never'), false);
});
test('supports unlimited, blocked, shared, multiple metrics and zero limits', () => {
  assert.equal(normalizeQuota({ subscription: { unlimited: true, windows: [] } }).unlimited, true);
  const body = raw(0); body.subscription.shared_quota = true; body.subscription.blocked = true;
  body.subscription.windows[0].dimensions.push({ metric: 'tokens', limit: 0, used: 0, remaining: 0 });
  const q = normalizeQuota(body);
  assert.equal(q.shared, true); assert.equal(q.blocked, true); assert.equal(q.windows[0].dimensions[1].percent, null);
});
test('malformed responses are not presented as zero or unlimited', () => {
  for (const value of [null, {}, { subscription: {} }, { subscription: { unlimited: false, windows: [] } }]) assert.throws(() => normalizeQuota(value), /invalid-response/);
  const body = raw(); body.subscription.windows[0].dimensions[0].remaining = NaN;
  assert.throws(() => normalizeQuota(body), /invalid-response/);
});
test('validates trimmed keys without permitting header injection', () => {
  assert.equal(validateKey('  sk-test-123  '), 'sk-test-123');
  for (const key of ['', 'short', 'sk-12345\nabc', 'sk- 12345', null]) assert.throws(() => validateKey(key));
});
test('requires an explicit HTTPS origin without credentials, path, query or fragment', () => {
  assert.equal(validateBillingOrigin(' https://BILLING.example.com/ '), ORIGIN);
  for (const origin of [undefined, '', 'http://billing.example.com', 'https://user:secret@billing.example.com', 'https://billing.example.com/path', 'https://billing.example.com/?x=1', 'https://billing.example.com/#x']) {
    assert.throws(() => validateBillingOrigin(origin), /invalid-endpoint/);
  }
});
test('uses only the configured origin, read-only endpoint, bearer, no redirects or cached credentials', async () => {
  let request;
  await fetchQuota('sk-test-123', ORIGIN, async (...args) => { request = args; return new Response(JSON.stringify(raw())); });
  assert.equal(request[0], ORIGIN + BILLING_PATH);
  assert.equal(request[1].method, 'GET'); assert.equal(request[1].redirect, 'error');
  assert.equal(request[1].headers.Authorization, 'Bearer sk-test-123');
  assert.equal(request[0].includes('sk-test'), false);
});
test('sanitizes every upstream error without reflecting raw body or key', async () => {
  for (const [status, code] of [[401, 'unauthorized'], [403, 'unauthorized'], [429, 'rate-limited'], [500, 'upstream-unavailable']]) {
    await assert.rejects(fetchQuota('sk-test-123', ORIGIN, async () => new Response('secret', { status })), error => error.code === code && !error.message.includes('secret'));
  }
  await assert.rejects(fetchQuota('sk-test-123', ORIGIN, async () => { throw new Error('sk-test-123'); }), /network/);
});
test('missing configuration, validate before save, never returns secret, delete', async () => {
  const store = credentials();
  const service = createQuotaService(store, { load: async key => { if (key === 'bad-test-key') throw new QuotaError('unauthorized'); return normalized(); } });
  assert.deepEqual(await service.status(), { ok: true, configured: false, endpointConfigured: false });
  await service.save({ apiKey: 'sk-test-123', billingOrigin: ORIGIN });
  await assert.rejects(service.save({ apiKey: 'bad-test-key', billingOrigin: ORIGIN }), /unauthorized/);
  assert.equal((await store.readRecord()).key, 'sk-test-123');
  assert.equal(JSON.stringify(await service.status()).includes('sk-test'), false);
  await service.remove(); assert.equal((await service.status()).configured, false);
});
test('cache TTL, single flight and stale last-success preservation', async () => {
  let at = 1000000, calls = 0, fail = false;
  const store = credentials(); await store.modifyRecord(RECORD_KEY, () => ({ kind: 'api-key', key: 'sk-test-123' })); await store.set(ORIGIN_REF, ORIGIN);
  const service = createQuotaService(store, { now: () => at, load: async () => { calls++; if (fail) throw new QuotaError('network'); return normalized(); } });
  const [a, b] = await Promise.all([service.status(), service.status()]);
  assert.equal(calls, 1); assert.deepEqual(a, b);
  await service.status(); assert.equal(calls, 1);
  at += 61000; fail = true;
  const stale = await service.status(); assert.equal(stale.stale, true); assert.equal(stale.quota.windows[0].dimensions[0].remaining, 60);
  await service.status(); assert.equal(calls, 2);
});
test('rejected credentials never display or resurrect previous balance', async () => {
  let failure;
  const service = createQuotaService(credentials(), { load: async () => { if (failure) throw new QuotaError(failure); return normalized(); } });
  await service.save({ apiKey: 'sk-test-123', billingOrigin: ORIGIN }); failure = 'unauthorized';
  const result = await service.status(true); assert.equal(result.quota, undefined); assert.equal(result.error, 'unauthorized');
  failure = 'network';
  const next = await service.status(true); assert.equal(next.quota, undefined); assert.equal(next.ok, false);
});
test('rotation while old GET is in flight cannot resurrect old account', async () => {
  const store = credentials(); await store.modifyRecord(RECORD_KEY, () => ({ kind: 'api-key', key: 'old-test-key' })); await store.set(ORIGIN_REF, ORIGIN);
  let release;
  const service = createQuotaService(store, { load: key => key === 'old-test-key' ? new Promise(resolve => { release = resolve; }) : Promise.resolve(normalizeQuota(raw(42))) });
  const first = service.status(); await Promise.resolve(); await Promise.resolve();
  await service.save({ apiKey: 'new-test-key', billingOrigin: ORIGIN }); release(normalized());
  assert.equal((await first).quota.windows[0].dimensions[0].remaining, 42);
  assert.equal((await service.status()).quota.windows[0].dimensions[0].remaining, 42);
});
test('host route requires mutation origin, custom header and JSON; no secret response', async () => {
  let route;
  const store = credentials();
  const child = { credentials: store, connection: { fetch: { register: value => { route = value; } } }, effect: fn => fn(), on: () => {} };
  apply({ inject: (deps, fn) => fn(child) });
  const request = (headers, body = '{}', method = 'POST') => new Request('http://dsh.internal/api/subscription-quota', { method, headers: { host: '127.0.0.1:49708', ...headers }, body: method === 'POST' ? body : undefined });
  assert.equal((await route.fetch(request({}))).status, 403);
  assert.equal((await route.fetch(request({ origin: 'https://evil.invalid', 'x-subscription-quota': '1' }))).status, 403);
  const safe = { origin: 'http://127.0.0.1:49708', 'x-subscription-quota': '1', 'content-type': 'application/json' };
  assert.equal((await route.fetch(request(safe, '{'))).status, 400);
  assert.equal((await route.fetch(request(safe, 'x'.repeat(2049)))).status, 413);
  assert.equal((await route.fetch(request({ ...safe, 'content-type': 'text/plain' }))).status, 415);
  assert.equal((await route.fetch(request(safe, '{"apiKey":"bad"}'))).status, 400);
  assert.equal((await route.fetch(request(safe, '', 'DELETE'))).status, 200);
  // Native dsh-app forwarder strips Origin after its own admission checks.
  assert.equal((await route.fetch(request({ 'x-subscription-quota': '1' }, '', 'DELETE'))).status, 200);
  const result = await route.fetch(new Request('http://127.0.0.1:49708/api/subscription-quota'));
  assert.equal(result.headers.get('cache-control'), 'no-store'); assert.equal((await result.json()).configured, false);
});
test('client registers correct seat and portal, reversible CSS and no key storage', async () => {
  const source = await fs.readFile(new URL('../client.js', import.meta.url), 'utf8');
  let exported, registered;
  const context = { window: { __ModuleLoader__: { load: value => { exported = value; } } }, document: { createElement: () => ({ dataset: {}, remove() {} }), head: { append() {} } } };
  vm.runInNewContext(source, context);
  const plugin = exported.factory(name => name === 'react' ? { createElement() {} } : { createPortal() {} });
  plugin.apply({ effect: fn => fn(), slots: { inject: (name, fn) => fn(), register: meta => { registered = meta; } } });
  assert.equal(exported.id, '@local/subscription-quota'); assert.equal(registered.name, 'conversation.input.right');
  assert.ok(source.includes('createPortal(h(\'dialog\''));
  assert.doesNotMatch(source, /localStorage|sessionStorage|indexedDB/);
  assert.match(source, /type: 'password'/); assert.match(source, /visibilitychange/);
});

test('compact badge replaces text and dot with 20 green quota strokes, keeps amounts', async () => {
  const source = await fs.readFile(new URL('../client.js', import.meta.url), 'utf8');
  let exported, Badge;
  const context = { window: { __ModuleLoader__: { load: value => { exported = value; } } }, document: { createElement: () => ({ dataset: {}, remove() {} }), head: { append() {} } }, Intl, AbortSignal };
  vm.runInNewContext(source, context);
  let hooks = 0;
  const react = {
    createElement: (type, props, ...children) => ({ type, props: props ?? {}, children }),
    useState: initial => [hooks++ === 0 ? { ok: true, configured: true, quota: normalized() } : initial, () => {}],
    useRef: value => ({ current: value }), useCallback: fn => fn, useEffect: () => {},
  };
  exported.factory(name => name === 'react' ? react : { createPortal() {} }).apply({ effect: fn => fn(), slots: { inject: (name, fn) => fn(), register: (meta, component) => { Badge = component; } } });
  const button = Badge().children[0];
  assert.match(button.props.title, /Лимиты обновятся: /);
  assert.ok(button.props.title.includes(new Date(normalized().windows[0].endAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })));
  assert.doesNotMatch(source, /'Обновление: '/);
  assert.match(source, /h\('time', \{ dateTime: window.endAt/);
  assert.equal(button.children.length, 2); // bar + retained amount, no label or dot
  assert.match(button.children[1].children[0], /60[.,]00/);
  assert.match(button.children[1].children[0], /100[.,]00/);
  const bars = button.children[0].type(button.children[0].props);
  assert.equal(bars.children.length, 20);
  assert.equal(bars.children.filter(bar => bar.props['data-filled']).length, 12);
  assert.equal(bars.props['aria-hidden'], true);
  const Bars = button.children[0].type;
  assert.equal(Bars({ percent: 0 }).children.filter(bar => bar.props['data-filled']).length, 0);
  assert.equal(Bars({ percent: 100 }).children.filter(bar => bar.props['data-filled']).length, 20);
  assert.equal(Bars({ unlimited: true }).children.filter(bar => bar.props['data-filled']).length, 20);
  assert.equal(Bars({ percent: null }).children.filter(bar => bar.props['data-filled']).length, 0);
  assert.doesNotMatch(source, /sq-dot|sq-label/);
});
