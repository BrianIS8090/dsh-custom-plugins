import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as preview from '../src/preview.js';

const node = (key, kind, data, visibility = 'visible') => ({ key, kind, data, visibility });
const message = (key, text, time = 1) => node(key, 'assistant-step', { status: 'settled', blocks: [{ kind: 'text', text }], time });
const tool = (key, root) => node(key, 'tool-call', { root });
const started = (callId, name, time = 2) => ({ phase: 'start', callId, name, time,
  args: { textPrefix: (key, limit) => key === 'description' ? 'Проверить сборку'.slice(0, limit) : undefined },
  argsRaw: JSON.stringify({ description: 'Проверить сборку', token: 'DO-NOT-SHOW' }), subCalls: [] });
const chat = nodes => ({ order: nodes.map(n => n.key), nodes: new Map(nodes.map(n => [n.key, n])) });
const t = key => key;

test('newest tool action replaces the stale preceding message and carries lifecycle status', () => {
  const entries = preview.activityEntries(chat([message('a', 'Old reply'), tool('t', started('c', 'pwsh'))]), t);
  assert.equal(entries[0].kind, 'tool');
  assert.equal(entries[0].status, 'running');
  assert.match(entries[0].text, /pwsh/);
  assert.match(entries[0].text, /Проверить сборку/);
  assert.doesNotMatch(JSON.stringify(entries), /DO-NOT-SHOW/);
  assert.equal(entries[1].text, 'Old reply');
});

test('preparing, completed, failed and nested tool calls appear with no raw output or arguments', () => {
  const root = { ...started('parent', 'parallel', 1), subCalls: [
    { ...started('child', 'read', 4), kind: 'tool-result', content: [{ type: 'text', text: 'DO-NOT-SHOW' }], isError: true },
  ] };
  const entries = preview.activityEntries(chat([
    tool('parent', root),
    tool('prepare', { phase: 'preparing', callId: 'prep', name: 'write', time: 3, subCalls: [] }),
    tool('done', { kind: 'tool-result', callId: 'ok', name: 'edit', time: 2, isError: false, subCalls: [] }),
  ]), t);
  assert.deepEqual(entries.map(e => e.status), ['error', 'preparing', 'completed', 'running']);
  assert.match(entries[0].text, /read/);
  assert.doesNotMatch(JSON.stringify(entries), /DO-NOT-SHOW/);
});

test('reasoning is a status only; hidden context and unknown plugin payloads never leak', () => {
  const entries = preview.activityEntries(chat([
    message('text', 'Visible'),
    node('r', 'assistant-step', { status: 'running', time: 2, blocks: [{ kind: 'reasoning', text: 'DO-NOT-SHOW' }] }),
    message('hidden', 'DO-NOT-SHOW', 4),
    node('ctx', 'context', { content: 'DO-NOT-SHOW', time: 5 }),
    node('unknown', 'plugin-secret', { content: 'DO-NOT-SHOW', time: 6 }),
  ].map(n => n.key === 'hidden' ? { ...n, visibility: 'hidden' } : n)), t);
  assert.equal(entries[0].kind, 'reasoning');
  assert.equal(entries[0].text, 'reasoning');
  assert.doesNotMatch(JSON.stringify(entries), /DO-NOT-SHOW/);
});

test('activity is bounded, safe plain text and ignores empty malformed snapshots', () => {
  assert.deepEqual(preview.activityEntries(undefined, t), []);
  const entries = preview.activityEntries(chat(Array.from({ length: 100 }, (_, i) => message(String(i), '<script>' + 'x'.repeat(10000), i))), t);
  assert.equal(entries.length, preview.ACTIVITY_LIMIT);
  assert.ok(entries.every(e => e.text.length <= preview.PREVIEW_LIMIT));
  assert.match(entries[0].text, /^<script>/);
});

