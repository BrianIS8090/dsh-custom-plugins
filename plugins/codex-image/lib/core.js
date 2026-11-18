/**
 * Pure helpers of the Codex image plugin: settings resolution, Images API
 * requests to an OpenAI-compatible relay (CLIProxyAPI → Codex), response
 * parsing, reference-image lookup and workspace path safety.
 *
 * No DSH imports here, so everything is unit-testable with plain `node --test`.
 */
import { randomBytes } from 'node:crypto';
import { isAbsolute, relative, resolve, sep } from 'node:path';

/** Defaults of every setting; the Host Config schema mirrors them. */
export const DEFAULTS = Object.freeze({
  baseURL: '',
  apiKeyEnv: 'CODEX_IMAGE_API_KEY',
  model: 'gpt-image-2.5',
  editModel: '',
  size: 'auto',
  aspectHint: true,
  quality: 'auto',
  background: 'auto',
  outputFormat: 'png',
  outputCompression: 100,
  moderation: 'auto',
  count: 1,
  stylePrompt: '',
  timeoutSeconds: 240,
  saveToWorkspace: true,
  workspaceFolder: 'generated-images',
});

export const QUALITIES = Object.freeze(['auto', 'low', 'medium', 'high']);
export const BACKGROUNDS = Object.freeze(['auto', 'opaque', 'transparent']);
export const OUTPUT_FORMATS = Object.freeze(['png', 'jpeg', 'webp']);
export const MODERATIONS = Object.freeze(['auto', 'low']);
export const SIZE_PRESETS = Object.freeze(['auto', '1024x1024', '1536x1024', '1024x1536']);
export const MAX_COUNT = 4;
export const MAX_SOURCES = 16;
const MAX_PROMPT = 32000;
const MAX_ERROR_TEXT = 600;
const KEY_REF = /^[A-Za-z_][A-Za-z0-9_]*$/;

/** Failure with a stable code and a message that never carries a secret. */
export class ImageError extends Error {
  constructor(code, message, status) {
    super(message);
    this.name = 'ImageError';
    this.code = code;
    if (status !== undefined) this.status = status;
  }
}

/** Unwrap volatile config references (`.get()`) into one plain object. */
export function plainConfig(source) {
  const out = {};
  for (const [key, value] of Object.entries(source ?? {})) {
    out[key] = value !== null && typeof value === 'object' && typeof value.get === 'function' ? value.get() : value;
  }
  return out;
}

/** Settings merged over defaults; unknown or malformed stored values fall back. */
export function effectiveSettings(config) {
  const raw = plainConfig(config);
  const out = { ...DEFAULTS };
  for (const key of Object.keys(DEFAULTS)) {
    const value = raw[key];
    if (value === undefined || value === null) continue;
    if (typeof value !== typeof DEFAULTS[key]) continue;
    out[key] = value;
  }
  return out;
}

export function validateKeyRef(value) {
  const ref = String(value ?? '').trim();
  if (!KEY_REF.test(ref)) throw new ImageError('invalid-key-ref', 'API key reference must look like an environment variable name, e.g. CODEX_IMAGE_API_KEY');
  return ref;
}

export function validateApiKey(value) {
  const key = typeof value === 'string' ? value.trim() : '';
  if (key.length < 8 || key.length > 2048 || /\s|[^\x21-\x7e]/.test(key)) throw new ImageError('invalid-key', 'API key must be 8–2048 printable characters without spaces');
  return key;
}

