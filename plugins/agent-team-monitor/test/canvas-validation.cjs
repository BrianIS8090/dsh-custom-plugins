// Production canvas geometry, identity, and chat validation for client.js.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const script = fs.readFileSync(__dirname + '/../client.js', 'utf8');
new Function(script);

const canvasSource = script.slice(script.indexOf('function defaultCardSize'), script.indexOf('function useReducedMotion'));
const members = [{ id: 'lead', role: 'lead' }, ...Array.from({ length: 16 }, (_, index) => ({ id: `agent-${index + 1}`, role: 'teammate' }))];
for (const count of [5, 10, 17]) {
  const visible = members.slice(0, count);
  const sizes = new Map(visible.map(member => [member.id, { width: member.role === 'lead' ? 264 : 246, height: 190 }]));
  const api = new Function('ROUTE_CELL', 'ROUTE_MARGIN', 'CARD_GAP', 'routeCache', `${canvasSource};return {planetaryLayout,geometry,collisionFree,routingObstacles,segmentClear}`)(36, 24, 30, new Map());
  const layout = api.planetaryLayout(visible, sizes);
  assert.equal(api.collisionFree(Object.values(layout.rects)), true, `${count}: card collision`);
  const pairs = [];
  for (const from of visible) for (const to of visible) if (from.id !== to.id) pairs.push([from.id, to.id]);
  for (const [from, to] of pairs) {
    const route = api.geometry(layout, from, to, true);
    assert.ok(route && !/NaN|Infinity/.test(route.d), `${from} → ${to}: invalid route`);
    const obstacles = api.routingObstacles(layout, [from, to]);
    for (let index = 1; index < route.points.length; index++) {
      assert.equal(api.segmentClear(route.points[index - 1], route.points[index], obstacles), true, `${from} → ${to}: edge crosses a card`);
    }
  }
  console.log(`Canvas ${count}: ${layout.rings.length} orbits, ${pairs.length} directed edges, collisions=0`);
}

const roleSource = script.slice(script.indexOf('const ROLE_NAME_CATALOG'), script.indexOf('function mergeMembers'));
const { displayAliases } = new Function(`${roleSource};return {displayAliases}`)();
const roleMembers = [{ id: 'lead', role: 'lead', name: 'lead' }, ...['researcher', 'reviewer', 'coder', 'tester', 'architect', 'analyst', 'writer', 'devops', 'designer'].map((name, index) => ({ id: `agent-${index + 1}`, role: 'teammate', name }))];
const aliases = displayAliases(roleMembers, new Map());
assert.equal(new Set(aliases.values()).size, aliases.size, 'display aliases must be unique');
assert.equal(aliases.get('lead'), 'LEAD');
assert.deepEqual([...aliases.values()].slice(0, 6), ['LEAD', 'Atlas', 'Sentinel', 'Forge', 'Probe', 'Nova']);
const colorSource = script.slice(script.indexOf('const MODEL_NAME_COLORS'), script.indexOf('const ROLE_NAME_CATALOG'));
const { modelNameColor, modelBrand } = new Function(`${colorSource};return {modelNameColor,modelBrand}`)();
assert.equal(modelBrand('deepseek-account', 'deepseek-v4-flash'), 'deepseek');
assert.equal(modelBrand('kimi-coding', 'k3.1-pro'), 'kimi');
assert.equal(modelBrand('openai', 'gpt-5'), 'gpt');
assert.equal(modelNameColor('deepseek', 'deepseek-chat'), '#4D9FFF');
assert.equal(modelNameColor('kimi-coding', 'k3.1-pro'), '#FF9F43');
assert.equal(modelNameColor('openai', 'gpt-5'), '#45C97A');
assert.equal(modelNameColor('custom', 'unknown-model'), undefined);

