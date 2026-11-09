import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import { isRunningSession, recentMessageKeys, latestMessageText, createLatestMessageSource, createPreviewRuntime, PREVIEW_LIMIT } from '../src/preview.js';

const node = (key, kind, data = {}, visibility = 'visible') => ({ key, kind, data, visibility });
const reply = (key, text) => node(key, 'assistant-step', { blocks: [{ kind: 'text', text }] });
function targetFixture(initial = []) {
  let nodes = initial;
  const listeners = new Set(), nodeListeners = new Map();
  const store = {
    get: key => nodes.find(n => n.key === key),
    source: key => ({
      getSnapshot: () => store.get(key),
      subscribe(fn) { if (!nodeListeners.has(key)) nodeListeners.set(key, new Set()); nodeListeners.get(key).add(fn); return () => nodeListeners.get(key).delete(fn); },
    }),
  };
  let snapshot = { order: nodes.map(n => n.key), nodes: store };
  const target = { getSnapshot: () => snapshot, subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); } };
  return {
    target,
    replace(next) { nodes = next; snapshot = { order: nodes.map(n => n.key), nodes: store }; for (const fn of [...listeners]) fn(); },
    stream(key, text) { nodes = nodes.map(n => n.key === key ? reply(key, text) : n); for (const fn of [...(nodeListeners.get(key) ?? [])]) fn(); },
    subscriptions: () => listeners.size + [...nodeListeners.values()].reduce((sum, set) => sum + set.size, 0),
  };
}

test('running means exact Agent activity, never selection or unread completion', () => {
  assert.equal(isRunningSession({ running: true }, undefined), true);
  assert.equal(isRunningSession({ running: true }, { running: false }), false);
  assert.equal(isRunningSession({ running: false }, { running: true }), true);
  assert.equal(isRunningSession({ running: true }, undefined, true), false);
  assert.equal(isRunningSession({ completed: true, selected: true }, { completionUnread: true }), false);
  assert.equal(isRunningSession(undefined, undefined), false);
});

test('reads only visible user/steering/assistant text, never context, tools, images or reasoning', () => {
  const f = targetFixture([
    node('u', 'user', { content: 'Question' }), reply('a', 'Answer'),
    node('tool', 'tool-call', { root: { content: 'PRIVATE TOOL RESULT' } }),
    node('context', 'context', { content: 'PRIVATE CONTEXT' }),
    node('hidden', 'assistant-step', { blocks: [{ kind: 'text', text: 'HIDDEN' }] }, 'hidden'),
    node('thinking', 'assistant-step', { blocks: [{ kind: 'reasoning', text: 'PRIVATE REASONING' }, { kind: 'image', attachment: { name: 'photo' } }] }),
  ]);
  assert.equal(latestMessageText(f.target.getSnapshot()), 'Answer');
  assert.deepEqual(recentMessageKeys(f.target.getSnapshot()), ['u', 'a', 'thinking']);
});

test('new messages replace previous text and text streams without rebuilding Chat snapshot', () => {
  const f = targetFixture([node('u', 'user', { content: [{ type: 'text', text: 'Question' }] }), reply('a', 'Hel')]);
  const source = createLatestMessageSource(f.target);
  const observed = [];
  const stop = source.subscribe(() => observed.push(source.getSnapshot()));
  const snapshot = f.target.getSnapshot();
  f.stream('a', 'Hello world');
  assert.equal(f.target.getSnapshot(), snapshot, 'node-only publications must be observed');
  assert.equal(source.getSnapshot(), 'Hello world');
  f.replace([reply('a', 'Hello world'), node('s', 'steering', { content: 'New direction' })]);
  assert.equal(source.getSnapshot(), 'New direction');
  f.replace([reply('b', 'New response')]);
  f.stream('b', 'New response streaming');
  assert.equal(observed.at(-1), 'New response streaming');
  stop();
  assert.equal(f.subscriptions(), 0);
});

