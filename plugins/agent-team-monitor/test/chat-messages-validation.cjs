// Reproduces the empty agent chat after the DSH update: the visible last
// message was sent through send_message, while the initial task has source
// kind=user. Both were discarded by the old inter-agent-only filter.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const script = fs.readFileSync(__dirname + '/../client.js', 'utf8');
const chatSource = script.slice(script.indexOf('function textFromContent'), script.indexOf('function parseInlineMarkdown'));
const numberSource = script.match(/function number\(value\) \{[^\n]+\}/)[0];
const { parseChatEntries } = new Function(`${numberSource}\n${chatSource};return {parseChatEntries}`)();
const aliases = new Map([['lead-id', 'LEAD'], ['agent-3-id', 'Atlas']]);
const runtimeNames = new Map([['lead-id', 'lead'], ['agent-3-id', 'agent-3']]);
const t = key => key;
const event = (seq, type, data) => ({ type: 'event', event: { seq, time: 1000 + seq, type, data } });

const entries = [
  event(5, 'turn/start', { turn: 1 }),
  event(9, 'user/message', {
    source: { kind: 'user' },
    content: [{ type: 'text', text: 'Исследуй GitHub Trending и сохрани отчёт.' }],
  }),
  event(10, 'user/message', {
    source: { kind: 'runtime-context', form: 'snapshot' },
    content: [{ type: 'text', text: '<system-reminder>internal context</system-reminder>' }],
  }),
  event(18, 'assistant/message', {
    message: { content: [{ type: 'tool-call', id: 'call-skill', name: 'skill', arguments: '{"name":"research"}' }] },
  }),
  event(75, 'assistant/message', {
    message: { content: [{ type: 'tool-call', id: 'call-send', name: 'send_message', arguments: JSON.stringify({
      agent: 'lead', message: 'Готов независимый отчёт: 42 кандидата.',
    }) }] },
  }),
];

const parsed = parseChatEntries(entries, 'agent-3-id', aliases, t, 'lead-id', runtimeNames);
assert.deepEqual(parsed.map(item => ({
  sender: item.sender,
  recipient: item.recipient,
  direction: item.direction,
  text: item.text,
})), [
  { sender: 'LEAD', recipient: 'Atlas', direction: 'incoming', text: 'Исследуй GitHub Trending и сохрани отчёт.' },
  { sender: 'Atlas', recipient: 'LEAD', direction: 'outgoing', text: 'Готов независимый отчёт: 42 кандидата.' },
], 'the real initial task and send_message text must appear, without runtime context or unrelated tool calls');

console.log('Agent message validation passed: initial task and send_message are visible, internal tools stay hidden');
