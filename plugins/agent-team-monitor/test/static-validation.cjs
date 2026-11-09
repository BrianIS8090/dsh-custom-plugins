const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const client = fs.readFileSync(path.join(root, 'client.js'), 'utf8');
const allowed = new Set([
  '--dsw-alias-bg-base',
  '--dsw-alias-bg-layer-1',
  '--dsw-alias-bg-layer-2',
  '--dsw-alias-bg-overlay',
  '--dsw-alias-border-l1',
  '--dsw-alias-border-l2',
  '--dsw-alias-brand-primary',
  '--dsw-alias-label-primary',
  '--dsw-alias-label-secondary',
  '--dsw-alias-state-error-primary',
  '--dsw-alias-state-idle-primary',
  '--dsw-alias-state-success-primary',
  '--dsw-alias-state-warn-primary',
  '--dsw-specific-sidebar-fill',
  '--atm-stats-height',
]);
const tokens = [...new Set([...client.matchAll(/var\((--[a-zA-Z0-9-]+)/g)].map(match => match[1]))];
assert.deepEqual(tokens.filter(token => !allowed.has(token)), [], 'only inspected theme tokens are used');
const imports = [...new Set([...client.matchAll(/require\(['"]([^'"]+)['"]\)/g)].map(match => match[1]))];
assert.deepEqual(imports, ['react'], 'React is the only browser import');
assert.doesNotMatch(client, /number\(tokens\.total\)\s*\|\|/, 'reported total has no arithmetic fallback');
assert.doesNotMatch(client, /CSS\.escape\(/, 'card lookup must not depend on CSS.escape');
assert.match(client, /style\[data-plugin-css\]/, 'stale plugin stylesheets must be discovered and replaced');
assert.match(client, /fill: 'none'/, 'SVG orbits and routes must have explicit fill none');
assert.match(client, /\.atm-main-chat-body\{[^}]*min-height:0/, 'main chat body must be a constrained flex container');
assert.match(client, /\.atm-main-chat-log\{[^}]*overflow-y:auto/s, 'main chat log must scroll vertically');
assert.match(client, /\.atm-chat-panel\{[^}]*min-height:0/, 'agent chat panel must be height-constrained');
assert.match(client, /\.atm-chat-log\{[^}]*overflow-y:auto/s, 'agent chat log must scroll vertically');
assert.match(client, /closest\('\.atm-main-chat,\.atm-details,\.atm-controls,\.atm-topbar'\)/, 'canvas zoom must ignore wheel events over panels');
assert.match(client, /addEventListener\('wheel', stopWheel/, 'panels must stop wheel propagation before canvas zoom');
assert.match(client, /className: 'atm-card-model'/, 'agent cards show the model row');
assert.match(client, /requestConfig\?\.reasoningEffort/, 'reasoning effort is read from the request header');
const literalColors = [...new Set([...client.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map(match => match[0].toUpperCase()))].sort();
assert.deepEqual(literalColors, ['#45C97A', '#4D9FFF', '#FF9F43'], 'only the three model-name colors may be literal');
assert.doesNotMatch(client, /rgba?\(|hsla?\(/, 'client CSS uses no literal rgb/hsl colors');
for (const file of ['package.json', 'locale/en.json', 'locale/ru.json']) {
  JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}
console.log(`Static validation passed: ${tokens.length} theme tokens, imports=${imports.join(',')}`);
