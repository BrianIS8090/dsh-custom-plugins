// Behavioural check for the agent chat: chronological order, follow-newest
// auto-scroll, pause while the reader is away from the bottom, and a stable
// reading position when earlier history is paged in.
//
// The production AgentChat is executed on a minimal React shim, so the real
// component code (not a copy of its logic) drives a fake scroll container.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

const client = fs.readFileSync(path.join(__dirname, '..', 'client.js'), 'utf8');
const start = client.indexOf('function textFromContent(');
const end = client.indexOf('function AgentDetails(');
assert.ok(start > 0 && end > start, 'client.js layout changed: cannot slice the chat source');
const chatSource = client.slice(start, end);
assert.match(chatSource, /const AgentChat = React\.forwardRef/, 'the sliced source must contain AgentChat');

// Fake scroll container: content height is derived from the rendered message count.
const metrics = { top: 0, base: 900, perMessage: 700, count: 0, clientHeight: 300 };
const logNode = {
  get scrollTop() { return metrics.top; },
  set scrollTop(value) { metrics.top = value; },
  get scrollHeight() { return metrics.base + metrics.perMessage * Math.max(0, metrics.count - 3); },
  get clientHeight() { return metrics.clientHeight; },
};

// Minimal React: one hook list, layout effects after the commit, effects after that.
const state = { hooks: [], cursor: 0, layoutQueue: [], effectQueue: [], dirty: false, tree: null, props: null, component: null, scheduling: false, scroller: null, forwardedRef: null };
const React = {
  createElement(type, config, ...children) {
    const element = { type, props: { ...(config || {}) }, children: children.flat(Infinity) };
    const ref = element.props.ref;
    if (element.props.className === 'atm-chat-log') {
      if (ref) ref.current = logNode;
      state.scroller = element.props.onScroll;
    }
    delete element.props.ref;
    return element;
  },
  forwardRef(render) { return { __forward: true, render }; },
  useState(initial) {
    const index = state.cursor++;
    if (!(index in state.hooks)) state.hooks[index] = typeof initial === 'function' ? initial() : initial;
    const set = value => {
      const next = typeof value === 'function' ? value(state.hooks[index]) : value;
      if (Object.is(next, state.hooks[index])) return;
      state.hooks[index] = next;
      state.dirty = true;
      schedule();
    };
    return [state.hooks[index], set];
  },
  useRef(initial) {
    const index = state.cursor++;
    if (!(index in state.hooks)) state.hooks[index] = { current: initial };
    return state.hooks[index];
  },
  useEffect(fn, deps) { register(state.effectQueue, fn, deps); },
  useLayoutEffect(fn, deps) { register(state.layoutQueue, fn, deps); },
  useImperativeHandle(ref, factory) { state.cursor++; if (ref) ref.current = factory(); },
  useCallback(fn) { state.cursor++; return fn; },
  useMemo(fn) { state.cursor++; return fn(); },
};
function register(target, fn, deps) {
  const index = state.cursor++;
  const previous = state.hooks[index];
  const changed = !previous || !deps || !previous.deps || deps.length !== previous.deps.length || deps.some((dep, i) => dep !== previous.deps[i]);
  state.hooks[index] = { deps };
  if (changed) target.push(fn);
}
function schedule() {
  if (state.scheduling) return;
  state.scheduling = true;
  queueMicrotask(() => { state.scheduling = false; render(); });
}
function render() {
  for (let round = 0; round < 30; round++) {
    state.dirty = false;
    state.cursor = 0;
    state.layoutQueue = [];
    state.effectQueue = [];
    state.scroller = null;
    state.tree = state.component.__forward ? state.component.render(state.props, state.forwardedRef) : state.component(state.props);
    metrics.count = articles(state.tree).length;
    const layout = state.layoutQueue, effects = state.effectQueue;
    state.layoutQueue = [];
    state.effectQueue = [];
    for (const fn of layout) fn();
    for (const fn of effects) fn();
    if (!state.dirty) return;
  }
  throw new Error('agent chat did not settle');
}

const constants = { EMPTY_LIST: [], CHAT_ENTRY_LIMIT: 100, CHAT_FOLLOW_PX: 48, RECENT_MESSAGE_MS: 14000 };
const helpers = {
  number: value => (typeof value === 'number' && Number.isFinite(value) ? value : 0),
  icon: name => ({ type: 'icon', props: { name }, children: [] }),
  formatClock: () => '00:00:00',
  formatAgo: () => '',
  formatDuration: () => '',
  formatNumber: String,
  formatCompact: String,
  totalTokenDisplay: () => ({ kind: 'exact', value: '0' }),
  tokensOf: () => ({}),
  activeMilliseconds: () => 0,
  statusOf: () => 'inactive',
  statusLabel: () => '',
  roleLabel: () => '',
  modelNameColor: () => undefined,
};
const h = React.createElement;
const { AgentChat } = new Function(
  'React', 'h', 'requires',
  `const { ${Object.keys(constants).join(', ')} } = requires.constants;
   const { ${Object.keys(helpers).join(', ')} } = requires.helpers;
   ${chatSource}
   return { AgentChat };`,
)(React, h, { constants, helpers });

