import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULTS, ImageError, aspectHintText, callImagesApi, composePrompt, detectMediaType, effectiveSettings, findReferenceImages,
  httpError, imageDimensions, imageFileName, listModels, normalizeBaseURL, parametersSchema, parseImagesResponse, parseSize,
  redact, requestFields, resolveRequest, runImages, safeFolder, toJsonSchema, validateKeyRef, workspacePath, withDeadline,
} from '../lib/core.js';

const PNG_1x1 = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
// Fake key for redaction tests, assembled so secret scanners do not flag it.
const KEY = ['sk', 'test', 'fake'.repeat(4)].join('-');
const RELAY = 'https://relay.example.test/v1';

function fakeFetch(handler) {
  const calls = [];
  const impl = async (url, init = {}) => {
    calls.push({ url, init });
    return handler(url, init, calls.length);
  };
  impl.calls = calls;
  return impl;
}
const okImage = (extra = {}) => new Response(JSON.stringify({ data: [{ b64_json: PNG_1x1.toString('base64') }], size: '1536x1024', quality: 'low', background: 'opaque', output_format: 'png', ...extra }), { status: 200 });

test('effective settings fall back on missing or mistyped values and unwrap volatile refs', () => {
  const settings = effectiveSettings({ model: { get: () => 'gpt-image-x' }, count: '3', quality: 'high', size: null });
  assert.equal(settings.model, 'gpt-image-x');
  assert.equal(settings.count, DEFAULTS.count);
  assert.equal(settings.quality, 'high');
  assert.equal(settings.size, 'auto');
  assert.equal(settings.baseURL, '');
  assert.equal(settings.apiKeyEnv, 'CODEX_IMAGE_API_KEY');
});

test('size parsing accepts presets and custom sizes and rejects bad frames', () => {
  assert.equal(parseSize('auto'), 'auto');
  assert.equal(parseSize(''), 'auto');
  assert.equal(parseSize('1536X1024'), '1536x1024');
  assert.equal(parseSize('1024 × 1536'), '1024x1536');
  for (const bad of ['777x333', '100x100', '4096x4096', '3840x256', 'big']) assert.throws(() => parseSize(bad), ImageError, bad);
});

test('aspect hint describes the frame', () => {
  assert.equal(aspectHintText('auto'), '');
  assert.match(aspectHintText('1536x1024'), /landscape.*3:2.*1536x1024/);
  assert.match(aspectHintText('1024x1536'), /portrait.*2:3/);
  assert.match(aspectHintText('1024x1024'), /square.*1:1/);
  assert.match(aspectHintText('1536x864'), /16:9/);
  const prompt = composePrompt('a cat', { stylePrompt: 'watercolor', aspectHint: true, size: '1024x1024' });
  assert.equal(prompt, 'a cat\n\nwatercolor\n\nImage format: square, aspect ratio 1:1, target 1024x1024 pixels.');
  assert.equal(composePrompt('a cat', { aspectHint: false, size: '1024x1024' }), 'a cat');
});

test('request resolution merges arguments over settings and validates model input', () => {
  const settings = { ...DEFAULTS, quality: 'low', count: 2, size: '1024x1024', editModel: 'gpt-image-edit' };
  const generate = resolveRequest(settings, { prompt: '  a fox  ' });
  assert.equal(generate.prompt, 'a fox');
  assert.equal(generate.quality, 'low');
  assert.equal(generate.count, 2);
  assert.equal(generate.model, 'gpt-image-2.5');
  assert.equal(generate.size, '1024x1024');
  const edit = resolveRequest(settings, { prompt: 'x', quality: 'high', count: 1, size: 'auto' }, 'edit');
  assert.equal(edit.model, 'gpt-image-edit');
  assert.equal(edit.quality, 'high');
  assert.equal(edit.size, 'auto');
  assert.throws(() => resolveRequest(settings, { prompt: '' }), /prompt is required/);
  assert.throws(() => resolveRequest(settings, { prompt: 'x', quality: 'ultra' }), /quality must be one of/);
  assert.throws(() => resolveRequest(settings, { prompt: 'x', count: 9 }), /count must be/);
  assert.throws(() => resolveRequest(settings, { prompt: 'x', background: 'transparent', output_format: 'jpeg' }), /transparent/);
  const broken = resolveRequest({ ...DEFAULTS, size: 'nonsense', quality: 'weird', count: 99 }, { prompt: 'x' });
  assert.equal(broken.size, 'auto');
  assert.equal(broken.quality, 'auto');
  assert.equal(broken.count, 4);
});

test('request fields omit auto values', () => {
  const request = resolveRequest({ ...DEFAULTS, aspectHint: false }, { prompt: 'x' });
  assert.deepEqual(requestFields(request), { model: 'gpt-image-2.5', prompt: 'x', n: 1 });
  const full = resolveRequest({ ...DEFAULTS, aspectHint: false, outputCompression: 70, moderation: 'low' }, { prompt: 'x', size: '1024x1536', quality: 'high', background: 'opaque', output_format: 'webp' });
  assert.deepEqual(requestFields(full), { model: 'gpt-image-2.5', prompt: 'x', n: 1, size: '1024x1536', quality: 'high', background: 'opaque', output_format: 'webp', output_compression: 70, moderation: 'low' });
});