test('empty/malformed chat has no placeholder and long messages stay one bounded line', () => {
  assert.equal(latestMessageText(undefined), '');
  const f = targetFixture([node('u', 'user', { content: [{ type: 'image', attachment: { name: 'not-fetched' } }] })]);
  assert.equal(latestMessageText(f.target.getSnapshot()), '');
  f.replace([reply('a', 'Line one\n\nLine two\t' + 'x'.repeat(20000))]);
  const text = latestMessageText(f.target.getSnapshot());
  assert.ok(text.startsWith('Line one Line two '));
  assert.equal(text.length, PREVIEW_LIMIT);
  assert.equal(text.at(-1), '…');
  f.replace([reply('a', '<img src=x onerror=alert(1)>')]);
  assert.equal(latestMessageText(f.target.getSnapshot()), '<img src=x onerror=alert(1)>');
});

test('subscription count stays bounded and releases old node sources on topology replacement', () => {
  const f = targetFixture(Array.from({ length: 100 }, (_, i) => reply(String(i), 'message ' + i)));
  const stop = createLatestMessageSource(f.target).subscribe(() => {});
  assert.equal(f.subscriptions(), 9);
  assert.equal(recentMessageKeys(f.target.getSnapshot()).length, 8);
  f.replace([reply('replacement', 'Fresh')]);
  assert.equal(f.subscriptions(), 2);
  stop();
  assert.equal(f.subscriptions(), 0);
});

function runtimeFixture(target = targetFixture().target, sessionSnapshot = { openState: 'open' }) {
  const calls = [];
  const bindings = new Map();
  const sessions = { retain(id, options) {
    calls.push(['retain', id, options.source]);
    const binding = { sessionId: id, session: { getSnapshot: () => sessionSnapshot, subscribe: () => () => {} } };
    bindings.set(id, binding);
    return { binding, ready: Promise.resolve(binding), release: () => calls.push(['release', id]) };
  } };
  const uiConversation = { binding(binding) {
    assert.equal(bindings.get(binding.sessionId), binding);
    return { target(name) { assert.equal(name, 'chat'); return target; } };
  } };
  return { calls, sessions, uiConversation };
}

test('read-only running lease targets exact nonselected session and releases once', async () => {
  const f = runtimeFixture();
  const runtime = createPreviewRuntime(f.sessions, f.uiConversation);
  const lease = runtime.open('nonselected-running');
  await lease.ready;
  assert.equal(lease.sessionId, 'nonselected-running');
  assert.match(f.calls[0][2], /:running-row$/);
  lease.close(); lease.close(); runtime.dispose();
  assert.equal(f.calls.filter(c => c[0] === 'release').length, 1);
  assert.throws(() => runtime.open('again'), /disposed/);
});

test('disposal closes all owned leases, binding failure cannot leak a lease', () => {
  const f = runtimeFixture();
  const runtime = createPreviewRuntime(f.sessions, f.uiConversation);
  runtime.open('a'); runtime.open('b'); runtime.dispose(); runtime.dispose();
  assert.deepEqual(f.calls.filter(c => c[0] === 'release').map(c => c[1]), ['a', 'b']);
  const failed = createPreviewRuntime(f.sessions, { binding() { throw Error('Unavailable'); } });
  assert.throws(() => failed.open('failed'), /Unavailable/);
  assert.equal(f.calls.at(-1)[0], 'release');
});

