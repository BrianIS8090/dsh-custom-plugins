const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const client = fs.readFileSync(path.join(root, 'client.js'), 'utf8');
const imports = [...new Set([...client.matchAll(/require\(['"]([^'"]+)['"]\)/g)].map(match => match[1]))];
assert.deepEqual(imports, ['react'], 'React is the only browser import');
const tokens = [...new Set([...client.matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map(match => match[1]))];
const allowed = new Set([
  '--dsw-alias-bg-base', '--dsw-alias-bg-layer-1', '--dsw-alias-bg-layer-2', '--dsw-alias-border-l1', '--dsw-alias-border-l2',
  '--dsw-alias-brand-primary', '--dsw-alias-label-primary', '--dsw-alias-label-primary-inverted', '--dsw-alias-label-secondary',
  '--dsw-alias-label-dimmed', '--dsw-alias-label-caption', '--dsw-alias-state-error-primary', '--dsw-alias-state-idle-primary',
  '--dsw-alias-state-success-primary', '--dsw-alias-interactive-bg-active', '--dsw-alias-link',
  '--dsw-alias-markdown-inline-code', '--dsw-alias-markdown-code-block',
  // Conversation shell layout variable: composer seat height, also read by Chat and Trajectory.
  '--dsh-composer-height',
]);
assert.deepEqual(tokens.filter(token => !allowed.has(token)), [], 'only inspected theme tokens are used');
assert.doesNotMatch(client, /#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/, 'client styling uses no literal colors');
assert.doesNotMatch(client, /reasoning|reasoning-chunks|reasoning-delta/, 'client never displays reasoning or chain of thought');
assert.match(client, /'data-conversation-composer-overlay': true/, 'the full-height view opts into the Conversation viewport contract');
assert.match(client, /values\.subagentCatalog/, 'the live subagent catalog supplies real role identities');
assert.match(fs.readFileSync(path.join(root, 'index.js'), 'utf8'), /summary: false/, 'heavy run history stays out of sidebar summaries');
for (const file of ['package.json', 'locale/en.json', 'locale/ru.json']) JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
for (const file of ['index.js', 'projection.js', 'orchestrator.js', 'schema.js', 'client.js']) execFileSync(process.execPath, ['--check', path.join(root, file)], { stdio: 'pipe' });
const orchestrator = fs.readFileSync(path.join(root, 'orchestrator.js'), 'utf8');
assert.match(orchestrator, /const ATTACK_ROUNDS = 2/, 'two attack and revision rounds are wired');
assert.match(orchestrator, /Promise\.all\(\[\s*\[skeptic, verifier\]|Promise\.all\(\[\s*spawn\('skeptic'/, 'skeptic and verifier run independently');
assert.match(orchestrator, /delivery: 'caller'/, 'child completion is awaited by the runner');
assert.match(orchestrator, /activation\.dispose\(\)/, 'all activations are disposed');
console.log(`Static validation passed: ${tokens.length} theme tokens, all JavaScript parses, imports=${imports.join(',')}`);