function event(seq, time, type, data) { return { type: 'event', event: { seq, time, type, data } }; }
function peerMessage(seq, time, sender, text) {
  return event(seq, time, 'user/message', { source: { kind: 'agent-message', senderSessionId: sender }, content: [{ type: 'text', text: `Team message from ${sender}:\n${text}` }] });
}
function assistantMessage(seq, time, text) {
  return event(seq, time, 'assistant/message', { message: { content: [{ type: 'text', text }] } });
}
function articles(node, out = []) {
  if (!node || typeof node !== 'object') return out;
  if (node.type === 'article' && String(node.props?.className || '').startsWith('atm-chat-entry')) {
    const strings = [];
    const walk = inner => {
      if (typeof inner === 'string') { strings.push(inner); return; }
      if (!inner || typeof inner !== 'object') return;
      for (const child of inner.children || []) walk(child);
    };
    walk(node);
    out.push(strings.join(' | '));
    return out;
  }
  for (const child of node.children || []) articles(child, out);
  return out;
}
const turn = () => new Promise(resolve => setTimeout(resolve, 5));
const text = index => articles(state.tree).at(index) || '';

// A store that behaves like the real session: the snapshot is updated and the
// subscribers are notified before loadOlder() resolves.
let entries = [];
let listeners = [];
let olderPages = [];
let raceMessage = null;
let heightAfterRace = 0;
const binding = {
  eventSource: {
    getSnapshot: () => ({ entries, hasMore: olderPages.length > 0 }),
    subscribe(fn) { listeners.push(fn); return () => { listeners = listeners.filter(item => item !== fn); }; },
  },
  session: {
    getSnapshot: () => ({ openState: 'ready' }),
    async loadOlder() {
      // A live message may land between the click and the earlier page, in its
      // own snapshot update.
      if (raceMessage) {
        entries = [...entries, raceMessage];
        raceMessage = null;
        for (const fn of listeners) fn();
        await turn();
        heightAfterRace = logNode.scrollHeight;
      }
      const page = olderPages.shift();
      if (page) entries = [...page, ...entries];
      for (const fn of listeners) fn();
    },
  },
};
const sessions = { retain: () => ({ ready: Promise.resolve(binding), release() {} }) };
const aliases = new Map([['lead', 'LEAD'], ['agent-1', 'Atlas']]);
const nameColors = new Map([['lead', '#4D9FFF'], ['agent-1', '#FF9F45']]);
const t = key => key;
const deliver = () => { for (const fn of listeners) fn(); };

(async () => {
  entries = [peerMessage(1, 100, 'lead', 'first'), assistantMessage(2, 200, 'second'), peerMessage(3, 300, 'lead', 'third')];
  const chatRef = { current: null };
  state.forwardedRef = chatRef;
  state.props = { agentId: 'agent-1', leadId: 'lead', aliases, sessions, nameColors, t, locale: 'ru-RU' };
  state.component = AgentChat;
  state.hooks = [];
  render();
  await turn();
  render();

  // Chronological order, opened on the newest message.
  assert.deepEqual(articles(state.tree).map(item => ['first', 'second', 'third'].find(token => item.includes(token))), ['first', 'second', 'third'], 'oldest message must be rendered first');
  assert.equal(metrics.top, logNode.scrollHeight, 'opening the chat must reveal the newest message');

  // A new message keeps the log pinned to the bottom.
  entries = [...entries, peerMessage(4, 400, 'lead', 'fourth')];
  deliver();
  await turn();
  render();
  assert.match(text(-1), /fourth/, 'the new message must be appended at the bottom');
  assert.equal(metrics.top, logNode.scrollHeight, 'a new message must scroll the log to the bottom');

  // Reading history is not yanked by live traffic.
  metrics.top = 120;
  state.scroller({ currentTarget: logNode });
  entries = [...entries, peerMessage(5, 500, 'lead', 'fifth')];
  deliver();
  await turn();
  render();
  assert.equal(metrics.top, 120, 'a reader away from the bottom must keep their position');
  assert.match(text(-1), /fifth/, 'the message must still be appended');

  // Paging in earlier history keeps the reading position.
  metrics.top = 400;
  const heightBefore = logNode.scrollHeight;
  olderPages = [[peerMessage(0, 50, 'lead', 'older-1')]];
  await chatRef.current.loadOlder();
  await turn();
  render();
  assert.equal(metrics.top, 400 + (logNode.scrollHeight - heightBefore), 'paging in earlier history must keep the reading position');
  assert.match(text(0), /older-1/, 'the paged-in message must be rendered first');

  // Returning to the bottom resumes following the newest message.
  metrics.top = logNode.scrollHeight - logNode.clientHeight;
  state.scroller({ currentTarget: logNode });
  entries = [...entries, peerMessage(6, 600, 'lead', 'sixth')];
  deliver();
  await turn();
  render();
  assert.equal(metrics.top, logNode.scrollHeight, 'following must resume at the bottom');

  // A live message that lands while the earlier page is still loading must not
  // drop the reading anchor: only the prepended page may move the viewport.
  metrics.top = 200;
  raceMessage = peerMessage(7, 700, 'lead', 'race-live');
  olderPages = [[peerMessage(-1, 10, 'lead', 'older-a')]];
  await chatRef.current.loadOlder();
  await turn();
  render();
  assert.equal(metrics.top, 200 + (logNode.scrollHeight - heightAfterRace), 'a concurrent live message must not drop the reading anchor');
  assert.match(text(0), /older-a/, 'the paged-in message must be rendered first');
  assert.match(text(-1), /race-live/, 'the live message must stay the newest one');

  console.log('Agent chat validation passed: chronological order, follow-newest, stable reading position');
})();
