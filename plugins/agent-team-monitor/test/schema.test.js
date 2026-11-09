import test from 'node:test';
import assert from 'node:assert/strict';
import { agentTeamMonitorProjection } from '../index.js';
import { createInitialMonitorState, foldMonitorEvent, monitorView } from '../projection.js';

const initial = () => createInitialMonitorState({ id: 'member-a', createdAt: 100 }, 0);

test('state and wire schemas accept the complete projection shape', () => {
  const state = foldMonitorEvent(initial(), {
    type: 'agent/inbox/spliced', seq: 0, time: 200,
    data: {
      target: 'next-turn', start: 0, removedCount: 0,
      inserted: [{
        id: 'peer-1', source: { kind: 'agent-message', senderSessionId: 'member-b' },
        content: [{ type: 'text', text: 'Team message from reviewer:' }, { type: 'text', text: 'OK' }],
      }],
    },
  });
  assert.equal(agentTeamMonitorProjection.stateSchema.parse(state), state);
  const view = monitorView(state);
  assert.equal(agentTeamMonitorProjection.wire.viewSchema.parse(view), view);
});

test('schemas reject malformed persisted values and wire-private state keys', () => {
  const state = initial();
  assert.throws(() => agentTeamMonitorProjection.stateSchema.parse({
    ...state, tokens: { ...state.tokens, total: -1 },
  }), /non-negative/);
  assert.throws(() => agentTeamMonitorProjection.stateSchema.parse({
    ...state, unknown: true,
  }), /unknown key/);
  assert.throws(() => agentTeamMonitorProjection.stateSchema.parse({
    ...state, activity: { kind: 'unknown', at: 0 },
  }), /activity kind/);
  assert.throws(() => agentTeamMonitorProjection.wire.viewSchema.parse(state), /unknown key/);
});
