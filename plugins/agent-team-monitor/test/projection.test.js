import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialMonitorState, foldMonitorEvent, monitorView, monitorInternals } from '../projection.js';

const header = { id: 'member-a', createdAt: 100 };
let sequence = 0;
const event = (type, time, data = {}) => ({ type, time, data, seq: ++sequence });
const fold = (state, events) => events.reduce(foldMonitorEvent, state);

test('provider usage is summed with an unreported-total marker and optional breakdowns', () => {
  const initial = createInitialMonitorState(header);
  const state = fold(initial, [
    event('step/start', 100, { turn: 1, step: 1 }),
    event('assistant/message', 200, {
      turn: 1,
      step: 1,
      message: { content: [{ type: 'text', text: 'Done' }] },
      usage: { inputTokens: 100, outputTokens: 20, cacheReadTokens: 60, reasoningTokens: 5 },
    }),
    event('step/start', 300, { turn: 1, step: 2 }),
    event('assistant/message', 400, {
      turn: 1,
      step: 2,
      message: { content: [] },
      usage: { inputTokens: 50, outputTokens: 10, totalTokens: 75, cacheWriteTokens: 4 },
    }),
    event('assistant/message', 500, {
      turn: 1,
      step: 3,
      message: { content: [] },
      usage: { inputTokens: Number.NaN, outputTokens: 99 },
    }),
  ]);
  assert.deepEqual(state.tokens, {
    input: 150,
    output: 30,
    total: 75,
    unreportedTotal: 1,
    cacheRead: 60,
    cacheWrite: 4,
    reasoning: 5,
  });
  assert.equal(state.llmMs, 200);
  assert.equal(state.lastAction.kind, 'message');
});

test('turn, model and tool time use durable boundaries', () => {
  const initial = createInitialMonitorState(header);
  const running = fold(initial, [
    event('turn/start', 1000, { turn: 1 }),
    event('step/start', 1100, { turn: 1, step: 1 }),
  ]);
  assert.equal(running.openTurnStartedAt, 1000);
  assert.equal(running.activity.kind, 'thinking');

  const withTool = fold(running, [
    event('assistant/message', 2100, {
      turn: 1,
      step: 1,
      message: { content: [{ type: 'text', text: 'Calling a tool' }] },
      usage: { inputTokens: 10, outputTokens: 2 },
    }),
    event('tool/call', 2200, { turn: 1, step: 1, callId: 'call-1', name: 'read' }),
  ]);
  assert.deepEqual(withTool.activity, { kind: 'tool', at: 2200, toolName: 'read' });

  const completed = fold(withTool, [
    event('tool/result', 3000, {
      turn: 1,
      step: 1,
      message: { source: { callId: 'call-1' }, content: [] },
    }),
    event('step/end', 3100, { turn: 1, step: 1 }),
    event('turn/end', 4000, { turn: 1, reason: { kind: 'completed' } }),
  ]);
  assert.equal(completed.activeMs, 3000);
  assert.equal(completed.llmMs, 1000);
  assert.equal(completed.toolMs, 800);
  assert.equal(completed.steps, 1);
  assert.equal(completed.turns, 1);
  assert.equal(completed.openTurnStartedAt, null);
  assert.equal(completed.activity, null);
  assert.deepEqual(completed.pendingCalls, {});
  assert.equal(completed.lastAction.kind, 'idle');
});

test('peer messages retain sender, target, count and bounded readable preview', () => {
  const initial = createInitialMonitorState(header);
  const peer = {
    id: 'message-1',
    source: { kind: 'agent-message', senderSessionId: 'member-b' },
    content: [
      { type: 'text', text: 'Team message from reviewer:' },
      { type: 'text', text: '  Review\n completed ' },
      { type: 'text', text: 'without issues' },
    ],
  };
  const state = fold(initial, [
    event('user/message', 500, { source: { kind: 'user' }, content: [{ type: 'text', text: 'Human' }] }),
    event('user/message', 600, peer),
    event('user/message', 700, peer),
  ]);
  assert.equal(state.messageCount, 1);
  assert.deepEqual(state.messages, [{
    id: 'message-1',
    senderId: 'member-b',
    senderName: 'reviewer',
    targetId: 'member-a',
    time: 600,
    preview: 'Review completed without issues',
  }]);
  assert.equal(state.lastAction.kind, 'peer-message');

  const many = Array.from({ length: 85 }, (_, index) => event('user/message', 1000 + index, {
    id: `message-${index + 2}`,
    source: { kind: 'agent-message', senderSessionId: 'member-b' },
    content: [{ type: 'text', text: `Body ${index}` }],
  }));
  const bounded = fold(state, many);
  assert.equal(bounded.messageCount, 86);
  assert.equal(bounded.messages.length, monitorInternals.MAX_MESSAGES);
  assert.equal(bounded.messages.at(-1).preview, 'Body 84');
});

