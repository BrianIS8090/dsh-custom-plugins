import { createInitialMonitorState, foldMonitorEvent, monitorView } from './projection.js';
import { stateSchema, viewSchema } from './schema.js';

export const name = 'agent-team-monitor';
export const inject = ['sessionProjections'];

export const agentTeamMonitorProjection = {
  key: 'agentTeamMonitor',
  stateVersion: 3,
  stateSchema,
  init: createInitialMonitorState,
  apply: foldMonitorEvent,
  wire: {
    viewSchema,
    view: monitorView,
  },
};

export function apply(ctx) {
  ctx.sessionProjections.register(agentTeamMonitorProjection);
}
