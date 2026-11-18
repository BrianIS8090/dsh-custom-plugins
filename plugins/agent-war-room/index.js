import { WarRoomRunner } from './orchestrator.js';
import { createInitialWarRoomState, foldWarRoomEvent, warRoomView } from './projection.js';
import { stateSchema, viewSchema } from './schema.js';

export const name = 'agent-war-room';
export const inject = ['sessionProjections', 'subagents', 'agents', 'commands', 'tools'];

export async function apply(ctx) {
  await ctx.sessionProjections.register({
    key: 'agentWarRoom',
    stateVersion: 3,
    stateSchema,
    init: createInitialWarRoomState,
    apply: foldWarRoomEvent,
    wire: { viewSchema, view: warRoomView, summary: false },
  });

  const runner = new WarRoomRunner(ctx);
  ctx.effect(() => () => runner.dispose(), 'agent-war-room: runs');

  ctx.effect(() => ctx.commands.register({
    name: 'war-room',
    description: 'Run four agents against one question and build a verified live artifact',
    input: { hint: '<question or decision>' },
    handler({ agent, rawInput, commandId }) {
      const run = runner.start(agent, rawInput, String(commandId));
      void run.promise.catch(error => {
        ctx.logger.error(`[agent-war-room] ${run.runId} failed: ${error instanceof Error ? error.message : String(error)}`);
      });
      return {
        kind: 'success',
        text: `War Room ${run.runId} started. Open the War Room view to watch the shared artifact.`,
      };
    },
  }), 'agent-war-room: command');

  ctx.effect(() => ctx.tools.register({
    name: 'war_room',
    description: 'Run a four-role War Room on a consequential question: a researcher gathers cited facts, an architect builds a solution, a skeptic attacks it twice, and a source verifier independently checks the load-bearing claims. Returns the final Markdown artifact after two revisions. The live process is visible in the War Room conversation view.',
    parameters: {
      type: 'object',
      properties: {
        question: { type: 'string', description: 'Complete self-contained question or decision to investigate.' },
      },
      required: ['question'],
      additionalProperties: false,
    },
    output: {
      schema: {
        type: 'object',
        properties: {
          runId: { type: 'string' }, status: { type: 'string', const: 'completed' },
          artifact: { type: 'string' }, versions: { type: 'number' }, sources: { type: 'number' },
          children: {
            type: 'object',
            properties: {
              researcher: { type: 'string' }, architect: { type: 'string' },
              skeptic: { type: 'string' }, verifier: { type: 'string' },
            },
            required: ['researcher', 'architect', 'skeptic', 'verifier'],
            additionalProperties: false,
          },
        },
        required: ['runId', 'status', 'artifact', 'versions', 'sources', 'children'],
        additionalProperties: false,
      },
      render: (_args, value) => [{ type: 'text', text: `War Room ${value.runId}: ${value.versions} artifact versions, ${value.sources} cited sources.\n\n${value.artifact}` }],
    },
    timeoutMs: 3600000,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      if (!exec.agent) throw new Error('A calling Agent is required');
      const runId = `tool-${String(exec.callId)}`;
      const run = runner.start(exec.agent, args.question, runId, exec.signal);
      return await run.promise;
    },
  }), 'agent-war-room: tool');
}
