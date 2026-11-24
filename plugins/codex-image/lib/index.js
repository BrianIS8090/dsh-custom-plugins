/**
 * Codex image — Host half.
 *
 * Two model tools (`gpt_image_generate`, `gpt_image_edit`) call the Images API
 * of an OpenAI-compatible CLIProxyAPI relay that serves Codex's gpt-image
 * model. Results are stored as durable conversation attachments and,
 * optionally, as original files in the session workspace.
 *
 * Settings are the plugin's volatile Config (edited live from the Plugins
 * page); the API key stays in the Harness credential store and is resolved
 * per call from the configured reference name.
 */
import { mkdir, readFile, realpath, stat, writeFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { Config } from './config.js';
import {
  BACKGROUNDS, DEFAULTS, ImageError, MAX_COUNT, MAX_SOURCES, OUTPUT_FORMATS, QUALITIES,
  detectMediaType, effectiveSettings, errorText, findReferenceImages, imageDimensions, imageFileName,
  isInside, listModels, normalizeBaseURL, parametersSchema, resolveRequest, runImages, safeFolder, toJsonSchema,
  validateKeyRef, workspacePath,
} from './core.js';

export const name = 'codex-image';
export const inject = ['tools', 'attachments', 'credentials'];
export { Config };

export const GENERATE_TOOL = 'gpt_image_generate';
export const EDIT_TOOL = 'gpt_image_edit';
const CHECK_PATH = '/api/codex-image/check';
const PREVIEW_PATH = '/api/codex-image/preview';
const DEFAULT_MAX_BYTES = 50 * 1024 * 1024;

const ATTACHMENT_SCHEMA = {
  type: 'object',
  required: true,
  properties: {
    attachmentId: { type: 'string', required: true },
    mediaType: { type: 'string', required: true },
    bytes: { type: 'integer', required: true },
    width: { type: 'integer', required: true },
    height: { type: 'integer', required: true },
    name: { type: 'string' },
    originalDimensions: {
      type: 'object',
      properties: { width: { type: 'integer', required: true }, height: { type: 'integer', required: true } },
    },
  },
};

const OUTPUT_SCHEMA = {
  type: 'object',
  properties: {
    operation: { type: 'string', required: true },
    model: { type: 'string', required: true },
    prompt: { type: 'string', required: true },
    size: { type: 'string', required: true },
    quality: { type: 'string', required: true },
    background: { type: 'string', required: true },
    images: {
      type: 'array',
      required: true,
      items: {
        type: 'object',
        properties: {
          attachment: ATTACHMENT_SCHEMA,
          savedTo: { type: 'string' },
          saveError: { type: 'string' },
          width: { type: 'integer' },
          height: { type: 'integer' },
          revisedPrompt: { type: 'string' },
        },
      },
    },
    sources: { type: 'integer' },
    failures: { type: 'array', required: true, items: { type: 'string' } },
  },
};

const SHARED_PARAMETERS = {
  size: {
    type: 'string',
    description: 'Frame: "auto" or WIDTHxHEIGHT such as 1024x1024 (square), 1536x1024 (landscape), 1024x1536 (portrait). Omit to use the plugin setting.',
  },
  quality: { type: 'string', enum: [...QUALITIES], description: 'Rendering quality. Omit to use the plugin setting.' },
  background: { type: 'string', enum: [...BACKGROUNDS], description: 'Use "transparent" for stickers, icons and cut-outs. Omit to use the plugin setting.' },
  output_format: { type: 'string', enum: [...OUTPUT_FORMATS], description: 'Requested file format. Omit to use the plugin setting.' },
  count: { type: 'integer', description: `Number of variants, 1-${MAX_COUNT}. Each variant is a separate request. Omit to use the plugin setting.` },
};

function attachmentMeta(ref) {
  return {
    attachmentId: String(ref.attachmentId),
    mediaType: ref.mediaType,
    bytes: ref.bytes,
    width: ref.width,
    height: ref.height,
    ...(typeof ref.name === 'string' ? { name: ref.name } : {}),
    ...(ref.originalDimensions ? { originalDimensions: { width: ref.originalDimensions.width, height: ref.originalDimensions.height } } : {}),
  };
}

function render(verb) {
  return (args, value) => {
    const lines = value.images.map((image, index) => {
      const dims = image.width && image.height ? ` ${image.width}x${image.height}` : '';
      const saved = image.savedTo ? `, saved to ${image.savedTo}` : image.saveError ? `, workspace save failed: ${image.saveError}` : '';
      return `#${index + 1}: attachment ${image.attachment.attachmentId}${dims}${saved}`;
    });
    const failed = value.failures.length > 0 ? ` ${value.failures.length} of ${value.images.length + value.failures.length} requests failed: ${value.failures.join(' | ')}.` : '';
    const text = `${verb} ${value.images.length} image(s) with ${value.model} through the Codex relay (requested size ${value.size}, quality ${value.quality}, background ${value.background}).${failed}\n${lines.join('\n')}\n`
      + 'The images are already attached and shown to the user in the tool card; do not read or search for them again. '
      + 'If you mention an image in your reply you may embed its saved file with Markdown, e.g. ![image](<saved path>).';
    return [{ type: 'text', text }, ...value.images.map((image) => ({ type: 'image', attachment: image.attachment }))];
  };
}

function presentationMeta(args, value) {
  return {
    kind: 'codex-image',
    operation: value.operation,
    model: value.model,
    prompt: value.prompt,
    size: value.size,
    quality: value.quality,
    background: value.background,
    images: value.images.map((image) => ({
      attachmentId: image.attachment.attachmentId,
      ...(image.savedTo ? { savedTo: image.savedTo } : {}),
      ...(image.width ? { width: image.width, height: image.height } : {}),
    })),
    failures: value.failures,
  };
}

export function apply(ctx, config) {
  const settings = () => effectiveSettings(config);
  const maxBytes = () => ctx.attachments?.imageLimits?.maxImageBytes ?? DEFAULT_MAX_BYTES;
  const acceptedTypes = () => ctx.attachments?.imageLimits?.mediaTypes ?? ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];

  async function resolveKey(refName) {
    const ref = validateKeyRef(refName);
    let hit;
    try { hit = await ctx.credentials.resolve(ref); } catch { throw new ImageError('credential-store', 'Cannot read the Harness credential store'); }
    const value = typeof hit?.value === 'string' ? hit.value.trim() : '';
    if (value.length === 0) throw new ImageError('no-key', `No API key is stored under ${ref}. Open Plugins → Codex image (GPT Image) and enter the relay key.`);
    return value;
  }

  async function saveToWorkspace(cwd, folderSetting, image, signal) {
    const folder = safeFolder(folderSetting);
    const root = await realpath(cwd);
    const dir = folder ? resolve(root, folder) : root;
    if (!isInside(root, dir)) throw new ImageError('invalid-folder', 'The save folder leaves the workspace');
    await mkdir(dir, { recursive: true });
    const realDir = await realpath(dir);
    if (!isInside(root, realDir)) throw new ImageError('invalid-folder', 'The save folder resolves outside the workspace');
    const fileName = imageFileName(image.mediaType);
    await writeFile(join(realDir, fileName), image.data, { flag: 'wx', signal });
    return folder ? `${folder}/${fileName}` : fileName;
  }

  async function store(images, current, exec) {
    const cwd = exec.agent?.session?.header?.cwd;
    const out = [];
    for (const image of images) {
      if (!acceptedTypes().includes(image.mediaType)) throw new ImageError('unsupported-type', `This Harness does not accept ${image.mediaType} images`);
      const ref = await ctx.attachments.saveImage({ data: image.data, mediaType: image.mediaType, name: 'gpt-image' });
      const dims = imageDimensions(image.data);
      const entry = { attachment: attachmentMeta(ref), ...(dims ? { width: dims.width, height: dims.height } : {}) };
      if (image.revisedPrompt) entry.revisedPrompt = image.revisedPrompt;
      if (current.saveToWorkspace && typeof cwd === 'string' && cwd.length > 0) {
        try {
          entry.savedTo = await saveToWorkspace(cwd, current.workspaceFolder, image, exec.signal);
        } catch (error) {
          exec.signal?.throwIfAborted?.();
          entry.saveError = errorText(error);
          ctx.logger?.warn?.('codex-image: workspace save failed: %s', entry.saveError);
        }
      }
      out.push(entry);
    }
    return out;
  }

  async function readSources(args, exec) {
    const ids = Array.isArray(args.source_attachment_ids) && args.source_attachment_ids.length > 0 ? args.source_attachment_ids.map(String) : undefined;
    const paths = Array.isArray(args.source_paths) && args.source_paths.length > 0 ? args.source_paths.map(String) : undefined;
    if ((ids?.length ?? 0) + (paths?.length ?? 0) > MAX_SOURCES) throw new ImageError('invalid-argument', `at most ${MAX_SOURCES} source images`);
    const sources = [];
    if (ids !== undefined || paths === undefined) {
      const messages = exec.agent?.session?.deriveMessages?.();
      if (!Array.isArray(messages)) throw new ImageError('invalid-argument', 'image editing needs an active conversation or source_paths');
      const refs = findReferenceImages(messages, ids);
      if (paths === undefined && refs.length === 0) throw new ImageError('invalid-argument', 'There is no image in this conversation to edit; attach one, generate one first, or pass source_paths');
      for (const ref of refs.slice(0, MAX_SOURCES)) {
        const stored = await ctx.attachments.readImage(ref, exec.signal);
        sources.push({ data: stored.data, mediaType: stored.ref?.mediaType ?? ref.mediaType });
      }
    }
    if (paths !== undefined) {
      const cwd = exec.agent?.session?.header?.cwd;
      if (typeof cwd !== 'string' || cwd.length === 0) throw new ImageError('invalid-argument', 'source_paths need a session workspace');
      const root = await realpath(cwd);
      for (const path of paths) {
        const absolute = workspacePath(root, path);
        let real;
        try { real = await realpath(absolute); } catch { throw new ImageError('not-found', `Workspace image not found: ${path}`); }
        if (!isInside(root, real)) throw new ImageError('invalid-argument', `source path resolves outside the workspace: ${path}`);
        const info = await stat(real);
        if (!info.isFile()) throw new ImageError('invalid-argument', `source path is not a file: ${path}`);
        if (info.size > maxBytes()) throw new ImageError('too-large', `source image is too large: ${path}`);
        const data = new Uint8Array(await readFile(real, { signal: exec.signal }));
        const mediaType = detectMediaType(data);
        if (mediaType === undefined) throw new ImageError('invalid-argument', `not a PNG, JPEG, WebP or GIF image: ${path}`);
        sources.push({ data, mediaType });
      }
    }
    return sources;
  }

  async function run(operation, args, exec) {
    const current = settings();
    const baseURL = normalizeBaseURL(current.baseURL);
    const request = resolveRequest(current, args, operation);
    const apiKey = await resolveKey(current.apiKeyEnv);
    const sources = operation === 'edit' ? await readSources(args, exec) : [];
    const { images, failures } = await runImages({ request, baseURL, apiKey, sources, signal: exec.signal, maxBytes: maxBytes() });
    return {
      operation,
      model: request.model,
      prompt: request.prompt,
      size: request.size,
      quality: request.quality,
      background: request.background,
      images: await store(images, current, exec),
      ...(operation === 'edit' ? { sources: sources.length } : {}),
      failures,
    };
  }

  const wrap = (operation) => async (args, exec) => {
    try {
      return await run(operation, args, exec);
    } catch (error) {
      if (exec.signal?.aborted) throw error;
      throw new Error(errorText(error));
    }
  };

  ctx.effect(() => ctx.tools.register({
    name: GENERATE_TOOL,
    description: 'Generate images with OpenAI gpt-image (Codex) through the configured CLIProxyAPI relay. '
      + 'Use when the user asks to draw, create, render or design a picture, illustration, icon, poster, mockup, texture or photo. '
      + 'Write a complete, specific prompt in English or the user\'s language (subject, composition, style, colors, lighting, text to render). '
      + 'Model, size, quality, background, format, variant count, style suffix and saving are taken from the plugin settings unless you pass them. '
      + 'Generated images are attached to the conversation, shown to the user, and saved into the workspace when enabled.',
    parameters: parametersSchema({
      prompt: { type: 'string', required: true, description: 'Complete description of the image to create.' },
      ...SHARED_PARAMETERS,
    }),
    output: { schema: toJsonSchema(OUTPUT_SCHEMA), render: render('Generated'), presentationMeta },
    timeoutMs: 900000,
    isConcurrencySafe: () => true,
    execute: wrap('generate'),
  }), `codex-image: ${GENERATE_TOOL}`);

  ctx.effect(() => ctx.tools.register({
    name: EDIT_TOOL,
    description: 'Edit or combine existing images with OpenAI gpt-image (Codex) through the configured CLIProxyAPI relay: change, restyle, extend, retouch, put objects together, or use images as references. '
      + 'Without source arguments it edits the images of the latest user message that has images, otherwise the newest image in the conversation (including images generated by gpt_image_generate). '
      + 'Pass source_attachment_ids (from earlier tool results or attachments) or workspace source_paths to choose images explicitly; several sources are sent together in the given order. '
      + 'Describe the desired result and what must stay unchanged.',
    parameters: parametersSchema({
      prompt: { type: 'string', required: true, description: 'What to change and what to keep.' },
      source_attachment_ids: { type: 'array', items: { type: 'string' }, description: 'Attachment ids of conversation images to edit, in order.' },
      source_paths: { type: 'array', items: { type: 'string' }, description: 'Workspace-relative paths of PNG/JPEG/WebP images to edit, in order.' },
      ...SHARED_PARAMETERS,
    }),
    output: { schema: toJsonSchema(OUTPUT_SCHEMA), render: render('Edited'), presentationMeta },
    timeoutMs: 900000,
    isConcurrencySafe: () => true,
    execute: wrap('edit'),
  }), `codex-image: ${EDIT_TOOL}`);

  ctx.inject(['connection'], (child) => {
    const register = (path, handler, label) => child.effect(() => child.connection.fetch.register({
      path, methods: ['POST'], requestBody: 'buffered',
      async fetch(request) {
        const denied = await guard(request);
        if (denied) return denied;
        let body = {};
        try {
          const raw = await request.text();
          if (raw.length > 16384) return json({ ok: false, error: 'invalid-request', message: 'Request is too large' }, 413);
          body = raw.trim() ? JSON.parse(raw) : {};
        } catch {
          return json({ ok: false, error: 'invalid-request', message: 'Request body is not JSON' }, 400);
        }
        try {
          return json(await handler(body ?? {}));
        } catch (error) {
          return json({ ok: false, error: error instanceof ImageError ? error.code : 'failed', message: errorText(error) });
        }
      },
    }), label);

    register(CHECK_PATH, async () => {
      const current = settings();
      const baseURL = normalizeBaseURL(current.baseURL);
      const model = current.model.trim() || DEFAULTS.model;
      const apiKey = await resolveKey(current.apiKeyEnv);
      const started = Date.now();
      const models = await listModels({ baseURL, apiKey, signal: AbortSignal.timeout(20000) });
      return { ok: true, ms: Date.now() - started, models, imageModels: models.filter((id) => /image|dall-?e/i.test(id)), hasModel: models.includes(model), model };
    }, 'codex-image: connection check route');

    register(PREVIEW_PATH, async (body) => {
      const current = settings();
      const baseURL = normalizeBaseURL(current.baseURL);
      const prompt = typeof body.prompt === 'string' && body.prompt.trim() ? body.prompt.trim().slice(0, 2000) : 'A small cozy lighthouse on a rocky shore at sunset, soft flat illustration';
      const request = resolveRequest(current, { prompt, count: 1 }, 'generate');
      const apiKey = await resolveKey(current.apiKeyEnv);
      const started = Date.now();
      const { images } = await runImages({ request, baseURL, apiKey, signal: AbortSignal.timeout(request.timeoutMs + 5000), maxBytes: maxBytes() });
      const image = images[0];
      const dims = imageDimensions(image.data);
      return {
        ok: true,
        ms: Date.now() - started,
        model: request.model,
        mediaType: image.mediaType,
        bytes: image.data.byteLength,
        ...(dims ?? {}),
        info: image.info ?? {},
        dataUrl: `data:${image.mediaType};base64,${Buffer.from(image.data).toString('base64')}`,
      };
    }, 'codex-image: preview generation route');
  });

  ctx.logger?.info?.('codex-image: tools %s and %s registered', GENERATE_TOOL, EDIT_TOOL);
}

function json(body, status = 200) {
  return Response.json(body, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}

/** Same-origin JSON requests with the plugin header only (mirrors subscription-quota). */
async function guard(request) {
  let sameOrigin = !request.headers.has('origin');
  try {
    if (request.headers.has('origin')) {
      const origin = new URL(request.headers.get('origin'));
      const authority = new URL(origin.protocol + '//' + request.headers.get('host'));
      sameOrigin = ['http:', 'https:'].includes(origin.protocol) && origin.host === authority.host;
    }
  } catch {}
  if (!sameOrigin || request.headers.get('x-codex-image') !== '1') return json({ ok: false, error: 'forbidden', message: 'Request refused' }, 403);
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) return json({ ok: false, error: 'invalid-request', message: 'JSON expected' }, 415);
  return undefined;
}
