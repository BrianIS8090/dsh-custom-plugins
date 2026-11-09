import { discoverModels, selectOptions } from './selection.js';
export const name = 'team-model-selection-discovery';
export const inject = ['tools', 'llm', 'subagents'];
export function apply(ctx) {
  for (const [name, backend] of [['subagent_with_model', 'spawn'], ['subagent_fork_with_model', 'fork']]) {
    ctx.tools.register({
      name,
      description: backend === 'spawn'
        ? 'Delegate an independent task to a fresh subagent with an optional model and reasoning effort. Returns its id; completion arrives separately.'
        : 'Delegate to a subagent inheriting completed conversation turns, with optional model and reasoning effort. Returns its id; completion arrives separately.',
      parameters: {
        type: 'object',
        properties: {
          description: { type: 'string', description: 'Short task description.' },
          prompt: { type: 'string', description: 'Complete task for the subagent.' },
          cwd: { type: 'string', description: 'Initial working directory; omission inherits the parent directory.' },
          provider: { type: 'string', description: 'LLM provider id from list_team_models; supply together with model. Omit both to inherit.' },
          model: { type: 'string', description: 'Exact model id for provider. Changing a fork route may require recomputing copied history without cache reuse.' },
          reasoning_effort: { type: 'string', description: 'Exact supported effort id from list_team_models(provider, model). Same route inherits effort; a changed route uses its own default.' }
        },
        required: ['description', 'prompt'],
        additionalProperties: false
      },
      output: {
        schema: { type: 'object', properties: { subagentId: { type: 'string' } }, required: ['subagentId'], additionalProperties: false },
        render: (_args, value) => [{ type: 'text', text: 'started subagent ' + value.subagentId }]
      },
      async execute(args, exec) {
        if (!exec.agent) throw new Error('A calling Agent is required');
        const agentOptions = await selectOptions(ctx.llm, exec.agent, args, exec.signal);
        const activation = await ctx.subagents.startActivation({
          provider: backend, label: args.description, delivery: 'parent', signal: exec.signal,
          request: {
            parent: exec.agent, prompt: [{ type: 'text', text: args.prompt }],
            maxDepth: ctx.subagents.resolveMaxDepth(),
            ...(args.cwd === undefined ? {} : { cwd: args.cwd }),
            ...(agentOptions === undefined ? {} : { agentOptions })
          }
        });
        return { subagentId: activation.childId };
      }
    });
  }
  ctx.tools.register({
    name: 'list_team_models',
    description: 'Discover available LLM providers, their models, or one model’s exact supported reasoning efforts and default.',
    parameters: {
      type: 'object',
      properties: {
        provider: { type: 'string', description: 'Omit to list providers; set to list that provider’s models.' },
        model: { type: 'string', description: 'Exact model id with provider to inspect supported reasoning efforts.' }
      },
      additionalProperties: false
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }]
    },
    async execute(args, exec) {
      return await discoverModels(ctx.llm, args, exec.signal);
    }
  });
}
