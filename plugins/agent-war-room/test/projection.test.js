import assert from 'node:assert/strict';
import test from 'node:test';
import { createInitialWarRoomState, foldWarRoomEvent, extractUrls, textFromContent, warRoomView } from '../projection.js';
import { outputText, latestAssistantText, lastEventSeq, continuationText } from '../orchestrator.js';
import { stateSchema, viewSchema } from '../schema.js';

function rootEvent(state, type, data, seq = state.firstOwnSeq + 1) {
  return foldWarRoomEvent(state, { type, data, seq, time: 1000 + seq });
}

test('command/run opens a root run and tool result settles its exact id', () => {
  let state = createInitialWarRoomState({ id: 'lead', createdAt: 100 });
  state = rootEvent(state, 'command/run', { commandId: 'cmd-1', name: 'war-room', args: ' Ship it? ' });
  assert.equal(state.runs[0].question, 'Ship it?');
  assert.equal(state.runs[0].origin, 'command');
  const changed = rootEvent(state, 'tool/result', { message: { source: { callId: 'cmd-1' } } }, 2);
  assert.equal(changed.runs[0].status, 'running', 'a command id is not a tool call id');
  state = createInitialWarRoomState({ id: 'lead', createdAt: 100 });
  state = rootEvent(state, 'tool/call', { callId: 'call-1', name: 'war_room', arguments: JSON.stringify({ question: 'Ship it?' }) });
  assert.equal(state.runs[0].id, 'tool-call-1');
  state = rootEvent(state, 'tool/result', { message: { source: { callId: 'call-1' } } });
  assert.equal(state.runs[0].status, 'completed');
  stateSchema.parse(state);
  viewSchema.parse(warRoomView(state));
});

test('child marker binds the role without exposing runtime context or reasoning', () => {
  let state = createInitialWarRoomState({ id: 'child', parentSession: 'lead', createdAt: 100 });
  const noise = rootEvent(state, 'assistant/message', { message: { content: [{ type: 'text', text: 'not yet a member' }] } });
  assert.equal(noise, state);
  state = rootEvent(state, 'user/message', {
    source: { kind: 'user' },
    content: [{ type: 'text', text: '[WAR_ROOM run=cmd-1 role=researcher]\nFind the facts' }],
  });
  assert.equal(state.role, 'researcher');
  assert.equal(state.runId, 'cmd-1');
  state = rootEvent(state, 'turn/start', { turn: 1 });
  assert.equal(state.status, 'running');
  state = rootEvent(state, 'assistant/message', {
    message: { content: [
      { type: 'reasoning', text: 'never surface this' },
      { type: 'text', text: '## Факты\n- A [source](https://example.com/a).' },
    ] },
  });
  assert.equal(state.lastText.includes('never surface'), false);
  assert.equal(state.entries[0].kind, 'fact');
  assert.equal(state.sources[0].url, 'https://example.com/a');
  state = rootEvent(state, 'turn/end', { turn: 1, reason: { kind: 'completed' } });
  assert.equal(state.status, 'done');
  viewSchema.parse(warRoomView(state));
});

test('architect versions retain history and tool traffic stays bounded', () => {
  let state = createInitialWarRoomState({ id: 'architect', createdAt: 100 });
  state = rootEvent(state, 'user/message', { source: { kind: 'user' }, content: [{ type: 'text', text: '[WAR_ROOM run=r role=architect]' }] });
  for (let index = 0; index < 3; index++) {
    state = rootEvent(state, 'turn/start', { turn: index + 1 }, index * 2 + 2);
    state = rootEvent(state, 'assistant/message', { message: { content: [{ type: 'text', text: `# Version ${index + 1}` }] } }, index * 2 + 2.5);
    state = rootEvent(state, 'turn/end', { turn: index + 1, reason: { kind: 'completed' } }, index * 2 + 3);
  }
  assert.equal(state.versions.length, 3);
  assert.equal(state.versions[2].number, 3);
  state = rootEvent(state, 'tool/call', { callId: 'read-1', name: 'web_fetch', arguments: JSON.stringify({ url: 'https://example.com/docs' }) }, 8);
  assert.equal(state.activeTool, 'web_fetch');
  assert.equal(state.entries.at(-1).status, 'running');
  state = rootEvent(state, 'tool/result', { message: { source: { callId: 'read-1' }, content: [{ type: 'text', text: 'https://example.com/reference' }] } }, 9);
  assert.equal(state.activeTool, null);
  assert.equal(state.entries.at(-1).status, 'done');
  assert.equal(state.sources.length, 0, 'URLs in tool arguments and results never create citations');
  state = rootEvent(state, 'tool/call', { callId: 'read-1', name: 'web_fetch', arguments: '{}' }, 10);
  assert.equal(state.entries.length, 4, 'a duplicate call id cannot create another feed move');
  assert.equal(state.activeTool, null, 'a replayed settled call does not resume activity');
  stateSchema.parse(state);
});

