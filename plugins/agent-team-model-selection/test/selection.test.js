import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { selectOptions, discoverModels } from '../selection.js';
const parent = { options: { provider: 'old', model: 'old-model', reasoningEffort: 'low' }, session: { requestHeader: () => ({ config: { provider: 'live', model: 'current', reasoningEffort: 'high' } }) } };
const signal = new AbortController().signal;
const llm = {
  listProviders: () => [{ id: 'live', name: 'Live' }, { id: 'other', name: 'Other' }],
  listModels: async provider => [{ provider, id: 'next', name: 'Next' }],
  resolveModelInfo: async (provider, model) => ({ provider, id: model, name: model, reasoning: { efforts: [{ id: 'low', name: 'Low' }, { id: 'high', name: 'High' }], defaultEffort: 'low' } }),
  resolveCallConfig: async config => {
    if (!['live','other','old'].includes(config.provider)) throw new Error('unknown provider');
    if (config.reasoningEffort !== undefined && !['low','high'].includes(config.reasoningEffort)) throw new Error('unsupported effort');
    return { ...config, reasoningEffort: config.reasoningEffort ?? 'low' };
  }
};
test('omission leaves manager inheritance unchanged and performs no preflight', async () => {
  assert.equal(await selectOptions({}, parent, {}, signal), undefined);
});
test('provider and model must be paired', async () => {
  await assert.rejects(selectOptions(llm, parent, {provider:'other'}, signal), /together/);
  await assert.rejects(selectOptions(llm, parent, {model:'next'}, signal), /together/);
});
test('effort-only uses latest logged route, not stale creation options', async () => {
  assert.deepEqual(await selectOptions(llm, parent, {reasoning_effort:'low'}, signal), {provider:'live', model:'current', reasoningEffort:'low'});
});
test('same route inherits effort', async () => {
  assert.equal((await selectOptions(llm, parent, {provider:'live',model:'current'}, signal)).reasoningEffort, 'high');
});
test('new provider clears inherited effort and resolves its default', async () => {
  assert.deepEqual(await selectOptions(llm, parent, {provider:'other',model:'next'}, signal), {provider:'other',model:'next',reasoningEffort:'low'});
});
test('new model on same provider also clears inherited effort', async () => {
  assert.equal((await selectOptions(llm, parent, {provider:'live',model:'next'}, signal)).reasoningEffort, 'low');
});
test('explicit effort accompanies selected route', async () => {
  assert.equal((await selectOptions(llm, parent, {provider:'other',model:'next',reasoning_effort:'high'}, signal)).reasoningEffort,'high');
});
test('invalid effort rejects before child creation', async () => {
  await assert.rejects(selectOptions(llm, parent, {reasoning_effort:'made-up'}, signal), /unsupported/);
});
test('unknown provider rejects', async () => {
  await assert.rejects(selectOptions(llm, parent, {provider:'missing',model:'next'}, signal), /unknown/);
});
test('before first request the creation options are the fallback', async () => {
  const early = {...parent, session:{requestHeader:()=>undefined}};
  assert.equal((await selectOptions(llm, early, {reasoning_effort:'high'}, signal)).provider,'old');
});
test('selection never mutates parent options or logged header', async () => {
  const before = JSON.stringify(parent.options);
  await selectOptions(llm,parent,{provider:'other',model:'next'},signal);
  assert.equal(JSON.stringify(parent.options),before);
  assert.equal(parent.session.requestHeader().config.reasoningEffort,'high');
});
test('discovery is progressive and unknown providers fail before catalog lookup', async () => {
  assert.equal((await discoverModels(llm,{},signal)).providers.length,2);
  assert.equal((await discoverModels(llm,{provider:'other'},signal)).models[0].id,'next');
  assert.equal((await discoverModels(llm,{provider:'other',model:'next'},signal)).reasoning.defaultEffort,'low');
  await assert.rejects(discoverModels(llm,{provider:'missing'},signal), /not registered/);
  await assert.rejects(discoverModels(llm,{model:'next'},signal), /requires provider/);
});
test('domain forwards overrides into native durable activation; never rewrites parent', async () => {
  const domain = await readFile(new URL('../vendor/agent-team/package/lib/index.js',import.meta.url),'utf8');
  assert.match(domain, /agentOptions: request.agentOptions/);
  assert.doesNotMatch(domain, /root\.options\s*=/);
  assert.doesNotMatch(domain, /live\?\.options\.model \?\? root\.options\.model/);
});
test('Team schema exposes selection with preflight before spawning', async () => {
  const tool = await readFile(new URL('../vendor/tool-agent-team/package/lib/index.js',import.meta.url),'utf8');
  assert.match(tool,/reasoning_effort: \{ type: "string"/);
  assert.ok(tool.indexOf('await selectOptions(') < tool.indexOf('await ctx.agentTeams.spawnTeammate('));
  assert.match(tool,/\.\.\.\(agentOptions === undefined \? \{\} : \{ agentOptions \}\)/);
});