/** Absolute http(s) URL without credentials and without a trailing slash. */
export function normalizeBaseURL(value) {
  const text = String(value ?? '').trim();
  if (!text) throw new ImageError('unconfigured', 'No relay base URL is configured. Open Plugins → Codex image (GPT Image), enter and save your own API base URL.');
  if (!/^https?:\/\//i.test(text)) throw new ImageError('invalid-base-url', 'Base URL must be an absolute http(s) URL');
  let url;
  try { url = new URL(text); } catch { throw new ImageError('invalid-base-url', 'Base URL must be an absolute http(s) URL'); }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') throw new ImageError('invalid-base-url', 'Base URL must use http or https');
  if (url.username || url.password) throw new ImageError('invalid-base-url', 'Base URL must not contain credentials');
  if (/[?#]/.test(url.href)) throw new ImageError('invalid-base-url', 'Base URL must not contain a query or fragment');
  return url.href.replace(/\/+$/, '');
}

/** `auto` or a validated `WIDTHxHEIGHT` (16-px steps, 256–3840, ratio ≤ 3:1). */
export function parseSize(value) {
  const text = String(value ?? '').trim().toLowerCase().replace(/[×*х]/g, 'x').replace(/\s+/g, '');
  if (text === '' || text === 'auto') return 'auto';
  const match = /^(\d{3,4})x(\d{3,4})$/.exec(text);
  if (!match) throw new ImageError('invalid-size', `size must be "auto" or WIDTHxHEIGHT such as 1536x1024, got ${JSON.stringify(String(value))}`);
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (width < 256 || height < 256 || width > 3840 || height > 3840) throw new ImageError('invalid-size', 'size edges must be between 256 and 3840 pixels');
  if (width % 16 !== 0 || height % 16 !== 0) throw new ImageError('invalid-size', 'size edges must be multiples of 16 pixels');
  if (Math.max(width, height) / Math.min(width, height) > 3) throw new ImageError('invalid-size', 'size aspect ratio must not exceed 3:1');
  return `${width}x${height}`;
}

const KNOWN_RATIOS = [[1, 1], [3, 2], [2, 3], [4, 3], [3, 4], [16, 9], [9, 16], [21, 9], [9, 21], [5, 4], [4, 5], [2, 1], [1, 2], [3, 1], [1, 3]];
const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));

/** Plain-language frame hint: the Codex relay treats `size` only as a suggestion. */
export function aspectHintText(size) {
  if (size === 'auto') return '';
  const [width, height] = size.split('x').map(Number);
  const ratio = width / height;
  const known = KNOWN_RATIOS.find(([a, b]) => Math.abs(a / b - ratio) / ratio < 0.02);
  const divisor = gcd(width, height);
  const [rw, rh] = known ?? [width / divisor, height / divisor];
  const shape = width === height ? 'square' : width > height ? 'landscape (horizontal)' : 'portrait (vertical)';
  return `Image format: ${shape}, aspect ratio ${rw}:${rh}, target ${width}x${height} pixels.`;
}

export function composePrompt(prompt, { stylePrompt = '', aspectHint = false, size = 'auto' } = {}) {
  const parts = [String(prompt).trim()];
  const style = String(stylePrompt ?? '').trim();
  if (style) parts.push(style);
  if (aspectHint) {
    const hint = aspectHintText(size);
    if (hint) parts.push(hint);
  }
  return parts.join('\n\n');
}

function choice(name, allowed, value, fallback) {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string' || !allowed.includes(value)) throw new ImageError('invalid-argument', `${name} must be one of: ${allowed.join(', ')}`);
  return value;
}

function settingChoice(allowed, value, fallback) {
  return typeof value === 'string' && allowed.includes(value) ? value : fallback;
}

/**
 * Merge tool arguments over settings into one validated request.
 * Arguments are untrusted model input and throw on bad values; settings fall back.
 */
export function resolveRequest(settingsInput, args = {}, operation = 'generate') {
  const settings = { ...DEFAULTS, ...settingsInput };
  const prompt = typeof args.prompt === 'string' ? args.prompt.trim() : '';
  if (prompt.length === 0) throw new ImageError('invalid-argument', 'prompt is required');
  if (prompt.length > MAX_PROMPT) throw new ImageError('invalid-argument', `prompt is too long (max ${MAX_PROMPT} characters)`);

  let size;
  if (args.size !== undefined && args.size !== null && args.size !== '') size = parseSize(args.size);
  else {
    try { size = parseSize(settings.size); } catch { size = 'auto'; }
  }
  const quality = choice('quality', QUALITIES, args.quality, settingChoice(QUALITIES, settings.quality, 'auto'));
  const background = choice('background', BACKGROUNDS, args.background, settingChoice(BACKGROUNDS, settings.background, 'auto'));
  const outputFormat = choice('output_format', OUTPUT_FORMATS, args.output_format, settingChoice(OUTPUT_FORMATS, settings.outputFormat, 'png'));
  const moderation = settingChoice(MODERATIONS, settings.moderation, 'auto');
  if (background === 'transparent' && outputFormat === 'jpeg') throw new ImageError('invalid-argument', 'a transparent background needs png or webp output');

  let count;
  if (args.count !== undefined && args.count !== null) {
    if (!Number.isInteger(args.count) || args.count < 1 || args.count > MAX_COUNT) throw new ImageError('invalid-argument', `count must be an integer from 1 to ${MAX_COUNT}`);
    count = args.count;
  } else {
    const stored = Math.round(Number(settings.count));
    count = Number.isFinite(stored) ? Math.min(MAX_COUNT, Math.max(1, stored)) : 1;
  }

  const requestedModel = typeof args.model === 'string' ? args.model.trim() : '';
  const editModel = typeof settings.editModel === 'string' ? settings.editModel.trim() : '';
  const baseModel = (typeof settings.model === 'string' ? settings.model.trim() : '') || DEFAULTS.model;
  const model = requestedModel || (operation === 'edit' && editModel ? editModel : baseModel);

  const compression = Math.round(Number(settings.outputCompression));
  const outputCompression = Number.isFinite(compression) ? Math.min(100, Math.max(0, compression)) : 100;
  const timeoutSeconds = Math.min(900, Math.max(10, Number(settings.timeoutSeconds) || DEFAULTS.timeoutSeconds));

  return {
    operation,
    prompt,
    fullPrompt: composePrompt(prompt, { stylePrompt: settings.stylePrompt, aspectHint: settings.aspectHint === true, size }),
    model,
    size,
    quality,
    background,
    outputFormat,
    outputCompression,
    moderation,
    count,
    timeoutMs: timeoutSeconds * 1000,
  };
}

/** Request fields for one Images API call; `auto` values are left to the relay. */
export function requestFields(request) {
  const fields = { model: request.model, prompt: request.fullPrompt, n: 1 };
  if (request.size !== 'auto') fields.size = request.size;
  if (request.quality !== 'auto') fields.quality = request.quality;
  if (request.background !== 'auto') fields.background = request.background;
  if (request.outputFormat !== 'png') {
    fields.output_format = request.outputFormat;
    if (request.outputCompression < 100) fields.output_compression = request.outputCompression;
  }
  if (request.moderation !== 'auto') fields.moderation = request.moderation;
  return fields;
}

/** Remove anything secret-looking before a message leaves the Host. */
export function redact(text, secrets = []) {
  let out = String(text ?? '');
  for (const secret of secrets) if (typeof secret === 'string' && secret.length >= 6) out = out.split(secret).join('[redacted]');
  return out.replace(/\b(sk|rk|pk)-[A-Za-z0-9_-]{8,}/g, '[redacted]').replace(/Bearer\s+[^\s"']+/gi, 'Bearer [redacted]');
}

function upstreamMessage(text) {
  try {
    const body = JSON.parse(text);
    const message = body?.error?.message ?? body?.message ?? body?.error;
    if (typeof message === 'string' && message.trim()) return message.trim();
  } catch {}
  return String(text ?? '').trim();
}

/** Map an HTTP failure to a stable code with a short, redacted explanation. */
export function httpError(status, text, secrets) {
  const detail = redact(upstreamMessage(text), secrets).slice(0, MAX_ERROR_TEXT);
  const suffix = detail ? `: ${detail}` : '';
  if (status === 401 || status === 403) return new ImageError('unauthorized', `The relay rejected the API key (HTTP ${status})${suffix}`, status);
  if (status === 404) return new ImageError('not-found', `Endpoint not found (HTTP 404) — check the base URL${suffix}`, status);
  if (status === 408 || status === 504) return new ImageError('timeout', `The relay timed out (HTTP ${status})${suffix}`, status);
  if (status === 413) return new ImageError('too-large', `The request is too large for the relay (HTTP 413)${suffix}`, status);
  if (status === 429) return new ImageError('rate-limited', `Rate limit or quota exceeded (HTTP 429)${suffix}`, status);
  if (status >= 500) return new ImageError('upstream', `The relay or Codex failed (HTTP ${status})${suffix}`, status);
  return new ImageError('bad-request', `The relay refused the request (HTTP ${status})${suffix}`, status);
}

export function detectMediaType(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes ?? []);
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b.length >= 12 && b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  if (b.length >= 6 && b[0] === 0x47 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x38) return 'image/gif';
  return undefined;
}

export const EXTENSIONS = Object.freeze({ 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' });

function abortReason(signal) {
  return signal?.reason ?? new DOMException('The operation was aborted', 'AbortError');
}

/**
 * Run `operation(signal)` under the caller's signal plus a deadline. A deadline
 * becomes a `timeout` ImageError; caller cancellation propagates unchanged.
 */
export async function withDeadline(signal, timeoutMs, operation) {
  const controller = new AbortController();
  const onAbort = () => controller.abort(abortReason(signal));
  if (signal?.aborted) throw abortReason(signal);
  signal?.addEventListener('abort', onAbort, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => { timedOut = true; controller.abort(new ImageError('timeout', `No answer from the relay within ${Math.round(timeoutMs / 1000)} s`)); }, timeoutMs);
  try {
    return await operation(controller.signal);
  } catch (error) {
    if (signal?.aborted) throw abortReason(signal);
    if (timedOut) throw new ImageError('timeout', `No answer from the relay within ${Math.round(timeoutMs / 1000)} s`);
    throw error;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
}

async function downloadImage(url, fetchImpl, signal, maxBytes) {
  let parsed;
  try { parsed = new URL(url); } catch { throw new ImageError('invalid-response', 'The relay returned an invalid image URL'); }
  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') throw new ImageError('invalid-response', 'The relay returned a non-http image URL');
  const response = await fetchImpl(parsed.href, { method: 'GET', redirect: 'follow', signal });
  if (!response.ok) throw new ImageError('upstream', `Downloading the generated image failed (HTTP ${response.status})`, response.status);
  const data = new Uint8Array(await response.arrayBuffer());
  if (data.byteLength > maxBytes) throw new ImageError('too-large', 'The generated image is larger than this deployment accepts');
  return data;
}

/** Decode `data[]` of an Images API answer into byte arrays. */
export async function parseImagesResponse(body, { fetchImpl = fetch, signal, maxBytes = 50 * 1024 * 1024 } = {}) {
  const items = Array.isArray(body?.data) ? body.data : undefined;
  if (items === undefined || items.length === 0) throw new ImageError('invalid-response', 'The relay answered without images');
  const images = [];
  for (const item of items) {
    let data;
    if (typeof item?.b64_json === 'string' && item.b64_json.length > 0) data = new Uint8Array(Buffer.from(item.b64_json, 'base64'));
    else if (typeof item?.url === 'string' && item.url.length > 0) {
      if (item.url.startsWith('data:')) {
        const comma = item.url.indexOf(',');
        data = new Uint8Array(Buffer.from(item.url.slice(comma + 1), 'base64'));
      } else data = await downloadImage(item.url, fetchImpl, signal, maxBytes);
    } else continue;
    if (data.byteLength > maxBytes) throw new ImageError('too-large', 'The generated image is larger than this deployment accepts');
    const mediaType = detectMediaType(data);
    if (mediaType === undefined) throw new ImageError('invalid-response', 'The relay returned bytes that are not a PNG, JPEG, WebP or GIF image');
    images.push({ data, mediaType, ...(typeof item.revised_prompt === 'string' && item.revised_prompt ? { revisedPrompt: item.revised_prompt } : {}) });
  }
  if (images.length === 0) throw new ImageError('invalid-response', 'The relay answered without image data');
  const info = {};
  if (typeof body.size === 'string') info.size = body.size;
  if (typeof body.quality === 'string') info.quality = body.quality;
  if (typeof body.background === 'string') info.background = body.background;
  if (typeof body.output_format === 'string') info.outputFormat = body.output_format;
  return { images, info };
}

function multipartName(mediaType, index) {
  return `image-${index + 1}.${EXTENSIONS[mediaType] ?? 'png'}`;
}

/** One `/images/generations` or `/images/edits` call; returns decoded images. */
export async function callImagesApi({ baseURL, apiKey, operation, fields, sources = [], fetchImpl = fetch, signal, maxBytes }) {
  const base = normalizeBaseURL(baseURL);
  const url = base + (operation === 'edit' ? '/images/edits' : '/images/generations');
  const headers = { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' };
  let body;
  if (operation === 'edit') {
    if (sources.length === 0) throw new ImageError('invalid-argument', 'image editing needs at least one source image');
    const form = new FormData();
    for (const [key, value] of Object.entries(fields)) form.append(key, String(value));
    const field = sources.length > 1 ? 'image[]' : 'image';
    sources.forEach((source, index) => form.append(field, new Blob([source.data], { type: source.mediaType }), multipartName(source.mediaType, index)));
    body = form;
  } else {
    headers['content-type'] = 'application/json';
    body = JSON.stringify(fields);
  }
  let response;
  try {
    response = await fetchImpl(url, { method: 'POST', headers, body, redirect: 'error', signal });
  } catch (error) {
    if (signal?.aborted) throw abortReason(signal);
    throw new ImageError('network', `Cannot reach ${new URL(base).host}: ${redact(error?.cause?.message ?? error?.message ?? String(error), [apiKey])}`);
  }
  const text = await response.text();
  if (!response.ok) throw httpError(response.status, text, [apiKey]);
  let json;
  try { json = JSON.parse(text); } catch { throw new ImageError('invalid-response', 'The relay answered with something that is not JSON'); }
  return parseImagesResponse(json, { fetchImpl, signal, maxBytes });
}

/**
 * Generate or edit `request.count` images: one parallel call per image,
 * because the Codex relay returns a single image whatever `n` says.
 */
export async function runImages({ request, baseURL, apiKey, sources = [], fetchImpl = fetch, signal, maxBytes }) {
  const fields = requestFields(request);
  const settled = await Promise.allSettled(Array.from({ length: request.count }, () => withDeadline(signal, request.timeoutMs, (callSignal) =>
    callImagesApi({ baseURL, apiKey, operation: request.operation, fields, sources, fetchImpl, signal: callSignal, maxBytes }))));
  if (signal?.aborted) throw abortReason(signal);
  const images = [];
  const failures = [];
  for (const outcome of settled) {
    if (outcome.status === 'fulfilled') for (const image of outcome.value.images) images.push({ ...image, info: outcome.value.info });
    else failures.push(outcome.reason);
  }
  if (images.length === 0) throw failures[0] ?? new ImageError('invalid-response', 'No image was produced');
  return { images, failures: failures.map((error) => errorText(error, [apiKey])) };
}

export function errorText(error, secrets = []) {
  if (error instanceof ImageError) return redact(error.message, secrets);
  return redact(error?.message ?? String(error), secrets).slice(0, MAX_ERROR_TEXT);
}

/** GET `/models`: ids the relay exposes; never spends a generation. */
export async function listModels({ baseURL, apiKey, fetchImpl = fetch, signal }) {
  const base = normalizeBaseURL(baseURL);
  let response;
  try {
    response = await fetchImpl(base + '/models', { method: 'GET', headers: { Authorization: `Bearer ${apiKey}`, Accept: 'application/json' }, redirect: 'error', signal });
  } catch (error) {
    if (signal?.aborted) throw abortReason(signal);
    throw new ImageError('network', `Cannot reach ${new URL(base).host}: ${redact(error?.cause?.message ?? error?.message ?? String(error), [apiKey])}`);
  }
  const text = await response.text();
  if (!response.ok) throw httpError(response.status, text, [apiKey]);
  let json;
  try { json = JSON.parse(text); } catch { throw new ImageError('invalid-response', 'The relay /models answer is not JSON'); }
  const ids = Array.isArray(json?.data) ? json.data.map((item) => item?.id).filter((id) => typeof id === 'string') : [];
  return ids.sort();
}

// ---------------------------------------------------------------------------
// Tool schemas

/**
 * Compile the author DSL (`required: true` on a property) into the raw JSON
 * Schema subset the DSH tool registry accepts (`required: [...]` arrays).
 */
export function toJsonSchema(node) {
  const { required: _flag, properties, items, ...rest } = node;
  const out = { ...rest };
  if (properties !== undefined) {
    out.properties = {};
    const required = [];
    for (const [key, child] of Object.entries(properties)) {
      out.properties[key] = toJsonSchema(child);
      if (child.required === true) required.push(key);
    }
    if (required.length > 0) out.required = required;
  }
  if (items !== undefined) out.items = toJsonSchema(items);
  return out;
}

/** Parameter map → object-rooted JSON Schema. */
export function parametersSchema(spec) {
  return toJsonSchema({ type: 'object', properties: spec });
}

// ---------------------------------------------------------------------------
// Reference images for editing

/** Images of one message's content, recursing into nested tool-result blocks. */
export function collectImages(blocks) {
  const refs = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    if (block?.type === 'image' && block.attachment && typeof block.attachment === 'object') refs.push(block.attachment);
    if (Array.isArray(block?.content)) refs.push(...collectImages(block.content));
  }
  return refs;
}

export function sameAttachment(actual, requested) {
  if (actual === requested) return true;
  const digest = (value) => /^(?:sha256:)?([0-9a-f]{64})$/i.exec(String(value).trim())?.[1]?.toLowerCase();
  const a = digest(actual);
  return a !== undefined && a === digest(requested);
}

/**
 * Pick edit sources: requested ids in caller order, else every image of the
 * newest user message that has one, else the newest image anywhere.
 */
export function findReferenceImages(messages, ids) {
  const list = Array.isArray(messages) ? messages : [];
  if (ids !== undefined) {
    return ids.map((id) => {
      for (let index = list.length - 1; index >= 0; index -= 1) {
        const found = collectImages(list[index]?.content).reverse().find((ref) => sameAttachment(String(ref.attachmentId), id));
        if (found) return found;
      }
      throw new ImageError('not-found', `Image attachment ${id} is not in this conversation`);
    });
  }
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const message = list[index];
    if (message?.source?.kind !== 'user' && message?.role !== 'user') continue;
    const refs = collectImages(message.content);
    if (refs.length > 0) return refs;
  }
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const refs = collectImages(list[index]?.content);
    if (refs.length > 0) return refs.slice(-1);
  }
  return [];
}

// ---------------------------------------------------------------------------
// Workspace files

/** Whether `child` is `root` or inside it (lexically). */
export function isInside(root, child) {
  const rel = relative(root, child);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel) && rel.split(sep)[0] !== '..');
}

/** Validate a workspace-relative folder name from settings. */
export function safeFolder(value) {
  const folder = String(value ?? '').trim().replace(/\\/g, '/').replace(/^\.\/+/, '').replace(/\/+$/, '');
  if (folder === '' || folder === '.') return '';
  if (isAbsolute(folder) || /^[A-Za-z]:/.test(folder) || folder.split('/').some((part) => part === '..' || part === '')) {
    throw new ImageError('invalid-folder', 'The save folder must be a relative path inside the workspace');
  }
  return folder;
}

/** Absolute path of a user-named workspace file; refuses paths that leave the workspace. */
export function workspacePath(root, requested) {
  const text = String(requested ?? '').trim();
  if (text === '') throw new ImageError('invalid-argument', 'source path must not be empty');
  const absolute = isAbsolute(text) ? resolve(text) : resolve(root, text);
  if (!isInside(resolve(root), absolute)) throw new ImageError('invalid-argument', `source path must stay inside the session workspace: ${text}`);
  return absolute;
}

export function imageFileName(mediaType, now = new Date(), random = randomBytes(4).toString('hex')) {
  const pad = (value) => String(value).padStart(2, '0');
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  return `gpt-image-${stamp}-${random}.${EXTENSIONS[mediaType] ?? 'png'}`;
}

/** Pixel size of PNG / JPEG / WebP / GIF bytes, when cheaply readable. */
export function imageDimensions(bytes) {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  const view = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const type = detectMediaType(b);
  try {
    if (type === 'image/png') return { width: view.getUint32(16), height: view.getUint32(20) };
    if (type === 'image/gif') return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
    if (type === 'image/webp') {
      const chunk = String.fromCharCode(b[12], b[13], b[14], b[15]);
      if (chunk === 'VP8X') return { width: 1 + (b[24] | (b[25] << 8) | (b[26] << 16)), height: 1 + (b[27] | (b[28] << 8) | (b[29] << 16)) };
      if (chunk === 'VP8 ') return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
      if (chunk === 'VP8L') { const bits = view.getUint32(21, true); return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 }; }
    }
    if (type === 'image/jpeg') {
      let offset = 2;
      while (offset + 9 < b.length) {
        if (b[offset] !== 0xff) { offset += 1; continue; }
        const marker = b[offset + 1];
        const length = view.getUint16(offset + 2);
        if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) return { width: view.getUint16(offset + 7), height: view.getUint16(offset + 5) };
        offset += 2 + length;
      }
    }
  } catch {}
  return undefined;
}