test('intermediate architect messages stay in the feed but only a completed pass creates a version', () => {
  let state = createInitialWarRoomState({ id: 'architect', createdAt: 100 });
  state = rootEvent(state, 'user/message', { source: { kind: 'user' }, content: [{ type: 'text', text: '[WAR_ROOM run=r role=architect]' }] }, 1);
  state = rootEvent(state, 'turn/start', { turn: 1 }, 2);
  state = rootEvent(state, 'assistant/message', { message: { content: [{ type: 'text', text: 'Checking the brief' }] } }, 3);
  state = rootEvent(state, 'tool/call', { callId: 'c1', name: 'web_fetch', arguments: '{}' }, 4);
  state = rootEvent(state, 'tool/result', { message: { source: { callId: 'c1' } } }, 5);
  state = rootEvent(state, 'assistant/message', { message: { content: [{ type: 'text', text: 'Reading one more source' }] } }, 6);
  state = rootEvent(state, 'assistant/message', { message: { content: [{ type: 'text', text: '# Draft' }] } }, 7);
  assert.equal(state.versions.length, 0, 'no version before the pass completes');
  assert.equal(state.entries.filter(entry => entry.kind === 'draft').length, 3, 'progress text stays in the feed');
  state = rootEvent(state, 'turn/end', { turn: 1, reason: { kind: 'completed' } }, 8);
  assert.equal(state.versions.length, 1);
  assert.equal(state.versions[0].text, '# Draft');
  assert.equal(state.versions[0].id, 'version-7', 'version keeps the feed link of its message');
  stateSchema.parse(state);
  state = rootEvent(state, 'turn/start', { turn: 2 }, 9);
  state = rootEvent(state, 'assistant/message', { message: { content: [{ type: 'text', text: '# Half revision' }] } }, 10);
  state = rootEvent(state, 'turn/end', { turn: 2, reason: { kind: 'error' } }, 11);
  assert.equal(state.versions.length, 1, 'a failed pass never becomes a version');
  assert.equal(state.pendingDraft, null);
  viewSchema.parse(warRoomView(state));
});

test('continuation reading requires a new successful turn after the boundary', () => {
  const session = events => ({ snapshotEvents: () => events });
  const old = [
    { seq: 1, type: 'turn/start', data: {} },
    { seq: 2, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'initial draft' }] } } },
    { seq: 3, type: 'turn/end', data: { reason: { kind: 'completed' } } },
  ];
  assert.equal(lastEventSeq(session(old)), 3);
  assert.equal(lastEventSeq(session([])), -1);
  const ok = [...old,
    { seq: 4, type: 'user/message', data: {} },
    { seq: 5, type: 'turn/start', data: {} },
    { seq: 6, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'revision' }] } } },
    { seq: 7, type: 'turn/end', data: { reason: { kind: 'completed' } } },
  ];
  assert.equal(continuationText(session(ok), 3, 'architect'), 'revision');
  const failedEarly = [...old,
    { seq: 4, type: 'turn/start', data: {} },
    { seq: 5, type: 'turn/end', data: { reason: { kind: 'error' } } },
  ];
  assert.throws(() => continuationText(session(failedEarly), 3, 'architect'), /continuation failed: error/);
  const aborted = [...old,
    { seq: 4, type: 'turn/start', data: {} },
    { seq: 5, type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'partial' }] } } },
    { seq: 6, type: 'turn/end', data: { reason: { kind: 'aborted' } } },
  ];
  assert.throws(() => continuationText(session(aborted), 3, 'skeptic'), /continuation failed: aborted/);
  assert.throws(() => continuationText(session(old), 3, 'architect'), /did not finish/);
  const silent = [...old,
    { seq: 4, type: 'turn/start', data: {} },
    { seq: 5, type: 'turn/end', data: { reason: { kind: 'completed' } } },
  ];
  assert.throws(() => continuationText(session(silent), 3, 'architect'), /no new response/);
});

test('source extraction strips Markdown and sentence punctuation and deduplicates', () => {
  const text = '[one](https://example.com/a). See https://example.com/a and <https://example.com/b?q=1>.';
  assert.deepEqual(extractUrls(text), ['https://example.com/a', 'https://example.com/b?q=1']);
});

test('inherited transcript never creates a War Room role', () => {
  let state = createInitialWarRoomState({ id: 'fork', createdAt: 100 }, 10);
  const inherited = { type: 'user/message', seq: 2, time: 1, data: { source: { kind: 'user' }, content: [{ type: 'text', text: '[WAR_ROOM run=old role=architect]' }] } };
  assert.equal(foldWarRoomEvent(state, inherited), state);
  assert.equal(state.role, null);
});

test('result reading uses complete text blocks and the latest committed assistant message', () => {
  assert.equal(outputText([{ type: 'reasoning', text: 'hidden' }, { type: 'text', text: 'Result' }]), 'Result');
  assert.equal(latestAssistantText({ snapshotEvents: () => [
    { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'old' }] } } },
    { type: 'assistant/message', data: { message: { content: [{ type: 'text', text: 'new' }] } } },
  ] }), 'new');
  assert.equal(textFromContent([{ type: 'image', name: 'ignored' }, { type: 'text', text: 'visible' }]), 'visible');
});