test('validators', () => {
  assert.equal(normalizeBaseURL(RELAY + '///'), RELAY);
  assert.throws(() => normalizeBaseURL('ftp://x'), ImageError);
  assert.throws(() => normalizeBaseURL('https://example.test/v1?'), ImageError);
  assert.throws(() => normalizeBaseURL('https://user:pass@example.test/v1'), ImageError);
  assert.throws(() => normalizeBaseURL('  '), { code: 'unconfigured' });
  assert.throws(() => normalizeBaseURL('nope'), ImageError);
  assert.equal(validateKeyRef(' CODEX_IMAGE_API_KEY '), 'CODEX_IMAGE_API_KEY');
  assert.throws(() => validateKeyRef('bad-name'), ImageError);
  assert.equal(safeFolder('generated-images/'), 'generated-images');
  assert.equal(safeFolder(''), '');
  assert.throws(() => safeFolder('../out'), ImageError);
  assert.throws(() => safeFolder('C:/out'), ImageError);
  assert.match(imageFileName('image/png', new Date(2026, 10, 12, 9, 5, 7), 'abcd1234'), /^gpt-image-20261112-090507-abcd1234\.png$/);
});

test('workspace paths cannot escape the root', () => {
  const root = process.platform === 'win32' ? 'C:\\ws' : '/ws';
  assert.ok(workspacePath(root, 'a/b.png').startsWith(root));
  assert.throws(() => workspacePath(root, '../x.png'), /inside the session workspace/);
  assert.throws(() => workspacePath(root, process.platform === 'win32' ? 'D:\\x.png' : '/etc/x.png'), /inside the session workspace/);
});

test('errors are mapped and redacted', () => {
  const error = httpError(401, JSON.stringify({ error: { message: `bad key ${KEY}` } }), [KEY]);
  assert.equal(error.code, 'unauthorized');
  assert.ok(!error.message.includes(KEY));
  assert.equal(httpError(429, '').code, 'rate-limited');
  assert.equal(httpError(502, 'gateway').code, 'upstream');
  assert.equal(redact('Authorization: Bearer abc.def sk-abcdefghijkl'), 'Authorization: Bearer [redacted] [redacted]');
});

test('media detection and dimensions', () => {
  assert.equal(detectMediaType(PNG_1x1), 'image/png');
  assert.deepEqual(imageDimensions(PNG_1x1), { width: 1, height: 1 });
  assert.equal(detectMediaType(Buffer.from([0xff, 0xd8, 0xff, 0xe0])), 'image/jpeg');
  assert.equal(detectMediaType(Buffer.from('hello')), undefined);
});

test('response parsing handles b64, data and remote URLs and rejects junk', async () => {
  const b64 = await parseImagesResponse({ data: [{ b64_json: PNG_1x1.toString('base64'), revised_prompt: 'rp' }], size: '1x1' });
  assert.equal(b64.images[0].mediaType, 'image/png');
  assert.equal(b64.images[0].revisedPrompt, 'rp');
  assert.equal(b64.info.size, '1x1');
  const dataUrl = await parseImagesResponse({ data: [{ url: `data:image/png;base64,${PNG_1x1.toString('base64')}` }] });
  assert.equal(dataUrl.images.length, 1);
  const remote = await parseImagesResponse({ data: [{ url: 'https://cdn.example.test/image.png' }] }, { fetchImpl: async () => new Response(PNG_1x1) });
  assert.equal(remote.images[0].data.byteLength, PNG_1x1.byteLength);
  await assert.rejects(parseImagesResponse({ data: [] }), /without images/);
  await assert.rejects(parseImagesResponse({ data: [{ b64_json: Buffer.from('nope').toString('base64') }] }), /not a PNG/);
});

test('generation call posts JSON with the bearer key', async () => {
  const fetchImpl = fakeFetch(() => okImage());
  const result = await callImagesApi({ baseURL: RELAY, apiKey: KEY, operation: 'generate', fields: { model: 'm', prompt: 'p', n: 1 }, fetchImpl });
  assert.equal(result.images.length, 1);
  const [{ url, init }] = fetchImpl.calls;
  assert.equal(url, RELAY + '/images/generations');
  assert.equal(init.headers.Authorization, `Bearer ${KEY}`);
  assert.deepEqual(JSON.parse(init.body), { model: 'm', prompt: 'p', n: 1 });
  assert.equal(init.redirect, 'error');
});

