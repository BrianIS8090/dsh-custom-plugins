/**
 * Cordis Config of the plugin. Every field is `.volatile()`, so the settings
 * page edits it live without restarting the plugin.
 *
 * A locally linked bundle has no node_modules of its own, so Schemastery is
 * loaded from the running Harness installation (the same ESM copy the Host
 * uses). Without it the plugin still works with defaults; only the settings
 * page cannot save.
 */
import { createRequire } from 'node:module';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { DEFAULTS } from './core.js';

async function loadSchemastery() {
  const bases = [];
  if (typeof process.argv[1] === 'string') bases.push(process.argv[1]);
  if (typeof process.argv[2] === 'string') bases.push(join(process.argv[2], 'package.json'));
  if (typeof process.resourcesPath === 'string') bases.push(join(process.resourcesPath, 'app.asar', 'dsh', 'package.json'));
  if (process.env.DSH_PROFILE_DIR) bases.push(join(process.env.DSH_PROFILE_DIR, 'package.json'));
  if (process.env.DSH_HOME) bases.push(join(process.env.DSH_HOME, 'profiles', 'desktop', 'package.json'));
  bases.push(import.meta.url);
  for (const base of bases) {
    try {
      const require = createRequire(base);
      const manifest = require.resolve('@deepseek-ai/schemastery/package.json');
      const esm = join(dirname(manifest), 'lib', 'index.mjs');
      const mod = existsSync(esm) ? await import(pathToFileURL(esm).href) : require('@deepseek-ai/schemastery');
      const schema = mod.default ?? mod;
      if (typeof schema?.object === 'function' && typeof schema.string === 'function') return schema;
    } catch {}
  }
  return undefined;
}

const z = await loadSchemastery();

/** Mark a field live; hosts without `.volatile()` keep a plain schema. */
const live = (schema) => (typeof schema.volatile === 'function' ? schema.volatile() : schema);

export const Config = z === undefined ? undefined : z.object({
  baseURL: live(z.string().default(DEFAULTS.baseURL).description('OpenAI-compatible relay base URL, including /v1; empty disables all relay requests')),
  apiKeyEnv: live(z.string().default(DEFAULTS.apiKeyEnv).description('Credential reference that holds the relay API key')),
  model: live(z.string().default(DEFAULTS.model).description('Image model for generation')),
  editModel: live(z.string().default(DEFAULTS.editModel).description('Image model for editing; empty = same as model')),
  size: live(z.string().default(DEFAULTS.size).description('auto or WIDTHxHEIGHT')),
  aspectHint: live(z.boolean().default(DEFAULTS.aspectHint).description('Also describe the requested frame in the prompt')),
  quality: live(z.string().default(DEFAULTS.quality).description('auto, low, medium or high')),
  background: live(z.string().default(DEFAULTS.background).description('auto, opaque or transparent')),
  outputFormat: live(z.string().default(DEFAULTS.outputFormat).description('png, jpeg or webp')),
  outputCompression: live(z.number().min(0).max(100).default(DEFAULTS.outputCompression).description('JPEG/WebP compression, 0–100')),
  moderation: live(z.string().default(DEFAULTS.moderation).description('auto or low')),
  count: live(z.number().min(1).max(4).default(DEFAULTS.count).description('Images per call by default')),
  stylePrompt: live(z.string().default(DEFAULTS.stylePrompt).description('Text appended to every prompt')),
  timeoutSeconds: live(z.number().min(10).max(900).default(DEFAULTS.timeoutSeconds).description('Timeout of one request, seconds')),
  saveToWorkspace: live(z.boolean().default(DEFAULTS.saveToWorkspace).description('Save original files into the session workspace')),
  workspaceFolder: live(z.string().default(DEFAULTS.workspaceFolder).description('Workspace-relative folder for saved images')),
});