// Minimal hook renderer: exercises the real bundled components/effect disposal without a second chat runtime.
function hookRenderer() {
  const records = new Map();
  let current, cursor, dirty = false, effects = [], visited;
  const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => Object.is(v, b[i]));
  const React = {
    Fragment: Symbol('Fragment'),
    createElement: (type, props, ...children) => ({ type, props: { ...props, children } }),
    useState(initial) {
      const slot = cursor++, record = current;
      if (!(slot in record.hooks)) record.hooks[slot] = typeof initial === 'function' ? initial() : initial;
      return [record.hooks[slot], value => { const next = typeof value === 'function' ? value(record.hooks[slot]) : value; if (!Object.is(next, record.hooks[slot])) { record.hooks[slot] = next; dirty = true; } }];
    },
    useMemo(fn, deps) {
      const slot = cursor++, previous = current.hooks[slot];
      if (previous && same(previous.deps, deps)) return previous.value;
      const value = fn(); current.hooks[slot] = { deps, value }; return value;
    },
    useEffect(fn, deps) {
      const slot = cursor++, record = current, previous = record.hooks[slot];
      if (previous && same(previous.deps, deps)) return;
      record.hooks[slot] = { deps, cleanup: previous?.cleanup };
      effects.push(() => { record.hooks[slot].cleanup?.(); record.hooks[slot].cleanup = fn(); });
    },
    useSyncExternalStore(subscribe, getSnapshot) {
      React.useEffect(() => subscribe(() => { dirty = true; }), [subscribe]);
      return getSnapshot();
    },
  };
  function visit(element, path) {
    if (Array.isArray(element)) return element.flatMap((e, i) => visit(e, path + '/' + i));
    if (element == null || typeof element !== 'object') return element;
    if (typeof element.type === 'function') {
      const key = path + '/' + element.type.name + ':' + (element.props.key ?? '');
      visited.add(key);
      if (!records.has(key)) records.set(key, { hooks: [] });
      const old = current, oldCursor = cursor; current = records.get(key); cursor = 0;
      const result = element.type(element.props); current = old; cursor = oldCursor;
      return visit(result, key);
    }
    return { ...element, props: { ...element.props, children: visit(element.props.children, path + '/children') } };
  }
  function unmount() { for (const r of records.values()) for (const hook of r.hooks) hook?.cleanup?.(); records.clear(); }
  return { React, unmount, render(type, props) {
    let output, turns = 0;
    do {
      if (++turns > 20) throw new Error('Render did not settle');
      dirty = false; effects = []; visited = new Set();
      output = visit(React.createElement(type, props), 'root');
      for (const [key, r] of records) if (!visited.has(key)) { for (const hook of r.hooks) hook?.cleanup?.(); records.delete(key); }
      for (const effect of effects) effect();
    } while (dirty);
    return output;
  } };
}

async function loadedPlugin(React) {
  let module;
  const source = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8');
  new Script(source).runInNewContext({ window: { __ModuleLoader__: { load: value => { module = value; } } } });
  return module.factory(name => { assert.equal(name, 'react'); return React; });
}

async function componentFixture(sessionSnapshot, surface = 'hover') {
  const renderer = hookRenderer();
  const f = targetFixture([reply('a', 'First text')]);
  const runtime = runtimeFixture(f.target, sessionSnapshot);
  const cleanup = [], registrations = [];
  const plugin = await loadedPlugin(renderer.React);
  plugin.apply({
    ...runtime,
    effect(fn) { cleanup.push(fn()); },
    locale: { register() { return () => {}; } },
    slots: { inject(seat, fn) { assert.ok(['sidebar.session.row.hover', 'sidebar.session.row.trailing'].includes(seat)); cleanup.push(fn()); }, register(options, component) { registrations.push({ options, component }); return () => {}; } },
  });
  let summary = false, status, archived = false;
  assert.equal(registrations.length, 2);
  const entry = registrations.find(item => item.options.inject().surface === surface);
  const props = { sessionId: 'nonselected', ...entry.options.inject(), t: key => key,
    useSessions: select => select({ byId: { nonselected: { running: summary } } }),
    useSessionStatus: select => select(new Map(status === undefined ? [] : [['nonselected', { running: status }]])),
    useWorkspaces: select => select({ archivedSessionIds: archived ? ['nonselected'] : [] }),
  };
  return { ...f, calls: runtime.calls, registrations,
    state(s, st, a = false) { summary = s; status = st; archived = a; },
    render: () => renderer.render(entry.component, props),
    close() { renderer.unmount(); for (const fn of cleanup.reverse()) fn?.(); },
  };
}
function messageElements(tree) {
  if (tree == null || typeof tree !== 'object') return [];
  if (Array.isArray(tree)) return tree.flatMap(messageElements);
  return [...(tree.props?.['data-running-session-preview'] ? [tree] : []), ...messageElements(tree.props?.children)];
}