test('node-only tool updates publish stable snapshots and unsubscription releases every source', () => {
  let nodes = [tool('t', started('c', 'pwsh'))];
  const targetListeners = new Set(), nodeListeners = new Map();
  const store = {
    get: key => nodes.find(n => n.key === key),
    source: key => ({ subscribe(fn) {
      if (!nodeListeners.has(key)) nodeListeners.set(key, new Set());
      nodeListeners.get(key).add(fn);
      return () => nodeListeners.get(key).delete(fn);
    } }),
  };
  const snapshot = { order: ['t'], nodes: store };
  const target = { getSnapshot: () => snapshot, subscribe(fn) { targetListeners.add(fn); return () => targetListeners.delete(fn); } };
  const source = preview.createActivitySource(target, t);
  let updates = 0;
  const stop = source.subscribe(() => updates++);
  const before = source.getSnapshot();
  assert.equal(source.getSnapshot(), before, 'React snapshot must be referentially stable');
  nodes = [tool('t', { ...started('c', 'pwsh'), kind: 'tool-result', isError: false })];
  for (const fn of [...nodeListeners.get('t')]) fn();
  assert.ok(updates > 1);
  assert.equal(source.getSnapshot()[0].status, 'completed');
  assert.notEqual(source.getSnapshot(), before);
  stop();
  assert.equal(targetListeners.size + [...nodeListeners.values()].reduce((n, set) => n + set.size, 0), 0);
});

test('latest nested calls survive the traversal budget of a long-running parallel tool', () => {
  const root = { ...started('root', 'parallel', 1), subCalls: Array.from({ length: 200 }, (_, i) => started('c' + i, 'child-' + i, i + 2)) };
  const entries = preview.activityEntries(chat([tool('root', root)]), t);
  assert.match(entries[0].text, /^child-199/);
  assert.equal(root.subCalls[0].name, 'child-0', 'original dispatch order must remain untouched');
});

test('interrupted calls are not reported as tool failures', () => {
  const entries = preview.activityEntries(chat([tool('t', { kind: 'tool-result', name: 'pwsh', callId: 'c', time: 2, isError: true, error: { name: 'Interrupted', code: 'interrupted' }, subCalls: [] })]), t);
  assert.equal(entries[0].status, 'interrupted');
  assert.equal(entries[0].label, 'toolInterrupted');
});

test('equal timestamps preserve newest dispatch order without rearranging the original tree', () => {
  const entries = preview.activityEntries(chat([tool('t', { ...started('root', 'parallel'), subCalls: [started('first', 'first'), started('last', 'last')] })]), t);
  assert.match(entries[0].text, /^last/);
});

test('mutable partial arguments are read again without replacing their owner or identity', () => {
  let description = 'Сбор';
  const root = { ...started('c', 'pwsh'), phase: 'preparing', args: { textPrefix: key => key === 'description' ? description : undefined } };
  const snapshot = chat([tool('t', root)]);
  const source = preview.createActivitySource({ getSnapshot: () => snapshot }, t);
  assert.match(source.getSnapshot()[0].text, /Сбор$/);
  description = 'Сборка проекта';
  assert.match(source.getSnapshot()[0].text, /Сборка проекта$/);
});

test('commands, retry, compaction and errors expose statuses rather than hidden payloads', () => {
  const entries = preview.activityEntries(chat([
    node('hidden-permission', 'command', { name: 'permission', time: 10, outcome: null }),
    node('hidden-team', 'command', { name: 'team', args: 'on', time: 10, outcome: { kind: 'success' } }),
    node('cmd', 'command', { name: 'goal', args: 'DO-NOT-SHOW', time: 2, outcome: { kind: 'success', text: 'DO-NOT-SHOW' } }),
    node('retry', 'model-retry', { current: { time: 3, retryState: 'scheduled', error: 'DO-NOT-SHOW' } }),
    node('compact', 'compaction', { time: 4, summary: 'DO-NOT-SHOW' }),
    node('error', 'turn-error', { time: 5, message: 'DO-NOT-SHOW' }),
    node('limit', 'turn-max-tokens', { time: 6 }),
    node('manual', 'manual-compaction', { command: { time: 7, outcome: null } }),
  ]), t);
  assert.deepEqual(entries.map(e => e.kind), ['command', 'turn-max-tokens', 'turn-error', 'compaction', 'retry', 'command']);
  assert.doesNotMatch(JSON.stringify(entries), /DO-NOT-SHOW|permission|hidden-team/);
});

// В обеих темах карточка тёмная: нужен её парный hovercard foreground,
// а не цвет текста страницы. Контракт подтверждён design-platform.css rc.3.
test('hover activity uses the host card foreground instead of the page foreground', async () => {
  const client = await readFile(new URL('../src/client.js', import.meta.url), 'utf8');
  const rule = client.match(/\.dsh-running-1e3fa7-message\{([^}]+)\}/)?.[1];
  assert.ok(rule, 'missing hover preview rule');
  assert.match(rule, /(?:^|;)color:var\(--dsw-alias-hovercard-label-primary\)(?:;|$)/);
  assert.doesNotMatch(rule, /color:var\(--dsw-alias-label-primary\)/);
});