test('edit call sends multipart with every source image', async () => {
  const fetchImpl = fakeFetch(() => okImage());
  const sources = [{ data: PNG_1x1, mediaType: 'image/png' }, { data: PNG_1x1, mediaType: 'image/png' }];
  await callImagesApi({ baseURL: RELAY, apiKey: KEY, operation: 'edit', fields: { model: 'm', prompt: 'p', n: 1, quality: 'low' }, sources, fetchImpl });
  const { url, init } = fetchImpl.calls[0];
  assert.equal(url, RELAY + '/images/edits');
  assert.ok(init.body instanceof FormData);
  assert.equal(init.body.getAll('image[]').length, 2);
  assert.equal(init.body.get('quality'), 'low');
  assert.equal(init.headers['content-type'], undefined);
  await assert.rejects(callImagesApi({ baseURL: RELAY, apiKey: KEY, operation: 'edit', fields: {}, sources: [], fetchImpl }), /source image/);
});

test('HTTP failures surface as redacted ImageErrors', async () => {
  const fetchImpl = fakeFetch(() => new Response(JSON.stringify({ error: { message: `invalid key ${KEY}` } }), { status: 401 }));
  await assert.rejects(callImagesApi({ baseURL: RELAY, apiKey: KEY, operation: 'generate', fields: {}, fetchImpl }), (error) => error.code === 'unauthorized' && !error.message.includes(KEY));
  const network = async () => { throw new TypeError('fetch failed', { cause: new Error(`ECONNREFUSED ${KEY}`) }); };
  await assert.rejects(callImagesApi({ baseURL: RELAY, apiKey: KEY, operation: 'generate', fields: {}, fetchImpl: network }), (error) => error.code === 'network' && !error.message.includes(KEY));
});

test('variants run as parallel single-image requests and keep partial results', async () => {
  const fetchImpl = fakeFetch((url, init, n) => (n === 2 ? new Response('{"error":{"message":"busy"}}', { status: 503 }) : okImage()));
  const request = resolveRequest(DEFAULTS, { prompt: 'x', count: 3 });
  const result = await runImages({ request, baseURL: RELAY, apiKey: KEY, fetchImpl });
  assert.equal(fetchImpl.calls.length, 3);
  assert.equal(result.images.length, 2);
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /503/);
  const allFail = fakeFetch(() => new Response('{}', { status: 500 }));
  await assert.rejects(runImages({ request, baseURL: RELAY, apiKey: KEY, fetchImpl: allFail }), /HTTP 500/);
});

test('deadline aborts slow requests; caller cancellation propagates', async () => {
  const hang = (signal) => new Promise((_, reject) => signal.addEventListener('abort', () => reject(signal.reason)));
  await assert.rejects(withDeadline(undefined, 30, hang), (error) => error.code === 'timeout');
  const controller = new AbortController();
  const pending = withDeadline(controller.signal, 10000, hang);
  controller.abort(new Error('user stop'));
  await assert.rejects(pending, /user stop/);
});

test('model listing never spends a generation', async () => {
  const fetchImpl = fakeFetch(() => new Response(JSON.stringify({ data: [{ id: 'gpt-image-2.5' }, { id: 'text-model-for-test' }] })));
  assert.deepEqual(await listModels({ baseURL: RELAY, apiKey: KEY, fetchImpl }), ['gpt-image-2.5', 'text-model-for-test']);
  assert.equal(fetchImpl.calls[0].url, RELAY + '/models');
  assert.equal(fetchImpl.calls[0].init.method, 'GET');
});

test('reference images: explicit ids, latest user images, newest anywhere', () => {
  const a = { attachmentId: 'sha256:' + 'a'.repeat(64), mediaType: 'image/png' };
  const b = { attachmentId: 'sha256:' + 'b'.repeat(64), mediaType: 'image/png' };
  const c = { attachmentId: 'sha256:' + 'c'.repeat(64), mediaType: 'image/png' };
  const messages = [
    { role: 'user', source: { kind: 'user' }, content: [{ type: 'text', text: 'hi' }, { type: 'image', attachment: a }, { type: 'image', attachment: b }] },
    { role: 'tool', content: [{ type: 'text', text: 'Generated' }, { type: 'image', attachment: c }] },
  ];
  assert.deepEqual(findReferenceImages(messages), [a, b]);
  assert.deepEqual(findReferenceImages(messages, ['c'.repeat(64), a.attachmentId]), [c, a]);
  assert.throws(() => findReferenceImages(messages, ['sha256:' + 'd'.repeat(64)]), /not in this conversation/);
  assert.deepEqual(findReferenceImages([messages[1]]), [c]);
  assert.deepEqual(findReferenceImages([]), []);
});

test('tool schemas compile required flags into arrays', () => {
  const schema = parametersSchema({ prompt: { type: 'string', required: true }, ids: { type: 'array', items: { type: 'string' } } });
  assert.deepEqual(schema, { type: 'object', properties: { prompt: { type: 'string' }, ids: { type: 'array', items: { type: 'string' } } }, required: ['prompt'] });
  const nested = toJsonSchema({ type: 'object', properties: { a: { type: 'object', required: true, properties: { b: { type: 'integer', required: true } } } } });
  assert.deepEqual(nested, { type: 'object', properties: { a: { type: 'object', properties: { b: { type: 'integer' } }, required: ['b'] } }, required: ['a'] });
});