test('bundled row: idle retains nothing; nonselected running mounts; streaming updates; idle hides and releases', async () => {
  const f = await componentFixture();
  assert.equal(f.render(), null);
  assert.equal(f.calls.length, 0);
  f.state(true);
  assert.deepEqual(messageElements(f.render())[0].props.children, ['First text']);
  assert.equal(f.calls.filter(c => c[0] === 'retain').length, 1);
  f.stream('a', 'Fresh streamed text');
  assert.deepEqual(messageElements(f.render())[0].props.children, ['Fresh streamed text']);
  f.state(true, false); // live stop overrides a stale catalog summary
  assert.equal(f.render(), null);
  assert.equal(f.calls.filter(c => c[0] === 'release').length, 1);
  assert.equal(f.subscriptions(), 0);
  f.state(true, true);
  assert.equal(messageElements(f.render()).length, 1);
  f.state(true, true, true);
  assert.equal(f.render(), null);
  assert.equal(f.calls.filter(c => c[0] === 'release').length, 2);
  f.close();
});

test('bundled row replaces message, renders hostile markup as text, and cleans up on unload', async () => {
  const f = await componentFixture(); f.state(false, true);
  assert.equal(messageElements(f.render()).length, 1);
  f.replace([reply('b', '<script>private()</script>')]);
  const el = messageElements(f.render())[0];
  assert.equal(el.type, 'span');
  assert.deepEqual(el.props.children, ['<script>private()</script>']);
  assert.equal(el.props.dangerouslySetInnerHTML, undefined);
  f.close();
  assert.equal(f.subscriptions(), 0);
  assert.equal(f.calls.filter(c => c[0] === 'release').length, 1);
});

test('restored bottom line remains independent of hover, streams text and releases on stop', async () => {
  const f = await componentFixture(undefined, 'row');
  assert.equal(f.render(), null);
  f.state(true, true);
  const row = messageElements(f.render())[0];
  assert.equal(row.props.className, 'dsh-running-1e3fa7-row-message');
  assert.equal(row.props['data-preview-surface'], 'row');
  assert.deepEqual(row.props.children, ['First text']);
  f.stream('a', 'Updated bottom line');
  assert.deepEqual(messageElements(f.render())[0].props.children, ['Updated bottom line']);
  f.state(false, false);
  assert.equal(f.render(), null);
  assert.equal(f.subscriptions(), 0);
  assert.equal(f.calls.filter(c => c[0] === 'release').length, 1);
  f.close();
});

test('a resolved opening with openState error never renders a stale message', async () => {
  const f = await componentFixture({ openState: 'error', openError: { message: 'Unavailable' } });
  f.state(true, true);
  assert.equal(messageElements(f.render()).length, 0);
  f.close();
  assert.equal(f.subscriptions(), 0);
  assert.equal(f.calls.filter(c => c[0] === 'release').length, 1);
});

test('both row and hover render one latest text message and never expose reasoning or tools', async () => {
  const source = await readFile(new URL('../dist/client.js', import.meta.url), 'utf8');
  assert.ok(source.includes("ctx.slots.inject('sidebar.session.row.hover'"));
  assert.ok(source.includes("ctx.slots.inject('sidebar.session.row.trailing'"));
  assert.ok(source.includes('width:min(488px,calc(100vw - 24px))'));
  assert.ok(source.includes('max-height:min(240px,32vh)'));
  assert.ok(source.includes('transition:opacity 180ms ease-out'));
  assert.ok(source.includes('@media(prefers-reduced-motion:reduce)'));
  assert.ok(source.includes('createLatestMessageSource(lease.target)'));
  assert.ok(source.includes('height:52px'));
  assert.ok(source.includes('rowResting'));
  assert.ok(source.includes('pointer-events:none'));
  assert.ok(!source.includes('ToolDetails'));
  assert.ok(!source.includes('Disclosure'));
  assert.ok(!source.includes('toolRunning'));
  assert.ok(!source.includes('toolCall'));
  assert.ok(!source.includes("t('reasoning')"));
  assert.ok(!source.includes('renderMarkdown'));
  assert.doesNotMatch(source, /dangerouslySetInnerHTML|document\.|fetch\(|remote\.|mainView|setInterval|setTimeout|MutationObserver|addEventListener|ctx\.llm/);
});
