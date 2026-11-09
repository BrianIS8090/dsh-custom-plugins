// Resolve shared dependencies from the single installed Desktop host. Installing
// duplicate Cordis/DSH service classes into this bundle is intentionally unsupported.
import { createRequire } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolveInstalledDshRoot } from './runtime-resolver.js';

const root = resolveInstalledDshRoot();
const team = createRequire(path.join(root, 'dsh-experimental-agent-team', 'package.json'));
const tools = createRequire(path.join(root, 'dsh-experimental-tool-agent-team', 'package.json'));
const load = (resolve, name) => import(pathToFileURL(resolve.resolve(name)).href);
export const { Service } = await load(team, '@deepseek-ai/cordis');
export const { default: schemastery } = await load(team, '@deepseek-ai/schemastery');
export const { HarnessError, createUserMessage } = await load(team, '@deepseek-ai/dsh-llm');
export const { steerHostSubagentPrompt } = await load(team, '@deepseek-ai/dsh-subagent/internal');
export const { brandString } = await load(team, '@deepseek-ai/dsh-brand');
export const { foldSubagentDescriptor } = await load(team, '@deepseek-ai/dsh-subagent');
export const { z } = await load(team, 'zod');
export const { TeamTaskId } = await load(tools, '@deepseek-ai/dsh-experimental-agent-team');
export const { defineTool } = await load(tools, '@deepseek-ai/dsh-tools');