test('accepted inbox peer messages appear immediately, deduplicate on admission, and roll back when canceled', () => {
  const initial = createInitialMonitorState(header);
  const peer = {
    id: 'inbox-message-1',
    source: { kind: 'agent-message', form: 'relay', senderSessionId: 'member-b' },
    content: [{ type: 'text', text: 'Team message from reviewer:' }, { type: 'text', text: 'Accepted' }],
  };
  const accepted = foldMonitorEvent(initial, event('agent/inbox/spliced', 400, {
    target: 'next-step', start: 0, removedCount: 0, inserted: [peer],
  }));
  assert.equal(accepted.messageCount, 1);
  assert.equal(accepted.messages[0].preview, 'Accepted');
  assert.deepEqual(accepted.peerInbox['next-step'], ['inbox-message-1']);

  const admitted = foldMonitorEvent(accepted, event('user/message', 500, peer));
  assert.equal(admitted, accepted);
  assert.equal(admitted.messageCount, 1);

  const canceled = foldMonitorEvent(accepted, event('agent/inbox/spliced', 450, {
    target: 'next-step', start: 0, removedCount: 1, inserted: [], outcome: 'canceled',
  }));
  assert.equal(canceled.messageCount, 0);
  assert.deepEqual(canceled.messages, []);
  assert.deepEqual(canceled.seenPeerMessageIds, []);
  assert.deepEqual(canceled.peerInbox['next-step'], []);
});

test('reported total remains independent from input, output and cache fields', () => {
  const state = foldMonitorEvent(createInitialMonitorState(header), event('assistant/message', 100, {
    turn: 1,
    step: 1,
    message: { content: [] },
    usage: { inputTokens: 33455, outputTokens: 2142, totalTokens: 89357, cacheReadTokens: 53760 },
  }));
  assert.equal(state.tokens.total, 89357);
  assert.equal(state.tokens.input + state.tokens.output + state.tokens.cacheRead, state.tokens.total);
  assert.equal(state.tokens.unreportedTotal, 0);
});

test('Team member metadata preserves creation time and updates purpose and phase', () => {
  const initial = createInitialMonitorState({ id: 'lead-id', createdAt: 100 }, 0);
  const provisioning = foldMonitorEvent(initial, event('team/member', 200, {
    version: 2,
    teamId: 'lead-id',
    member: { id: 'child-id', name: 'researcher', description: 'Research APIs', provider: 'spawn', context: 'fresh', phase: 'provisioning' },
  }));
  const active = foldMonitorEvent(provisioning, event('team/member', 400, {
    version: 2,
    teamId: 'lead-id',
    member: { id: 'child-id', name: 'researcher', description: 'Research APIs', provider: 'spawn', context: 'fresh', phase: 'active' },
  }));
  const otherTeam = foldMonitorEvent(active, event('team/member', 500, {
    version: 2,
    teamId: 'other-lead',
    member: { id: 'other-child', name: 'other', description: 'Other', provider: 'spawn', context: 'fresh', phase: 'active' },
  }));
  assert.equal(otherTeam, active);
  assert.deepEqual(active.teamMembers, [{
    id: 'child-id', name: 'researcher', description: 'Research APIs', provider: 'spawn', context: 'fresh', phase: 'active', createdAt: 200, updatedAt: 400,
  }]);
});

test('request headers expose the exact model and reasoning effort', () => {
  const initial = createInitialMonitorState(header);
  const selected = foldMonitorEvent(initial, event('request/header', 100, {
    header: { config: { provider: 'deepseek', model: 'deepseek-chat', reasoningEffort: 'high' } },
    reason: { kind: 'initial' },
  }));
  assert.deepEqual(selected.requestConfig, { provider: 'deepseek', model: 'deepseek-chat', reasoningEffort: 'high' });
  const changed = foldMonitorEvent(selected, event('request/header', 200, {
    header: { config: { provider: 'deepseek', model: 'deepseek-reasoner' } },
    reason: { kind: 'change' },
  }));
  assert.deepEqual(changed.requestConfig, { provider: 'deepseek', model: 'deepseek-reasoner' });
  assert.equal(monitorView(changed).requestConfig.model, 'deepseek-reasoner');
});

test('unrelated events and unmatched tool results preserve state identity', () => {
  const initial = createInitialMonitorState(header);
  assert.equal(foldMonitorEvent(initial, event('request/context', 100, { provider: 'p' })), initial);
  assert.equal(foldMonitorEvent(initial, event('tool/result', 100, {
    message: { source: { callId: 'missing' }, content: [] },
  })), initial);
});

test('a fork excludes inherited Lead events from member metrics', () => {
  const initial = createInitialMonitorState({ id: 'fork-member', createdAt: 500 }, 2);
  const inherited = fold(initial, [
    { type: 'turn/start', time: 100, data: { turn: 1 }, seq: 0 },
    { type: 'assistant/message', time: 200, data: {
      turn: 1,
      step: 1,
      message: { content: [{ type: 'text', text: 'Lead history' }] },
      usage: { inputTokens: 1000, outputTokens: 100 },
    }, seq: 1 },
  ]);
  assert.equal(inherited, initial);
  assert.equal(inherited.tokens.total, 0);
  assert.equal(inherited.turns, 0);

  const own = foldMonitorEvent(inherited, { type: 'turn/start', time: 600, data: { turn: 2 }, seq: 2 });
  assert.equal(own.turns, 1);
  assert.equal(own.openTurnStartedAt, 600);
});

test('wire view exposes no fold-private call or step maps', () => {
  const state = fold(createInitialMonitorState(header), [
    event('turn/start', 100, { turn: 1 }),
    event('step/start', 110, { turn: 1, step: 1 }),
    event('tool/call', 120, { turn: 1, step: 1, callId: 'call-1', name: 'read' }),
  ]);
  const view = monitorView(state);
  assert.equal('openTurn' in view, false);
  assert.equal('openStep' in view, false);
  assert.equal('pendingCalls' in view, false);
  assert.equal(view.openTurnStartedAt, 100);
  assert.equal(view.activity.toolName, 'read');
});