const chatSource = script.slice(script.indexOf('function textFromContent'), script.indexOf('function MainChatPanel'));
const numberSource = script.match(/function number\(value\) \{[^\n]+\}/)[0];
const { parseChatEntries, parseMainChat } = new Function(`${numberSource}\nconst CHAT_ENTRY_LIMIT=100;\n${chatSource};return {parseChatEntries,parseMainChat}`)();
const t = key => key;
const chatAliases = new Map([['lead', 'LEAD'], ['agent-1', 'Atlas']]);
const entries = [
  { type: 'event', event: { type: 'turn/start', seq: 0, time: 90, data: { turn: 1 } } },
  { type: 'event', event: { type: 'user/message', seq: 1, time: 100, data: { id: 'm1', source: { kind: 'agent-message', senderSessionId: 'lead' }, content: [{ type: 'text', text: 'Team message from lead:' }, { type: 'text', text: 'Research this' }] } } },
  { type: 'event', event: { type: 'assistant/message', seq: 2, time: 200, data: { message: { content: [{ type: 'text', text: 'Done' }] } } } },
  { type: 'event', event: { type: 'tool/call', seq: 3, time: 300, data: { callId: 'call-1', name: 'read', arguments: '{"file_path":"README.md"}' } } },
  { type: 'event', event: { type: 'tool/result', seq: 4, time: 400, data: { message: { source: { callId: 'call-1' }, content: [{ type: 'text', text: 'contents' }] } } } },
  { type: 'event', event: { type: 'user/message', seq: 6, time: 600, data: { id: 'human', source: { kind: 'user' }, content: [{ type: 'text', text: 'Human prompt' }] } } },
  { type: 'transient', event: { type: 'assistant/live-chunk', seq: 5, time: 500, data: {} } },
];
const parsed = parseChatEntries(entries, 'agent-1', chatAliases, t);
assert.equal(parsed.length, 2, 'only inter-agent messages are shown; tools and human messages are excluded');
assert.deepEqual(parsed.map(item => [item.sender, item.recipient]), [['LEAD', 'Atlas'], ['Atlas', 'LEAD']]);
assert.doesNotMatch(chatSource, /tool\/call|tool-result/, 'chat parser must not render tool calls or results');
assert.match(script, /slice\(-limit\)(?!\.reverse\(\))/, 'chat renders newest messages last');
assert.match(script, /className: 'atm-chat-log', ref: logRef/, 'agent chat log is mounted on the scroll container');
assert.match(script, /if \(stickRef\.current\) log\.scrollTop = log\.scrollHeight/, 'agent chat follows new messages while the reader stays at the bottom');
assert.match(script, /restoreRef\.current = \{ height: log\.scrollHeight, top: log\.scrollTop, \.\.\.visibleRef\.current \}/, 'loading older messages keeps the reading position');
assert.match(script, /visible\.count > restore\.count && visible\.firstId !== restore\.firstId/, 'the reading anchor applies only when an older page is prepended');
assert.match(script, /restore\.height = log\.scrollHeight;/, 'unrelated growth rebases the reading anchor instead of dropping it');
const mainParsed = parseMainChat([
  { type: 'event', event: { type: 'user/message', seq: 10, time: 100, data: { id: 'u1', source: { kind: 'user' }, content: [{ type: 'text', text: 'Hello' }] } } },
  { type: 'event', event: { type: 'assistant/message', seq: 11, time: 200, data: { message: { content: [{ type: 'text', text: 'Hi' }] } } } },
  { type: 'event', event: { type: 'user/message', seq: 12, time: 300, data: { id: 'p1', source: { kind: 'agent-message', senderSessionId: 'lead' }, content: [{ type: 'text', text: 'Team message from lead:' }, { type: 'text', text: 'Peer note' }] } } },
  { type: 'event', event: { type: 'assistant/message', seq: 13, time: 400, data: { message: { content: [{ type: 'text', text: 'Reply' }] } } } },
  { type: 'event', event: { type: 'tool/call', seq: 14, time: 500, data: { callId: 'c1', name: 'read', arguments: '{}' } } },
  { type: 'event', event: { type: 'user/message', seq: 15, time: 600, data: { id: 's1', source: { kind: 'subagent-settled', senderSessionId: 'child-1', form: 'notice' }, content: [{ type: 'text', text: 'Background subagent finished' }] } } },
], chatAliases, t);
assert.deepEqual(mainParsed.map(item => [item.sender, item.isUser, item.text]), [
  ['user', true, 'Hello'], ['assistant', false, 'Hi'], ['LEAD', false, 'Peer note'], ['assistant', false, 'Reply'], ['subagentNotice', false, 'Background subagent finished'],
]);
assert.equal(mainParsed[4].isSystem, true, 'subagent notices are not labelled USER');
assert.match(script, /className: 'atm-main-chat'/, 'main chat panel is rendered inside the stage');
assert.match(script, /panelSpace = rect\.width >= 1180 \? 376 : 0/, 'canvas fit reserves space for the main chat panel');
assert.match(script, /className: 'atm-detail-actions'/, 'agent actions must be in the header');
assert.doesNotMatch(script, /className: 'atm-open-main', onClick: openMain/, 'open-main is no longer a full-width button');
const markdownSource = script.slice(script.indexOf('function parseInlineMarkdown'), script.indexOf('function parseMainChat'));
const { parseMarkdown } = new Function(`${markdownSource};return {parseMarkdown}`)();
const blocks = parseMarkdown('# Title\n\nSome **bold**, *italic*, `code` and [link](https://example.com).\n\n- one\n- two\n\n```js\nconst x = 1;\n```\n\n| A | B |\n| --- | --- |\n| 1 | 2 |');
assert.deepEqual(blocks.map(block => block.type), ['heading', 'paragraph', 'list', 'code', 'table']);
assert.equal(blocks[0].children[0], 'Title');
assert.ok(blocks[1].children.some(token => token.type === 'strong'));
assert.ok(blocks[1].children.some(token => token.type === 'link' && token.href === 'https://example.com'));
assert.equal(blocks[2].items.length, 2);
assert.match(blocks[3].text, /const x = 1/);
assert.deepEqual(blocks[4].header.map(cell => cell[0]), ['A', 'B']);
console.log(`Identity and chat validation passed: ${aliases.size} unique aliases, chronological inter-agent messages only`);
